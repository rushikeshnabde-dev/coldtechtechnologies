import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingCart, FiZap, FiStar, FiShare2, FiHeart,
  FiShield, FiTruck, FiRefreshCw, FiHeadphones,
  FiChevronLeft, FiChevronRight, FiCheck, FiMinus, FiPlus,
  FiMaximize2,
} from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { api } from "../services/api";
import { assetUrl } from "../utils/imageUrl";
import { useCart } from "../context/CartContext";
import { ProductCard } from "../components/ProductCard";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const SAMPLE_SPECS = [
  { label: "Processor",    value: "Intel Core i7-1355U" },
  { label: "RAM",          value: "16GB DDR5" },
  { label: "Storage",      value: "512GB NVMe SSD" },
  { label: "Display",      value: '15.6" FHD IPS, 1920Ã—1080' },
  { label: "Graphics",     value: "Intel Iris Xe" },
  { label: "Battery",      value: "54Wh, up to 8 hours" },
  { label: "Weight",       value: "1.8 kg" },
  { label: "OS",           value: "Windows 11 Pro" },
  { label: "Warranty",     value: "3 years onsite" },
];

const SAMPLE_REVIEWS = [
  { name: "Rahul M.",    rating: 5, date: "Mar 2026", text: "Excellent build quality and blazing fast performance. Best laptop I've owned." },
  { name: "Priya S.",    rating: 4, date: "Feb 2026", text: "Great value for money. Battery life is impressive. Keyboard could be better." },
  { name: "Amit K.",     rating: 5, date: "Jan 2026", text: "ColdTech support was amazing. Delivered on time and setup was smooth." },
];

const TRUST = [
  { icon: FiShield,      label: "100% Secure Payments" },
  { icon: FiTruck,       label: "Free Shipping above â‚¹999" },
  { icon: FiRefreshCw,   label: "30 Days Easy Returns" },
  { icon: FiHeadphones,  label: "24/7 Customer Support" },
];

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array(5).fill(0).map((_, i) => {
        if (i < Math.floor(rating)) return <FaStar key={i} className="w-4 h-4 text-yellow-400" />;
        if (i < rating)             return <FaStarHalfAlt key={i} className="w-4 h-4 text-yellow-400" />;
        return <FaRegStar key={i} className="w-4 h-4 text-gray-300" />;
      })}
    </div>
  );
}

export function ProductDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx]   = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [tab, setTab]         = useState("details");
  const [qty, setQty]         = useState(1);
  const [wished, setWished]   = useState(false);
  const [pincode, setPincode] = useState("");
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get("/products/" + id)
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) return (
    <div className="w-full px-4 md:px-6 lg:px-12 py-12 animate-pulse">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square rounded-2xl bg-gray-100" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 rounded bg-gray-100" />
          <div className="h-4 w-full rounded bg-gray-100" />
          <div className="h-4 w-3/4 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );

  if (!data?.product) return (
    <div className="w-full px-4 py-16 text-center">
      <p className="text-sm text-[var(--color-text-muted)]">
        Product not found.{" "}
        <Link to="/shop" className="font-semibold underline" style={{ color: "#00A6C4" }}>Back to shop</Link>
      </p>
    </div>
  );

  const { product, related } = data;
  const effective = product.discount > 0
    ? Math.round(product.sellingPrice * (1 - product.discount / 100) * 100) / 100
    : product.sellingPrice;
  const rating   = product.rating || 4.7;
  const reviews  = product.reviewsCount || 128;
  const emi      = Math.round(effective / 12);
  const inStock  = product.stock > 0;
  const specs    = product.specs?.length ? product.specs : SAMPLE_SPECS;
  const images   = product.images?.length ? product.images : [null];

  const add = () => { addItem(product, qty); toast.success("Added to cart"); };
  const buyNow = () => {
    addItem(product, qty);
    if (!isAuthenticated) { navigate("/login", { state: { from: { pathname: "/cart" } } }); return; }
    navigate("/cart");
  };
  return (
    <div className="w-full bg-[var(--color-page)]">

      {/* Breadcrumb */}
      <div className="px-4 md:px-6 lg:px-12 pt-6 pb-2">
        <nav className="text-xs text-[var(--color-text-muted)] flex flex-wrap items-center gap-1">
          <Link to="/" className="hover:text-[#00A6C4] transition">Home</Link> <span>›</span>
          <Link to="/shop" className="hover:text-[#00A6C4] transition">Shop</Link>
          {product.category && <><span>›</span><span>{product.category}</span></>}
          <span>›</span><span className="text-[var(--color-text)] font-medium truncate max-w-[160px]">{product.name}</span>
        </nav>
      </div>

      {/* Hero: 2-column */}
      <div className="px-4 md:px-6 lg:px-12 py-6">
        <div className="grid gap-8 lg:grid-cols-2 xl:gap-12">

          {/* Gallery */}
          <div>
            <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-md group cursor-zoom-in"
              onClick={() => setLightbox(true)}>
              <img src={assetUrl(images[imgIdx])} alt={product.name}
                className="aspect-square w-full object-contain bg-gray-50 transition-transform duration-500 group-hover:scale-105" />
              {product.discount > 0 && (
                <span className="absolute left-4 top-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
                  -{product.discount}% OFF
                </span>
              )}
              {/* Coldtech Verified Badge */}
              <div className="absolute bottom-3 left-3 z-10 pointer-events-none flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                style={{ background:"linear-gradient(135deg,rgba(10,10,40,0.85),rgba(13,27,62,0.85))", border:"1px solid rgba(58,182,255,0.5)", backdropFilter:"blur(8px)", boxShadow:"0 2px 10px rgba(0,0,0,0.4)" }}>
                <img src="/logo.png" alt="Coldtech Verified" width="20" height="20" className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                <div className="leading-none">
                  <p className="text-[10px] font-black uppercase tracking-wider" style={{ color:"#3AB6FF" }}>Coldtech Verified</p>
                  <p className="text-[8px] font-medium" style={{ color:"rgba(255,255,255,0.6)" }}>Quality Checked</p>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setLightbox(true); }}
                className="absolute right-4 top-4 w-9 h-9 bg-white/90 rounded-xl flex items-center justify-center shadow hover:bg-white transition">
                <FiMaximize2 className="w-4 h-4 text-gray-600" />
              </button>
              {images.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setImgIdx(i => (i - 1 + images.length) % images.length); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition">
                    <FiChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setImgIdx(i => (i + 1) % images.length); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition">
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={"h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition " + (imgIdx === i ? "border-[#00A6C4] shadow-md" : "border-transparent hover:border-gray-300")}>
                    <img src={assetUrl(src)} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="mt-4 flex items-center gap-3">
              <button onClick={() => { setWished(w => !w); toast(wished ? "Removed from wishlist" : "Saved to wishlist"); }}
                className={"flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition " + (wished ? "border-red-300 text-red-500 bg-red-50" : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-red-300")}>
                <FiHeart className={"w-4 h-4 " + (wished ? "fill-red-500" : "")} />
                {wished ? "Wishlisted" : "Add to Wishlist"}
              </button>
              <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied!"); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-muted)] hover:border-[#00A6C4] transition">
                <FiShare2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#00A6C4" }}>
                {product.brand || "Coldtech"} · {product.category || "IT Hardware"}
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-[var(--color-text)] leading-tight">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <div className="flex items-center gap-2">
                  <StarRow rating={rating} />
                  <span className="text-sm font-semibold text-[var(--color-text)]">{rating.toFixed(1)}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">({reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 p-5">
              <div className="flex flex-wrap items-end gap-3 mb-2">
                <span className="text-3xl font-bold" style={{ color: "#00A6C4" }}>{fmt(effective)}</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-base line-through text-gray-400">{fmt(product.sellingPrice)}</span>
                    <span className="px-2 py-0.5 rounded-lg text-xs font-bold text-green-700 bg-green-100">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-3">Inclusive of all taxes · No hidden charges</p>
              <p className="text-sm text-[var(--color-text)]">
                No Cost EMI from <span className="font-bold text-[var(--color-text)]">{fmt(emi)}/month</span>
                <span className="text-xs text-gray-500 ml-1">· Available at checkout</span>
              </p>
            </div>

            {/* Stock + delivery */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className={"w-2 h-2 rounded-full " + (inStock ? "bg-green-500" : "bg-red-500")} />
                <span className={"font-semibold " + (inStock ? "text-green-600" : "text-red-600")}>
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
                {inStock && product.stock <= 5 && (
                  <span className="text-xs font-semibold text-orange-500">· Only {product.stock} left!</span>
                )}
              </div>
              <form className="flex items-center gap-2" onSubmit={e => e.preventDefault()}>
                <span className="text-[var(--color-text-muted)] text-xs">Deliver to</span>
                <input type="text" value={pincode} onChange={e => setPincode(e.target.value.slice(0,6))} placeholder="Pincode"
                  className="w-24 rounded-lg border border-[var(--color-border)] px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#00A6C4]" />
                <button type="submit" className="px-3 py-1 rounded-lg text-xs font-semibold text-white" style={{ background: "#1A2C3E" }}>Check</button>
              </form>
              <p className="text-xs text-[var(--color-text-muted)]">
                Free delivery by <span className="font-semibold text-[var(--color-text)]">
                  {new Date(Date.now() + 3*86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span> · 30 days return policy
              </p>
            </div>

            {/* Qty + Actions */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--color-text-muted)]">Quantity:</span>
                <div className="flex items-center gap-2 border border-[var(--color-border)] rounded-xl px-3 py-2">
                  <button onClick={() => setQty(q => Math.max(1, q-1))} disabled={qty <= 1}
                    className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-40 transition">
                    <FiMinus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-semibold text-[var(--color-text)]">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock || 99, q+1))} disabled={!inStock}
                    className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-40 transition">
                    <FiPlus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button onClick={add} disabled={!inStock} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white disabled:opacity-40 transition"
                  style={{ background: "linear-gradient(135deg, #1A2C3E, #00A6C4)" }}>
                  <FiShoppingCart className="w-4 h-4" /> Add to Cart
                </motion.button>
                <motion.button onClick={buyNow} disabled={!inStock} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold border-2 disabled:opacity-40 transition"
                  style={{ borderColor: "#00A6C4", color: "#00A6C4" }}>
                  <FiZap className="w-4 h-4" /> Buy Now
                </motion.button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2">
              {TRUST.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                  <FiCheck className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>

            {/* Seller */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 text-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Sold by</p>
                <p className="font-semibold text-[var(--color-text)]">Coldtech Technologies</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--color-text-muted)]">Seller rating</p>
                <p className="font-semibold text-[var(--color-text)]">4.8 <span className="text-yellow-400">★</span></p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 md:px-6 lg:px-12 py-8 border-t border-[var(--color-border)]">
        <div className="flex flex-wrap gap-1 mb-6 border-b border-[var(--color-border)]">
          {[
            { id: "details",  label: "Description" },
            { id: "specs",    label: "Specifications" },
            { id: "reviews",  label: "Reviews (" + reviews + ")" },
            { id: "warranty", label: "Warranty & Support" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={"px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition " + (tab === t.id
                ? "border-[#00A6C4] text-[#00A6C4]"
                : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]")}>
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

            {tab === "details" && (
              <div className="max-w-3xl space-y-4 text-sm text-[var(--color-text-muted)] leading-relaxed">
                <p>{product.description || "The Coldtech ProBook 15 is designed for professionals who need performance and reliability. With Intel's latest processor, ample memory, and fast SSD storage, this laptop handles everything from spreadsheets to creative work with ease."}</p>
                <ul className="space-y-2 mt-4">
                  {["Powerful Intel Core i7 processor","16GB fast DDR5 RAM for multitasking","512GB SSD for quick boot and file access","Full HD display with anti-glare coating","Backlit keyboard for working in low light","Fingerprint reader for secure login","All-day battery life"].map(f => (
                    <li key={f} className="flex items-center gap-2 text-[var(--color-text)]">
                      <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tab === "specs" && (
              <div className="max-w-2xl overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    {specs.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="py-3 px-4 font-medium text-[var(--color-text-muted)] w-40 border border-[var(--color-border)]">{row.label}</td>
                        <td className="py-3 px-4 text-[var(--color-text)] border border-[var(--color-border)]">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "reviews" && (
              <div className="max-w-3xl">
                <div className="flex items-center gap-6 mb-8 p-5 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-[var(--color-text)]">{rating.toFixed(1)}</p>
                    <StarRow rating={rating} />
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{reviews} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5,4,3,2,1].map(s => (
                      <div key={s} className="flex items-center gap-2 text-xs">
                        <span className="w-4 text-right text-[var(--color-text-muted)]">{s}</span>
                        <FaStar className="w-3 h-3 text-yellow-400" />
                        <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full rounded-full bg-yellow-400" style={{ width: s === 5 ? "70%" : s === 4 ? "20%" : s === 3 ? "7%" : "3%" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  {SAMPLE_REVIEWS.map((r, i) => (
                    <div key={i} className="card p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ background: "linear-gradient(135deg, #1A2C3E, #00A6C4)" }}>
                            {r.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-[var(--color-text)]">{r.name}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">{r.date}</p>
                          </div>
                        </div>
                        <StarRow rating={r.rating} />
                      </div>
                      <p className="text-sm text-[var(--color-text-muted)]">{r.text}</p>
                    </div>
                  ))}
                </div>
                <button className="mt-5 btn-outline text-sm">Write a Review</button>
              </div>
            )}

            {tab === "warranty" && (
              <div className="max-w-2xl space-y-4 text-sm text-[var(--color-text-muted)]">
                {[
                  { title: "Warranty Coverage", text: "3-year onsite warranty from Coldtech Technologies. Covers manufacturing defects and hardware failures." },
                  { title: "Return Policy",      text: "30-day easy returns. Product must be in original condition with all accessories." },
                  { title: "Support",            text: "24/7 technical support via phone, email, and live chat. On-site support available in 10+ cities." },
                  { title: "Extended Warranty",  text: "Extended coverage available for enterprise deployments. Contact our sales team for pricing." },
                ].map(({ title, text }) => (
                  <div key={title} className="card p-4">
                    <p className="font-semibold text-[var(--color-text)] mb-1">{title}</p>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Related products */}
      {related?.length > 0 && (
        <div className="px-4 md:px-6 lg:px-12 py-8 border-t border-[var(--color-border)]">
          <h2 className="ct-h2 font-bold text-[var(--color-text)] mb-6">You May Also Like</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setLightbox(false)}>
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              src={assetUrl(images[imgIdx])} alt=""
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
              onClick={e => e.stopPropagation()} />
            <button onClick={() => setLightbox(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky mobile bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
            className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-[var(--color-border)] px-4 py-3 flex items-center gap-3 shadow-2xl">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--color-text)] truncate">{product.name}</p>
              <p className="text-sm font-bold" style={{ color: "#00A6C4" }}>{fmt(effective)}</p>
            </div>
            <button onClick={add} disabled={!inStock}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #1A2C3E, #00A6C4)" }}>
              <FiShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
