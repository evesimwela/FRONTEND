# Asthma Prediction — Frontend

React single-page application for the Asthma Prediction system. Provides patient-facing health forms, risk visualization, prediction history, and an admin dashboard.

## Tech Stack

- **React 19** with Vite 7
- **Tailwind CSS 4** for styling
- **React Router 7** for client-side routing
- **Recharts 3** for data visualization (line charts, pie charts, bar charts)
- **Axios** for HTTP requests with JWT interceptor

## Getting Started

### Prerequisites

- Node.js (v18+)
- Backend server running on `http://localhost:5000`

### Installation

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173`. API requests to `/api` are proxied to the backend via Vite's dev server.

### Build for Production

```bash
npm run build
npm run preview
```

The production build outputs to `dist/`.

## Project Structure

```
src/
├── main.jsx                    # App entry point with router + auth provider
├── App.jsx                     # Route definitions
├── index.css                   # Tailwind directives
├── api/
│   └── axios.js                # Axios instance with JWT interceptor (auto-attaches
│                                 Bearer token, redirects to /login on 401)
├── context/
│   └── AuthContext.jsx          # Authentication state (user, token, login/logout)
├── components/
│   ├── Navbar.jsx               # Top navigation bar
│   ├── ProtectedRoute.jsx       # Redirects unauthenticated users to /login
│   ├── AdminRoute.jsx           # Restricts access to admin-role users
│   ├── PredictionForm.jsx       # 20-field health assessment form (4 sections)
│   ├── RiskGauge.jsx            # Visual risk level display
│   ├── RecommendationCard.jsx   # Displays a single recommendation
│   └── StatsCard.jsx            # Metric card for dashboards
└── pages/
    ├── LandingPage.jsx          # Public landing page
    ├── LoginPage.jsx            # Login form
    ├── RegisterPage.jsx         # Registration form
    ├── PredictPage.jsx          # Health form + prediction result with risk gauge
    ├── DashboardPage.jsx        # Stats cards, risk-over-time chart, history table
    ├── ResultPage.jsx           # Single prediction detail view
    ├── ProfilePage.jsx          # User profile page
    └── AdminDashboardPage.jsx   # System stats, charts, user & prediction management
```

## Pages & Routes

| Route | Component | Auth | Description |
|-------|-----------|------|-------------|
| `/` | LandingPage | No | Public landing page |
| `/login` | LoginPage | No | User login |
| `/register` | RegisterPage | No | User registration |
| `/predict` | PredictPage | Required | Submit health data for asthma prediction |
| `/dashboard` | DashboardPage | Required | View prediction history and trends |
| `/result/:id` | ResultPage | Required | View a single prediction in detail |
| `/profile` | ProfilePage | Required | User profile |
| `/admin` | AdminDashboardPage | Admin | System analytics, user & prediction management |

## Authentication

Authentication uses JWT tokens stored in `localStorage`. The Axios interceptor in `api/axios.js`:
- Attaches `Authorization: Bearer <token>` to every request
- On 401 responses, clears stored credentials and redirects to `/login`

## API Proxy

During development, Vite proxies all `/api` requests to `http://localhost:5000` (configured in `vite.config.js`). In production, configure your web server (e.g., Nginx) to proxy `/api` to the backend.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
