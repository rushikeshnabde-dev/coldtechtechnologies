const crypto      = require('crypto');
const Company     = require('../models/Company');
const User        = require('../models/User');
const { sendActivationEmail } = require('../utils/mailer');

const CLIENT_URL  = process.env.CLIENT_URL || 'http://localhost:5173';

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// ── Admin: Create Company + AMC ───────────────────────────────────────────────

exports.createCompany = async (req, res) => {
  try {
    const {
      name, contactPerson, email, phone, address, gstNumber,
      amcPlanName, amcStartDate, amcEndDate, amcServices,
    } = req.body;

    if (!name || !contactPerson || !email) {
      return res.status(400).json({ message: 'name, contactPerson and email are required' });
    }

    // Create company
    const company = await Company.create({
      name, contactPerson, email, phone, address, gstNumber,
      amcPlan: {
        name:      amcPlanName || '',
        startDate: amcStartDate ? new Date(amcStartDate) : null,
        endDate:   amcEndDate   ? new Date(amcEndDate)   : null,
        services:  amcServices  || [],
        active:    !!(amcStartDate && amcEndDate),
      },
      createdBy: req.user._id,
    });

    // Create primary user (contact person) with activation token
    const token   = generateToken();
    const expires = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name:              contactPerson,
        email:             email.toLowerCase(),
        password:          null,
        company:           company._id,
        companyRole:       'admin',
        activated:         false,
        activationToken:   token,
        activationExpires: expires,
      });
    } else {
      // Link existing user to company
      user.company           = company._id;
      user.companyRole       = 'admin';
      user.activated         = false;
      user.activationToken   = token;
      user.activationExpires = expires;
      await user.save();
    }

    await sendActivationEmail(email, contactPerson, token);

    res.status(201).json({ company, user: { id: user._id, email: user.email, activated: user.activated } });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Company email already exists' });
    console.error(err);
    res.status(500).json({ message: 'Create company failed' });
  }
};

exports.listCompanies = async (_req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 }).lean();
    res.json({ companies });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load companies' });
  }
};

exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).lean();
    if (!company) return res.status(404).json({ message: 'Company not found' });
    const users = await User.find({ company: company._id }).select('-password -activationToken').lean();
    res.json({ company, users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load company' });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json({ company });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    // Unlink users from this company
    await User.updateMany({ company: req.params.id }, { $set: { company: null, companyRole: 'member' } });
    console.log(`[AMC] Company "${company.name}" deleted by admin ${req.user.email}`);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Delete failed' });
  }
};

// Add user to company
exports.addCompanyUser = async (req, res) => {
  try {
    const { name, email, companyRole } = req.body;
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const token   = generateToken();
    const expires = new Date(Date.now() + 48 * 60 * 60 * 1000);

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name, email: email.toLowerCase(), password: null,
        company: company._id, companyRole: companyRole || 'member',
        activated: false, activationToken: token, activationExpires: expires,
      });
    } else {
      user.company = company._id;
      user.companyRole = companyRole || 'member';
      user.activated = false;
      user.activationToken = token;
      user.activationExpires = expires;
      await user.save();
    }

    await sendActivationEmail(email, name, token);
    res.status(201).json({ user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Add user failed' });
  }
};

// Add device to company
exports.addDevice = async (req, res) => {
  try {
    const { name, model, type, serialNumber } = req.body;
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { $push: { devices: { name, model, type, serialNumber } } },
      { new: true }
    );
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json({ devices: company.devices });
  } catch (err) {
    res.status(500).json({ message: 'Add device failed' });
  }
};

// ── Admin: Resend activation email ───────────────────────────────────────────
exports.resendActivation = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.activated) return res.status(400).json({ message: 'User is already activated' });

    // Refresh token + extend expiry
    const token   = generateToken();
    const expires = new Date(Date.now() + 48 * 60 * 60 * 1000);
    user.activationToken   = token;
    user.activationExpires = expires;
    await user.save();

    await sendActivationEmail(user.email, user.name, token);
    res.json({ message: `Activation email resent to ${user.email}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Resend failed' });
  }
};

// ── Public: Activate account ──────────────────────────────────────────────────

exports.activateAccount = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: 'token and password are required' });
    if (password.length < 6)  return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const user = await User.findOne({
      activationToken:   token,
      activationExpires: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired activation link' });

    const bcrypt = require('bcryptjs');
    user.password          = await bcrypt.hash(password, 12);
    user.activated         = true;
    user.activationToken   = null;
    user.activationExpires = null;
    await user.save();

    const jwt = require('jsonwebtoken');
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'coldtech-dev-secret', { expiresIn: '7d' });

    res.json({
      token: jwtToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, company: user.company },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Activation failed' });
  }
};

// ── Client: My company + AMC data ─────────────────────────────────────────────

exports.myCompany = async (req, res) => {
  try {
    if (!req.user.company) return res.json({ company: null });
    const company = await Company.findById(req.user.company).lean();
    res.json({ company });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load company' });
  }
};

exports.myDevices = async (req, res) => {
  try {
    if (!req.user.company) return res.json({ devices: [] });
    const company = await Company.findById(req.user.company).select('devices').lean();
    res.json({ devices: company?.devices || [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load devices' });
  }
};

exports.addMyDevice = async (req, res) => {
  try {
    if (!req.user.company) return res.status(400).json({ message: 'No company linked to your account' });
    const { name, model, type, serialNumber } = req.body;
    if (!name) return res.status(400).json({ message: 'Device name is required' });

    const company = await Company.findByIdAndUpdate(
      req.user.company,
      { $push: { devices: { name, model, type: type || 'Laptop', serialNumber } } },
      { new: true }
    );
    res.json({ devices: company.devices });
  } catch (err) {
    res.status(500).json({ message: 'Add device failed' });
  }
};
