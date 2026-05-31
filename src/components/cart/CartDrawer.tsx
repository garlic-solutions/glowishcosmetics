"use client";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import Image from "next/image";
import { FiX, FiTrash2, FiShoppingBag, FiPlus, FiMinus } from "react-icons/fi";
import { lkr, usdLabel } from "@/lib/currency";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: Props) {
  const { items, removeItem, updateQuantity } = useCartStore();

  const subtotalLKR = items.reduce((sum, i) => sum + (i.product.price ?? 0) * i.quantity, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#333333]/10">
              <h2 className="font-display text-xl font-normal tracking-wide text-[#333333] flex items-center gap-2">
                <FiShoppingBag /> Your Cart
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-none text-gray-500">
                <FiX />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <FiShoppingBag className="text-5xl mx-auto mb-3 text-gray-200" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3 items-center bg-gray-50 rounded-none p-3 border border-[#333333]/5">
                    <div className="relative w-14 h-14 rounded-none overflow-hidden bg-white flex-shrink-0">
                      {product.image ? (
                        <Image src={product.image.url} alt={product.name} fill className="object-cover" sizes="56px" />
                      ) : (
                        <span className="text-2xl flex items-center justify-center h-full">🌸</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800 truncate">{product.name}</p>
                      {product.price && (
                        <p className="text-xs text-gray-500">
                          {quantity} × {lkr(product.price)}
                        </p>
                      )}

                      {/* Qty controls */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-none border border-[#333333]/20 text-[#333333] hover:bg-white transition-colors"
                          aria-label="Decrease"
                        >
                          <FiMinus className="text-xs" />
                        </button>
                        <span className="text-sm font-normal text-gray-700 w-5 text-center">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-none border border-[#333333]/20 text-[#333333] hover:bg-white transition-colors"
                          aria-label="Increase"
                        >
                          <FiPlus className="text-xs" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      {product.price && (
                        <p className="text-sm font-bold text-[#333333]">{lkr(product.price * quantity)}</p>
                      )}
                    </div>

                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-gray-400 hover:text-[#333333] p-1 flex-shrink-0"
                      aria-label="Remove"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-[#333333]/10 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <div className="text-right">
                    <p className="font-bold text-[#333333]">{lkr(subtotalLKR)}</p>
                    <p className="text-xs text-gray-400">{usdLabel(subtotalLKR)} USD</p>
                  </div>
                </div>
                <Link href="/checkout" onClick={onClose} className="btn-primary w-full text-center block">
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
