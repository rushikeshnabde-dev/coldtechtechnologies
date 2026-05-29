import { useState, useCallback } from "react";
import { FiChevronDown, FiTrash2, FiSearch, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

/* ── FilterGroup ── */
function FilterGroup({ title, children, defaultOpen = true, count = 0 }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-[#3AB6FF] transition-colors"
      >
        <span className="flex items-center gap-1.5">
          {title}
          {count > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#3AB6FF] text-white leading-none">{count}</span>
          )}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <FiChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="pb-2.5 space-y-0.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── CheckItem ── */
function CheckItem({ label, checked, onChange }) {
  return (
    <label
      className="flex items-center gap-2.5 cursor-pointer group py-1 px-1 rounded-lg hover:bg-slate-50 transition-colors select-none"
      onClick={onChange}
    >
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
        checked
          ? "bg-[#3AB6FF] border-[#3AB6FF]"
          : "border-slate-300 bg-white group-hover:border-[#3AB6FF]"
      }`}>
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span className={`text-xs leading-none transition-colors ${
        checked ? "text-[#3AB6FF] font-semibold" : "text-slate-600 group-hover:text-slate-800"
      }`}>
        {label}
      </span>
    </label>
  );
}

/* ── PriceRangeSlider ── */
function PriceRangeSlider({ min, max, value, onChange }) {
  const fmtK = n => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
    if (n >= 1000)   return `₹${(n / 1000).toFixed(0)}K`;
    return `₹${n}`;
  };
  const pct = v => Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));

  return (
    <div className="space-y-4 pt-1 px-2">
      {/* Price labels */}
      <div className="flex justify-between">
        <span className="text-xs font-bold text-[#3AB6FF] bg-sky-50 px-2 py-1 rounded-lg">{fmtK(value[0])}</span>
        <span className="text-xs font-bold text-[#3AB6FF] bg-sky-50 px-2 py-1 rounded-lg">{fmtK(value[1])}</span>
      </div>

      {/* Dual range track */}
      <div className="relative h-6 flex items-center px-2">
        {/* Background track */}
        <div className="absolute left-2 right-2 h-1.5 bg-slate-200 rounded-full" />
        {/* Active track */}
        <div
          className="absolute h-1.5 rounded-full"
          style={{
            left: `calc(${pct(value[0])}% * (100% - 16px) / 100% + 8px)`,
            right: `calc((100 - ${pct(value[1])}) * 1% * (100% - 16px) / 100% + 8px)`,
            background: "linear-gradient(90deg, #3AB6FF, #1E90FF)",
          }}
        />
        {/* Min range input */}
        <input
          type="range" min={min} max={max} step={1000} value={value[0]}
          onChange={e => {
            const v = Number(e.target.value);
            if (v < value[1] - 1000) onChange([v, value[1]]);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: value[0] > max * 0.9 ? 5 : 3 }}
        />
        {/* Max range input */}
        <input
          type="range" min={min} max={max} step={1000} value={value[1]}
          onChange={e => {
            const v = Number(e.target.value);
            if (v > value[0] + 1000) onChange([value[0], v]);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 4 }}
        />
        {/* Min thumb */}
        <div
          className="absolute w-4 h-4 bg-white border-2 border-[#3AB6FF] rounded-full shadow-md pointer-events-none"
          style={{
            left: `calc(${pct(value[0])}% * (100% - 32px) / 100% + 8px)`,
            transform: "translateX(-50%)",
            zIndex: 6,
          }}
        />
        {/* Max thumb */}
        <div
          className="absolute w-4 h-4 bg-white border-2 border-[#3AB6FF] rounded-full shadow-md pointer-events-none"
          style={{
            left: `calc(${pct(value[1])}% * (100% - 32px) / 100% + 8px)`,
            transform: "translateX(-50%)",
            zIndex: 6,
          }}
        />
      </div>

      {/* Number inputs */}
      <div className="flex gap-2">
        <div className="flex-1 min-w-0">
          <label className="text-[10px] text-slate-400 mb-1 block font-medium">Min (₹)</label>
          <input
            type="number"
            placeholder="0"
            value={value[0] === 0 ? "" : value[0]}
            onChange={e => {
              const v = e.target.value === "" ? 0 : Number(e.target.value);
              if (v >= min && v < value[1]) onChange([v, value[1]]);
            }}
            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#3AB6FF] focus:border-[#3AB6FF] text-slate-700 bg-white transition"
          />
        </div>
        <div className="flex items-end pb-2 text-slate-300 text-sm font-light">–</div>
        <div className="flex-1 min-w-0">
          <label className="text-[10px] text-slate-400 mb-1 block font-medium">Max (₹)</label>
          <input
            type="number"
            placeholder="2L"
            value={value[1] === 200000 ? "" : value[1]}
            onChange={e => {
              const v = e.target.value === "" ? 200000 : Number(e.target.value);
              if (v <= max && v > value[0]) onChange([value[0], v]);
            }}
            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#3AB6FF] focus:border-[#3AB6FF] text-slate-700 bg-white transition"
          />
        </div>
      </div>
    </div>
  );
}

/* ── Main FilterSidebar ── */
export function FilterSidebar({ filters, onChange, onClear, activeCount, search, onSearchChange }) {
  const toggle = useCallback((key, val) => {
    const cur = filters[key] || [];
    onChange(key, cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]);
  }, [filters, onChange]);

  const conditionCount  = (filters.condition || []).length;
  const ramCount        = (filters.ram || []).length;
  const storageCount    = (filters.storageType || []).length;
  const processorCount  = (filters.processor || []).length;
  const brandCount      = (filters.brand || []).length;

  return (
    <div className="text-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
          Filters
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3AB6FF] text-white">{activeCount}</span>
          )}
        </h3>
        {activeCount > 0 && (
          <button onClick={onClear}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-semibold transition">
            <FiTrash2 className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-8 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#3AB6FF]/20 focus:border-[#3AB6FF] focus:bg-white transition"
        />
        {search && (
          <button onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
            <FiX className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter groups */}
      <div className="space-y-0 divide-y divide-slate-100">

        {/* Price Range */}
        <FilterGroup title="Price Range" defaultOpen={true}>
          <PriceRangeSlider
            min={0} max={200000}
            value={[Number(filters.minPrice) || 0, Number(filters.maxPrice) || 200000]}
            onChange={([lo, hi]) => {
              onChange("minPrice", lo > 0 ? String(lo) : "");
              onChange("maxPrice", hi < 200000 ? String(hi) : "");
            }}
          />
        </FilterGroup>

        {/* Availability */}
        <FilterGroup title="Availability" defaultOpen={true}>
          <CheckItem label="In Stock"
            checked={filters.inStock === "true"}
            onChange={() => onChange("inStock", filters.inStock === "true" ? "" : "true")} />
          <CheckItem label="Out of Stock"
            checked={filters.inStock === "false"}
            onChange={() => onChange("inStock", filters.inStock === "false" ? "" : "false")} />
        </FilterGroup>

        {/* Condition */}
        <FilterGroup title="Condition" defaultOpen={true} count={conditionCount}>
          {["New", "Refurbished", "Used"].map(c => (
            <CheckItem key={c} label={c}
              checked={(filters.condition || []).includes(c)}
              onChange={() => toggle("condition", c)} />
          ))}
        </FilterGroup>

        {/* RAM */}
        <FilterGroup title="RAM" defaultOpen={false} count={ramCount}>
          {["4GB", "8GB", "16GB", "32GB"].map(r => (
            <CheckItem key={r} label={r}
              checked={(filters.ram || []).includes(r)}
              onChange={() => toggle("ram", r)} />
          ))}
        </FilterGroup>

        {/* Storage */}
        <FilterGroup title="Storage Type" defaultOpen={false} count={storageCount}>
          {["HDD", "SSD", "NVMe"].map(s => (
            <CheckItem key={s} label={s}
              checked={(filters.storageType || []).includes(s)}
              onChange={() => toggle("storageType", s)} />
          ))}
        </FilterGroup>

        {/* Processor */}
        <FilterGroup title="Processor" defaultOpen={false} count={processorCount}>
          {["i3", "i5", "i7", "Ryzen"].map(p => (
            <CheckItem key={p} label={p}
              checked={(filters.processor || []).includes(p)}
              onChange={() => toggle("processor", p)} />
          ))}
        </FilterGroup>

        {/* Brand */}
        <FilterGroup title="Brand" defaultOpen={false} count={brandCount}>
          {["HP", "Dell", "Lenovo", "Coldtech"].map(b => (
            <CheckItem key={b} label={b}
              checked={(filters.brand || []).includes(b)}
              onChange={() => toggle("brand", b)} />
          ))}
        </FilterGroup>

      </div>
    </div>
  );
}
