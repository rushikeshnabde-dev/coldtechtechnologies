import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiFileText, FiPrinter,
  FiEye, FiCode, FiSave, FiRefreshCw, FiChevronDown,
  FiSettings, FiDollarSign,
} from "react-icons/fi";
import { api } from "../../services/api";

/* ── helpers ── */
const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED"];
const GST_RATES  = [0, 5, 12, 18, 28];

const fmtCurrency = (n, cur = "INR") =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: cur, maximumFractionDigits: 2 }).format(n || 0);

const STATUS_COLORS = {
  draft:     "bg-slate-500/15 text-slate-400 border-slate-500/30",
  sent:      "bg-blue-500/15 text-blue-400 border-blue-500/30",
  paid:      "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
};

const inp = "w-full rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] focus:ring-1 focus:ring-[#3AB6FF]/30 transition";
const sel = inp + " appearance-none";

const EMPTY_ITEM = { name: "", description: "", quantity: 1, rate: 0, taxPercent: 18 };
const DEFAULT_COMPANY = {
  name: "Coldtech Technologies",
  address: "PCMC, Pune, Maharashtra 410507",
  phone: "+91 9529882920",
  email: "support@coldtechtechnologies.in",
  gstin: "",
  logo: "",
};

/* ── Confirm delete ── */
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="bg-[#0D1220] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <p className="font-bold text-white mb-2">Confirm Delete</p>
        <p className="text-sm text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition">Delete</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Invoice Form ── */
function InvoiceForm({ initial, templates, onClose, onSaved }) {
  const isEdit = !!initial?._id;
  const today  = new Date().toISOString().slice(0, 10);

  const [company, setCompany]   = useState(initial?.company || { ...DEFAULT_COMPANY });
  const [client,  setClient]    = useState(initial?.client  || { name:"", email:"", phone:"", address:"", gstin:"" });
  const [items,   setItems]     = useState(initial?.items?.length ? initial.items.map(i => ({ ...i })) : [{ ...EMPTY_ITEM }]);
  const [discount,    setDiscount]    = useState(initial?.discount    ?? 0);
  const [currency,    setCurrency]    = useState(initial?.currency    || "INR");
  const [status,      setStatus]      = useState(initial?.status      || "draft");
  const [invoiceDate, setInvoiceDate] = useState(initial?.invoiceDate ? new Date(initial.invoiceDate).toISOString().slice(0,10) : today);
  const [dueDate,     setDueDate]     = useState(initial?.dueDate     ? new Date(initial.dueDate).toISOString().slice(0,10) : "");
  const [notes,       setNotes]       = useState(initial?.notes       || "");
  const [paymentTerms,setPaymentTerms]= useState(initial?.paymentTerms|| "Payment due within 15 days");
  const [templateId,  setTemplateId]  = useState(initial?.templateId  || "");
  const [saving,      setSaving]      = useState(false);
  const [tab,         setTab]         = useState("details"); // details | items | settings

  const setC = (k, v) => setCompany(p => ({ ...p, [k]: v }));
  const setCl = (k, v) => setClient(p => ({ ...p, [k]: v }));

  const setItem = (idx, k, v) => setItems(prev =>
    prev.map((it, i) => i !== idx ? it : { ...it, [k]: v })
  );

  const calcTotals = () => {
    const processed = items.map(it => {
      const amt = Number(it.quantity || 0) * Number(it.rate || 0);
      const tax = amt * (Number(it.taxPercent || 0) / 100);
      return { ...it, amount: amt, taxAmount: tax, total: amt + tax };
    });
    const subtotal  = processed.reduce((s, i) => s + i.amount, 0);
    const taxTotal  = processed.reduce((s, i) => s + i.taxAmount, 0);
    const grandTotal = subtotal + taxTotal - Number(discount);
    return { processed, subtotal, taxTotal, grandTotal };
  };

  const { subtotal, taxTotal, grandTotal } = calcTotals();
  const fmt = n => fmtCurrency(n, currency);

  const submit = async e => {
    e.preventDefault();
    // Read directly from state — no stale closure issue
    const clientName = client?.name?.trim() || "";
    if (!clientName) {
      setTab("details"); // switch to details tab so user can see the error
      toast.error("Client name is required — check the Details tab");
      return;
    }
    if (!items.length) { toast.error("Add at least one item"); return; }
    setSaving(true);
    try {
      const payload = {
        company, client, items, discount, currency, status,
        invoiceDate, dueDate: dueDate || undefined,
        notes, paymentTerms, templateId: templateId || null,
      };
      if (isEdit) {
        await api.put(`/invoices/${initial._id}`, payload);
        toast.success("Invoice updated");
      } else {
        await api.post("/invoices", payload);
        toast.success("Invoice created");
      }
      onSaved(); onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally { setSaving(false); }
  };

  const TABS = [
    { id: "details",  label: "Details" },
    { id: "items",    label: "Items & GST" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        className="bg-[#0D1220] border border-white/10 rounded-2xl w-full max-w-3xl shadow-2xl mb-10">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <p className="font-bold text-white">{isEdit ? "Edit Invoice" : "Create Invoice"}</p>
            <p className="text-xs text-slate-500 mt-0.5">Fill in the details to generate a professional invoice</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 border-b border-white/5 pb-0">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition border-b-2 ${
                tab === t.id
                  ? "text-[#3AB6FF] border-[#3AB6FF] bg-[#3AB6FF]/5"
                  : "text-slate-500 border-transparent hover:text-white"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="p-6 space-y-5">

          {/* ── TAB: DETAILS ── */}
          {tab === "details" && (
            <div className="space-y-5">
              {/* Company */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Your Company</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-500 mb-1">Company Name</label>
                    <input className={inp} value={company.name} onChange={e => setC("name", e.target.value)} placeholder="Coldtech Technologies" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Phone</label>
                    <input className={inp} value={company.phone} onChange={e => setC("phone", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Email</label>
                    <input className={inp} value={company.email} onChange={e => setC("email", e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-500 mb-1">Address</label>
                    <input className={inp} value={company.address} onChange={e => setC("address", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">GSTIN</label>
                    <input className={inp} value={company.gstin} onChange={e => setC("gstin", e.target.value)} placeholder="22AAAAA0000A1Z5" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Logo URL (optional)</label>
                    <input className={inp} value={company.logo} onChange={e => setC("logo", e.target.value)} placeholder="https://..." />
                  </div>
                </div>
              </div>

              {/* Client */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Client Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-500 mb-1">Client Name <span className="text-red-400">*</span></label>
                    <input className={inp} value={client.name} onChange={e => setCl("name", e.target.value)} placeholder="Client / Company name" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Phone</label>
                    <input className={inp} value={client.phone} onChange={e => setCl("phone", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Email</label>
                    <input type="email" className={inp} value={client.email} onChange={e => setCl("email", e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-500 mb-1">Address</label>
                    <textarea className={`${inp} resize-none`} rows={2} value={client.address} onChange={e => setCl("address", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Client GSTIN</label>
                    <input className={inp} value={client.gstin} onChange={e => setCl("gstin", e.target.value)} placeholder="Optional" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: ITEMS ── */}
          {tab === "items" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Line Items with GST</p>
                <button type="button" onClick={() => setItems(p => [...p, { ...EMPTY_ITEM }])}
                  className="flex items-center gap-1.5 text-xs text-[#3AB6FF] hover:text-white transition">
                  <FiPlus className="w-3.5 h-3.5" /> Add Item
                </button>
              </div>

              {/* Header */}
              <div className="grid grid-cols-12 gap-2 text-[10px] text-slate-500 uppercase tracking-wider px-1">
                <span className="col-span-3">Item Name</span>
                <span className="col-span-2">Description</span>
                <span className="col-span-1 text-center">Qty</span>
                <span className="col-span-2 text-right">Rate (₹)</span>
                <span className="col-span-1 text-center">GST%</span>
                <span className="col-span-2 text-right">Total</span>
                <span className="col-span-1" />
              </div>

              {items.map((item, idx) => {
                const amt = Number(item.quantity || 0) * Number(item.rate || 0);
                const tax = amt * (Number(item.taxPercent || 0) / 100);
                return (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl bg-white/3 border border-white/5">
                    <input className={`${inp} col-span-3 text-xs`} placeholder="Item name" value={item.name}
                      onChange={e => setItem(idx, "name", e.target.value)} />
                    <input className={`${inp} col-span-2 text-xs`} placeholder="Details" value={item.description}
                      onChange={e => setItem(idx, "description", e.target.value)} />
                    <input type="number" min="0" className={`${inp} col-span-1 text-center text-xs`}
                      value={item.quantity} onChange={e => setItem(idx, "quantity", e.target.value)} />
                    <input type="number" min="0" className={`${inp} col-span-2 text-right text-xs`}
                      value={item.rate} onChange={e => setItem(idx, "rate", e.target.value)} />
                    <select className={`${sel} col-span-1 text-xs text-center`}
                      value={item.taxPercent} onChange={e => setItem(idx, "taxPercent", e.target.value)}>
                      {GST_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                    </select>
                    <div className="col-span-2 text-right">
                      <p className="text-xs font-bold text-white">{fmt(amt + tax)}</p>
                      {tax > 0 && <p className="text-[9px] text-slate-500">+{fmt(tax)} GST</p>}
                    </div>
                    <button type="button" onClick={() => setItems(p => p.filter((_, i) => i !== idx))}
                      className="col-span-1 flex justify-center text-slate-500 hover:text-red-400 transition">
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

              {/* Totals */}
              <div className="flex justify-end mt-4">
                <div className="w-64 space-y-2 bg-white/3 rounded-xl p-4">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Subtotal</span><span className="text-white">{fmt(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>GST / Tax</span><span className="text-yellow-400">{fmt(taxTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Discount (₹)</span>
                    <input type="number" min="0" className="w-24 rounded-lg border border-white/8 bg-[#0B0F1A] px-2 py-1 text-xs text-white text-right focus:outline-none focus:border-[#3AB6FF] transition"
                      value={discount} onChange={e => setDiscount(e.target.value)} />
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white border-t border-white/10 pt-2">
                    <span>Grand Total</span>
                    <span style={{ color: "#3AB6FF" }}>{fmt(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: SETTINGS ── */}
          {tab === "settings" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">Invoice Date</label>
                  <input type="date" className={inp} value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">Due Date</label>
                  <input type="date" className={inp} value={dueDate} onChange={e => setDueDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">Currency</label>
                  <select className={sel} value={currency} onChange={e => setCurrency(e.target.value)}>
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">Status</label>
                  <select className={sel} value={status} onChange={e => setStatus(e.target.value)}>
                    {["draft","sent","paid","cancelled"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">Template</label>
                  <select className={sel} value={templateId} onChange={e => setTemplateId(e.target.value)}>
                    <option value="">Default Template</option>
                    {templates.map(t => <option key={t._id} value={t._id}>{t.name}{t.isDefault ? " (Default)" : ""}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">Payment Terms</label>
                  <input className={inp} value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-slate-500 mb-1.5">Notes</label>
                  <textarea className={`${inp} resize-none`} rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Thank you for your business..." />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-3 border-t border-white/5">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition"
              style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
              {saving ? "Saving…" : isEdit ? "Update Invoice" : "Create Invoice"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ── Preview Modal ── */
function PreviewModal({ invoice, onClose }) {
  const iframeRef = useRef(null);
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = (() => {
      try { return JSON.parse(localStorage.getItem("coldtech_auth") || "{}").token || ""; }
      catch { return ""; }
    })();

    fetch(`${import.meta.env.VITE_API_URL || "https://coldtechtechnologies.onrender.com/api"}/invoices/${invoice._id}/render`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.text())
      .then(text => { setHtml(text); setLoading(false); })
      .catch(() => { toast.error("Failed to load preview"); setLoading(false); });
  }, [invoice._id]);

  const handlePrint = () => {
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        className="bg-[#0D1220] border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl mb-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <FiEye className="w-4 h-4 text-[#3AB6FF]" />
            <p className="font-bold text-white">Invoice Preview — {invoice.invoiceNumber}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
              <FiPrinter className="w-3.5 h-3.5" /> Print / PDF
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#3AB6FF]/30 border-t-[#3AB6FF] rounded-full animate-spin" />
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              srcDoc={html}
              className="w-full rounded-xl border border-white/10"
              style={{ height: "70vh", background: "#fff" }}
              title="Invoice Preview"
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Template Editor ── */
function TemplateEditor({ onClose }) {
  const [templates, setTemplates] = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [name,      setName]      = useState("");
  const [html,      setHtml]      = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [preview,   setPreview]   = useState(false);

  useEffect(() => {
    api.get("/invoices/templates").then(r => {
      setTemplates(r.data.templates || []);
    });
    api.get("/invoices/templates/default").then(r => {
      if (!selected) setHtml(r.data.html || "");
    });
  }, []);

  const loadTemplate = t => {
    setSelected(t);
    setName(t.name);
    setHtml(t.html);
    setIsDefault(t.isDefault);
  };

  const newTemplate = () => {
    setSelected(null);
    setName("New Template " + (templates.length + 1));
    // keep current html as starting point for the new template
    setIsDefault(false);
  };

  const save = async () => {
    if (!name.trim()) { toast.error("Template name is required"); return; }
    if (!html.trim()) { toast.error("Template HTML is required"); return; }
    setSaving(true);
    try {
      let saved;
      if (selected?._id) {
        const r = await api.put(`/invoices/templates/${selected._id}`, { name, html, isDefault });
        saved = r.data.template;
        toast.success("Template updated");
      } else {
        const r = await api.post("/invoices/templates", { name, html, isDefault });
        saved = r.data.template;
        setSelected(saved); // prevent duplicate on next save
        toast.success("Template saved");
      }
      const r = await api.get("/invoices/templates");
      setTemplates(r.data.templates || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save template");
    } finally { setSaving(false); }
  };

  const deleteTemplate = async t => {
    if (!window.confirm(`Delete "${t.name}"?`)) return;
    try {
      await api.delete(`/invoices/templates/${t._id}`);
      toast.success("Template deleted");
      const r = await api.get("/invoices/templates");
      setTemplates(r.data.templates || []);
      if (selected?._id === t._id) {
        setSelected(null);
        setName("");
        setHtml("");
        setIsDefault(false);
      }
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        className="bg-[#0D1220] border border-white/10 rounded-2xl w-full max-w-6xl shadow-2xl mb-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <FiCode className="w-4 h-4 text-[#3AB6FF]" />
            <p className="font-bold text-white">Invoice Template Editor</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-4 h-[75vh]">
          {/* Sidebar */}
          <div className="col-span-1 border-r border-white/5 p-4 flex flex-col gap-3 overflow-y-auto">
            <button onClick={newTemplate}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white border border-white/10 hover:border-[#3AB6FF]/40 transition">
              <FiPlus className="w-3.5 h-3.5" /> New Template
            </button>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-2">Saved Templates</p>
            {templates.length === 0 && <p className="text-xs text-slate-600">No saved templates</p>}
            {templates.map(t => (
              <div key={t._id}
                className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition text-xs ${
                  selected?._id === t._id ? "bg-[#3AB6FF]/15 text-[#3AB6FF] border border-[#3AB6FF]/30" : "text-slate-400 hover:bg-white/5 border border-transparent"
                }`}
                onClick={() => loadTemplate(t)}>
                <span className="truncate">{t.name}{t.isDefault ? " ⭐" : ""}</span>
                <button onClick={e => { e.stopPropagation(); deleteTemplate(t); }}
                  className="text-slate-600 hover:text-red-400 transition ml-1 flex-shrink-0">
                  <FiTrash2 className="w-3 h-3" />
                </button>
              </div>
            ))}

            <div className="mt-auto pt-4 border-t border-white/5 space-y-2 text-[10px] text-slate-500">
              <p className="font-bold text-slate-400 uppercase tracking-wider">Placeholders</p>
              {["{{company_name}}","{{company_logo}}","{{client_name}}","{{invoice_number}}","{{invoice_date}}","{{due_date}}","{{items}}","{{subtotal}}","{{tax_total}}","{{grand_total}}","{{notes}}","{{payment_terms}}"].map(p => (
                <p key={p} className="font-mono text-[9px] text-slate-500 cursor-pointer hover:text-[#3AB6FF] transition"
                  onClick={() => navigator.clipboard.writeText(p).then(() => toast.success("Copied!"))}>
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div className="col-span-3 flex flex-col">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
              <input className="flex-1 rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] transition"
                placeholder="Template name" value={name} onChange={e => setName(e.target.value)} />
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input type="checkbox" checked={isDefault} onChange={e => setIsDefault(e.target.checked)} className="accent-[#3AB6FF]" />
                Default
              </label>
              <button onClick={() => setPreview(p => !p)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${preview ? "bg-[#3AB6FF]/15 text-[#3AB6FF] border-[#3AB6FF]/30" : "border-white/10 text-slate-400 hover:text-white"}`}>
                <FiEye className="w-3.5 h-3.5" /> {preview ? "Code" : "Preview"}
              </button>
              <button onClick={save} disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white disabled:opacity-50 transition"
                style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
                <FiSave className="w-3.5 h-3.5" /> {saving ? "Saving…" : "Save"}
              </button>
            </div>

            {preview ? (
              <iframe srcDoc={html} className="flex-1 w-full" style={{ background: "#fff" }} title="Template Preview" />
            ) : (
              <textarea
                className="flex-1 w-full bg-[#080C14] text-green-400 font-mono text-xs p-4 focus:outline-none resize-none"
                value={html}
                onChange={e => setHtml(e.target.value)}
                spellCheck={false}
                placeholder="Paste your HTML template here. Use {{placeholders}} for dynamic data."
              />
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main AdminInvoices ── */
export function AdminInvoices() {
  const [invoices,     setInvoices]     = useState([]);
  const [templates,    setTemplates]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [modal,        setModal]        = useState(null);
  const [previewInv,   setPreviewInv]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showTemplates,setShowTemplates]= useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const [invRes, tmplRes] = await Promise.all([
        api.get("/invoices", { params }),
        api.get("/invoices/templates"),
      ]);
      setInvoices(invRes.data.invoices || []);
      setTemplates(tmplRes.data.templates || []);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  }, [filterStatus]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    try {
      await api.delete(`/invoices/${deleteTarget._id}`);
      toast.success("Deleted");
      setDeleteTarget(null);
      load();
    } catch { toast.error("Failed to delete"); }
  };

  const updateStatus = async (inv, newStatus) => {
    try {
      await api.put(`/invoices/${inv._id}`, { status: newStatus });
      load();
    } catch { toast.error("Failed"); }
  };

  const pendingCount = invoices.filter(i => i.status === "draft" || i.status === "sent").length;
  const paidTotal    = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.grandTotal, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-white">Invoices</h1>
          <p className="text-xs text-slate-500 mt-0.5">Create, manage and print professional invoices with GST</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowTemplates(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 border border-white/10 hover:border-white/20 transition">
            <FiCode className="w-3.5 h-3.5" /> Templates
          </button>
          <button onClick={() => setModal("create")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition"
            style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
            <FiPlus className="w-4 h-4" /> Create Invoice
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Invoices", value: invoices.length, color: "#3AB6FF", icon: FiFileText },
          { label: "Pending / Draft", value: pendingCount, color: "#FBBF24", icon: FiFileText },
          { label: "Total Paid", value: new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 }).format(paidTotal), color: "#4ade80", icon: FiDollarSign },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-[#0D1220] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.color + "20" }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-2xl font-black mt-0.5" style={{ color: s.color }}>{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-slate-500">Filter:</span>
        {["", "draft", "sent", "paid", "cancelled"].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              filterStatus === s ? "bg-[#3AB6FF]/20 text-[#3AB6FF] border-[#3AB6FF]/40" : "border-white/10 text-slate-400 hover:text-white"
            }`}>
            {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#0D1220] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#3AB6FF]/30 border-t-[#3AB6FF] rounded-full animate-spin" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <FiFileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No invoices yet. Create your first one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-white/5">
                  {["Invoice #","Client","Amount","GST","Status","Due Date","Date","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <motion.tr key={inv._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className="border-b border-white/5 hover:bg-white/2 transition">
                    <td className="px-4 py-3 font-mono text-xs text-[#3AB6FF] font-bold">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3">
                      <p className="text-white font-medium text-xs">{inv.client?.name}</p>
                      {inv.client?.phone && <p className="text-[10px] text-slate-500">{inv.client.phone}</p>}
                    </td>
                    <td className="px-4 py-3 font-bold text-white text-xs">
                      {new Intl.NumberFormat("en-IN", { style:"currency", currency: inv.currency || "INR", maximumFractionDigits:0 }).format(inv.grandTotal || 0)}
                    </td>
                    <td className="px-4 py-3 text-yellow-400 text-xs font-semibold">
                      {new Intl.NumberFormat("en-IN", { style:"currency", currency: inv.currency || "INR", maximumFractionDigits:0 }).format(inv.taxTotal || 0)}
                    </td>
                    <td className="px-4 py-3">
                      <select value={inv.status} onChange={e => updateStatus(inv, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border appearance-none cursor-pointer bg-transparent ${STATUS_COLORS[inv.status] || STATUS_COLORS.draft}`}>
                        {["draft","sent","paid","cancelled"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {new Date(inv.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => setPreviewInv(inv)} title="Preview & Print"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-green-400 transition">
                          <FiPrinter className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setModal(inv)} title="Edit"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#3AB6FF] transition">
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteTarget(inv)} title="Delete"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition">
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {modal && (
          <InvoiceForm
            initial={modal === "create" ? null : modal}
            templates={templates}
            onClose={() => setModal(null)}
            onSaved={load}
          />
        )}
        {previewInv && <PreviewModal invoice={previewInv} onClose={() => setPreviewInv(null)} />}
        {showTemplates && <TemplateEditor onClose={() => { setShowTemplates(false); load(); }} />}
        {deleteTarget && (
          <ConfirmModal
            message={`Delete invoice ${deleteTarget.invoiceNumber}?`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
