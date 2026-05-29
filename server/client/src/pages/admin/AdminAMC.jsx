import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import { FiPlus, FiX, FiSave, FiUsers, FiMonitor, FiChevronDown, FiChevronUp, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

const EMPTY_COMPANY = {
  name:'', contactPerson:'', email:'', phone:'', address:'', gstNumber:'',
  amcPlanName:'', amcStartDate:'', amcEndDate:'', amcServices:'',
};

const inp = "w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] transition";

function fmtDate(d) { return d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'; }

function isExpired(d) { return d && new Date(d) < new Date(); }

export function AdminAMC() {
  const [companies, setCompanies] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(false);
  const [form,      setForm]      = useState(EMPTY_COMPANY);
  const [saving,    setSaving]    = useState(false);
  const [expanded,  setExpanded]  = useState(null);
  const [detail,    setDetail]    = useState({});
  const [resending, setResending] = useState(null);
  const [deleting,  setDeleting]  = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/admin/amc').then(r => setCompanies(r.data.companies || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const set = (k,v) => setForm(p => ({...p,[k]:v}));

  async function save() {
    if (!form.name || !form.contactPerson || !form.email) { toast.error('Name, contact person and email are required'); return; }
    setSaving(true);
    try {
      await api.post('/admin/amc', { ...form, amcServices: form.amcServices.split(',').map(s=>s.trim()).filter(Boolean) });
      toast.success('Company created & activation email sent');
      setModal(false);
      setForm(EMPTY_COMPANY);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed');
    } finally { setSaving(false); }
  }

  async function expand(id) {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (!detail[id]) {
      try {
        const { data } = await api.get(`/admin/amc/${id}`);
        setDetail(p => ({...p, [id]: data}));
      } catch { toast.error('Failed to load details'); }
    }
  }

  async function resendEmail(userId, email) {
    setResending(userId);
    try {
      await api.post(`/admin/amc/resend/${userId}`);
      toast.success(`Activation email resent to ${email}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Resend failed');
    } finally {
      setResending(null);
    }
  }

  async function deleteCompany(id, name) {
    if (!window.confirm(`Delete "${name}"? This will unlink all users. This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/amc/${id}`);
      toast.success(`"${name}" deleted`);
      setExpanded(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">AMC Clients</h1>
          <p className="text-sm text-slate-500 mt-0.5">{companies.length} companies</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background:'linear-gradient(135deg,#3AB6FF,#2B0FA8)' }}>
          <FiPlus className="w-4 h-4" /> Add Company
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#3AB6FF]/30 border-t-[#3AB6FF] rounded-full animate-spin" /></div>
      ) : companies.length === 0 ? (
        <div className="text-center py-20 text-slate-500"><p className="text-4xl mb-3">🏢</p><p>No AMC clients yet.</p></div>
      ) : (
        <div className="space-y-3">
          {companies.map(c => {
            const expired = isExpired(c.amcPlan?.endDate);
            const active  = c.amcPlan?.active && !expired;
            const d       = detail[c._id];
            return (
              <div key={c._id} className="rounded-2xl border border-white/5 overflow-hidden" style={{ background:'#0D1220' }}>
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 cursor-pointer hover:bg-white/3 transition"
                  onClick={() => expand(c._id)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${active ? 'bg-green-400' : 'bg-red-400'}`} />
                    <div>
                      <p className="font-bold text-white">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.contactPerson} · {c.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${active ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                      {active ? 'Active' : expired ? 'Expired' : 'No AMC'}
                    </span>
                    {c.amcPlan?.name && <span className="text-xs text-slate-400">{c.amcPlan.name}</span>}
                    <span className="text-xs text-slate-500">{fmtDate(c.amcPlan?.endDate)}</span>
                    {expanded === c._id ? <FiChevronUp className="w-4 h-4 text-slate-400" /> : <FiChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                  {/* Delete button — stop propagation so it doesn't toggle expand */}
                  <button
                    onClick={e => { e.stopPropagation(); deleteCompany(c._id, c.name); }}
                    disabled={deleting === c._id}
                    title="Delete company"
                    className="ml-2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition disabled:opacity-40 flex-shrink-0">
                    {deleting === c._id
                      ? <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                      : <FiTrash2 className="w-4 h-4" />}
                  </button>
                </div>

                <AnimatePresence>
                  {expanded === c._id && (
                    <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
                      exit={{ height:0, opacity:0 }} transition={{ duration:.2 }} className="overflow-hidden">
                      <div className="px-5 pb-5 border-t border-white/5 pt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Company info */}
                        <div className="space-y-1.5 text-sm">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Company Details</p>
                          {c.phone && <p className="text-slate-300">📞 {c.phone}</p>}
                          {c.address && <p className="text-slate-300">📍 {c.address}</p>}
                          {c.gstNumber && <p className="text-slate-300">GST: {c.gstNumber}</p>}
                          <p className="text-slate-400 text-xs">AMC: {fmtDate(c.amcPlan?.startDate)} → {fmtDate(c.amcPlan?.endDate)}</p>
                          {c.amcPlan?.services?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {c.amcPlan.services.map(s => <span key={s} className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-slate-300 border border-white/10">{s}</span>)}
                            </div>
                          )}
                        </div>

                        {/* Users */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                            <FiUsers className="w-3 h-3" /> Users ({d?.users?.length || 0})
                          </p>
                          {d?.users?.map(u => (
                            <div key={u._id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                              <div>
                                <p className="text-sm text-white">{u.name}</p>
                                <p className="text-xs text-slate-400">{u.email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 capitalize">{u.companyRole}</span>
                                {!u.activated && <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400">Pending</span>}
                                {!u.activated && (
                                  <button
                                    onClick={() => resendEmail(u._id, u.email)}
                                    disabled={resending === u._id}
                                    title="Resend activation email"
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-sky-400 hover:bg-sky-400/10 transition disabled:opacity-50">
                                    {resending === u._id
                                      ? <span className="w-3 h-3 border border-sky-400/40 border-t-sky-400 rounded-full animate-spin" />
                                      : <FiRefreshCw className="w-3 h-3" />}
                                    Resend
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Devices */}
                        {c.devices?.length > 0 && (
                          <div className="md:col-span-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                              <FiMonitor className="w-3 h-3" /> Devices ({c.devices.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {c.devices.map((dv,i) => (
                                <span key={i} className="px-3 py-1.5 rounded-xl text-xs bg-white/5 border border-white/10 text-slate-300">
                                  {dv.name} {dv.model ? `· ${dv.model}` : ''} <span className="text-slate-500">({dv.type})</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Company Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto"
            style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(4px)' }}>
            <motion.div initial={{ scale:.95 }} animate={{ scale:1 }} exit={{ scale:.95 }}
              className="w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl" style={{ background:'#0D1220' }}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <h2 className="font-bold text-white">Add AMC Client</h2>
                <button onClick={() => setModal(false)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
                  <FiX className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    ['name','Company Name *','text'],
                    ['contactPerson','Contact Person *','text'],
                    ['email','Official Email *','email'],
                    ['phone','Phone','tel'],
                    ['gstNumber','GST Number','text'],
                    ['address','Address','text'],
                  ].map(([k,label,type]) => (
                    <div key={k}>
                      <label className="text-xs font-semibold text-slate-400 block mb-1.5">{label}</label>
                      <input type={type} value={form[k]} onChange={e => set(k,e.target.value)} placeholder={label.replace(' *','')} className={inp} />
                    </div>
                  ))}
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-2">AMC Plan</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">Plan Name</label>
                    <input value={form.amcPlanName} onChange={e => set('amcPlanName',e.target.value)} placeholder="e.g. Premium" className={inp} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">Start Date</label>
                    <input type="date" value={form.amcStartDate} onChange={e => set('amcStartDate',e.target.value)} className={inp} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">End Date</label>
                    <input type="date" value={form.amcEndDate} onChange={e => set('amcEndDate',e.target.value)} className={inp} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Included Services (comma separated)</label>
                  <input value={form.amcServices} onChange={e => set('amcServices',e.target.value)} placeholder="Hardware Support, OS Install, Data Backup" className={inp} />
                </div>
                <p className="text-xs text-slate-500">An activation email will be sent to the contact person to set their password.</p>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
                <button onClick={() => setModal(false)} className="px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition">Cancel</button>
                <button onClick={save} disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
                  style={{ background:'linear-gradient(135deg,#3AB6FF,#2B0FA8)' }}>
                  {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave className="w-4 h-4" />}
                  {saving ? 'Creating…' : 'Create & Send Invite'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
