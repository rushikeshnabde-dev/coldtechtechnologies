import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "../../services/api";
import { FiSearch, FiTool, FiChevronLeft, FiChevronRight, FiChevronDown, FiUser } from "react-icons/fi";

const STATUSES = ["received","diagnosing","repairing","completed"];
const STATUS_STYLE = {
  received:   "bg-slate-500/15 text-slate-400 border-slate-500/30",
  diagnosing: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  repairing:  "bg-blue-500/15 text-blue-400 border-blue-500/30",
  completed:  "bg-green-500/15 text-green-400 border-green-500/30",
};

function TicketRow({ ticket, staff, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(ticket.notes || "");
  const [eta, setEta] = useState(ticket.estimatedCompletion ? new Date(ticket.estimatedCompletion).toISOString().slice(0,16) : "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await api.patch(`/admin/services/${ticket._id}`, { notes, estimatedCompletion: eta || undefined });
      toast.success("Ticket updated");
      onUpdate();
    } catch { toast.error("Update failed"); }
    finally { setSaving(false); }
  };

  const assignStaff = async (staffId) => {
    try {
      await api.patch(`/admin/services/${ticket._id}/assign`, { staffId: staffId || null });
      toast.success(staffId ? "Ticket assigned" : "Assignment removed");
      onUpdate();
    } catch { toast.error("Assign failed"); }
  };

  const assignedId = ticket.assignedTo?._id || ticket.assignedTo || "";

  return (
    <div className="border-b border-white/5 last:border-0">
      <div className="flex flex-wrap items-center gap-4 px-5 py-4 hover:bg-white/2 transition cursor-pointer" onClick={() => setOpen(o => !o)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-bold text-[#3AB6FF]">{ticket.ticketId}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLE[ticket.status] || STATUS_STYLE.received}`}>
              {ticket.status}
            </span>
            {ticket.assignedTo && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-[#4FD1C5] bg-[#4FD1C5]/10 px-2 py-0.5 rounded-full border border-[#4FD1C5]/20">
                <FiUser className="w-2.5 h-2.5" />
                {ticket.assignedTo.name || "Assigned"}
              </span>
            )}
          </div>
          <p className="text-sm text-white mt-0.5">{ticket.fullName} · <span className="text-slate-400">{ticket.email}</span></p>
          <p className="text-xs text-slate-500 mt-0.5">{ticket.deviceType} · {ticket.issueType}</p>
        </div>
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          {/* Status dropdown */}
          <select value={ticket.status}
            onChange={async e => {
              try { await api.patch(`/admin/services/${ticket._id}`, { status: e.target.value }); toast.success("Status updated"); onUpdate(); }
              catch { toast.error("Failed"); }
            }}
            className={`text-xs font-semibold px-2 py-1 rounded-full border cursor-pointer bg-transparent capitalize focus:outline-none ${STATUS_STYLE[ticket.status] || STATUS_STYLE.received}`}>
            {STATUSES.map(s => <option key={s} value={s} className="bg-[#0D1220] text-white capitalize">{s}</option>)}
          </select>

          {/* Assign dropdown */}
          <select
            value={assignedId}
            onChange={e => assignStaff(e.target.value)}
            className="text-xs rounded-lg border border-white/10 bg-[#0B0F1A] text-slate-300 px-2 py-1 focus:outline-none focus:border-[#3AB6FF] transition max-w-[130px]">
            <option value="">Unassigned</option>
            {staff.map(s => (
              <option key={s._id} value={s._id} className="bg-[#0D1220]">{s.name}</option>
            ))}
          </select>

          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <FiChevronDown className="w-4 h-4 text-slate-500" />
          </motion.span>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.2 }}
            className="overflow-hidden">
            <div className="px-5 pb-5 space-y-4 bg-white/2">
              <div>
                <p className="text-xs text-slate-500 mb-1">Description</p>
                <p className="text-sm text-slate-300">{ticket.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Technician Notes</label>
                  <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                    className="w-full rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] resize-none transition"
                    placeholder="Add internal notes..." />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Estimated Completion</label>
                  <input type="datetime-local" value={eta} onChange={e => setEta(e.target.value)}
                    className="w-full rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3AB6FF] transition" />
                </div>
              </div>
              <button onClick={save} disabled={saving}
                className="px-5 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-60 transition"
                style={{ background:"linear-gradient(135deg,#3AB6FF,#1E90FF)" }}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AdminServices() {
  const [tickets, setTickets] = useState([]);
  const [staff, setStaff]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage]       = useState(1);
  const PER_PAGE = 10;

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get("/admin/services"),
      api.get("/admin/staff").catch(() => ({ data: { staff: [] } })),
    ])
      .then(([t, s]) => { setTickets(t.data.requests || []); setStaff(s.data.staff || []); })
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = tickets.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.ticketId?.toLowerCase().includes(q) || t.fullName?.toLowerCase().includes(q) || t.email?.toLowerCase().includes(q);
    const matchStatus = !statusFilter || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const pages = Math.ceil(filtered.length / PER_PAGE) || 1;

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily:"var(--font-display)" }}>Service Tickets</h1>
        <p className="text-sm text-slate-500 mt-1">{filtered.length} tickets</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by ticket ID, customer..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/8 bg-[#0D1220] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] transition" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-white/8 bg-[#0D1220] px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#3AB6FF] transition capitalize">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      <div className="bg-[#0D1220] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {Array(4).fill(0).map((_, i) => <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />)}
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-16 text-center">
            <FiTool className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="text-slate-500">No tickets found</p>
          </div>
        ) : (
          paginated.map(t => <TicketRow key={t._id} ticket={t} staff={staff} onUpdate={load} />)
        )}

        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
            <p className="text-xs text-slate-500">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p-1)}
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition">
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <button disabled={page >= pages} onClick={() => setPage(p => p+1)}
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition">
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
