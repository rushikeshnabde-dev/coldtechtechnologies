import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "../services/api";
import { SEO } from "../components/SEO";
import { FiSearch, FiClock, FiShield, FiHeadphones, FiAward, FiHelpCircle, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { BsTicketPerforated } from "react-icons/bs";

const STORAGE_KEY = "ct_recent_tickets";
const TICKET_RE = /^(CT|SR|COLD)-[\w-]+/i;
function getRecent() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]"); } catch { return []; } }
function saveRecent(id) { const p=getRecent().filter(t=>t!==id); localStorage.setItem(STORAGE_KEY,JSON.stringify([id,...p].slice(0,3))); }

const STATUS_CLS = {
  pending:"bg-yellow-100 text-yellow-700 border-yellow-300",
  open:"bg-sky-100 text-sky-700 border-sky-300",
  inprogress:"bg-blue-100 text-blue-700 border-blue-300",
  resolved:"bg-green-100 text-green-700 border-green-300",
  closed:"bg-gray-100 text-gray-600 border-gray-300",
};
function statusCls(s="") { return STATUS_CLS[s.toLowerCase().replace(/\s/g,"")]||STATUS_CLS.open; }

export function TrackService() {
  const [ticketId, setTicketId] = useState("");
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(false);
  const [recent, setRecent]     = useState([]);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => { setRecent(getRecent()); }, []);

  async function handleSearch(id) {
    const val = (id||ticketId).trim().toUpperCase();
    if (!val) { toast.error("Please enter a ticket ID"); return; }
    if (!TICKET_RE.test(val)) { toast.error("Invalid format — use CT-YYYY-NNN or SR-XXXXXX"); return; }
    setLoading(true); setData(null);
    try {
      const { data:res } = await api.get("/services/track/"+encodeURIComponent(val));
      setData(res); saveRecent(val); setRecent(getRecent());
    } catch { toast.error("Ticket not found. Please check the ID."); }
    finally { setLoading(false); }
  }

  return (
    <div className="w-full min-h-screen" style={{ background:"#F8FAFC" }}>
      <SEO
        title="Track IT Service Request — Real-Time Repair Status"
        description="Track your Coldtech Technologies IT service request in real time. Enter your ticket ID to see live repair status, technician updates, and estimated completion."
        keywords="track IT service request, repair ticket tracking Pune, service status Coldtech, IT support tracking Pune"
        canonical="/services/track"
      />

      {/* Hero */}
      <div className="relative overflow-hidden py-20 px-6 text-center"
        style={{ background:"linear-gradient(135deg,#1E293B 0%,#0f2744 60%,#1E293B 100%)" }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize:"32px 32px" }} />
        <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6 }}
          className="relative z-10 max-w-2xl mx-auto">
          <div className="ct-label mx-auto w-fit mb-5" style={{ background:"rgba(14,165,233,0.2)", color:"#38BDF8", borderColor:"rgba(14,165,233,0.3)" }}>
            Real-time Tracking
          </div>
          <h1 className="ct-h1 text-white font-black mb-3">Track Your Service Request</h1>
          <p className="text-slate-400 text-base max-w-md mx-auto">Enter your ticket ID to get live updates on your repair status.</p>
        </motion.div>
      </div>

      {/* Search card */}
      <div className="px-6 md:px-10 lg:px-16 py-12">
        <motion.div initial={{ y:30, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:.15 }}
          className="max-w-2xl mx-auto">
          <div className="p-px rounded-3xl shadow-xl" style={{ background:"linear-gradient(135deg,#0EA5E9,#1E293B)" }}>
            <div className="bg-white rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ background:"linear-gradient(135deg,#0EA5E9,#0284C7)", boxShadow:"0 4px 12px rgba(14,165,233,0.35)" }}>
                  <BsTicketPerforated className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">Enter Ticket ID</h2>
                  <p className="text-xs text-slate-500">Format: CT-YYYY-NNN (e.g. CT-2026-001)</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={ticketId} onChange={e => setTicketId(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key==="Enter" && handleSearch()} placeholder="CT-2026-001"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-slate-900 placeholder-slate-400 font-mono focus:outline-none transition border border-slate-200 bg-slate-50 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100" />
                </div>
                <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:.97 }} onClick={() => handleSearch()} disabled={loading}
                  className="btn-cyan flex items-center gap-2 px-5 disabled:opacity-60">
                  {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    : <><FiSearch className="w-4 h-4" /> Track</>}
                </motion.button>
              </div>
              {recent.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-slate-500 mb-2">Recently tracked:</p>
                  <div className="flex flex-wrap gap-2">
                    {recent.map(t => (
                      <button key={t} onClick={() => { setTicketId(t); handleSearch(t); }}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border border-sky-200 bg-sky-50 text-sky-600 hover:bg-sky-100 transition">
                        <FiClock className="w-3 h-3" /> {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-5">
            {[
              { icon:FiShield,     label:"100% Secure",       cls:"text-green-600 bg-green-50 border-green-200" },
              { icon:FiHeadphones, label:"24/7 Support",      cls:"text-sky-600   bg-sky-50   border-sky-200"   },
              { icon:FiAward,      label:"Real-time Updates", cls:"text-blue-600  bg-blue-50  border-blue-200"  },
            ].map(({ icon:Icon, label, cls }) => (
              <span key={label} className={"flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border " + cls}>
                <Icon className="w-3.5 h-3.5" /> {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {data && (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              className="max-w-2xl mx-auto mt-8 bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Ticket ID</p>
                  <p className="font-mono text-xl font-bold text-sky-600">{data.ticket.ticketId}</p>
                </div>
                <span className={"px-3 py-1 rounded-full text-xs font-semibold border capitalize " + statusCls(data.ticket.status)}>
                  {data.ticket.status}
                </span>
              </div>
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">Timeline</p>
                <div className="flex flex-wrap gap-2">
                  {data.timeline.map(step => (
                    <div key={step.key} className={"flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border " + (
                      step.current ? "border-sky-400 text-sky-600 bg-sky-50"
                      : step.done  ? "border-green-300 text-green-700 bg-green-50"
                      :              "border-slate-200 text-slate-500 bg-slate-50")}>
                      {step.done && <FiCheckCircle className="w-3 h-3" />}
                      {step.label}
                    </div>
                  ))}
                </div>
              </div>
              {data.ticket.notes && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">Technician Notes</p>
                  <p className="text-sm text-slate-700">{data.ticket.notes}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help */}
        <div className="max-w-2xl mx-auto mt-8">
          <button onClick={() => setShowHelp(h => !h)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-sky-600 transition w-full justify-center">
            <FiHelpCircle className="w-4 h-4" />
            {showHelp ? "Hide help" : "Where do I find my ticket ID?"}
            <FiArrowRight className={"w-3.5 h-3.5 transition-transform " + (showHelp ? "rotate-90" : "")} />
          </button>
          <AnimatePresence>
            {showHelp && (
              <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }}
                exit={{ height:0, opacity:0 }} transition={{ duration:.25 }} className="overflow-hidden">
                <div className="mt-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-sky-50">
                      <BsTicketPerforated className="w-4 h-4 text-sky-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Where to find it</p>
                      <p className="text-xs text-slate-500 mt-0.5">Your ticket ID was shown after submitting your request and sent to your email.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-sky-50">
                      <FiSearch className="w-4 h-4 text-sky-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Sample formats</p>
                      <div className="flex gap-2 mt-1.5 flex-wrap">
                        {["CT-2026-001","SR-ABC123"].map(s => (
                          <span key={s} className="font-mono text-xs px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-50">
                      <FiHeadphones className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Need help?</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Contact us at <a href="mailto:support@coldtech.com" className="text-sky-500 underline">support@coldtech.com</a>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}