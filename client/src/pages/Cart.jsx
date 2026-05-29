import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiTrash2, FiMinus, FiPlus, FiShoppingBag,
  FiArrowRight, FiShield, FiTruck, FiRefreshCw,
  FiMapPin, FiUser, FiPhone, FiChevronRight,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { assetUrl } from "../utils/imageUrl";
import { api } from "../services/api";

const fmt = n => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
const FREE_SHIP_THRESHOLD = 5000;
const GST_RATE = 0.18;
const DELIVERY_FEE = 99;

const TRUST_BADGES = [
  { icon: FiShield,    label: "Secure Payments" },
  { icon: FiTruck,    label: "Free above ₹5,000" },
  { icon: FiRefreshCw, label: "30-day Returns" },
];

/* ── Cart Item Row ── */
function CartItem({ line, onUpdateQty, onRemove }) {
  const effective = line.discount > 0
    ? line.sellingPrice * (1 - line.discount / 100)
    : line.sellingPrice;
  const lineTotal = effective * line.quantity;

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
      className="flex gap-4 bg-white rounded-2xl p-4 border border-slate-200 hover:border-slate-300 transition-colors">
      {/* Image */}
      <Link to={"/product/" + line.productId} className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
        <img src={assetUrl(line.image)} alt={line.name} loading="lazy" className="w-full h-full object-cover" />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link to={"/product/" + line.productId}>
          <h3 className="font-semibold text-sm text-slate-800 hover:text-[#3AB6FF] transition line-clamp-2 leading-snug">{line.name}</h3>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold text-[#3AB6FF]">{fmt(effective)}</span>
          {line.discount > 0 && (
            <>
              <span className="text-xs line-through text-slate-400">{fmt(line.sellingPrice)}</span>
              <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded">{line.discount}% off</span>
            </>
          )}
        </div>

        {/* Qty + Remove */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
            <button onClick={() => onUpdateQty(line.productId, line.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-[#3AB6FF] transition">
              <FiMinus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-slate-700">{line.quantity}</span>
            <button onClick={() => onUpdateQty(line.productId, line.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-[#3AB6FF] transition">
              <FiPlus className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-800">{fmt(lineTotal)}</span>
            <button onClick={() => onRemove(line.productId)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition">
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Input field ── */
function Field({ label, required, icon: Icon, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-600 block mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />}
        {children}
      </div>
    </div>
  );
}

/* ── Main Cart ── */
export function Cart() {
  const { items, updateQty, removeItem, subtotal, clear } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    line1: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setAddress(a => ({ ...a, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const freeShipping = subtotal >= FREE_SHIP_THRESHOLD;
  const shippingProgress = Math.min((subtotal / FREE_SHIP_THRESHOLD) * 100, 100);
  const delivery = freeShipping ? 0 : DELIVERY_FEE;
  const tax = Math.round(subtotal * GST_RATE);
  const total = subtotal + tax + delivery;

  function validate() {
    const e = {};
    if (!address.fullName.trim()) e.fullName = "Required";
    if (!address.phone.trim())    e.phone    = "Required";
    if (!address.line1.trim())    e.line1    = "Required";
    if (!address.city.trim())     e.city     = "Required";
    if (!address.state.trim())    e.state    = "Required";
    if (!address.zip.trim())      e.zip      = "Required";
    return e;
  }

  const checkout = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    if (items.length === 0) { toast.error("Cart is empty"); return; }
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); toast.error("Please fill in all required fields"); return; }

    setSubmitting(true);
    try {
      await api.post("/orders", {
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        address: { line1: address.line1, city: address.city, state: address.state, zip: address.zip, country: address.country },
      });
      clear();
      toast.success("Order placed successfully!");
      navigate("/dashboard", { state: { tab: "orders" } });
    } catch (e) {
      toast.error(e.response?.data?.message || "Checkout failed");
    } finally { setSubmitting(false); }
  };

  const inp = (err) => `w-full rounded-xl border px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3AB6FF]/20 focus:border-[#3AB6FF] transition ${err ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"}`;

  /* ── Empty state ── */
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-sky-50 flex items-center justify-center mb-6">
          <FiShoppingBag className="w-9 h-9 text-[#3AB6FF]" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 max-w-xs">Looks like you haven't added anything yet. Browse our catalog to get started.</p>
        <Link to="/shop" className="btn-primary flex items-center gap-2 px-8 py-3">
          Browse Products <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[var(--color-page)] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800" style={{ fontFamily: "var(--font-display)" }}>
            Shopping Cart
          </h1>
          <p className="text-sm text-slate-500 mt-1">{items.length} item{items.length !== 1 ? "s" : ""} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

          {/* ── Left: Cart items + Address ── */}
          <div className="space-y-6">

            {/* Free shipping progress */}
            {!freeShipping && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="flex justify-between text-xs text-slate-600 mb-2">
                  <span>Add <span className="font-bold text-[#3AB6FF]">{fmt(FREE_SHIP_THRESHOLD - subtotal)}</span> more for free shipping</span>
                  <span className="text-slate-400">{fmt(FREE_SHIP_THRESHOLD)}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                    animate={{ width: shippingProgress + "%" }}
                    style={{ background: "linear-gradient(90deg,#3AB6FF,#1E90FF)" }}
                    transition={{ duration: 0.5 }} />
                </div>
              </div>
            )}
            {freeShipping && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-3 flex items-center gap-2">
                <FiTruck className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-xs font-semibold text-green-700">You've unlocked free shipping!</p>
              </div>
            )}

            {/* Cart items */}
            <div className="space-y-3">
              <AnimatePresence>
                {items.map(line => (
                  <CartItem key={line.productId} line={line} onUpdateQty={updateQty} onRemove={removeItem} />
                ))}
              </AnimatePresence>
            </div>

            {/* Shipping address */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
                <FiMapPin className="w-4 h-4 text-[#3AB6FF]" /> Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" required icon={FiUser}>
                  <input value={address.fullName} onChange={e => set("fullName", e.target.value)}
                    placeholder="John Doe" className={inp(errors.fullName) + " pl-10"} />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </Field>
                <Field label="Phone" required icon={FiPhone}>
                  <input type="tel" value={address.phone} onChange={e => set("phone", e.target.value)}
                    placeholder="+91 98765 43210" className={inp(errors.phone) + " pl-10"} />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Address Line" required>
                    <input value={address.line1} onChange={e => set("line1", e.target.value)}
                      placeholder="House no., Street, Area" className={inp(errors.line1)} />
                    {errors.line1 && <p className="text-xs text-red-500 mt-1">{errors.line1}</p>}
                  </Field>
                </div>
                <Field label="City" required>
                  <input value={address.city} onChange={e => set("city", e.target.value)}
                    placeholder="Bangalore" className={inp(errors.city)} />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </Field>
                <Field label="State" required>
                  <input value={address.state} onChange={e => set("state", e.target.value)}
                    placeholder="Karnataka" className={inp(errors.state)} />
                  {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                </Field>
                <Field label="PIN Code" required>
                  <input value={address.zip} onChange={e => set("zip", e.target.value)}
                    placeholder="560001" className={inp(errors.zip)} />
                  {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
                </Field>
                <Field label="Country">
                  <input value={address.country} onChange={e => set("country", e.target.value)}
                    placeholder="India" className={inp(false)} />
                </Field>
              </div>
            </div>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
              <h2 className="font-bold text-slate-800 mb-5">Order Summary</h2>

              {/* Item list */}
              <div className="space-y-3 mb-5 max-h-52 overflow-y-auto pr-1">
                {items.map(line => {
                  const price = line.discount > 0 ? line.sellingPrice * (1 - line.discount / 100) : line.sellingPrice;
                  return (
                    <div key={line.productId} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={assetUrl(line.image)} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-700 truncate">{line.name}</p>
                        <p className="text-[10px] text-slate-400">Qty: {line.quantity}</p>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 flex-shrink-0">{fmt(price * line.quantity)}</p>
                    </div>
                  );
                })}
              </div>

              {/* Price breakdown */}
              <div className="space-y-2.5 border-t border-slate-100 pt-4 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18%)</span>
                  <span>{fmt(tax)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span className={freeShipping ? "text-green-600 font-semibold" : ""}>
                    {freeShipping ? "FREE" : fmt(delivery)}
                  </span>
                </div>
                <div className="flex justify-between font-black text-slate-800 text-base border-t border-slate-100 pt-3 mt-1">
                  <span>Total</span>
                  <span className="text-[#3AB6FF]">{fmt(total)}</span>
                </div>
              </div>

              {/* CTA */}
              <motion.button
                onClick={checkout}
                disabled={submitting}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm disabled:opacity-60 transition"
                style={{ background: "linear-gradient(135deg,#3AB6FF,#1E90FF)", boxShadow: "0 4px 20px rgba(58,182,255,0.35)" }}>
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : isAuthenticated ? (
                  <><FiChevronRight className="w-4 h-4" /> Place Order</>
                ) : (
                  <><FiChevronRight className="w-4 h-4" /> Login to Checkout</>
                )}
              </motion.button>

              {!isAuthenticated && (
                <p className="text-xs text-center text-slate-400 mt-3">
                  You'll be redirected to login before placing your order.
                </p>
              )}

              {/* Trust badges */}
              <div className="flex justify-around mt-5 pt-4 border-t border-slate-100">
                {TRUST_BADGES.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 text-center">
                    <Icon className="w-4 h-4 text-[#3AB6FF]" />
                    <span className="text-[10px] text-slate-500 leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue shopping */}
            <Link to="/shop" className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-[#3AB6FF] transition py-2">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
