const DEFAULT_API = 'https://coldtechtechnologies.onrender.com/api';

/**
 * Axios "Network Error" / ERR_NETWORK means no response reached the browser.
 * Common causes: API not listening, wrong base URL, CORS, firewall, or server
 * exiting immediately (e.g. MongoDB not running).
 */
export function describeAxiosNetworkFailure(err) {
  const base = import.meta.env.VITE_API_URL || DEFAULT_API;
  if (err?.response) return null;

  const isNetwork =
    err?.code === 'ERR_NETWORK' ||
    err?.message === 'Network Error' ||
    err?.message?.includes('Network Error');

  if (!isNetwork) return null;

  return `No response from ${base}. Check: API is running (server folder: npm run dev), MongoDB is running (server needs it to stay up), and VITE_API_URL matches that server — restart Vite after changing client/.env.`;
}
