# Webapp Backend

Backend per l'applicazione web - gestisce autenticazione locale e utenti.

## Features

- ✅ Autenticazione JWT
- ✅ Login/Logout
- ✅ Token refresh
- ✅ User management
- ✅ Role-based access control
- ✅ In-memory user storage

## Setup

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build
npm start
```

## Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login con username e password
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout

### Example Login Request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Environment Variables

Configura le variabili in `.env`:

```env
PORT=5000
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## Architecture

```
Frontend (:3001)
    ↓
Webapp Backend (:5000) ← Questo server
    ↓
Proxy (:4000)
    ↓
Also/TDSynnex/Trend APIs
```

## Development

Il server usa in-memory storage per gli utenti. In produzione, sostituire con un database reale (PostgreSQL, MySQL, MongoDB, etc.).
