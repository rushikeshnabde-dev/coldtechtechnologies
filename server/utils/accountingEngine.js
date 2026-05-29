/**
 * Double-Entry Accounting Engine
 * Every voucher must have sum(debits) === sum(credits)
 */
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Ledger      = require('../models/Ledger');

/**
 * Post a voucher: array of { ledgerName, type: 'debit'|'credit', amount }
 * Validates balance before writing.
 */
async function postVoucher({ entries, narration, referenceId, referenceType, date }) {
  const totalDebit  = entries.filter(e => e.type === 'debit').reduce((s, e) => s + e.amount, 0);
  const totalCredit = entries.filter(e => e.type === 'credit').reduce((s, e) => s + e.amount, 0);

  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    throw new Error(`Voucher imbalanced: debit=${totalDebit} credit=${totalCredit}`);
  }

  const voucherRef = new mongoose.Types.ObjectId().toString();
  const txDocs = [];

  for (const entry of entries) {
    // Resolve ledger by name or id
    let ledger;
    if (entry.ledgerId) {
      ledger = await Ledger.findById(entry.ledgerId);
    } else {
      ledger = await Ledger.findOne({ name: entry.ledgerName });
    }
    if (!ledger) throw new Error(`Ledger not found: ${entry.ledgerName || entry.ledgerId}`);

    txDocs.push({
      date:          date || new Date(),
      ledgerId:      ledger._id,
      type:          entry.type,
      amount:        entry.amount,
      narration:     narration || '',
      referenceId,
      referenceType,
      voucherRef,
    });

    // Update running balance: debit increases balance, credit decreases
    const delta = entry.type === 'debit' ? entry.amount : -entry.amount;
    await Ledger.findByIdAndUpdate(ledger._id, { $inc: { balance: delta } });
  }

  await Transaction.insertMany(txDocs);
  return voucherRef;
}

/**
 * Reverse a voucher (for cancellation) — swaps debit/credit
 */
async function reverseVoucher({ originalVoucherRef, narration, referenceId, referenceType }) {
  const origTxs = await Transaction.find({ voucherRef: originalVoucherRef });
  if (!origTxs.length) return null;

  const reversedEntries = origTxs.map(tx => ({
    ledgerId: tx.ledgerId,
    type:     tx.type === 'debit' ? 'credit' : 'debit',
    amount:   tx.amount,
  }));

  return postVoucher({
    entries: reversedEntries,
    narration: narration || `Reversal of ${originalVoucherRef}`,
    referenceId,
    referenceType,
    date: new Date(),
  });
}

/**
 * Get ledger statement with running balance
 */
async function getLedgerStatement(ledgerId, { from, to } = {}) {
  const query = { ledgerId };
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to)   query.date.$lte = new Date(to);
  }

  const txs = await Transaction.find(query).sort({ date: 1, createdAt: 1 }).lean();

  let runningBalance = 0;
  const rows = txs.map(tx => {
    const delta = tx.type === 'debit' ? tx.amount : -tx.amount;
    runningBalance += delta;
    return { ...tx, runningBalance };
  });

  return rows;
}

module.exports = { postVoucher, reverseVoucher, getLedgerStatement };
