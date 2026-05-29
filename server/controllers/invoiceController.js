const Invoice         = require('../models/Invoice');
const InvoiceTemplate = require('../models/InvoiceTemplate');

/* ── currency formatter ── */
const fmtCurrency = (n, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 2 }).format(n || 0);

/* ── calculate item totals ── */
function calcItems(items) {
  return items.map(item => {
    const qty    = Number(item.quantity || 0);
    const rate   = Number(item.rate || 0);
    const taxPct = Number(item.taxPercent || 0);
    const amount    = qty * rate;
    const taxAmount = amount * (taxPct / 100);
    return { ...item, amount, taxAmount, total: amount + taxAmount };
  });
}

/* ── render HTML template with invoice data ── */
function renderTemplate(html, invoice) {
  const fmt = n => fmtCurrency(n, invoice.currency || 'INR');

  // Build items rows
  const itemsHtml = (invoice.items || []).map(item => `
    <tr>
      <td>${item.name || ''}${item.description ? `<br><small style="color:#666">${item.description}</small>` : ''}</td>
      <td style="text-align:center">${item.quantity}</td>
      <td style="text-align:right">${fmt(item.rate)}</td>
      <td style="text-align:center">${item.taxPercent || 0}%</td>
      <td style="text-align:right">${fmt(item.taxAmount)}</td>
      <td style="text-align:right">${fmt(item.total)}</td>
    </tr>`).join('');

  const replacements = {
    '{{company_name}}':    invoice.company?.name    || '',
    '{{company_address}}': invoice.company?.address || '',
    '{{company_phone}}':   invoice.company?.phone   || '',
    '{{company_email}}':   invoice.company?.email   || '',
    '{{company_gstin}}':   invoice.company?.gstin   || '',
    '{{company_logo}}':    invoice.company?.logo
      ? `<img src="${invoice.company.logo}" alt="Logo" style="max-height:60px;max-width:180px" />`
      : '',
    '{{client_name}}':     invoice.client?.name    || '',
    '{{client_address}}':  invoice.client?.address || '',
    '{{client_phone}}':    invoice.client?.phone   || '',
    '{{client_email}}':    invoice.client?.email   || '',
    '{{client_gstin}}':    invoice.client?.gstin   || '',
    '{{invoice_number}}':  invoice.invoiceNumber   || '',
    '{{invoice_date}}':    invoice.invoiceDate
      ? new Date(invoice.invoiceDate).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
      : '',
    '{{due_date}}':        invoice.dueDate
      ? new Date(invoice.dueDate).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
      : '—',
    '{{items}}':           itemsHtml,
    '{{subtotal}}':        fmt(invoice.subtotal),
    '{{tax_total}}':       fmt(invoice.taxTotal),
    '{{discount}}':        fmt(invoice.discount),
    '{{grand_total}}':     fmt(invoice.grandTotal),
    '{{currency}}':        invoice.currency || 'INR',
    '{{notes}}':           invoice.notes         || '',
    '{{payment_terms}}':   invoice.paymentTerms  || '',
    '{{status}}':          (invoice.status || 'draft').toUpperCase(),
  };

  let result = html;
  for (const [key, val] of Object.entries(replacements)) {
    result = result.split(key).join(val);
  }
  return result;
}

/* ── default HTML template ── */
const DEFAULT_TEMPLATE_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; background: #fff; padding: 40px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
  .company-name { font-size: 22px; font-weight: 800; color: #0f172a; }
  .company-sub { font-size: 12px; color: #64748b; margin-top: 4px; line-height: 1.6; }
  .invoice-meta { text-align: right; }
  .invoice-num { font-size: 20px; font-weight: 700; color: #0ea5e9; }
  .badge { display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: #dcfce7; color: #166534; margin-top: 6px; }
  .divider { border: none; border-top: 2px solid #e2e8f0; margin: 24px 0; }
  .bill-section { display: flex; gap: 40px; margin-bottom: 28px; }
  .bill-box { flex: 1; }
  .bill-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; margin-bottom: 6px; }
  .bill-name { font-size: 15px; font-weight: 700; color: #0f172a; }
  .bill-detail { font-size: 12px; color: #64748b; line-height: 1.7; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  thead tr { background: #0f172a; color: #fff; }
  thead th { padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  thead th:not(:first-child) { text-align: right; }
  tbody tr { border-bottom: 1px solid #f1f5f9; }
  tbody tr:hover { background: #f8fafc; }
  tbody td { padding: 10px 12px; font-size: 13px; color: #334155; }
  tbody td:not(:first-child) { text-align: right; }
  .totals { display: flex; justify-content: flex-end; margin-top: 8px; }
  .totals-box { width: 260px; }
  .totals-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; color: #64748b; }
  .totals-row.grand { border-top: 2px solid #0f172a; margin-top: 6px; padding-top: 10px; font-size: 16px; font-weight: 800; color: #0f172a; }
  .totals-row.grand span:last-child { color: #0ea5e9; }
  .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; gap: 20px; }
  .notes-box { flex: 1; }
  .notes-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; margin-bottom: 6px; }
  .notes-text { font-size: 12px; color: #64748b; line-height: 1.6; }
  .terms-box { flex: 1; text-align: right; }
  .watermark { text-align: center; margin-top: 32px; font-size: 10px; color: #cbd5e1; }
</style>
</head>
<body>
<div class="header">
  <div>
    {{company_logo}}
    <div class="company-name">{{company_name}}</div>
    <div class="company-sub">
      {{company_address}}<br>
      {{company_phone}} · {{company_email}}<br>
      {{company_gstin}}
    </div>
  </div>
  <div class="invoice-meta">
    <div style="font-size:13px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.1em">Invoice</div>
    <div class="invoice-num">{{invoice_number}}</div>
    <div style="font-size:12px;color:#64748b;margin-top:6px">Date: {{invoice_date}}</div>
    <div style="font-size:12px;color:#64748b">Due: {{due_date}}</div>
    <div class="badge">{{status}}</div>
  </div>
</div>

<hr class="divider">

<div class="bill-section">
  <div class="bill-box">
    <div class="bill-label">Bill From</div>
    <div class="bill-name">{{company_name}}</div>
    <div class="bill-detail">{{company_address}}</div>
  </div>
  <div class="bill-box">
    <div class="bill-label">Bill To</div>
    <div class="bill-name">{{client_name}}</div>
    <div class="bill-detail">
      {{client_address}}<br>
      {{client_phone}}<br>
      {{client_email}}<br>
      {{client_gstin}}
    </div>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th style="width:35%">Item / Description</th>
      <th>Qty</th>
      <th>Rate</th>
      <th>GST %</th>
      <th>Tax</th>
      <th>Total</th>
    </tr>
  </thead>
  <tbody>
    {{items}}
  </tbody>
</table>

<div class="totals">
  <div class="totals-box">
    <div class="totals-row"><span>Subtotal</span><span>{{subtotal}}</span></div>
    <div class="totals-row"><span>GST / Tax</span><span>{{tax_total}}</span></div>
    <div class="totals-row"><span>Discount</span><span>-{{discount}}</span></div>
    <div class="totals-row grand"><span>Grand Total</span><span>{{grand_total}}</span></div>
  </div>
</div>

<div class="footer">
  <div class="notes-box">
    <div class="notes-label">Notes</div>
    <div class="notes-text">{{notes}}</div>
  </div>
  <div class="terms-box">
    <div class="notes-label">Payment Terms</div>
    <div class="notes-text">{{payment_terms}}</div>
  </div>
</div>

<div class="watermark">Generated by Coldtech Technologies · coldtechtechnologies.in</div>
</body>
</html>`;

/* ══════════════════════════════════════════
   INVOICE CRUD
══════════════════════════════════════════ */

exports.list = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const invoices = await Invoice.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 }).lean();
    res.json({ invoices });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};

exports.get = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('createdBy', 'name').lean();
    if (!invoice) return res.status(404).json({ message: 'Not found' });
    res.json({ invoice });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};

exports.create = async (req, res) => {
  try {
    const { company, client, items = [], discount = 0, currency, status, invoiceDate, dueDate, notes, paymentTerms, templateId } = req.body;
    if (!client?.name) return res.status(400).json({ message: 'Client name required' });

    const processedItems = calcItems(items);
    const subtotal   = processedItems.reduce((s, i) => s + i.amount, 0);
    const taxTotal   = processedItems.reduce((s, i) => s + i.taxAmount, 0);
    const grandTotal = subtotal + taxTotal - Number(discount);

    const invoice = await Invoice.create({
      company, client, items: processedItems,
      subtotal, taxTotal, discount: Number(discount), grandTotal,
      currency: currency || 'INR',
      status: status || 'draft',
      invoiceDate: invoiceDate ? new Date(invoiceDate) : new Date(),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      notes, paymentTerms, templateId: templateId || null,
      createdBy: req.user._id,
    });
    res.status(201).json({ invoice });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message || 'Failed to create' });
  }
};

exports.update = async (req, res) => {
  try {
    const inv = await Invoice.findById(req.params.id);
    if (!inv) return res.status(404).json({ message: 'Not found' });

    const { company, client, items, discount, currency, status, invoiceDate, dueDate, notes, paymentTerms, templateId } = req.body;
    if (company)      inv.company      = company;
    if (client)       inv.client       = client;
    if (currency)     inv.currency     = currency;
    if (status)       inv.status       = status;
    if (notes !== undefined)        inv.notes        = notes;
    if (paymentTerms !== undefined) inv.paymentTerms = paymentTerms;
    if (invoiceDate)  inv.invoiceDate  = new Date(invoiceDate);
    if (dueDate)      inv.dueDate      = new Date(dueDate);
    if (templateId !== undefined)   inv.templateId   = templateId || null;

    if (items) {
      const processed  = calcItems(items);
      inv.items        = processed;
      inv.subtotal     = processed.reduce((s, i) => s + i.amount, 0);
      inv.taxTotal     = processed.reduce((s, i) => s + i.taxAmount, 0);
    }
    if (discount !== undefined) inv.discount = Number(discount);
    inv.grandTotal = inv.subtotal + inv.taxTotal - inv.discount;

    await inv.save();
    res.json({ invoice: inv });
  } catch (e) { res.status(500).json({ message: 'Failed to update' }); }
};

exports.remove = async (req, res) => {
  try {
    const inv = await Invoice.findByIdAndDelete(req.params.id);
    if (!inv) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};

/* ── Render invoice as HTML ── */
exports.render = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).lean();
    if (!invoice) return res.status(404).json({ message: 'Not found' });

    let templateHtml = DEFAULT_TEMPLATE_HTML;
    if (invoice.templateId) {
      const tmpl = await InvoiceTemplate.findById(invoice.templateId).lean();
      if (tmpl) templateHtml = tmpl.html;
    }

    const html = renderTemplate(templateHtml, invoice);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (e) { res.status(500).json({ message: 'Failed to render' }); }
};

/* ══════════════════════════════════════════
   TEMPLATE CRUD
══════════════════════════════════════════ */

exports.listTemplates = async (_req, res) => {
  try {
    const templates = await InvoiceTemplate.find().sort({ createdAt: -1 }).lean();
    res.json({ templates });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};

exports.createTemplate = async (req, res) => {
  try {
    const { name, html, isDefault } = req.body;
    if (!name || !html) return res.status(400).json({ message: 'name and html required' });
    if (isDefault) await InvoiceTemplate.updateMany({}, { isDefault: false });
    const tmpl = await InvoiceTemplate.create({ name, html, isDefault: !!isDefault, createdBy: req.user._id });
    res.status(201).json({ template: tmpl });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};

exports.updateTemplate = async (req, res) => {
  try {
    const { name, html, isDefault } = req.body;
    if (isDefault) await InvoiceTemplate.updateMany({ _id: { $ne: req.params.id } }, { isDefault: false });
    const tmpl = await InvoiceTemplate.findByIdAndUpdate(req.params.id, { name, html, isDefault: !!isDefault }, { new: true });
    if (!tmpl) return res.status(404).json({ message: 'Not found' });
    res.json({ template: tmpl });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};

exports.removeTemplate = async (req, res) => {
  try {
    await InvoiceTemplate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};

exports.getDefaultTemplate = async (_req, res) => {
  try {
    const tmpl = await InvoiceTemplate.findOne({ isDefault: true }).lean();
    res.json({ html: tmpl?.html || DEFAULT_TEMPLATE_HTML, template: tmpl });
  } catch (e) { res.status(500).json({ message: 'Failed' }); }
};
