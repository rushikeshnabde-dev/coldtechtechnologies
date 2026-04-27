import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiTrash2, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { assetUrl } from "../utils/imageUrl";

const fmt = n => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const FREE_SHIP = 5000;

export function MiniCart({ open, onClose }) {
  const { items, updateQty, removeItem, subtotal, count } = useCart();
  const progress = Math.min((subtotal / FREE_SHIP) * 100, 100);
  const tax = subtotal * 0.18;
  const delivery = progress >= 100 ? 0 : 99;
  const total = subtotal + tax + delivery;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FiShoppingBag className="w-5 h-5 text-sky-500" />
                <h2 className="font-bold text-slate-800">Cart</h2>
                {count > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-500 text-white">{count}</span>
                )}
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
                <FiX className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Free shipping bar */}
            {count > 0 && (
              <div className="px-5 py-3 bg-sky-50 border-b border-sky-100">
                <div className="flex justify-between text-xs text-slate-600 mb-1.5">
                  <span>{progress >= 100 ? "🎉 You've unlocked free shipping!" : `Add ${fmt(FREE_SHIP - subtotal)} more for free shipping`}</span>
                </div>
                <div className="h-1.5 rounded-full bg-sky-200 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-sky-500"
                    initial={{ width: 0 }}
                    animate={{ width: progress + "%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {count === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="text-5xl mb-4">🛒</div>
                  <p className="font-semibold text-slate-700 mb-1">Your cart is empty</p>
                  <p className="text-sm text-slate-400 mb-6">Add some products to get started</p>
                  <button onClick={onClose} className="btn-cyan text-sm px-6 py-2.5">Browse Products</button>
                </div>
              ) : (
                items.map(line => {
                  const price = line.discount > 0
                    ? line.sellingPrice * (1 - line.discount / 100)
                    : line.sellingPrice;
                  return (
                    <motion.div
                      key={line.productId}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={assetUrl(line.image)} alt={line.name} loading="lazy" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 line-clamp-2 leading-snug">{line.name}</p>
                        <p className="text-sm font-bold text-sky-600 mt-0.5">{fmt(price * line.quantity)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                            <button onClick={() => updateQty(line.productId, line.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition text-sm font-bold">−</button>
                            <span className="w-8 text-center text-xs font-semibold text-slate-700">{line.quantity}</span>
                            <button onClick={() => updateQty(line.productId, line.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition text-sm font-bold">+</button>
                          </div>
                          <button onClick={() => removeItem(line.productId)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition">
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {count > 0 && (
              <div className="border-t border-slate-100 px-5 py-4 space-y-3">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-slate-500"><span>Subtotal</span><span className="font-semibold text-slate-700">{fmt(subtotal)}</span></div>
                  <div className="flex justify-between text-slate-500"><span>GST (18%)</span><span>{fmt(tax)}</span></div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery</span>
                    <span className={progress >= 100 ? "text-green-600 font-semibold" : ""}>{progress >= 100 ? "FREE" : fmt(delivery)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800 text-base pt-2 border-t border-slate-100">
                    <span>Total</span><span className="text-sky-600">{fmt(total)}</span>
                  </div>
                </div>
                <Link to="/cart" onClick={onClose}
                  className="btn-cyan w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold">
                  Checkout <FiArrowRight className="w-4 h-4" />
                </Link>
                <button onClick={onClose} className="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition">
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
