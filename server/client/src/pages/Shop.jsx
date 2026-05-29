import { useEffect, useCallback, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiShoppingCart, FiX, FiGrid, FiList, FiChevronDown } from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { api } from "../services/api";
import { ProductCard } from "../components/ProductCard";
import { ProductGridSkeleton, ProductListSkeleton } from "../components/Skeleton";
import { FilterSidebar } from "../components/FilterSidebar";
import { QuickViewModal } from "../components/QuickViewModal";
import { SEO } from "../components/SEO";
import { MiniCart } from "../components/MiniCart";
import { useCart } from "../context/CartContext";
import { assetUrl } from "../utils/imageUrl";
import toast from "react-hot-toast";

const fmt = n => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const SORT_OPTIONS = [
  { value: "", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Best Rating" },
  { value: "popularity", label: "Most Popular" },
];

const CONDITION_COLOR = {
  New: "bg-green-100 text-green-700 border-green-200",
  Refurbished: "bg-blue-100 text-blue-700 border-blue-200",
  Used: "bg-orange-100 text-orange-700 border-orange-200",
};

/* ── Helpers ── */
function useDebounce(value, delay) {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return dv;
}

function parseFiltersFromURL(search) {
  const p = new URLSearchParams(search);
  const arr = key => p.get(key) ? p.get(key).split(",").filter(Boolean) : [];
  const [minP, maxP] = (p.get("price") || "").split("-");
  return {
    minPrice: minP || "",
    maxPrice: maxP || "",
    inStock: p.get("inStock") || "",
    condition: arr("condition"),
    ram: arr("ram"),
    storageType: arr("storageType"),
    processor: arr("processor"),
    brand: arr("brand"),
    category: p.get("category") || "",
    sort: p.get("sort") || "",
  };
}

function filtersToURL(filters, search, page) {
  const p = new URLSearchParams();
  if (search) p.set("q", search);
  if (filters.minPrice || filters.maxPrice) p.set("price", `${filters.minPrice || 0}-${filters.maxPrice || 200000}`);
  if (filters.inStock) p.set("inStock", filters.inStock);
  if (filters.condition?.length) p.set("condition", filters.condition.join(","));
  if (filters.ram?.length) p.set("ram", filters.ram.join(","));
  if (filters.storageType?.length) p.set("storageType", filters.storageType.join(","));
  if (filters.processor?.length) p.set("processor", filters.processor.join(","));
  if (filters.brand?.length) p.set("brand", filters.brand.join(","));
  if (filters.category) p.set("category", filters.category);
  if (filters.sort) p.set("sort", filters.sort);
  if (page > 1) p.set("page", String(page));
  return p.toString() ? "?" + p.toString() : "";
}

/* ── ProductListCard ── */
function ProductListCard({ product, index, onQuickView }) {
  const { addItem } = useCart();
  const effective = product.discount > 0
    ? Math.round(product.sellingPrice * (1 - product.discount / 100) * 100) / 100
    : product.sellingPrice;
  const stars = product.rating || 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
      className="flex gap-4 bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md hover:border-sky-200 transition-all group"
    >
      <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onQuickView(product)}>
        <img src={assetUrl(product.images?.[0])} alt={product.name} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {product.discount > 0 && (
          <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">-{product.discount}%</span>
        )}
        {/* Coldtech Verified Badge */}
        <div className="absolute bottom-1 left-1 z-10 pointer-events-none flex items-center gap-1 px-1.5 py-0.5 rounded-full"
          style={{ background:"rgba(10,10,40,0.8)", border:"1px solid rgba(58,182,255,0.45)", backdropFilter:"blur(4px)" }}>
          <img src="/logo.png" alt="" width="12" height="12" className="w-3 h-3 rounded-full object-cover flex-shrink-0" />
          <span className="text-[8px] font-black uppercase tracking-wider" style={{ color:"#3AB6FF" }}>Verified</span>
        </div>
      </div>
      <div className="flex flex-1 min-w-0 flex-col justify-between py-0.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold text-sky-600 uppercase tracking-wide">{product.brand}</p>
              <h3 className="font-semibold text-sm text-slate-800 hover:text-sky-600 transition line-clamp-2 leading-snug cursor-pointer"
                onClick={() => onQuickView(product)}>{product.name}</h3>
            </div>
            {product.condition && (
              <span className={"text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 " + (CONDITION_COLOR[product.condition] || "bg-gray-100 text-gray-600 border-gray-200")}>
                {product.condition}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1.5">
            {Array(5).fill(0).map((_, i) => (
              <FaStar key={i} className={"w-3 h-3 " + (i < stars ? "text-yellow-400" : "text-gray-200")} />
            ))}
            <span className="text-xs text-slate-400 ml-1">({product.reviewCount || 0})</span>
          </div>
          {/* Spec pills */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {product.processor && <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{product.processor}</span>}
            {product.ram && <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{product.ram}</span>}
            {product.storageType && <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{product.storageType}</span>}
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          <div>
            {product.discount > 0 && <p className="text-xs line-through text-slate-400">{fmt(product.sellingPrice)}</p>}
            <p className="font-bold text-base text-sky-600">{fmt(effective)}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onQuickView(product)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:border-sky-400 hover:text-sky-600 transition">
              Quick View
            </button>
            <button onClick={() => { addItem(product, 1); toast.success("Added to cart!"); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white btn-cyan">
              <FiShoppingCart className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── ActiveChips ── */
function ActiveChips({ filters, search, onRemove, onClearSearch }) {
  const chips = [];
  if (search) chips.push({ key: "search", label: `"${search}"`, onRemove: onClearSearch });
  if (filters.category) chips.push({ key: "category", label: filters.category, onRemove: () => onRemove("category", "") });
  if (filters.minPrice || filters.maxPrice) chips.push({ key: "price", label: `₹${Number(filters.minPrice||0).toLocaleString("en-IN")} – ₹${Number(filters.maxPrice||200000).toLocaleString("en-IN")}`, onRemove: () => { onRemove("minPrice",""); onRemove("maxPrice",""); } });
  if (filters.inStock) chips.push({ key: "inStock", label: filters.inStock === "true" ? "In Stock" : "Out of Stock", onRemove: () => onRemove("inStock","") });
  ["condition","ram","storageType","processor","brand"].forEach(key => {
    (filters[key]||[]).forEach(v => chips.push({ key: key+v, label: v, onRemove: () => onRemove(key, (filters[key]||[]).filter(x=>x!==v)) }));
  });
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map(c => (
        <span key={c.key} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-50 border border-sky-200 text-sky-700">
          {c.label}
          <button onClick={c.onRemove} className="hover:text-red-500 transition"><FiX className="w-3 h-3" /></button>
        </span>
      ))}
    </div>
  );
}

/* ── Empty State ── */
function EmptyState({ onClear }) {
  return (
    <div className="py-20 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="font-bold text-slate-700 text-lg mb-2">No products found</h3>
      <p className="text-slate-500 text-sm mb-6">Try adjusting your filters or search term</p>
      <button onClick={onClear} className="btn-cyan text-sm px-6 py-2.5">Clear All Filters</button>
    </div>
  );
}

/* ── Main Shop ── */
export function Shop() {
  const location = useLocation();
  const navigate = useNavigate();
  const { count } = useCart();

  // Parse initial state from URL
  const [filters, setFilters] = useState(() => parseFiltersFromURL(location.search));
  const [search, setSearch]   = useState(() => new URLSearchParams(location.search).get("q") || "");
  const [sort, setSort]       = useState(() => new URLSearchParams(location.search).get("sort") || "");
  const [page, setPage]       = useState(() => Number(new URLSearchParams(location.search).get("page")) || 1);
  const [viewMode, setViewMode] = useState("grid");

  const [products, setProducts] = useState([]);
  const [total, setTotal]       = useState(0);
  const [pages, setPages]       = useState(1);
  const [loading, setLoading]   = useState(true);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [miniCartOpen, setMiniCartOpen]           = useState(false);
  const [quickViewProduct, setQuickViewProduct]   = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  // Sync URL when filters change
  useEffect(() => {
    const url = filtersToURL({ ...filters, sort }, debouncedSearch, page);
    navigate("/shop" + url, { replace: true });
  }, [filters, sort, debouncedSearch, page]);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    const params = {
      page, limit: 12,
      search: debouncedSearch || undefined,
      category: filters.category || undefined,
      brand: filters.brand?.length ? filters.brand.join(",") : undefined,
      condition: filters.condition?.length ? filters.condition.join(",") : undefined,
      ram: filters.ram?.length ? filters.ram.join(",") : undefined,
      storageType: filters.storageType?.length ? filters.storageType.join(",") : undefined,
      processor: filters.processor?.length ? filters.processor.join(",") : undefined,
      inStock: filters.inStock || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      sort: sort || undefined,
    };
    api.get("/products", { params })
      .then(res => { setProducts(res.data.products || []); setTotal(res.data.total || 0); setPages(res.data.pages || 1); })
      .catch(() => { setProducts([]); setTotal(0); })
      .finally(() => setLoading(false));
  }, [filters, sort, debouncedSearch, page]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ minPrice:"", maxPrice:"", inStock:"", condition:[], ram:[], storageType:[], processor:[], brand:[], category:"" });
    setSearch("");
    setSort("");
    setPage(1);
  }, []);

  const activeCount = [
    filters.category, filters.inStock, filters.minPrice, filters.maxPrice,
    ...(filters.condition||[]), ...(filters.ram||[]), ...(filters.storageType||[]),
    ...(filters.processor||[]), ...(filters.brand||[]),
  ].filter(Boolean).length + (search ? 1 : 0);

  const shownFrom = (page - 1) * 12 + 1;
  const shownTo   = Math.min(page * 12, total);

  const FiltersPanel = (
    <FilterSidebar
      filters={filters}
      onChange={handleFilterChange}
      onClear={clearFilters}
      activeCount={activeCount}
      search={search}
      onSearchChange={v => { setSearch(v); setPage(1); }}
    />
  );

  return (
    <div className="w-full bg-[var(--color-page)] min-h-screen">
      <SEO
        title="Shop IT Products — Laptops, PCs & Accessories in Pune"
        description="Buy refurbished laptops, desktops, networking devices & IT accessories in Pune. Certified quality, best prices. Shop Coldtech Technologies today."
        keywords="buy laptop Pune, refurbished laptops Pune, IT products Pune, computer accessories Pune, networking devices Pune, buy PC Pune, IT shop Pune"
        canonical="/shop"
      />

      {/* Hero banner */}
      <div className="px-4 md:px-6 lg:px-10 pt-6 pb-4">
        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
          <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-bold text-slate-800">
            Refurbished Laptops & PCs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {total > 0 ? `${total} products available` : "Browse our catalog"} · Certified quality · Best prices
          </p>
        </motion.div>

        {/* Promo banner */}
        <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
          className="mt-4 rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{ background:"linear-gradient(90deg,rgba(14,165,233,0.08),rgba(16,185,129,0.08))", border:"1px solid rgba(14,165,233,0.2)" }}>
          <div>
            <p className="font-semibold text-sm text-slate-800">🎉 Festival Sale · Extra 10% off on all laptops</p>
            <p className="text-xs text-slate-500 mt-0.5">Code <span className="font-mono font-bold text-sky-600">COLDTECH10</span> at checkout</p>
          </div>
          <button onClick={() => handleFilterChange("category", "Laptops")}
            className="btn-primary text-xs px-4 py-2 flex-shrink-0">
            View Laptop Deals
          </button>
        </motion.div>
      </div>

      {/* Main layout */}
      <div className="px-4 md:px-6 lg:px-10 pb-12">
        <div className="flex gap-6">

          {/* Left: Filter sidebar (desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              {FiltersPanel}
            </div>
          </aside>

          {/* Center: Products */}
          <section className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:border-sky-400 transition bg-white">
                  <FiFilter className="w-4 h-4" />
                  Filters
                  {activeCount > 0 && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500 text-white">{activeCount}</span>}
                </button>

                {/* Count */}
                {!loading && total > 0 && (
                  <span className="text-sm text-slate-500">
                    Showing <span className="font-semibold text-slate-700">{shownFrom}–{shownTo}</span> of <span className="font-semibold text-slate-700">{total}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <div className="relative">
                  <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
                    className="appearance-none rounded-xl border border-slate-200 pl-3 pr-8 py-2 text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer">
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>

                {/* Mobile cart */}
                <button onClick={() => setMiniCartOpen(true)}
                  className="lg:hidden relative flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:border-sky-400 transition bg-white">
                  <FiShoppingCart className="w-4 h-4" />
                  {count > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-sky-500 text-white text-[10px] flex items-center justify-center font-bold">{count}</span>}
                </button>

                {/* View toggle */}
                <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden bg-white">
                  <button onClick={() => setViewMode("grid")} title="Grid view"
                    className={"px-2.5 py-2 transition " + (viewMode==="grid" ? "bg-sky-500 text-white" : "text-slate-400 hover:text-sky-500")}>
                    <FiGrid className="w-4 h-4" />
                  </button>
                  <button onClick={() => setViewMode("list")} title="List view"
                    className={"px-2.5 py-2 transition border-l border-slate-200 " + (viewMode==="list" ? "bg-sky-500 text-white" : "text-slate-400 hover:text-sky-500")}>
                    <FiList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            <ActiveChips
              filters={filters}
              search={search}
              onRemove={handleFilterChange}
              onClearSearch={() => { setSearch(""); setPage(1); }}
            />

            {/* Products */}
            {loading ? (
              viewMode === "grid" ? <ProductGridSkeleton count={12} /> : <ProductListSkeleton count={6} />
            ) : products.length === 0 ? (
              <EmptyState onClear={clearFilters} />
            ) : viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p, i) => (
                  <ProductCard key={p._id} product={p} index={i} onQuickView={setQuickViewProduct} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {products.map((p, i) => (
                  <ProductListCard key={p._id} product={p} index={i} onQuickView={setQuickViewProduct} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-1.5">
                <button disabled={page<=1} onClick={() => setPage(p => p-1)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:border-sky-400 disabled:opacity-40 transition bg-white">
                  ← Prev
                </button>
                {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                  const p = pages <= 7 ? i+1 : page <= 4 ? i+1 : page >= pages-3 ? pages-6+i : page-3+i;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={"w-9 h-9 rounded-xl text-sm font-medium transition " + (p===page ? "bg-sky-500 text-white" : "border border-slate-200 text-slate-600 hover:border-sky-400 bg-white")}>
                      {p}
                    </button>
                  );
                })}
                <button disabled={page>=pages} onClick={() => setPage(p => p+1)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:border-sky-400 disabled:opacity-40 transition bg-white">
                  Next →
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div className="fixed inset-0 z-40 lg:hidden" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <button className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
            <motion.div className="absolute inset-y-0 left-0 w-80 bg-white shadow-2xl overflow-y-auto"
              initial={{ x:"-100%" }} animate={{ x:0 }} exit={{ x:"-100%" }}
              transition={{ type:"spring", stiffness:300, damping:30 }}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
                <h2 className="font-bold text-slate-800">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <FiX className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <div className="p-5">{FiltersPanel}</div>
              <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4">
                <button onClick={() => setMobileFiltersOpen(false)} className="btn-cyan w-full py-3 text-sm font-bold">
                  Show {total} Results
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Cart */}
      <MiniCart open={miniCartOpen} onClose={() => setMiniCartOpen(false)} />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
}
