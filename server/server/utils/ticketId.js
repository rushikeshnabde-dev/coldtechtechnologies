const ServiceRequest = require('../models/ServiceRequest');

async function generateTicketId() {
  const year = new Date().getFullYear();
  const prefix = `CT-${year}-`;

  const existing = await ServiceRequest.find({
    ticketId: new RegExp(`^CT-${year}-`),
  })
    .sort({ ticketId: -1 })
    .limit(1)
    .lean();

  let next = 1;
  if (existing.length && existing[0].ticketId) {
    const parts = existing[0].ticketId.split('-');
    const num = parseInt(parts[2], 10);
    if (!Number.isNaN(num)) next = num + 1;
  }
  return `${prefix}${String(next).padStart(3, '0')}`;
}

module.exports = { generateTicketId };