import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCalendar, FiUser, FiEye, FiArrowLeft, FiTag } from "react-icons/fi";
import { api } from "../services/api";
import { SEO } from "../components/SEO";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80";

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export function BlogPost() {
  const { slug }          = useParams();
  const navigate          = useNavigate();
  const [post, setPost]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/blog/${slug}`)
      .then(r => setPost(r.data.post))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
    </div>
  );

  if (error || !post) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-5xl">📄</p>
      <p className="text-slate-600 text-lg">Post not found.</p>
      <Link to="/blog" className="btn-cyan text-sm px-5 py-2">← Back to Blog</Link>
    </div>
  );

  return (
    <div className="w-full bg-[var(--color-page)] min-h-screen">
      <SEO
        title={post.title}
        description={post.excerpt || post.title}
        canonical={`/blog/${post.slug}`}
        ogType="article"
        ogImage={post.coverImage || PLACEHOLDER_IMG}
      />

      {/* Cover */}
      <div className="w-full h-64 md:h-96 overflow-hidden bg-slate-200">
        <img
          src={post.coverImage || PLACEHOLDER_IMG}
          alt={post.title}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = PLACEHOLDER_IMG; }}
        />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-sky-600 transition mb-6">
          <FiArrowLeft className="w-4 h-4" /> Back to Blog
        </button>

        {/* Category */}
        {post.category && (
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ background: "rgba(58,182,255,0.1)", color: "#3AB6FF" }}>
            <FiTag className="w-3 h-3" /> {post.category}
          </span>
        )}

        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4"
          style={{ fontFamily: "var(--font-display)" }}>
          {post.title}
        </motion.h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-8 pb-6 border-b border-slate-200">
          <span className="flex items-center gap-1.5">
            <FiCalendar className="w-4 h-4" /> {fmtDate(post.createdAt)}
          </span>
          {post.author?.name && (
            <span className="flex items-center gap-1.5">
              <FiUser className="w-4 h-4" /> {post.author.name}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <FiEye className="w-4 h-4" /> {post.views} views
          </span>
        </div>

        {/* Body — render HTML content */}
        <div
          className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
          style={{ fontSize: "1rem", lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-slate-200">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-10">
          <Link to="/blog" className="btn-cyan inline-flex items-center gap-2 text-sm px-5 py-2.5">
            <FiArrowLeft className="w-4 h-4" /> All Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
