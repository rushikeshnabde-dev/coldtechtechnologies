import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCalendar, FiUser, FiEye, FiArrowRight, FiTag, FiClock } from "react-icons/fi";
import { api } from "../services/api";
import { SEO } from "../components/SEO";
import { STATIC_BLOGS } from "../data/staticBlogs";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80";

const CATEGORY_COLORS = {
  Laptop:        { bg: "#EFF6FF", color: "#2563EB" },
  Network:       { bg: "#ECFDF5", color: "#059669" },
  Upgrade:       { bg: "#FFF7ED", color: "#EA580C" },
  "Data Recovery": { bg: "#FEF3C7", color: "#D97706" },
  Security:      { bg: "#FDF4FF", color: "#9333EA" },
  PC:            { bg: "#F0F9FF", color: "#0284C7" },
  General:       { bg: "#F8FAFC", color: "#475569" },
};

function readTime(content = "") {
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function Blog() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [pages,   setPages]   = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get("/blog", { params: { page, limit: 9 } })
      .then(r => {
        const apiPosts = r.data.posts || [];
        setPosts(apiPosts.length > 0 ? apiPosts : STATIC_BLOGS);
        setPages(r.data.pages || 1);
      })
      .catch(() => setPosts(STATIC_BLOGS))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="w-full bg-[var(--color-page)] min-h-screen">
      <SEO
        title="IT Tips, Tech Guides & Insights Blog — Coldtech Technologies Pune"
        description="Read the latest laptop repair tips, data recovery guides, cybersecurity advice, and IT insights from Coldtech Technologies — Pune's trusted IT service provider."
        keywords="IT blog Pune, laptop repair tips, data recovery guide, cybersecurity tips India, tech blog Pune, IT solutions blog, computer repair advice"
        canonical="/blog"
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }]}
        schema={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Coldtech Technologies Blog",
          "description": "IT tips, tech guides, laptop repair advice and cybersecurity insights from Coldtech Technologies, Pune.",
          "url": "https://coldtechtechnologies.in/blog",
          "publisher": {
            "@type": "Organization",
            "name": "Coldtech Technologies",
            "url": "https://coldtechtechnologies.in",
            "logo": { "@type": "ImageObject", "url": "https://coldtechtechnologies.in/og-image.png" },
          },
          "inLanguage": "en-IN",
        }}
      />

      {/* Hero */}
      <div className="py-16 px-6 text-center"
        style={{ background: "linear-gradient(135deg,#1E293B 0%,#0f2744 60%,#1E293B 100%)" }}>
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-widest"
            style={{ background: "rgba(58,182,255,0.15)", color: "#3AB6FF", border: "1px solid rgba(58,182,255,0.3)" }}>
            Resources & Insights
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Blog
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            IT tips, cloud guides, cybersecurity advice, and tech insights from the Coldtech team.
          </p>
        </motion.div>
      </div>

      {/* Grid */}
      <section className="py-14 px-6 md:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white border border-slate-200 overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">📝</p>
              <p className="text-slate-500 text-lg">No posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => {
                const catStyle = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.General;
                return (
                  <motion.article key={post._id}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="group rounded-2xl bg-white border border-slate-200 overflow-hidden flex flex-col"
                    style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>

                    {/* Cover image */}
                    <Link to={`/blog/${post.slug}`} className="block relative overflow-hidden h-48 bg-slate-100 flex-shrink-0">
                      <img
                        src={post.coverImage || PLACEHOLDER_IMG}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={e => { e.target.src = PLACEHOLDER_IMG; }}
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Read now pill on hover */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="flex items-center gap-1.5 bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          Read Article <FiArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>

                    <div className="p-5 flex flex-col flex-1">
                      {/* Category + read time */}
                      <div className="flex items-center justify-between mb-3">
                        {post.category && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                            style={{ background: catStyle.bg, color: catStyle.color }}>
                            <FiTag className="w-3 h-3" /> {post.category}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <FiClock className="w-3 h-3" /> {readTime(post.content || post.excerpt)}
                        </span>
                      </div>

                      {/* Title */}
                      <Link to={`/blog/${post.slug}`}>
                        <h2 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-sky-600 transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                      </Link>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Meta row */}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <FiCalendar className="w-3 h-3" /> {fmtDate(post.createdAt)}
                          </span>
                          {post.views > 0 && (
                            <span className="flex items-center gap-1">
                              <FiEye className="w-3 h-3" /> {post.views.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <Link to={`/blog/${post.slug}`}
                          className="flex items-center gap-1 text-xs font-bold text-sky-500 hover:text-sky-700 transition-colors">
                          Read <FiArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:border-sky-400 disabled:opacity-40 transition bg-white">
                ← Prev
              </button>
              {Array.from({ length: pages }, (_, i) => (
                <button key={i + 1} onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition ${page === i + 1 ? "bg-sky-500 text-white" : "border border-slate-200 text-slate-600 hover:border-sky-400 bg-white"}`}>
                  {i + 1}
                </button>
              ))}
              <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:border-sky-400 disabled:opacity-40 transition bg-white">
                Next →
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
