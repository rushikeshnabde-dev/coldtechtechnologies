const API = (import.meta.env.VITE_API_URL || 'https://coldtechtechnologies.onrender.com').replace(/\/api\/?$/, '');

const PLACEHOLDER =
  'https://placehold.co/600x400/0f172a/00f5ff?text=Coldtech';

export function assetUrl(path) {
  if (!path) return PLACEHOLDER;
  if (path.startsWith('http')) return path;
  return `${API.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}
