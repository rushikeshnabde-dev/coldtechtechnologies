import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiBarChart2, FiTrendingUp, FiFileText, FiDollarSign } from 'react-icons/fi';
import { accountingApi } from '../../services/api';

const inp = "w-full rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] focus:ring-1 focus:ring-[#3AB6FF]/30 transition";

export function AdminReports() {
  const [tab, setTab] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [ledgers, setLedgers] = useState([]);
  const [selectedLedger, setSelectedLedger] = useState('');
  const [ledgerReport, setLedgerReport] = useState(null);
  const [plReport, setPlReport] = useState(null);
  const [gstReport, setGstReport] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    accountingApi.getLedgers().then(r => setLedgers(r.data.ledgers || []));
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const { data } = await accountingApi.getDashboard();
      setDashboard(data);
    } catch (err) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadLedgerReport = async () => {
    if (!selectedLedger) { toast.error('Select a ledger'); return; }
    setLoading(true);
    try {
      const { data } = await accountingApi.getLedgerReport({ ledgerId: selectedLedger, from: dateFrom, to: dateTo });
      setLedgerReport(data);
    } catch (err) {
      toast.error('Failed to load ledger report');
    } finally {
      setLoading(false);
    }
  };

  const loadPL = async () => {
    setLoading(true);
    try {
      const { data } = await accountingApi.getProfitLoss({ from: dateFrom, to: dateTo });
      setPlReport(data);
    } catch (err) {
      toast.error('Failed to load P&L');
    } finally {
      setLoading(false);
    }
  };

  const loadGST = async () => {
    setLoading(true);
    try {
      const { data } = await accountingApi.getGstSummary({ from: dateFrom, to: dateTo });
      setGstReport(data);
    } catch (err) {
      toast.error('Failed to load GST report');
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: FiBarChart2 },
    { id: 'ledger', label: 'Ledger Report', icon: FiFileText },
    { id: 'pl', label: 'Profit & Loss', icon: FiTrendingUp },
    { id: 'gst', label: 'GST Summary', icon: FiDollarSign },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Accounting Reports</h1>
        <p className="text-sm text-slate-500 mt-1">Financial insights and summaries</p>
      </div>

      <div className="flex gap-2 border-b border-white/5 pb-0">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition border-b-2 ${
              tab === t.id
                ? "text-[#3AB6FF] border-[#3AB6FF] bg-[#3AB6FF]/5"
                : "text-slate-500 border-transparent hover:text-white"
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#3AB6FF]/30 border-t-[#3AB6FF] rounded-full animate-spin" />
            </div>
          ) : dashboard ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0D1220] border border-white/10 rounded-2xl p-5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Total Invoices</p>
                <p className="text-3xl font-bold text-white">{dashboard.totalInvoices || 0}</p>
              </div>
              <div className="bg-[#0D1220] border border-white/10 rounded-2xl p-5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Pending Invoices</p>
                <p className="text-3xl font-bold text-yellow-400">{dashboard.pendingInvoices || 0}</p>
              </div>
              <div className="bg-[#0D1220] border border-white/10 rounded-2xl p-5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Month Revenue</p>
                <p className="text-3xl font-bold text-green-400">₹{dashboard.monthRevenue?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-[#0D1220] border border-white/10 rounded-2xl p-5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Outstanding</p>
                <p className="text-3xl font-bold text-orange-400">₹{dashboard.monthOutstanding?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-[#0D1220] border border-white/10 rounded-2xl p-5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Cash Balance</p>
                <p className="text-3xl font-bold text-blue-400">₹{dashboard.cashBalance?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-[#0D1220] border border-white/10 rounded-2xl p-5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Bank Balance</p>
                <p className="text-3xl font-bold text-cyan-400">₹{dashboard.bankBalance?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {tab === 'ledger' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <select className={inp + " flex-1"} value={selectedLedger} onChange={e => setSelectedLedger(e.target.value)}>
              <option value="">Select Ledger</option>
              {ledgers.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
            </select>
            <input type="date" className={inp} placeholder="From" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <input type="date" className={inp} placeholder="To" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            <button onClick={loadLedgerReport} disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition"
              style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
              {loading ? 'Loading…' : 'Generate'}
            </button>
          </div>

          {ledgerReport && (
            <div className="bg-[#0D1220] border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <p className="font-bold text-white">{ledgerReport.ledger?.name}</p>
                <p className="text-xs text-slate-500 mt-1">Opening: ₹{ledgerReport.openingBalance?.toFixed(2)} | Closing: ₹{ledgerReport.closingBalance?.toFixed(2)}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Narration</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Debit</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Credit</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {ledgerReport.rows?.map((row, i) => (
                      <tr key={i} className="hover:bg-white/5 transition">
                        <td className="px-4 py-3 text-sm text-slate-400">{new Date(row.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm text-white">{row.narration}</td>
                        <td className="px-4 py-3 text-sm text-right font-mono text-green-400">
                          {row.type === 'debit' ? `₹${row.amount.toFixed(2)}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-mono text-red-400">
                          {row.type === 'credit' ? `₹${row.amount.toFixed(2)}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-mono text-white">₹{row.runningBalance?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'pl' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <input type="date" className={inp} placeholder="From" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <input type="date" className={inp} placeholder="To" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            <button onClick={loadPL} disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition"
              style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
              {loading ? 'Loading…' : 'Generate'}
            </button>
          </div>

          {plReport && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0D1220] border border-white/10 rounded-2xl p-5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Income</p>
                {plReport.incomeRows?.map(row => (
                  <div key={row.ledger._id} className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">{row.ledger.name}</span>
                    <span className="text-green-400 font-mono">₹{row.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-2 mt-2">
                  <span className="text-white">Total Income</span>
                  <span className="text-green-400 font-mono">₹{plReport.totalIncome?.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-[#0D1220] border border-white/10 rounded-2xl p-5">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Expenses</p>
                {plReport.expenseRows?.map(row => (
                  <div key={row.ledger._id} className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">{row.ledger.name}</span>
                    <span className="text-red-400 font-mono">₹{row.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-2 mt-2">
                  <span className="text-white">Total Expense</span>
                  <span className="text-red-400 font-mono">₹{plReport.totalExpense?.toFixed(2)}</span>
                </div>
              </div>

              <div className="md:col-span-2 bg-gradient-to-br from-[#0EA5E9]/20 to-[#3AB6FF]/20 border border-[#3AB6FF]/30 rounded-2xl p-6">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Net Profit / Loss</p>
                <p className={`text-4xl font-bold ${plReport.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ₹{plReport.netProfit?.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'gst' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <input type="date" className={inp} placeholder="From" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <input type="date" className={inp} placeholder="To" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            <button onClick={loadGST} disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition"
              style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
              {loading ? 'Loading…' : 'Generate'}
            </button>
          </div>

          {gstReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {gstReport.rows?.map(row => (
                  <div key={row.name} className="bg-[#0D1220] border border-white/10 rounded-2xl p-5">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">{row.name}</p>
                    <p className="text-sm text-slate-400 mb-1">Collected: <span className="text-green-400 font-mono">₹{row.collected?.toFixed(2)}</span></p>
                    <p className="text-sm text-slate-400 mb-1">Paid: <span className="text-red-400 font-mono">₹{row.paid?.toFixed(2)}</span></p>
                    <p className="text-sm font-bold text-white mt-2">Net: <span className="text-[#3AB6FF] font-mono">₹{row.net?.toFixed(2)}</span></p>
                  </div>
                ))}
              </div>

              <div className="bg-[#0D1220] border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                  <p className="font-bold text-white">Invoice-wise GST Breakdown</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/5">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Invoice #</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Party</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Subtotal</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">CGST</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">SGST</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">IGST</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {gstReport.invoices?.map(inv => (
                        <tr key={inv._id} className="hover:bg-white/5 transition">
                          <td className="px-4 py-3 text-sm text-white font-mono">{inv.invoiceNumber}</td>
                          <td className="px-4 py-3 text-sm text-slate-400">{new Date(inv.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm text-white">{inv.partyId?.name}</td>
                          <td className="px-4 py-3 text-sm text-right font-mono text-slate-400">₹{inv.subtotal?.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-right font-mono text-yellow-400">₹{inv.totalCgst?.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-right font-mono text-yellow-400">₹{inv.totalSgst?.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-right font-mono text-yellow-400">₹{inv.totalIgst?.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-right font-mono text-green-400">₹{inv.grandTotal?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
