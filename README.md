# D-Table Analytics — Inventory Management System

A full-stack MERN inventory management system built as an assessment submission for D-Table Analytics. Features JWT-based authentication, role-based access control, real-time stock tracking, and a responsive React dashboard.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, Vite, Redux Toolkit, RTK Query, Tailwind CSS |
| Backend    | Node.js, Express.js                             |
| Database   | MongoDB Atlas (Mongoose)                        |
| Auth       | JWT (JSON Web Tokens), bcryptjs                 |
| Deployment | Render (backend), Vercel (frontend)             |

---

## Local Setup Instructions

### Prerequisites
- Node.js >= 18
- npm >= 9

### 1. Clone the Repository

```bash
git clone https://github.com/Smart-vision1/dtable-inventory.git
cd dtable-inventory
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Variables

The `.env` files are pre-configured for development. For production, copy the examples:

```bash
# Server
cp server/.env.example server/.env

# Client
cp client/.env.example client/.env
```

Edit the files with your values:

**server/.env**
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/dtable-inventory
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api/v1
```

### 4. Seed the Database

```bash
cd server
node seed.js
```

This creates:
- **Admin** user: `admin` / `admin123`
- **Viewer** user: `viewer` / `viewer123`
- 8 sample products across Electronics, Stationery, and Packaging categories

### 5. Run the Application

**Start the backend** (from `/server`):
```bash
npm run dev
```

**Start the frontend** (from `/client`):
```bash
npm run dev
```

- Backend runs on: `http://localhost:5000`
- Frontend runs on: `http://localhost:3000`

---

## API Overview

| Method | Endpoint                     | Auth Required | Role     | Description                  |
|--------|------------------------------|---------------|----------|------------------------------|
| GET    | /api/v1/health               | No            | —        | Health check                 |
| POST   | /api/v1/auth/register        | No            | —        | Register a new user          |
| POST   | /api/v1/auth/login           | No            | —        | Login and receive JWT        |
| GET    | /api/v1/products             | Yes           | Any      | List products (paginated)    |
| POST   | /api/v1/products             | Yes           | Admin    | Create a new product         |
| PUT    | /api/v1/products/:id         | Yes           | Admin    | Update an existing product   |
| DELETE | /api/v1/products/:id         | Yes           | Admin    | Delete a product             |
| GET    | /api/v1/movements            | Yes           | Any      | List stock movements         |
| POST   | /api/v1/movements            | Yes           | Admin    | Record a stock movement      |
| GET    | /api/v1/dashboard            | Yes           | Any      | Get dashboard summary        |

---

## Live Demo

| Service  | URL                                                        |
|----------|------------------------------------------------------------|
| Backend  | https://dtable-inventory.onrender.com                      |
| Frontend | https://dtable-inventory.vercel.app                        |

> **Note:** The backend is hosted on Render's free tier and may take 30–60 seconds to wake up on first request (cold start).

---

## Assumptions

1. **Single-tenant system**: The application is designed for a single organization. Multi-tenant isolation is not implemented.
2. **SKU immutability**: Once a product SKU is created, it cannot be changed. SKUs serve as permanent unique identifiers.
3. **Admin-only mutations**: All create, update, and delete operations (including stock movements) are restricted to Admin users. Viewers have read-only access.
4. **Stock floor at zero**: The system prevents stock levels from dropping below zero. An OUT movement that would result in negative quantity is rejected with a 400 error.
5. **Password hashing on write**: User passwords are hashed with bcryptjs (10 salt rounds) before storage. Plain-text passwords are never persisted.

---

## Trade-offs

1. **JWT over sessions**: Stateless JWTs eliminate the need for a session store, simplifying horizontal scaling. The trade-off is that token revocation requires expiry (24h) rather than immediate invalidation.
2. **RTK Query over custom hooks**: RTK Query provides automatic caching, de-duplication, and tag-based invalidation out of the box. The trade-off is a larger Redux bundle and a learning curve for developers new to the pattern.
3. **Pagination over infinite scroll**: Server-side pagination keeps initial page loads fast regardless of dataset size. The trade-off is that the user must explicitly navigate pages rather than scrolling continuously.
4. **MongoDB over SQL**: MongoDB's flexible schema accelerates iteration during development and naturally fits the document-style product/movement model. The trade-off is weaker relational integrity compared to a SQL database with foreign keys.

---

## Known Limitations

- **Cold start delay**: The backend on Render's free tier spins down after 15 minutes of inactivity. The first request after sleep may take 30–60 seconds.
- **No automated tests**: The current implementation has no unit or integration tests. This was a deliberate trade-off given the assessment timeline.
- **No refresh tokens**: JWT tokens expire after 24 hours with no silent refresh. Users must log in again after expiry.
- **No file uploads**: Product images are not supported in this version.

---

## Project Structure

```
dtable-inventory/
├── server/           # Express + Mongoose API
│   ├── config/       # Database connection
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Auth + role guards
│   ├── models/       # Mongoose schemas
│   ├── routes/       # Express routers
│   ├── seed.js       # Database seeder
│   └── server.js     # Entry point
│
└── client/           # React + Vite SPA
    └── src/
        ├── app/          # Redux store
        ├── features/     # Redux slices + RTK Query APIs
        ├── components/   # Reusable UI components
        └── pages/        # Route-level page components
```

---

*Built for D-Table Analytics Assessment — April 2026*
