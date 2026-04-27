/**
 * AI Blog Generation — Google Gemini 2.5 Flash
 * Asks for each field in a separate call to avoid JSON/HTML escaping issues.
 */

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/* ── slug ── */
function toSlug(t) {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80);
}

/* ── Unsplash ── */
function img(q, w = 1200, h = 500) {
  return `https://source.unsplash.com/${w}x${h}/?${encodeURIComponent(q)}`;
}

/* ── single Gemini call ── */
async function ask(prompt) {
  const r = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 3000 },
    }),
  });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw new Error(e.error?.message || `Gemini ${r.status}`);
  }
  const d = await r.json();
  const text = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text.trim();
}

/* ── brand CSS ── */
const CSS = `<style>
.ct-blog{font-family:'Inter',system-ui,sans-serif;color:#1e293b;line-height:1.8;max-width:800px;margin:0 auto}
.ct-blog h1{font-size:2rem;font-weight:800;color:#0f172a;margin-bottom:.5rem}
.ct-blog h2{font-size:1.4rem;font-weight:700;color:#0f172a;margin:2rem 0 .75rem;padding-bottom:.5rem;border-bottom:2px solid #e2e8f0}
.ct-blog h3{font-size:1.15rem;font-weight:600;color:#1e293b;margin:1.5rem 0 .5rem}
.ct-blog p{margin-bottom:1rem;color:#334155}
.ct-blog ul,.ct-blog ol{padding-left:1.5rem;margin-bottom:1rem}
.ct-blog li{margin-bottom:.4rem;color:#334155}
.ct-blog strong{color:#0f172a}
.ct-blog .hero-img{width:100%;border-radius:16px;margin:1.5rem 0;object-fit:cover}
.ct-blog .section-img{width:100%;border-radius:12px;margin:1rem 0;object-fit:cover;max-height:300px}
.ct-blog .tip-box{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-left:4px solid #3b82f6;border-radius:8px;padding:1rem 1.25rem;margin:1.5rem 0}
.ct-blog .tip-box p{margin:0;color:#1e40af}
.ct-blog .warning-box{background:#fffbeb;border-left:4px solid #f59e0b;border-radius:8px;padding:1rem 1.25rem;margin:1.5rem 0}
.ct-blog .warning-box p{margin:0;color:#92400e}
.ct-blog .cta-box{background:linear-gradient(135deg,#0f172a,#0f2744);border-radius:16px;padding:2rem;margin:2rem 0;text-align:center}
.ct-blog .cta-box h3{color:#fff;margin:0 0 .5rem;font-size:1.25rem}
.ct-blog .cta-box p{color:#94a3b8;margin:0 0 1.25rem}
.ct-blog .cta-btn{display:inline-block;background:linear-gradient(135deg,#3ab6ff,#1e90ff);color:#fff;font-weight:700;padding:.75rem 2rem;border-radius:12px;text-decoration:none;font-size:.95rem}
.ct-blog .tag-row{display:flex;flex-wrap:wrap;gap:.5rem;margin:1.5rem 0}
.ct-blog .tag{background:rgba(58,182,255,.1);color:#0ea5e9;border:1px solid rgba(58,182,255,.3);border-radius:999px;padding:.25rem .75rem;font-size:.75rem;font-weight:600}
.ct-blog .author-bar{display:flex;align-items:center;gap:.75rem;padding:1rem;background:#f8fafc;border-radius:12px;margin:1.5rem 0}
.ct-blog .author-bar img{width:44px;height:44px;border-radius:50%;object-fit:cover;flex-shrink:0}
.ct-blog .author-avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#1a2c3e,#00a6c4);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:1.1rem;flex-shrink:0}
.ct-blog .author-name{font-weight:700;color:#0f172a;font-size:.9rem}
.ct-blog .author-role{color:#64748b;font-size:.75rem}
.ct-blog .stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:1.5rem 0}
.ct-blog .stat-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:1rem;text-align:center}
.ct-blog .stat-num{font-size:1.5rem;font-weight:800;color:#0ea5e9}
.ct-blog .stat-label{font-size:.75rem;color:#64748b;margin-top:.25rem}
</style>`;

/* ══════════════════════════════════════════
   MAIN HANDLER
══════════════════════════════════════════ */
exports.generateBlog = async (req, res) => {
  try {
    const { topic, category = 'IT Tips', tone = 'professional', wordCount = 800 } = req.body;
    if (!topic?.trim()) return res.status(400).json({ message: 'Topic is required' });
    if (!GEMINI_KEY)    return res.status(400).json({ message: 'GEMINI_API_KEY not set in .env' });

    const context = `You are a tech blogger for Coldtech Technologies — IT repair and laptop sales in Pune, India.
Topic: "${topic}" | Category: ${category} | Tone: ${tone} | ~${wordCount} words`;

    /* ── Step 1: title, meta, tags, excerpt (small JSON, safe) ── */
    const metaRaw = await ask(`${context}

Return ONLY this JSON (no markdown, no extra text):
{"title":"SEO title max 60 chars","metaDescription":"150-160 char meta","excerpt":"2-3 sentence summary","tags":["tag1","tag2","tag3","tag4","tag5"]}`);

    let title, metaDescription, excerpt, tags;
    try {
      const clean = metaRaw.slice(metaRaw.indexOf('{'), metaRaw.lastIndexOf('}') + 1);
      const m = JSON.parse(clean);
      title           = m.title           || `Guide to ${topic}`;
      metaDescription = m.metaDescription || '';
      excerpt         = m.excerpt         || '';
      tags            = Array.isArray(m.tags) ? m.tags : [topic, category];
    } catch (_) {
      title           = `Complete Guide to ${topic}`;
      metaDescription = `Learn everything about ${topic} from Coldtech Technologies, Pune's trusted IT experts.`;
      excerpt         = `A comprehensive guide about ${topic} by Coldtech Technologies.`;
      tags            = [topic, category, 'IT Tips', 'Pune'];
    }

    /* ── Step 2: full HTML content (plain text, no JSON wrapper) ── */
    const heroImage = img(`${topic} technology`, 1200, 500);
    const midImage  = img(`${category} computer repair`, 800, 350);

    const htmlRaw = await ask(`${context}

Write the FULL blog post HTML body for the title: "${title}"

Use ONLY these HTML elements: h2, h3, p, ul, ol, li, strong, em, div
Use these exact CSS classes (already defined): tip-box, warning-box, cta-box, cta-btn, tag-row, tag, author-bar, author-avatar, author-name, author-role, stats-row, stat-card, stat-num, stat-label, hero-img, section-img

Start with this EXACT author bar (copy it exactly, do not change it):
<div class="author-bar"><img src="/logo.png" alt="Coldtech" style="width:44px;height:44px;border-radius:50%;object-fit:cover;flex-shrink:0" /><div><div class="author-name">Coldtech Technologies</div><div class="author-role">IT Experts in Pune 📍</div></div></div>
<img src="${heroImage}" alt="${topic}" class="hero-img" />

Then write:
1. Intro paragraph with emojis
2. Tag row: <div class="tag-row"><span class="tag">${tags.slice(0,3).join('</span><span class="tag">')}</span></div>
3. 4-5 sections with h2 headings using emojis (e.g. "🔧 Section Title")
4. Include at least 2 tip-box divs and 1 warning-box div
5. Mid image: <img src="${midImage}" alt="${category}" class="section-img" />
6. Stats: <div class="stats-row"><div class="stat-card"><div class="stat-num">X</div><div class="stat-label">label</div></div>...</div>
7. FAQ section (3 questions, h3 + p)
8. Conclusion
9. End with: <div class="cta-box"><h3>🚀 Need Expert IT Help in Pune?</h3><p>Coldtech Technologies — fast, reliable IT repair with transparent pricing and 30-day warranty.</p><a href="/services/request" class="cta-btn">Book a Free Diagnosis →</a></div>

Return ONLY the HTML. No JSON. No markdown. No explanation. Start directly with <div class="author-bar">`);

    /* ── Assemble final content ── */
    const content = `${CSS}<div class="ct-blog">${htmlRaw}</div>`;

    res.json({
      title,
      slug:            toSlug(title),
      metaDescription,
      excerpt,
      tags,
      content,
      aiGenerated:     true,
    });

  } catch (err) {
    console.error('AI error:', err.message);
    res.status(500).json({ message: err.message || 'AI generation failed' });
  }
};
