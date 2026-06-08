import { NextRequest, NextResponse } from "next/server";
import { hygraphClient, hygraphMutationClient } from "@/lib/hygraph";
import { CREATE_ORDER, PUBLISH_ORDER } from "@/lib/mutations";
import { GET_PRODUCTS_BY_IDS, GET_WEBSITE_SETTINGS, GET_LATEST_ORDER_NUMBER } from "@/lib/queries";
import { sendOrderEmails } from "@/lib/resend";
import type { OrderInput, WebsiteSettings } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: OrderInput = await req.json();
    const { customerName, phone, address, notes, productIds, customerEmail, discountApplied, items, paymentMethod } = body;

    if (!customerName || !phone || !address || !productIds?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const uniqueProductIds = Array.from(new Set(productIds)).map((id) => ({ id }));

    console.log("[Orders API] Creating order:", { customerName, phone, address, productIds: uniqueProductIds });

    // 1. Create draft order in Hygraph with retry logic to resolve concurrency conflicts on orderNumber
    let createOrder: { id: string; customerName: string; orderNumber: number } | null = null;
    let retries = 5;

    while (retries > 0) {
      let nextOrderNumber = 1001;
      try {
        const latestOrderRes = await hygraphMutationClient.request<{
          orders: { orderNumber: number | null }[];
        }>(GET_LATEST_ORDER_NUMBER);
        
        const latestOrder = latestOrderRes?.orders?.[0];
        if (latestOrder && typeof latestOrder.orderNumber === "number") {
          nextOrderNumber = latestOrder.orderNumber + 1;
        }
      } catch (latestOrderErr) {
        console.error("[Orders API] Failed to fetch latest order number:", latestOrderErr);
      }

      console.log(`[Orders API] Attempting to create order with orderNumber: ${nextOrderNumber}. Retries remaining: ${retries - 1}`);

      try {
        const paymentMethodValue = paymentMethod === "bank_transfer" ? "Direct Bank Transfer" : "Cash on Delivery";
        const result = await hygraphMutationClient.request<{
          createOrder: { id: string; customerName: string; orderNumber: number };
        }>(CREATE_ORDER, {
          customerName,
          phone,
          address,
          notes,
          productIds: uniqueProductIds,
          customerEmail: customerEmail ?? null,
          discountApplied: discountApplied ?? null,
          orderNumber: nextOrderNumber,
          paymentMethod: paymentMethodValue,
        });
        createOrder = result.createOrder;
        console.log("[Orders API] Order created successfully:", createOrder.id, "with orderNumber:", createOrder.orderNumber);
        break; // Success, break the retry loop
      } catch (createErr: any) {
        const msg = createErr.message || String(createErr);
        const isUniqueError = 
          msg.includes("value is not unique") || 
          msg.includes("already exists") || 
          msg.includes("uniqueness constraint") || 
          msg.includes("unique");

        if (isUniqueError && retries > 1) {
          retries--;
          const backoffDelay = Math.random() * 150 + 50; // Random delay between 50ms and 200ms
          console.warn(`[Orders API] Unique constraint conflict on orderNumber ${nextOrderNumber}. Retrying in ${Math.round(backoffDelay)}ms...`);
          await new Promise((resolve) => setTimeout(resolve, backoffDelay));
          continue;
        }

        console.error("[Orders API] createOrder failed:", msg);
        return NextResponse.json({ error: "Failed to create order", detail: msg }, { status: 500 });
      }
    }

    if (!createOrder) {
      return NextResponse.json({ error: "Failed to create order due to concurrency conflicts" }, { status: 500 });
    }

    // 2. Publish the order (non-blocking — order is created even if publish fails)
    try {
      await hygraphMutationClient.request(PUBLISH_ORDER, { id: createOrder.id });
      console.log("[Orders API] Order published:", createOrder.id);
    } catch (publishErr: unknown) {
      const msg = publishErr instanceof Error ? publishErr.message : String(publishErr);
      console.error("[Orders API] publishOrder failed (order still created):", msg);
    }

    // 3. Send emails via Resend (non-blocking to prevent checkout delays)
    try {
      // Normalize items list with quantities. Fallback to 1 if items list is missing.
      const normalizedItems = items || productIds.map((id) => ({ productId: id, quantity: 1 }));

      // Fetch ordered products details from Hygraph
      const productsResult = await hygraphClient.request<{ products: any[] }>(GET_PRODUCTS_BY_IDS, {
        ids: productIds,
      });
      const products = productsResult?.products || [];

      // Map products to their ordered quantities
      const emailItems = normalizedItems.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          product: product || { id: item.productId, name: "Unknown Product", code: "N/A", price: 0 },
          quantity: item.quantity,
        };
      });

      // Retrieve admin email address (check env first, then fall back to Hygraph WebsiteSettings)
      let adminEmail = process.env.ADMIN_EMAIL;
      if (!adminEmail) {
        try {
          const settingsResult = await hygraphClient.request<{ websiteSettings: WebsiteSettings[] }>(GET_WEBSITE_SETTINGS);
          adminEmail = settingsResult?.websiteSettings?.[0]?.contactEmail;
        } catch (settingsErr) {
          console.error("[Orders API] Failed to fetch WebsiteSettings contactEmail:", settingsErr);
        }
      }

      if (!adminEmail) {
        // Ultimate fallback if nothing is configured
        adminEmail = "orders@glowishcosmetic.com";
        console.warn("[Orders API] No ADMIN_EMAIL env variable or WebsiteSettings contactEmail found. Falling back to:", adminEmail);
      }

      console.log("[Orders API] Triggering email sending via Resend to admin:", adminEmail, "and customer:", customerEmail || "none");
      
      // Wait for emails to send to prevent serverless function termination before completion
      try {
        const emailResult = await sendOrderEmails({
          orderId: createOrder.id,
          orderNumber: createOrder.orderNumber,
          customerName,
          customerEmail: customerEmail ?? undefined,
          phone,
          address,
          notes: notes ?? undefined,
          items: emailItems,
          discountApplied: discountApplied ?? undefined,
          adminEmail,
          paymentMethod: paymentMethod === "bank_transfer" ? "Direct Bank Transfer" : "Cash on Delivery",
        });
        console.log("[Orders API] Email sending result:", emailResult);
      } catch (emailErr) {
        console.error("[Orders API] sendOrderEmails failed:", emailErr);
      }

    } catch (prepErr) {
      console.error("[Orders API] Error during email preparation:", prepErr);
    }

    return NextResponse.json({ success: true, orderId: createOrder.id, orderNumber: createOrder.orderNumber }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Orders API] Unexpected error:", msg);
    return NextResponse.json({ error: "Failed to create order", detail: msg }, { status: 500 });
  }
}
