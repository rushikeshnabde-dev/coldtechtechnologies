/**
 * Coldtech Mailer — powered by Resend API
 * https://resend.com/docs
 */

const { Resend } = require('resend');

let _resend = null;

function getResend() {
  if (_resend) return _resend;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[Mailer] ⚠️  RESEND_API_KEY not set — emails will be logged only.');
    return null;
  }

  _resend = new Resend(apiKey);
  console.log('[Mailer] ✅ Resend client initialized.');
  return _resend;
}

// ── Called on server startup ──────────────────────────────────────────────────
async function verifyMailer() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[Mailer] ⚠️  RESEND_API_KEY missing — add it to server/.env');
    return;
  }
  console.log('[Mailer] ✅ Resend API key loaded.');
}

// ── Core send function ────────────────────────────────────────────────────────
async function sendMail({ to, subject, html, text }) {
  console.log(`[Mailer] 📧 Sending "${subject}" → ${to}`);

  if (!to || !to.includes('@')) {
    console.error(`[Mailer] ❌ Invalid recipient: "${to}"`);
    return { ok: false, error: 'Invalid recipient email' };
  }

  const resend = getResend();
  if (!resend) {
    console.warn(`[Mailer] ⚠️  Email NOT sent (no API key). Link logged above.`);
    return { ok: false, error: 'RESEND_API_KEY not configured' };
  }

  const from = 'Coldtech Technologies <no-reply@coldtechtechnologies.in>';

  try {
    const { data, error } = await resend.emails.send({ from, to, subject, html, text });

    if (error) {
      console.error(`[Mailer] ❌ Resend error for ${to}:`, error.message || error);
      return { ok: false, error: error.message || JSON.stringify(error) };
    }

    console.log(`[Mailer] ✅ Email sent to ${to} — id: ${data.id}`);
    return { ok: true, id: data.id };
  } catch (err) {
    console.error(`[Mailer] ❌ Exception sending to ${to}:`, err.message);
    return { ok: false, error: err.message };
  }
}

// ── Email templates ───────────────────────────────────────────────────────────
function activationEmailHtml(name, link) {
  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:auto;background:#f8fafc;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">
      <div style="background:linear-gradient(135deg,#1a00cc,#0a0a2e);padding:32px 40px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800">Coldtech Technologies</h1>
        <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:13px">IT Solutions · Pune, India</p>
      </div>
      <div style="padding:36px 40px;background:#ffffff">
        <h2 style="color:#1e293b;margin:0 0 12px;font-size:20px">Welcome, ${name}!</h2>
        <p style="color:#475569;line-height:1.7;margin:0 0 24px;font-size:15px">
          Your AMC account has been created on the Coldtech Technologies platform.
          Click the button below to set your password and activate your account.
        </p>
        <div style="text-align:center;margin:32px 0">
          <a href="${link}"
            style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#3AB6FF,#2B0FA8);color:#fff;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px">
            Activate My Account
          </a>
        </div>
        <p style="color:#64748b;font-size:13px;margin:0 0 8px">Or copy this link into your browser:</p>
        <p style="color:#3AB6FF;font-size:12px;word-break:break-all;margin:0">${link}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
        <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0">
          This link expires in <strong>48 hours</strong>.<br/>
          If you did not expect this email, please ignore it.
        </p>
      </div>
      <div style="background:#f1f5f9;padding:16px 40px;text-align:center">
        <p style="color:#94a3b8;font-size:11px;margin:0">
          © ${new Date().getFullYear()} Coldtech Technologies · PCMC, Pune, Maharashtra 410507
        </p>
      </div>
    </div>
  `;
}

async function sendActivationEmail(email, name, token) {
  const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
  const link = `${CLIENT_URL}/activate?token=${token}`;

  console.log(`[Mailer] 🔗 Activation link for ${email}: ${link}`);

  return sendMail({
    to:      email,
    subject: 'Activate your Coldtech AMC Account',
    html:    activationEmailHtml(name, link),
    text:    `Welcome ${name}! Activate your account: ${link} (expires in 48 hours)`,
  });
}

async function sendTestEmail(to) {
  return sendMail({
    to,
    subject: 'Coldtech Mailer Test ✅',
    html:    `<p>Test email from Coldtech Technologies. Resend is working correctly.</p><p>Sent: ${new Date().toISOString()}</p>`,
    text:    `Coldtech mailer test — sent at ${new Date().toISOString()}`,
  });
}

module.exports = { verifyMailer, sendMail, sendActivationEmail, sendTestEmail };
