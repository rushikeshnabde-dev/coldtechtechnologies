import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import {
  FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff,
  FiX, FiSave, FiExternalLink,
} from 'react-icons/fi';

const EMPTY = {
  title: '', slug: '', excerpt: '', content: '',
  coverImage: '', category: 'General', tags: '', published: false,
};

const CATEGORIES = ['General', 'IT Tips', 'Cybersecurity', 'Cloud', 'Networking', 'Hardware', 'News'];

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function AdminBlog() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);   // 'create' | 'edit' | false
  const [form,    setForm]    = useState(EMPTY);
  const [editId,  setEditId]  = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/admin/blog')
      .then(r => setPosts(r.data.posts || []))
      .catch(() => toast.error('Failed to load posts'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Auto-generate slug from title
  const handleTitleChange = (val) => {
    set('title', val);
    if (!editId) {
      set('slug', val.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-'));
    }
  };

  function openCreate() {
    setForm(EMPTY);
    setEditId(null);
    setModal('create');
  }

  function openEdit(post) {
    setForm({
      title:      post.title,
      slug:       post.slug,
      excerpt:    post.excerpt || '',
      content:    post.content || '',
      coverImage: post.coverImage || '',
      category:   post.category || 'General',
      tags:       (post.tags || []).join(', '),
      published:  post.published,
    });
    setEditId(post._id);
    setModal('edit');
  }

  async function save() {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    try {
      if (editId) {
        await api.put(`/admin/blog/${editId}`, payload);
        toast.success('Post updated');
      } else {
        await api.post('/admin/blog', payload);
        toast.success('Post created');
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(post) {
    try {
      await api.put(`/admin/blog/${post._id}`, { published: !post.published });
      toast.success(post.published ? 'Post unpublished' : 'Post published');
      load();
    } catch {
      toast.error('Failed to update');
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/blog/${id}`);
      toast.success('Post deleted');
      load();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Blog Posts</h1>
          <p className="text-sm text-slate-500 mt-0.5">{posts.length} total posts</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg,#3AB6FF,#2B0FA8)' }}>
          <FiPlus className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#3AB6FF]/30 border-t-[#3AB6FF] rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-4xl mb-3">📝</p>
          <p>No posts yet. Create your first blog post!</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Date</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Views</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr key={post._id}
                  className={`border-t border-white/5 hover:bg-white/3 transition ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white line-clamp-1">{post.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-400">{post.category}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-slate-400">{fmtDate(post.createdAt)}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-slate-400">{post.views || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${post.published ? 'bg-green-500/15 text-green-400' : 'bg-slate-500/15 text-slate-400'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => togglePublish(post)} title={post.published ? 'Unpublish' : 'Publish'}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition">
                        {post.published ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" title="View post"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-400 hover:bg-sky-400/10 transition">
                        <FiExternalLink className="w-4 h-4" />
                      </a>
                      <button onClick={() => openEdit(post)} title="Edit"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#3AB6FF] hover:bg-[#3AB6FF]/10 transition">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => remove(post._id)} disabled={deleting === post._id} title="Delete"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition disabled:opacity-40">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ scale: .95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .95, opacity: 0 }}
              className="w-full max-w-3xl rounded-2xl border border-white/10 shadow-2xl"
              style={{ background: '#0D1220' }}>

              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <h2 className="font-bold text-white">{modal === 'edit' ? 'Edit Post' : 'New Blog Post'}</h2>
                <button onClick={() => setModal(false)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">Title *</label>
                    <input value={form.title} onChange={e => handleTitleChange(e.target.value)}
                      placeholder="Post title"
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-[#3AB6FF] transition" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">Slug</label>
                    <input value={form.slug} onChange={e => set('slug', e.target.value)}
                      placeholder="auto-generated-from-title"
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-slate-400 bg-white/5 border border-white/10 focus:outline-none focus:border-[#3AB6FF] transition font-mono" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">Category</label>
                    <select value={form.category} onChange={e => set('category', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-[#3AB6FF] transition">
                      {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#0D1220' }}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">Cover Image URL</label>
                    <input value={form.coverImage} onChange={e => set('coverImage', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-[#3AB6FF] transition" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Excerpt (short summary)</label>
                  <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
                    rows={2} placeholder="Brief description shown on the blog listing page..."
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-[#3AB6FF] transition resize-none" />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                    Content * <span className="font-normal text-slate-500">(HTML supported)</span>
                  </label>
                  <textarea value={form.content} onChange={e => set('content', e.target.value)}
                    rows={14} placeholder="Write your blog post content here. HTML tags like <h2>, <p>, <ul>, <strong> are supported."
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-[#3AB6FF] transition resize-y font-mono" />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Tags (comma separated)</label>
                  <input value={form.tags} onChange={e => set('tags', e.target.value)}
                    placeholder="IT, cloud, security, Pune"
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-[#3AB6FF] transition" />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => set('published', !form.published)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${form.published ? 'bg-green-500' : 'bg-white/10'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.published ? 'left-6' : 'left-1'}`} />
                  </div>
                  <span className="text-sm text-slate-300 font-medium">
                    {form.published ? 'Published (visible to public)' : 'Draft (hidden from public)'}
                  </span>
                </label>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
                <button onClick={() => setModal(false)}
                  className="px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition">
                  Cancel
                </button>
                <button onClick={save} disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60 transition"
                  style={{ background: 'linear-gradient(135deg,#3AB6FF,#2B0FA8)' }}>
                  {saving
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <FiSave className="w-4 h-4" />}
                  {saving ? 'Saving…' : modal === 'edit' ? 'Update Post' : 'Publish Post'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
