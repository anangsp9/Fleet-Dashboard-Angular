# Fleet Dashboard - Monorepo

Real-time fleet management and logistics optimization platform.

## 📁 Project Structure

```
fleet-dashboard/
├── backend/          # Express.js REST API server
│   ├── src/
│   ├── package.json
│   └── README.md
├── frontend/         # Angular 17 web application
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── README.md
└── package.json      # Root monorepo scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Install all dependencies (backend + frontend)
npm run install:all
```

### Development

Run backend and frontend simultaneously:

```bash
# Terminal 1: Run backend API (port 3001)
npm run backend

# Terminal 2: Run frontend (port 4200)
npm run frontend
```

Or run both in one command:

```bash
npm run dev
```

### Build

```bash
# Build frontend + backend
npm run build

# Build frontend only
npm run build:frontend

# Build backend only
npm run build:backend
```

## 📚 Project Details

### Backend
- **Framework**: Express.js
- **Language**: JavaScript/Node.js
- **Port**: 3001
- **API**: REST endpoints
- **Location**: `backend/` folder

**See**: `backend/README.md` for detailed backend documentation

### Frontend
- **Framework**: Angular 17
- **Language**: TypeScript
- **Port**: 4200
- **Styling**: Tailwind CSS
- **Build Tool**: Webpack (via ng-cli)
- **Location**: `frontend/` folder

**See**: `frontend/README.md` for detailed frontend documentation

## 🔧 Available Scripts

### Root Level (Monorepo)

```bash
npm run install:all      # Install all dependencies
npm run backend          # Run backend server
npm run frontend         # Run frontend app
npm run dev              # Run both simultaneously (requires concurrently)
npm run build            # Build both backend & frontend
npm run build:backend    # Build backend only
npm run build:frontend   # Build frontend only
```

### Frontend Scripts (from `frontend/` folder)

```bash
npm start                # Run dev server
npm run build            # Production build
npm run test             # Run tests
npm run lint             # Run linter
```

### Backend Scripts (from `backend/` folder)

```bash
npm start                # Run server
npm run dev              # Run with nodemon
npm run build            # Build project (if applicable)
```

## 🌐 API Configuration

### Frontend to Backend Connection

Frontend is configured to connect to backend API at:
```
http://localhost:3001/api
```

To change the API baseURL, edit:
- `frontend/src/environments/environment.ts` (development)
- `frontend/src/environments/environment.prod.ts` (production)

### CORS

Backend has CORS enabled for frontend requests from `http://localhost:4200`

## 📦 Features

### Dashboard
- Real-time fleet overview
- KPI metrics (vehicles, trips, drivers, alerts)
- Active trips monitoring
- Fleet performance metrics

### Fleet Management
- Vehicle inventory
- Status tracking
- Fuel levels
- Search & filtering

### Live Tracking
- Interactive map
- Real-time vehicle markers
- Trip details
- Route information

### Trip Management
- Trip list with filters
- ETA predictions
- Overload warnings
- Status tracking

### Telemetry
- Real-time metrics
- Speed, fuel, engine monitoring
- Tire pressure tracking
- Historical data

### Reports & Analytics
- KPI dashboards
- Trip distribution
- Fleet utilization
- Performance trends

## 🎨 Design Features

- **Modern Professional UI**: Enterprise-grade dashboard design
- **Dark/Light Mode**: Toggle between themes with localStorage persistence
- **Amber Theme**: Consistent branding with amber accent color (#f59e0b)
- **Mobile Responsive**: Mobile-first design with responsive hamburger menu
- **Accessibility**: WCAG AA compliant with proper contrast & keyboard navigation

## 🛠️ Development Workflow

1. **Clone & Setup**
   ```bash
   git clone <repo-url>
   cd fleet-dashboard
   npm run install:all
   ```

2. **Start Development**
   ```bash
   # Terminal 1
   npm run backend
   
   # Terminal 2
   npm run frontend
   ```

3. **Open in Browser**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3001/api

4. **Login Credentials** (Demo)
   - Email: `admin@fleet.com`
   - Password: `admin123`

## 📝 Git Workflow

### Adding Files
```bash
git add .
git commit -m "feat: description of changes"
git push origin main
```

### Ignored Files (Auto-excluded)
- `backend/node_modules/`
- `frontend/node_modules/`
- `frontend/dist/`
- `backend/dist/`
- `.env` files
- IDE configs (.vscode, .idea)

## 🔍 Troubleshooting

### Frontend Build Issues
```bash
cd frontend
npm install --legacy-peer-deps
npm run build
```

### Backend Port Already in Use
```bash
# Change port in backend/.env or backend/src/server.js
# Default: 3001
```

### CORS Errors
- Ensure backend has CORS middleware enabled
- Check frontend API baseURL matches backend URL

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 📚 Additional Resources

- **Frontend README**: `frontend/README.md`
- **Backend README**: `backend/README.md`
- **Design System**: `DESIGN.md`
- **Product Context**: `PRODUCT.md`

## 📄 License

MIT License - See LICENSE file for details

## 👤 Author

Fleet Dashboard Development Team

---

**Last Updated**: September 18, 2026
