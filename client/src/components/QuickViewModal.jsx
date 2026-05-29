import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiShoppingCart, FiStar } from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { assetUrl } from "../utils/imageUrl";
import toast from "react-hot-toast";

const fmt = n => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array(5).fill(0).map((_, i) => {
        if (i < Math.floor(rating)) return <FaStar key={i} className="w-3.5 h-3.5 text-yellow-400" />;
        if (i < rating) return <FaStarHalfAlt key={i} className="w-3.5 h-3.5 text-yellow-400" />;
        return <FaRegStar key={i} className="w-3.5 h-3.5 text-gray-300" />;
      })}
    </div>
  );
}

const CONDITION_COLOR = { New: "bg-green-100 text-green-700", Refurbished: "bg-blue-100 text-blue-700", Used: "bg-orange-100 text-orange-700" };

export function QuickViewModal({ product, onClose }) {
  const { addItem } = useCart();
  if (!product) return null;

  const effective = product.discount > 0
    ? Math.round(product.sellingPrice * (1 - product.discount / 100) * 100) / 100
    : product.sellingPrice;

  const keySpecs = [
    product.processor && { label: "Processor", value: product.processor },
    product.ram       && { label: "RAM",       value: product.ram },
    product.storageType && { label: "Storage", value: product.storage || product.storageType },
    product.condition && { label: "Condition", value: product.condition },
  ].filter(Boolean);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Image */}
            <div className="relative bg-slate-50 aspect-square sm:aspect-auto">
              <img
                src={assetUrl(product.images?.[0])}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              {product.discount > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                  -{product.discount}%
                </span>
              )}
              {product.condition && (
                <span className={"absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full " + (CONDITION_COLOR[product.condition] || "bg-gray-100 text-gray-600")}>
                  {product.condition}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col gap-4">
              <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
                <FiX className="w-4 h-4 text-slate-600" />
              </button>

              <div>
                <p className="text-xs font-semibold text-sky-600 uppercase tracking-wide mb-1">{product.brand} · {product.category}</p>
                <h2 className="font-bold text-slate-800 text-lg leading-snug">{product.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Stars rating={product.rating || 4} />
                  <span className="text-xs text-slate-400">({product.reviewCount || 0} reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-sky-50 rounded-2xl p-4">
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-sky-600">{fmt(effective)}</span>
                  {product.discount > 0 && (
                    <span className="text-sm line-through text-slate-400 mb-0.5">{fmt(product.sellingPrice)}</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">Incl. all taxes · Free delivery above ₹5,000</p>
              </div>

              {/* Key specs */}
              {keySpecs.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {keySpecs.map(s => (
                    <div key={s.label} className="bg-slate-50 rounded-xl px-3 py-2">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide">{s.label}</p>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">{s.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Stock */}
              <div className="flex items-center gap-2">
                <span className={"w-2 h-2 rounded-full " + (product.stock > 0 ? "bg-green-500" : "bg-red-400")} />
                <span className={"text-xs font-semibold " + (product.stock > 0 ? "text-green-600" : "text-red-500")}>
                  {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto">
                <button
                  disabled={!product.stock}
                  onClick={() => { addItem(product, 1); toast.success("Added to cart!"); onClose(); }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white text-sm btn-cyan disabled:opacity-40"
                >
                  <FiShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
                <Link to={"/product/" + product._id} onClick={onClose}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:border-sky-400 hover:text-sky-600 transition">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
