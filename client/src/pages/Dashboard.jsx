import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiPackage, FiTool, FiUser, FiLogOut, FiArrowRight, FiClock,
  FiCheckCircle, FiAlertCircle, FiShield, FiMonitor, FiPlus,
  FiPhone, FiMessageCircle, FiBell, FiX, FiChevronDown,
} from "react-icons/fi";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const fmt = n => new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 }).format(n);
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";
const daysLeft = d => d ? Math.max(0, Math.ceil((new Date(d) - Date.now()) / 86400000)) : null;

const STATUS_META = {
  received:   { label:"Received",    color:"text-yellow-600", bg:"bg-yellow-50",  icon:FiClock },
  diagnosing: { label:"Diagnosing",  color:"text-blue-600",   bg:"bg-blue-50",    icon:FiAlertCircle },
  repairing:  { label:"Repairing",   color:"text-sky-600",    bg:"bg-sky-50",     icon:FiTool },
  completed:  { label:"Completed",   color:"text-green-600",  bg:"bg-green-50",   icon:FiCheckCircle },
};

function FadeUp({ children, delay=0, className="" }) {
  return (
    <motion.div initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }} transition={{ duration:.45, delay }} className={className}>
      {children}
    </motion.div>
  );
}

function SectionCard({ title, icon:Icon, iconColor="#3AB6FF", children, action }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: iconColor+"18" }}>
            <Icon className="w-4 h-4" style={{ color: iconColor }} />
          </div>
          <h2 className="font-bold text-slate-800 text-sm">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── AMC Status Card ───────────────────────────────────────────────────────────
function AMCCard({ company }) {
  if (!company) return null;
  const amc     = company.amcPlan;
  const active  = amc?.active && amc?.endDate && new Date(amc.endDate) > new Date();
  const days    = daysLeft(amc?.endDate);
  const expiring = days !== null && days <= 30;

  return (
    <div className={`rounded-2xl p-5 border ${active ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FiShield className={`w-5 h-5 ${active ? "text-green-600" : "text-red-500"}`} />
            <span className={`text-xs font-black uppercase tracking-wider ${active ? "text-green-700" : "text-red-600"}`}>
              AMC {active ? "Active" : "Expired"}
            </span>
          </div>
          <p className="font-bold text-slate-800 text-lg">{amc?.name || "AMC Plan"}</p>
          <p className="text-xs text-slate-500 mt-1">
            {fmtDate(amc?.startDate)} → {fmtDate(amc?.endDate)}
          </p>
          {active && days !== null && (
            <p className={`text-xs font-semibold mt-1 ${expiring ? "text-orange-600" : "text-green-600"}`}>
              {expiring ? `⚠️ Expires in ${days} days` : `✅ ${days} days remaining`}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 mb-1">Company</p>
          <p className="font-semibold text-slate-800 text-sm">{company.name}</p>
        </div>
      </div>
      {amc?.services?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {amc.services.map(s => (
            <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-green-200 text-green-700">{s}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── No AMC upsell ─────────────────────────────────────────────────────────────
function AMCUpsell() {
  return (
    <div className="rounded-2xl p-5 border border-sky-200 bg-sky-50">
      <div className="flex items-center gap-2 mb-2">
        <FiShield className="w-5 h-5 text-sky-500" />
        <span className="text-xs font-black uppercase tracking-wider text-sky-600">No AMC Plan</span>
      </div>
      <p className="text-sm text-slate-600 mb-3">Get priority support, scheduled maintenance, and more with an AMC plan.</p>
      <Link to="/contact" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
        style={{ background:"linear-gradient(135deg,#3AB6FF,#2B0FA8)" }}>
        Get AMC Plan <FiArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

// ── Add Device Modal ──────────────────────────────────────────────────────────
function AddDeviceModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ name:"", model:"", type:"Laptop", serialNumber:"" });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(p => ({...p,[k]:v}));

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Device name is required"); return; }
    setSaving(true);
    try {
      const { data } = await api.post("/amc/my-devices", form);
      toast.success("Device added");
      onAdded(data.devices);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add device");
    } finally { setSaving(false); }
  }

  const inp = "w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition";

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.4)", backdropFilter:"blur(4px)" }}>
      <motion.div initial={{ scale:.95 }} animate={{ scale:1 }} exit={{ scale:.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800">Add Device</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition">
            <FiX className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Device Name *</label>
            <input value={form.name} onChange={e => set("name",e.target.value)} placeholder="e.g. Office Laptop" className={inp} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Model</label>
            <input value={form.model} onChange={e => set("model",e.target.value)} placeholder="e.g. Dell Inspiron 15" className={inp} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Type</label>
            <select value={form.type} onChange={e => set("type",e.target.value)} className={inp}>
              {["Laptop","Desktop","Smartphone","Tablet","Server","Other"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Serial Number</label>
            <input value={form.serialNumber} onChange={e => set("serialNumber",e.target.value)} placeholder="Optional" className={inp} />
          </div>
          <button type="submit" disabled={saving}
            className="w-full py-2.5 rounded-xl font-bold text-white text-sm disabled:opacity-60"
            style={{ background:"linear-gradient(135deg,#3AB6FF,#2B0FA8)" }}>
            {saving ? "Adding…" : "Add Device"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [orders,    setOrders]    = useState([]);
  const [services,  setServices]  = useState([]);
  const [company,   setCompany]   = useState(null);
  const [devices,   setDevices]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState("tickets");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [alerts,    setAlerts]    = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/orders/mine").catch(() => ({ data:{ orders:[] } })),
      api.get("/services/mine").catch(() => ({ data:{ requests:[] } })),
      api.get("/amc/my-company").catch(() => ({ data:{ company:null } })),
      api.get("/amc/my-devices").catch(() => ({ data:{ devices:[] } })),
    ]).then(([o, s, c, d]) => {
      setOrders(o.data.orders || []);
      setServices(s.data.requests || []);
      setCompany(c.data.company || null);
      setDevices(d.data.devices || []);

      // Build alerts
      const al = [];
      const amc = c.data.company?.amcPlan;
      if (amc?.endDate) {
        const days = daysLeft(amc.endDate);
        if (days !== null && days <= 30 && days > 0) al.push({ type:"warning", msg:`Your AMC plan expires in ${days} days.` });
        if (days === 0) al.push({ type:"error", msg:"Your AMC plan has expired. Contact us to renew." });
      }
      const pending = (s.data.requests || []).filter(r => r.status !== "completed");
      if (pending.length > 0) al.push({ type:"info", msg:`You have ${pending.length} active service ticket${pending.length>1?"s":""}.` });
      setAlerts(al);
    }).finally(() => setLoading(false));
  }, []);

  const filteredServices = statusFilter === "all"
    ? services
    : services.filter(s => s.status === statusFilter);

  const hasAMC = company?.amcPlan?.active && company?.amcPlan?.endDate && new Date(company.amcPlan.endDate) > new Date();

  return (
    <div className="w-full min-h-screen" style={{ background:"#F8FAFC" }}>

      {/* Header */}
      <div className="py-10 px-6 md:px-10 lg:px-16"
        style={{ background:"linear-gradient(135deg,#1E293B 0%,#0f2744 100%)" }}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase tracking-widest"
              style={{ background:"rgba(14,165,233,0.2)", color:"#38BDF8", border:"1px solid rgba(14,165,233,0.3)" }}>
              {hasAMC ? "🛡️ AMC Client" : "My Account"}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">
              Welcome, <span style={{ color:"#38BDF8" }}>{user?.name?.split(" ")[0] || "User"}</span>
            </h1>
            <p className="text-slate-400 mt-1 text-sm">{user?.email}</p>
          </div>
          <button onClick={() => { logout(); navigate("/"); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition"
            style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)" }}>
            <FiLogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16 py-8 space-y-6">

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((a, i) => (
              <FadeUp key={i} delay={i*0.05}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border ${
                  a.type==="error"   ? "bg-red-50 border-red-200 text-red-700" :
                  a.type==="warning" ? "bg-orange-50 border-orange-200 text-orange-700" :
                                       "bg-sky-50 border-sky-200 text-sky-700"}`}>
                  <FiBell className="w-4 h-4 flex-shrink-0" />
                  {a.msg}
                </div>
              </FadeUp>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon:FiPackage,  label:"Orders",          value:orders.length,                          color:"#0EA5E9" },
            { icon:FiTool,     label:"Service Tickets",  value:services.length,                        color:"#7C3AED" },
            { icon:FiMonitor,  label:"Devices",          value:devices.length,                         color:"#10B981" },
            { icon:FiShield,   label:"AMC Status",       value:hasAMC ? "Active" : "None",             color: hasAMC ? "#10B981" : "#94a3b8" },
          ].map((s,i) => (
            <FadeUp key={i} delay={i*0.07}>
              <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background:s.color+"18" }}>
                  <s.icon className="w-5 h-5" style={{ color:s.color }} />
                </div>
                <div>
                  <p className="text-lg font-black leading-none" style={{ color:s.color }}>{s.value}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* AMC + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            {company ? <AMCCard company={company} /> : <AMCUpsell />}
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/services/request"
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center">
                  <FiTool className="w-4 h-4 text-sky-500" />
                </div>
                <span className="font-semibold text-slate-800 text-sm">Raise Service Request</span>
              </div>
              <FiArrowRight className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="https://wa.me/919529882920" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-green-300 hover:shadow-md transition group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                  <FiMessageCircle className="w-4 h-4 text-green-500" />
                </div>
                <span className="font-semibold text-slate-800 text-sm">WhatsApp Support</span>
              </div>
              <FiArrowRight className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="tel:+919529882920"
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-md transition group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                  <FiPhone className="w-4 h-4 text-violet-500" />
                </div>
                <span className="font-semibold text-slate-800 text-sm">Call Support</span>
              </div>
              <FiArrowRight className="w-4 h-4 text-violet-400 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Tabs: Tickets / Orders / Devices */}
        <div>
          <div className="flex gap-1 mb-5 p-1 rounded-xl w-fit bg-slate-100 border border-slate-200">
            {[["tickets","Service Tickets"],["orders","Orders"],["devices","My Devices"]].map(([id,label]) => (
              <button key={id} onClick={() => setTab(id)}
                className={"px-4 py-2 rounded-lg text-xs font-bold transition " + (tab===id ? "bg-white text-sky-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">{Array(3).fill(0).map((_,i) => <div key={i} className="h-16 rounded-2xl animate-pulse bg-slate-200" />)}</div>
          ) : tab === "tickets" ? (
            <SectionCard title="Service Tickets" icon={FiTool} iconColor="#7C3AED"
              action={
                <div className="flex items-center gap-2">
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-600 focus:outline-none focus:border-sky-400">
                    <option value="all">All</option>
                    <option value="received">Received</option>
                    <option value="diagnosing">Diagnosing</option>
                    <option value="repairing">Repairing</option>
                    <option value="completed">Completed</option>
                  </select>
                  <Link to="/services/request" className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                    style={{ background:"linear-gradient(135deg,#3AB6FF,#2B0FA8)" }}>
                    <FiPlus className="w-3 h-3" /> New
                  </Link>
                </div>
              }>
              {filteredServices.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">🔧</div>
                  <p className="text-slate-500 text-sm mb-3">No tickets found</p>
                  <Link to="/services/request" className="btn-cyan text-xs px-4 py-2">Submit a Request</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredServices.map((s,i) => {
                    const meta = STATUS_META[s.status] || STATUS_META.received;
                    const Icon = meta.icon;
                    return (
                      <FadeUp key={s._id} delay={i*0.04}>
                        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/30 transition">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${meta.bg}`}>
                              <Icon className={`w-4 h-4 ${meta.color}`} />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm font-mono">{s.ticketId}</p>
                              <p className="text-xs text-slate-400 capitalize">{s.issueType} · {s.deviceType} · {fmtDate(s.createdAt)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {hasAMC && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">AMC Priority</span>}
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${meta.bg} ${meta.color}`}>{meta.label}</span>
                            <Link to="/services/track" className="text-xs text-sky-500 hover:underline font-medium">Track →</Link>
                          </div>
                        </div>
                      </FadeUp>
                    );
                  })}
                </div>
              )}
            </SectionCard>
          ) : tab === "orders" ? (
            <SectionCard title="My Orders" icon={FiPackage} iconColor="#0EA5E9"
              action={<Link to="/shop" className="text-xs text-sky-500 hover:underline font-semibold">Shop →</Link>}>
              {orders.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">📦</div>
                  <p className="text-slate-500 text-sm mb-3">No orders yet</p>
                  <Link to="/shop" className="btn-cyan text-xs px-4 py-2">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {orders.map((o,i) => (
                    <FadeUp key={o._id} delay={i*0.04}>
                      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 hover:border-sky-200 transition">
                        <div>
                          <p className="font-bold text-slate-800 text-sm">Order #{o._id?.slice(-6).toUpperCase()}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{fmtDate(o.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-sky-600">{fmt(o.totalAmount || 0)}</span>
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold capitalize bg-green-100 text-green-700">{o.status || "processing"}</span>
                        </div>
                      </div>
                    </FadeUp>
                  ))}
                </div>
              )}
            </SectionCard>
          ) : (
            <SectionCard title="My Devices" icon={FiMonitor} iconColor="#10B981"
              action={
                <button onClick={() => setShowAddDevice(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                  style={{ background:"linear-gradient(135deg,#10B981,#059669)" }}>
                  <FiPlus className="w-3 h-3" /> Add Device
                </button>
              }>
              {devices.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">💻</div>
                  <p className="text-slate-500 text-sm mb-3">No devices registered yet</p>
                  <button onClick={() => setShowAddDevice(true)} className="btn-cyan text-xs px-4 py-2">Add Your First Device</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {devices.map((d,i) => (
                    <FadeUp key={d._id || i} delay={i*0.05}>
                      <div className="p-4 rounded-xl border border-slate-100 hover:border-green-200 hover:bg-green-50/30 transition">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                            <FiMonitor className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{d.name}</p>
                            <p className="text-xs text-slate-400">{d.type}</p>
                          </div>
                        </div>
                        {d.model && <p className="text-xs text-slate-500">Model: {d.model}</p>}
                        {d.serialNumber && <p className="text-xs text-slate-400 font-mono">S/N: {d.serialNumber}</p>}
                        <p className="text-[10px] text-slate-400 mt-1">Added {fmtDate(d.addedAt)}</p>
                      </div>
                    </FadeUp>
                  ))}
                </div>
              )}
            </SectionCard>
          )}
        </div>
      </div>

      {/* Add Device Modal */}
      <AnimatePresence>
        {showAddDevice && (
          <AddDeviceModal onClose={() => setShowAddDevice(false)} onAdded={setDevices} />
        )}
      </AnimatePresence>
    </div>
  );
}
