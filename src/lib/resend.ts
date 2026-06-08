import { Resend } from "resend";
import { lkr, usdLabel } from "./currency";
import { hygraphClient } from "./hygraph";
import { GET_BANK_ACCOUNTS } from "./queries";
import type { BankAccount } from "@/types";

// Initialize Resend with API Key, providing a fallback to prevent runtime boot issues
const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey ? new Resend(apiKey) : null;

interface OrderEmailProduct {
  id: string;
  name: string;
  code: string;
  price?: number;
  image?: { url: string } | null;
}

interface OrderEmailItem {
  product: OrderEmailProduct;
  quantity: number;
}

interface SendOrderEmailsArgs {
  orderId: string;
  orderNumber?: number;
  customerName: string;
  customerEmail?: string;
  phone: string;
  address: string;
  notes?: string;
  items: OrderEmailItem[];
  discountApplied?: number; // discount percentage, e.g. 5
  adminEmail: string;
  paymentMethod?: string;
}

export async function sendOrderEmails({
  orderId,
  orderNumber,
  customerName,
  customerEmail,
  phone,
  address,
  notes,
  items,
  discountApplied = 0,
  adminEmail,
  paymentMethod = "Cash on Delivery",
}: SendOrderEmailsArgs) {
  if (!resend) {
    console.warn("Missing resend key.");
    return { success: false, error: "Resend not initialized" };
  }

  // Calculate pricing
  const subtotal = items.reduce((sum, item) => sum + (item.product.price ?? 0) * item.quantity, 0);
  const discountAmount = discountApplied > 0 ? subtotal * (discountApplied / 100) : 0;
  const total = subtotal - discountAmount;

  // Fetch settings from Hygraph (bank accounts and contact phone)
  let bankAccounts: BankAccount[] = [];
  let contactPhone = "";
  try {
    const result = await hygraphClient.request<{ websiteSettings: { bankAccounts?: BankAccount[]; contactPhone?: string }[] }>(GET_BANK_ACCOUNTS);
    const settings = result?.websiteSettings?.[0];
    if (settings?.bankAccounts && Array.isArray(settings.bankAccounts)) {
      bankAccounts = settings.bankAccounts;
    }
    if (settings?.contactPhone) {
      contactPhone = settings.contactPhone;
    }
  } catch (err) {
    console.error("[Resend] Failed to fetch settings from Hygraph:", err);
  }



  const hasNoPriceProduct = items.some((item) => !item.product.price || item.product.price === 0);

  const transferMessage = hasNoPriceProduct
    ? `Please transfer the finalized order amount to one of our bank accounts below once we send you the finalized invoice. Please use your Order Number <strong>#${orderNumber ?? orderId.substring(orderId.length - 8)}</strong> as your payment reference. Note that we do not process your order until the payment is cleared.`
    : `Please transfer the total due amount of <strong>${lkr(total)}</strong> to one of our bank accounts below. Please use your Order Number <strong>#${orderNumber ?? orderId.substring(orderId.length - 8)}</strong> as your payment reference. Note that we do not process your order until the payment is cleared.`;

  const bankDetailsHtml = paymentMethod === "Direct Bank Transfer"
    ? (bankAccounts.length > 0
      ? `
        <div style="margin-top: 30px; border: 1px solid #835a71; padding: 20px; background-color: #faf6f7; font-family: 'Inter', -apple-system, sans-serif;">
          <h3 style="margin-top: 0; color: #835a71; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Bank Transfer Instructions</h3>
          <p style="font-size: 13px; color: #555555; margin-bottom: 15px; line-height: 1.5;">
            ${transferMessage}
          </p>
          <div>
            ${bankAccounts.map((acc, index) => `
              <div style="border-top: ${index > 0 ? "1px dashed #e5e5e5" : "none"}; padding-top: ${index > 0 ? "15px" : "0"}; margin-top: ${index > 0 ? "15px" : "0"};">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #333333;">
                  <tr><td style="width: 130px; padding: 4px 0; font-weight: 600; color: #666666;">Bank:</td><td style="padding: 4px 0; font-weight: bold;">${acc.bank}</td></tr>
                  <tr><td style="padding: 4px 0; font-weight: 600; color: #666666;">Account Name:</td><td style="padding: 4px 0;">${acc.nameInAccount}</td></tr>
                  <tr><td style="padding: 4px 0; font-weight: 600; color: #666666;">Account Number:</td><td style="padding: 4px 0; font-weight: bold; color: #835a71;">${acc.accNumber}</td></tr>
                  <tr><td style="padding: 4px 0; font-weight: 600; color: #666666;">Branch:</td><td style="padding: 4px 0;">${acc.branch}${acc.branchCode ? ` (Code: ${acc.branchCode})` : ""}</td></tr>
                  ${acc.bankCode ? `<tr><td style="padding: 4px 0; font-weight: 600; color: #666666;">Bank Code:</td><td style="padding: 4px 0;">${acc.bankCode}</td></tr>` : ""}
                  ${acc.swiftCode ? `<tr><td style="padding: 4px 0; font-weight: 600; color: #666666;">SWIFT Code:</td><td style="padding: 4px 0;">${acc.swiftCode}</td></tr>` : ""}
                </table>
              </div>
            `).join("")}
          </div>
        </div>
      `
      : `
        <div style="margin-top: 30px; border: 1px solid #835a71; padding: 20px; background-color: #faf6f7; font-family: 'Inter', -apple-system, sans-serif;">
          <h3 style="margin-top: 0; color: #835a71; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Bank Transfer Instructions</h3>
          <p style="font-size: 13px; color: #555555; margin: 0; line-height: 1.5;">
            We will contact you and share bank account details.
          </p>
        </div>
      `)
    : "";

  const customerNoPriceWarningHtml = hasNoPriceProduct
    ? `
      <div style="margin-top: 25px; border: 1px solid #d89b00; padding: 15px; background-color: #fffdf5; font-family: 'Inter', -apple-system, sans-serif; font-size: 13px; color: #8a6d1c; line-height: 1.5;">
        <strong>⚠️ Notice:</strong> There is one or more products in your basket with no fixed price set. We will contact you with the final price and invoice for the relevant payment method.
      </div>
    `
    : "";

  const adminNoPriceWarningHtml = hasNoPriceProduct
    ? `
      <div style="background-color: #fffdf5; border-left: 4px solid #d89b00; padding: 15px; margin-bottom: 30px;">
        <p style="margin: 0; font-size: 13px; color: #8a6d1c; line-height: 1.5; font-weight: bold;">
          ⚠️ ACTION REQUIRED: This order contains one or more products with no fixed price set. Please contact the customer to finalize the price and send the invoice.
        </p>
      </div>
    `
    : "";

  const fromEmail = process.env.RESEND_FROM_EMAIL || "Glowish Cosmetics <no-reply@glowishcosmetic.com>";

  // --- HTML Helper Elements ---
  const productsTableHtml = `
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-family: 'Inter', -apple-system, sans-serif; font-size: 14px; color: #1a1a1a;">
      <thead>
        <tr style="border-bottom: 2px solid #1a1a1a; text-align: left;">
          <th style="padding: 12px 8px; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; color: #666666;">Product</th>
          <th style="padding: 12px 8px; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; color: #666666; text-align: center;">Qty</th>
          <th style="padding: 12px 8px; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; color: #666666; text-align: right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${items
      .map(
        (item) => `
          <tr style="border-bottom: 1px solid #eeeeee;">
            <td style="padding: 16px 8px; vertical-align: middle;">
              <div style="display: flex; align-items: center;">
                ${item.product.image?.url
            ? `<img src="${item.product.image.url}" alt="${item.product.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 12px; border: 1px solid #eeeeee;" />`
            : `<div style="width: 50px; height: 50px; background-color: #faf6f7; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-size: 20px; border: 1px solid #eeeeee;">🌸</div>`
          }
                <div>
                  <p style="margin: 0; font-weight: 500; font-size: 14px; color: #1a1a1a;">${item.product.name}</p>
                  <p style="margin: 2px 0 0 0; font-size: 11px; color: #888888; text-transform: uppercase; letter-spacing: 0.05em;">SKU: ${item.product.code}</p>
                </div>
              </div>
            </td>
            <td style="padding: 16px 8px; text-align: center; vertical-align: middle; color: #555555;">${item.quantity}</td>
            <td style="padding: 16px 8px; text-align: right; vertical-align: middle; font-weight: 500;">${lkr(
            (item.product.price ?? 0) * item.quantity
          )}</td>
          </tr>
        `
      )
      .join("")}
      </tbody>
    </table>
  `;

  const pricingSummaryHtml = `
    <div style="margin-top: 24px; font-family: 'Inter', -apple-system, sans-serif; font-size: 14px; color: #1a1a1a; border-top: 1px solid #eeeeee; padding-top: 16px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #666666;">Subtotal</td>
          <td style="padding: 6px 0; text-align: right; font-weight: 500;">${lkr(subtotal)}</td>
        </tr>
        ${discountApplied > 0
      ? `
        <tr>
          <td style="padding: 6px 0; color: #835a71;">Member Discount (${discountApplied}%)</td>
          <td style="padding: 6px 0; text-align: right; font-weight: 500; color: #835a71;">- ${lkr(discountAmount)}</td>
        </tr>
        `
      : ""
    }
        <tr style="border-top: 1px solid #1a1a1a; font-weight: bold; font-size: 16px;">
          <td style="padding: 12px 0 4px 0; font-size: 15px; text-transform: uppercase; letter-spacing: 0.05em;">Total</td>
          <td style="padding: 12px 0 4px 0; text-align: right; color: #1a1a1a;">
            <div>${lkr(total)}</div>
            <div style="font-size: 12px; font-weight: normal; color: #666666; margin-top: 2px;">approx. ${usdLabel(total)} USD</div>
          </td>
        </tr>
      </table>
    </div>
  `;

  // 1. Prepare Customer Confirmation Email (Invoice style)
  const customerEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Glowish Cosmetics Order Receipt</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="background-color: #faf8f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #eeeeee; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
        
        <!-- Header / Logo -->
        <div style="text-align: center; border-bottom: 1px solid #f2ece9; padding-bottom: 24px; margin-bottom: 30px;">
          <h1 style="font-family: 'Playfair Display', 'Georgia', serif; font-size: 28px; font-weight: normal; margin: 0 0 8px 0; color: #1a1a1a; letter-spacing: 0.08em; text-transform: uppercase;">Glowish Cosmetics</h1>
          <p style="margin: 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #835a71; font-weight: 500;">Make Yourself Beautiful!</p>
        </div>

        <!-- Hero Greeting -->
        <div style="margin-bottom: 30px;">
          <h2 style="font-family: 'Playfair Display', 'Georgia', serif; font-size: 20px; font-weight: normal; color: #1a1a1a; margin: 0 0 12px 0;">Thank you for your purchase, ${customerName}!</h2>
          <p style="margin: 0; font-size: 14px; color: #555555; line-height: 1.6; font-weight: 300;">
            We have received your order (<strong>#${orderNumber ?? orderId.substring(orderId.length - 8)}</strong>) and are preparing it for delivery.
            A summary of your items is detailed below. We will reach out to you if any additional information is required.
          </p>
        </div>

        <!-- Order details heading -->
        <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #835a71;">Order Details</p>
        <p style="margin: 0 0 15px 0; font-size: 14px; color: #1a1a1a;"><strong>Payment Method:</strong> ${paymentMethod}</p>
        ${productsTableHtml}
        ${pricingSummaryHtml}
        ${bankDetailsHtml}
        ${customerNoPriceWarningHtml}

        <!-- Delivery details section -->
        <div style="margin-top: 35px; border-top: 1px dashed #e5e5e5; padding-top: 25px; font-family: 'Inter', -apple-system, sans-serif; font-size: 13px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 50%; padding-right: 15px; vertical-align: top;">
                <p style="margin: 0 0 6px 0; font-weight: bold; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; color: #666666;">Delivery Address</p>
                <p style="margin: 0; color: #1a1a1a; line-height: 1.5; font-weight: 300;">
                  <strong>${customerName}</strong><br>
                  ${address}<br>
                  Phone: ${phone}
                </p>
              </td>
              <td style="width: 50%; vertical-align: top;">
                <p style="margin: 0 0 6px 0; font-weight: bold; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; color: #666666;">Special Instructions</p>
                <p style="margin: 0; color: #555555; font-style: italic; line-height: 1.5; font-weight: 300;">
                  ${notes ? notes : "No special instructions provided."}
                </p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Footer Call-to-action -->
        <div style="margin-top: 45px; border-top: 1px solid #eeeeee; padding-top: 30px; text-align: center;">
          <a href="https://glowishcosmetic.com" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; text-decoration: none; padding: 12px 28px; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500;">Visit Glowish Cosmetics</a>
          <p style="margin: 20px 0 0 0; font-size: 11px; color: #888888; font-weight: 300; line-height: 1.5;">
            Please do not reply to this email. This is an auto-generated email. If you have any questions or need to modify your order, please contact us via WhatsApp or Message at: <strong>${contactPhone || "+94768228015 (LK)"}</strong>.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  // 2. Prepare Admin Notification Email (Detailed)
  const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Received - Glowish Cosmetics</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="background-color: #f4f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #dddddd; padding: 40px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="border-bottom: 2px solid #1a1a1a; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: baseline;">
          <div>
            <h1 style="margin: 0; font-size: 20px; font-weight: bold; color: #1a1a1a; letter-spacing: 0.05em; text-transform: uppercase;">New Order Alert</h1>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #835a71;">
              ${orderNumber ? `Order Number: #${orderNumber} | ` : ""}ID: #${orderId}
            </p>
          </div>
        </div>

        <!-- Alert Box -->
        <div style="background-color: #fcf8f3; border-left: 4px solid #835a71; padding: 15px; margin-bottom: 30px;">
          <p style="margin: 0; font-size: 13px; color: #666666; line-height: 1.5;">
            A new order has been checked out successfully on the Glowish Cosmetics store. Please process this order.
          </p>
        </div>
        ${adminNoPriceWarningHtml}

        <!-- Customer Profile Table -->
        <div style="margin-bottom: 30px; font-family: 'Inter', -apple-system, sans-serif;">
          <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #835a71; margin: 0 0 12px 0; border-bottom: 1px solid #eeeeee; padding-bottom: 6px;">Customer Details</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; font-weight: 600; width: 120px; color: #666666;">Name:</td>
              <td style="padding: 6px 0; color: #1a1a1a;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #666666;">Phone:</td>
              <td style="padding: 6px 0; color: #1a1a1a;">
                <a href="tel:${phone}" style="color: #835a71; text-decoration: underline;">${phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #666666;">Email:</td>
              <td style="padding: 6px 0; color: #1a1a1a;">
                ${customerEmail
      ? `<a href="mailto:${customerEmail}" style="color: #835a71; text-decoration: underline;">${customerEmail}</a>`
      : `<span style="font-style: italic; color: #999999;">Checked out as Guest (No email provided)</span>`
    }
              </td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #666666; vertical-align: top;">Delivery Addr:</td>
              <td style="padding: 6px 0; color: #1a1a1a; line-height: 1.4;">${address}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #666666; vertical-align: top;">Payment Method:</td>
              <td style="padding: 6px 0; color: #1a1a1a; font-weight: bold;">${paymentMethod}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: 600; color: #666666; vertical-align: top;">Order Notes:</td>
              <td style="padding: 6px 0; color: #555555; font-style: italic; line-height: 1.4;">
                ${notes ? notes : "No special instructions provided."}
              </td>
            </tr>
          </table>
        </div>

        <!-- Ordered Items -->
        <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #835a71; margin: 0 0 12px 0; border-bottom: 1px solid #eeeeee; padding-bottom: 6px;">Ordered Items</h2>
        ${productsTableHtml}
        ${pricingSummaryHtml}

        <!-- Footer -->
        <div style="margin-top: 40px; border-top: 1px solid #eeeeee; padding-top: 20px; text-align: center; font-size: 11px; color: #888888;">
          This is an automated notification from the Glowish Cosmetics system.
        </div>

      </div>
    </body>
    </html>
  `;

  const results = {
    customerEmailSent: false,
    adminEmailSent: false,
    errors: [] as string[],
  };

  // Send Admin Notification Email
  try {
    const adminRes = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `[New Order] #${orderNumber ?? orderId.substring(orderId.length - 8)} - ${customerName}`,
      html: adminEmailHtml,
    });
    if (adminRes.error) {
      throw new Error(JSON.stringify(adminRes.error));
    }
    results.adminEmailSent = true;
  } catch (err: any) {
    const errMsg = err.message || String(err);
    console.error("[Resend] Failed to send notification:", errMsg);
    results.errors.push(`Admin email error: ${errMsg}`);
  }

  // Send Customer Invoice Email (only if they provided an email address)
  if (customerEmail) {
    try {
      const customerRes = await resend.emails.send({
        from: fromEmail,
        to: customerEmail,
        subject: `Your Glowish Cosmetics Order Confirmation - #${orderNumber ?? orderId.substring(orderId.length - 8)}`,
        html: customerEmailHtml,
      });
      if (customerRes.error) {
        throw new Error(JSON.stringify(customerRes.error));
      }
      results.customerEmailSent = true;
      console.log(`[Resend] Customer confirmation email sent successfully.`);
    } catch (err: any) {
      const errMsg = err.message || String(err);
      console.error("[Resend] Failed to send customer email:", errMsg);
      results.errors.push(`Customer email error: ${errMsg}`);
    }
  } else {
    console.log("[Resend] Skipping customer email: No customer email provided in checkout");
  }

  return {
    success: results.errors.length === 0,
    ...results,
  };
}
