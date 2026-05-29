# Coldtech Technologies — Full Stack App

## Quick Start (Local Dev)

```bash
# Install all dependencies
npm install          # root
cd server && npm install
cd client && npm install

# Start backend (port 5000)
cd server && npm run dev

# Start frontend (port 5173)
cd client && npm run dev
```

## Environment Setup

### Server (`server/.env`)
Copy `server/.env.example` → `server/.env` and fill in:

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `USE_IN_MEMORY_DB` | `true` for local dev (no MongoDB needed), `false` for production |
| `MONGODB_URI` | MongoDB Atlas connection string for production |
| `JWT_SECRET` | **Long random string** — generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `CLIENT_URL` | Your frontend URL (e.g. `https://coldtech.com`) |
| `ADMIN_EMAIL` | First admin account email |
| `ADMIN_PASSWORD` | First admin account password |

### Client (`client/.env`)
Copy `client/.env.example` → `client/.env`:

```
VITE_API_URL=https://api.yourdomain.com/api
```

## Production Deployment

### Backend (Node.js)
```bash
cd server
NODE_ENV=production npm start
```

Recommended: Deploy to **Railway**, **Render**, or **Fly.io**
- Set all env vars in the platform dashboard
- Set `USE_IN_MEMORY_DB=false`
- Set `MONGODB_URI` to your Atlas connection string
- Set `NODE_ENV=production`

### Frontend (React/Vite)
```bash
cd client
npm run build   # outputs to client/dist/
```

Deploy `client/dist/` to **Vercel**, **Netlify**, or **Cloudflare Pages**
- Set `VITE_API_URL` to your backend URL

## Security Checklist Before Deploy

- [ ] Change `JWT_SECRET` to a long random string
- [ ] Change `ADMIN_PASSWORD` to a strong password
- [ ] Set `USE_IN_MEMORY_DB=false`
- [ ] Set `NODE_ENV=production`
- [ ] Set `CLIENT_URL` to your exact frontend domain
- [ ] Set `MONGODB_URI` to Atlas (not localhost)
- [ ] Ensure `.env` is in `.gitignore` (it is)

## API Routes Summary

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | User | Get profile |
| GET | `/api/products` | Public | List products |
| GET | `/api/products/:id` | Public | Product detail |
| POST | `/api/orders` | User | Place order |
| GET | `/api/orders/mine` | User | My orders |
| POST | `/api/services` | Optional | Submit service request |
| GET | `/api/services/track/:ticketId` | Public | Track ticket |
| GET | `/api/offers/today` | Public | Today's active offer |
| GET | `/api/admin/*` | Admin only | Admin panel APIs |
| GET | `/api/staff/my-orders` | Staff only | Staff assigned orders |
| GET | `/api/health` | Public | Health check |
