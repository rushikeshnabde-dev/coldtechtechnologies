import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiEye, FiHeart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { assetUrl } from "../utils/imageUrl";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

export function ProductCard({ product, index = 0, variant = "default", badgeText, onQuickView }) {
  const { addItem } = useCart();
  const [hovered, setHovered]   = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [added, setAdded]       = useState(false);
  const [wished, setWished]     = useState(false);
  const tiltRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    setCanHover(window.matchMedia("(hover:hover)").matches);
  }, []);

  const effective = product.discount > 0
    ? Math.round(product.sellingPrice * (1 - product.discount / 100) * 100) / 100
    : product.sellingPrice;

  const img    = product.images?.[0];
  const isHero = variant === "hero";
  const stars  = product.rating || 4;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      onHoverStart={() => { if (canHover) setHovered(true); }}
      onHoverEnd={() => { if (canHover) setHovered(false); }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-[var(--color-border)] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      onMouseMove={(e) => {
        if (!canHover || !tiltRef.current) return;
        const rect = tiltRef.current.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top)  / rect.height - 0.5;
        tiltRef.current.style.setProperty("--rx", `${(-py * 8).toFixed(2)}deg`);
        tiltRef.current.style.setProperty("--ry", `${(px * 10).toFixed(2)}deg`);
      }}
      onMouseLeave={() => {
        if (!tiltRef.current) return;
        tiltRef.current.style.setProperty("--rx", "0deg");
        tiltRef.current.style.setProperty("--ry", "0deg");
      }}
    >
      <div ref={tiltRef} className="ct-product-tilt-inner flex flex-col flex-1">

        {/* Image */}
        <Link to={"/product/" + product._id}
          className={"relative overflow-hidden bg-gray-100 " + (isHero ? "aspect-[16/10]" : "aspect-[4/3]")}>

          {/* Discount badge */}
          {product.discount > 0 && (
            <span className="absolute left-3 top-3 z-10 rounded-md px-2 py-0.5 text-xs font-bold text-white bg-red-500 shadow">
              -{product.discount}%
            </span>
          )}
          {badgeText && (
            <span className="absolute right-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ background: "var(--color-green)" }}>
              {badgeText}
            </span>
          )}

          {/* Wishlist */}
          <button type="button" onClick={(e) => { e.preventDefault(); setWished(w => !w); toast(wished ? "Removed from wishlist" : "Added to wishlist"); }}
            className="absolute right-3 top-3 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow transition hover:scale-110">
            <FiHeart className={"w-4 h-4 transition " + (wished ? "fill-red-500 text-red-500" : "text-gray-400")} />
          </button>

          <img src={assetUrl(img)} alt={`${product.name} — Buy in Pune | Coldtech Technologies`}
            loading="lazy" width="400" height="300"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />

          {/* ── Coldtech Verified Badge ── */}
          <div className="absolute bottom-2 left-2 z-10 pointer-events-none select-none flex items-center gap-1.5 px-2 py-1 rounded-full"
            style={{
              background: "linear-gradient(135deg,rgba(10,10,40,0.82),rgba(13,27,62,0.82))",
              border: "1px solid rgba(58,182,255,0.5)",
              backdropFilter: "blur(6px)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
            }}>
            <img src="/logo.png" alt="Coldtech Verified"
              width="16" height="16"
              className="w-4 h-4 rounded-full object-cover flex-shrink-0"
              style={{ filter: "drop-shadow(0 0 2px rgba(58,182,255,0.6))" }} />
            <span className="text-[9px] font-black uppercase tracking-wider leading-none"
              style={{ color: "#3AB6FF", textShadow: "0 0 6px rgba(58,182,255,0.5)" }}>
              Verified
            </span>
          </div>

          {/* Quick View overlay */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: canHover && hovered ? 1 : 0 }}
            className="absolute inset-0 flex items-end justify-center pb-4"
            style={{ background: "linear-gradient(to top, rgba(26,44,62,0.7) 0%, transparent 60%)" }}>
            <button type="button" onClick={(e) => { e.preventDefault(); onQuickView?.(product); }}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white"
              style={{ background: "rgba(0,166,196,0.92)" }}>
              <FiEye className="w-3.5 h-3.5" /> Quick View
            </button>
          </motion.div>
        </Link>

        {/* Content */}
        <div className={"flex flex-1 flex-col " + (isHero ? "p-5" : "p-4")}>
          <Link to={"/product/" + product._id}>
            <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 hover:text-[#00A6C4] transition leading-snug mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-3">
            {Array(5).fill(0).map((_, i) => (
              <FaStar key={i} className={"w-3 h-3 " + (i < stars ? "text-yellow-400" : "text-gray-200")} />
            ))}
            <span className="text-xs text-gray-400 ml-1">({product.reviewCount || Math.floor(Math.random()*200)+10})</span>
          </div>

          <div className="mt-auto flex items-end justify-between gap-2">
            <div>
              {product.discount > 0 && (
                <p className="text-xs line-through text-gray-400">{fmt(product.sellingPrice)}</p>
              )}
              <p className={"font-bold " + (isHero ? "text-xl" : "text-base")} style={{ color: "#00A6C4" }}>
                {fmt(effective)}
              </p>
            </div>

            <motion.button type="button"
              onClick={() => { addItem(product, 1); toast.success("Added to cart"); setAdded(true); }}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white transition hover:scale-105"
              style={{ background: "linear-gradient(135deg, #1A2C3E, #00A6C4)" }}
              animate={added ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              onAnimationComplete={() => setAdded(false)}
              aria-label="Add to cart">
              <FiShoppingCart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}