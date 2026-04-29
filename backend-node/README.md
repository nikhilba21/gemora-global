# Gemora Global — Node.js Backend

Complete REST API replacement for the original Motoko/ICP backend.

## 📁 Project Structure

```
gemora-backend/
├── src/
│   ├── index.js              # Main Express server
│   ├── db/
│   │   └── database.js       # SQLite setup + seed data
│   ├── middleware/
│   │   └── auth.js           # JWT auth middleware
│   └── routes/
│       ├── auth.js           # Admin login/logout
│       ├── categories.js     # Product categories
│       ├── products.js       # Products CRUD
│       ├── inquiries.js      # Customer inquiries
│       ├── gallery.js        # Gallery items
│       ├── testimonials.js   # Testimonials
│       ├── blog.js           # Blog posts
│       ├── catalogues.js     # PDF catalogues
│       ├── content.js        # CMS content (key-value)
│       └── dashboard.js      # Admin stats
├── api.ts                    # Frontend TypeScript client (copy to frontend/src/)
├── render.yaml               # Render.com deployment config
├── package.json
├── .env.example
└── .gitignore
```

---

## 🚀 Deployment Guide

### Step 1: Deploy Backend on Render

1. **Create a new GitHub repository** (e.g., `gemora-backend`) and push this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial backend"
   git remote add origin https://github.com/YOUR_USERNAME/gemora-backend.git
   git push -u origin main
   ```

2. **Go to [render.com](https://render.com)** → New → Web Service

3. **Connect your GitHub repo** `gemora-backend`

4. **Set these settings:**
   - Name: `gemora-global-api`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `node src/index.js`

5. **Add a Persistent Disk** (IMPORTANT for SQLite):
   - Name: `gemora-db`
   - Mount Path: `/opt/render/project/src`
   - Size: `1 GB`

6. **Set Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3000
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=Gemora@2024
   JWT_SECRET=<generate a random 64-char string>
   FRONTEND_URL=https://YOUR-VERCEL-APP.vercel.app
   DATABASE_PATH=/opt/render/project/src/gemora.db
   ```

7. **Deploy!** Your API URL will be: `https://gemora-global-api.onrender.com`

---

### Step 2: Update Frontend to Use New API

1. **Copy `api.ts`** to `src/frontend/src/api.ts` in your main repo

2. **Set Vercel environment variable:**
   ```
   VITE_API_URL=https://gemora-global-api.onrender.com
   ```

3. **Update frontend imports** — anywhere the frontend imports from `./backend` or `./backend.ts`, 
   replace with imports from `./api`:
   
   **Old:**
   ```ts
   import { backend } from './backend';
   await backend.getCategories();
   ```
   
   **New:**
   ```ts
   import { categories } from './api';
   await categories.getAll();
   ```

4. **Admin Login** — update `AdminLogin.tsx` to use:
   ```ts
   import { auth } from '../api';
   const success = await auth.verifyAdminLogin(username, password);
   ```

---

### Step 3: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import `gemora-global` GitHub repo
3. **Configure:**
   - Root Directory: `src/frontend`
   - Build Command: `pnpm run build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`
4. **Add Environment Variable:**
   ```
   VITE_API_URL=https://gemora-global-api.onrender.com
   ```
5. Deploy! ✅

---

## 🔌 API Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | All categories |
| GET | `/api/products` | All products (supports `?categoryId=1&page=0&pageSize=20`) |
| GET | `/api/products/featured` | Featured products |
| GET | `/api/products/new-arrivals` | New arrival products |
| GET | `/api/products/:id` | Single product by ID or slug |
| GET | `/api/testimonials` | Active testimonials |
| GET | `/api/blog?status=Published` | Published blog posts |
| GET | `/api/blog/:slug` | Single blog post |
| GET | `/api/gallery` | Gallery items |
| GET | `/api/catalogues` | PDF catalogues |
| GET | `/api/content/:key` | Single content entry |
| GET | `/api/content/page/:pageId` | All content for a page |
| POST | `/api/inquiries` | Submit inquiry |

### Admin Endpoints (Require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login → returns JWT |
| GET | `/api/auth/verify` | Verify token |
| POST | `/api/auth/change-credentials` | Change admin username/password |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| POST/PUT/DELETE | `/api/categories/:id` | Manage categories |
| POST/PUT/DELETE | `/api/products/:id` | Manage products |
| GET/PATCH/DELETE | `/api/inquiries/:id` | Manage inquiries |
| POST/PUT/DELETE | `/api/gallery/:id` | Manage gallery |
| POST/PUT/DELETE | `/api/testimonials/:id` | Manage testimonials |
| POST/PUT/DELETE | `/api/blog/:id` | Manage blog posts |
| POST/DELETE | `/api/catalogues/:id` | Manage catalogues |
| POST | `/api/content` | Set content key |
| POST | `/api/content/page` | Set page content fields |

---

## 🔑 Default Admin Credentials

```
Username: admin
Password: Gemora@2024
```

**Change these immediately** after first login via Admin → Settings panel.

---

## 🛠 Local Development

```bash
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev
```

Server starts at `http://localhost:3000`
