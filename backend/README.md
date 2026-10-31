# Fleet Dashboard Backend

Backend API untuk Enterprise Logistics & Fleet Monitoring Dashboard

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Auth**: JWT (JSON Web Token)
- **Real-time**: Socket.io

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
Buat database PostgreSQL bernama `fleet_dashboard`, lalu update `.env` sesuai konfigurasi:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fleet_dashboard
DB_USER=postgres
DB_PASSWORD=postgres
```

### 3. Seed Data
```bash
npm run seed
```

### 4. Run Server
```bash
# Development
npm run dev

# Production
npm start
```

Server akan berjalan di `http://localhost:3000`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user baru |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get user profile |

### Vehicles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vehicles` | Get all vehicles |
| GET | `/api/vehicles/:id` | Get vehicle by ID |
| POST | `/api/vehicles` | Create vehicle |
| PUT | `/api/vehicles/:id` | Update vehicle |
| DELETE | `/api/vehicles/:id` | Delete vehicle |
| PATCH | `/api/vehicles/:id/status` | Update vehicle status |

### Drivers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/drivers` | Get all drivers |
| GET | `/api/drivers/:id` | Get driver by ID |
| POST | `/api/drivers` | Create driver |
| PUT | `/api/drivers/:id` | Update driver |
| DELETE | `/api/drivers/:id` | Delete driver |

### Trips
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trips` | Get all trips |
| GET | `/api/trips/active` | Get active trips |
| GET | `/api/trips/:id` | Get trip by ID |
| POST | `/api/trips` | Create trip |
| PATCH | `/api/trips/:id/status` | Update trip status |
| DELETE | `/api/trips/:id` | Delete trip |

### Telemetry
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/telemetry` | Get all telemetry |
| GET | `/api/telemetry/trip/:tripId` | Get telemetry by trip |
| GET | `/api/telemetry/vehicle/:vehicleId` | Get latest by vehicle |
| POST | `/api/telemetry` | Create telemetry |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics |
| GET | `/api/dashboard/fleet-status` | Get fleet status breakdown |
| GET | `/api/dashboard/recent-activity` | Get recent activity |

## Login Credentials
```
Email: admin@fleet.com
Password: admin123
```
