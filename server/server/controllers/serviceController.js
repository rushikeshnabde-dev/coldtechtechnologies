const ServiceRequest = require('../models/ServiceRequest');
const { generateTicketId } = require('../utils/ticketId');

exports.create = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      deviceType,
      issueType,
      description,
      priority,
    } = req.body;

    const ticketId = await generateTicketId();
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const doc = await ServiceRequest.create({
      user: req.user?._id || null,
      fullName,
      email,
      phone,
      deviceType,
      issueType,
      description,
      priority: priority || 'Normal',
      image,
      ticketId,
      status: 'received',
    });

    res.status(201).json({
      message: 'Service request submitted',
      ticketId: doc.ticketId,
      id: doc._id,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Could not submit request' });
  }
};

exports.track = async (req, res) => {
  try {
    const raw = (req.params.ticketId || '').trim().toUpperCase();
    const ticket = await ServiceRequest.findOne({ ticketId: raw }).lean();
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const steps = ['received', 'diagnosing', 'repairing', 'completed'];
    const idx = steps.indexOf(ticket.status);

    res.json({
      ticket: {
        ticketId: ticket.ticketId,
        status: ticket.status,
        notes: ticket.notes,
        estimatedCompletion: ticket.estimatedCompletion,
        deviceType: ticket.deviceType,
        issueType: ticket.issueType,
        priority: ticket.priority,
        createdAt: ticket.createdAt,
      },
      timeline: steps.map((s, i) => ({
        key: s,
        label: s.charAt(0).toUpperCase() + s.slice(1),
        done: i <= idx,
        current: i === idx,
      })),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Lookup failed' });
  }
};

exports.myRequests = async (req, res) => {
  try {
    const list = await ServiceRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ requests: list });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to load requests' });
  }
};
