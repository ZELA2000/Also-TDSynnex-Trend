# Unified API Platform - Setup Guide

## 📋 Architecture Overview

This platform integrates multiple vendor APIs (Also, TDSynnex, Trend Vision One) through a unified proxy and provides a web-based dashboard for management.

### Services and Ports

| Service | Port | Description |
|---------|------|-------------|
| **Also Backend** | 3001 | Also Marketplace API wrapper |
| **TDSynnex Backend** | 3002 | TDSynnex Ion API wrapper |
| **Trend Backend** | 3003 | Trend Vision One API wrapper |
| **Proxy Backend** | 4000 | Unified API aggregator |
| **WebAPP Backend** | 5000 | Authentication & user management |
| **WebAPP Frontend** | 3000 | Next.js web dashboard |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### 1. Install All Dependencies

```powershell
# Also Backend
cd Also/backend
npm install

# TDSynnex Backend
cd ../../TDSynnex/backend
npm install

# Trend Backend
cd ../../Trend/backend
npm install

# Proxy Backend
cd ../../Proxy/backend
npm install

# WebAPP Backend
cd ../../WebAPP/backend
npm install

# WebAPP Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Each service needs a `.env` file. Copy from `.env.example`:

```powershell
# Also Backend
cd Also/backend
Copy-Item .env.example .env

# TDSynnex Backend
cd ../../TDSynnex/backend
Copy-Item .env.example .env

# Trend Backend
cd ../../Trend/backend
Copy-Item .env.example .env

# Proxy Backend
cd ../../Proxy/backend
Copy-Item .env.example .env

# WebAPP Backend
cd ../../WebAPP/backend
Copy-Item .env.example .env

# WebAPP Frontend
cd ../frontend
Copy-Item .env.example .env.local
```

**Demo Mode**: The default `.env` files contain placeholder credentials that allow the services to run without real API access. API calls will fail gracefully, but the application structure works.

**Production**: Update the `.env` files with real credentials:
- Also: Get credentials from Also Marketplace
- TDSynnex: Get credentials from TDSynnex Ion platform
- Trend: Get API key from Trend Vision One console

### 3. Start All Services

**Option A: Manual Start (Individual Terminals)**

```powershell
# Terminal 1 - Also Backend
cd Also/backend
npm run dev

# Terminal 2 - TDSynnex Backend
cd TDSynnex/backend
npm run dev

# Terminal 3 - Trend Backend
cd Trend/backend
npm run dev

# Terminal 4 - Proxy Backend
cd Proxy/backend
npm run dev

# Terminal 5 - WebAPP Backend
cd WebAPP/backend
npm run dev

# Terminal 6 - WebAPP Frontend
cd WebAPP/frontend
npm run dev
```

**Option B: PowerShell Background Jobs**

```powershell
Start-Job -ScriptBlock { Set-Location "C:\GITHUB\Also\backend"; npm run dev } -Name "Also"
Start-Job -ScriptBlock { Set-Location "C:\GITHUB\TDSynnex\backend"; npm run dev } -Name "TDSynnex"
Start-Job -ScriptBlock { Set-Location "C:\GITHUB\Trend\backend"; npm run dev } -Name "Trend"
Start-Job -ScriptBlock { Set-Location "C:\GITHUB\Proxy\backend"; npm run dev } -Name "Proxy"
Start-Job -ScriptBlock { Set-Location "C:\GITHUB\WebAPP\backend"; npm run dev } -Name "WebApp-Backend"
Start-Job -ScriptBlock { Set-Location "C:\GITHUB\WebAPP\frontend"; npm run dev } -Name "WebApp-Frontend"

# Check status
Get-Job

# Stop all services
Get-Job | Stop-Job; Get-Job | Remove-Job
```

### 4. Access the Application

Open your browser and navigate to:

**🌐 http://localhost:3000**

**Default Login Credentials:**
- Username: `admin`
- Password: `admin123`

## 📚 Service Details

### Also Backend (Port 3001)

Wraps the Also Marketplace SimpleAPI service.

**Endpoints:**
- `/health` - Health check
- `/api/auth/*` - Authentication
- `/api/products/*` - Product catalog
- `/api/subscriptions/*` - Subscription management

**Environment Variables:**
```env
PORT=3001
ALSO_API_BASE_URL=https://marketplacetest.ccpaas.net/SimpleAPI/SimpleAPIService.svc/rest
ALSO_API_USERNAME=your_username
ALSO_API_PASSWORD=your_password
```

### TDSynnex Backend (Port 3002)

Wraps the TDSynnex Ion API service.

**Endpoints:**
- `/health` - Health check
- `/api/auth/*` - Token management
- `/api/customers/*` - Customer management
- `/api/products/*` - Product catalog
- `/api/orders/*` - Order management

**Environment Variables:**
```env
PORT=3002
TDSYNNEX_API_BASE_URL=https://ion.tdsynnex.com
TDSYNNEX_CLIENT_ID=your_client_id
TDSYNNEX_CLIENT_SECRET=your_client_secret
TDSYNNEX_ACCOUNT_ID=your_account_id
```

### Trend Backend (Port 3003)

Wraps the Trend Vision One XDR API.

**Endpoints:**
- `/health` - Health check
- `/api/auth/*` - API key validation
- `/api/alerts/*` - Security alerts
- `/api/endpoints/*` - Endpoint management

**Environment Variables:**
```env
PORT=3003
TREND_API_KEY=your_api_key
TREND_BASE_URL=https://api.xdr.trendmicro.com
```

### Proxy Backend (Port 4000)

Aggregates and proxies requests to vendor backends.

**Endpoints:**
- `/health` - Health check
- `/api/also/*` - Proxy to Also Backend
- `/api/tdsynnex/*` - Proxy to TDSynnex Backend
- `/api/trend/*` - Proxy to Trend Backend

**Environment Variables:**
```env
PORT=4000
ALSO_API_BASE_URL=http://localhost:3001
TDSYNNEX_API_BASE_URL=http://localhost:3002
TREND_API_BASE_URL=http://localhost:3003
```

### WebAPP Backend (Port 5000)

Handles authentication and user management for the web application.

**Endpoints:**
- `/health` - Health check
- `/api/auth/login` - User login
- `/api/auth/refresh` - Token refresh
- `/api/auth/me` - Current user info
- `/api/auth/logout` - User logout

**Environment Variables:**
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### WebAPP Frontend (Port 3000)

Next.js 16 web application with React 19.

**Pages:**
- `/login` - Authentication
- `/dashboard` - Main dashboard
- `/products` - Product management
- `/customers` - Customer management
- `/subscriptions` - Subscription management
- `/alerts` - Security alerts

**Environment Variables:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🔧 Development

### Check Listening Ports

```powershell
netstat -ano | Select-String "LISTENING" | Select-String ":3001|:3002|:3003|:4000|:5000|:3000"
```

### View Service Logs

If using background jobs:

```powershell
# View specific service output
Receive-Job -Name "Also"
Receive-Job -Name "WebApp-Frontend"

# View all jobs status
Get-Job
```

### Clean Build

If you encounter issues, clean and restart:

```powershell
# Clean all node_modules (optional, takes time to reinstall)
Remove-Item -Recurse -Force */backend/node_modules, */frontend/node_modules

# Clean Next.js cache
Remove-Item -Recurse -Force WebAPP/frontend/.next

# Reinstall and restart
# ... follow installation steps above
```

## 🐛 Troubleshooting

### Port Already in Use

```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process by PID
taskkill /PID <PID> /F
```

### Frontend Shows White Screen

1. Clear Next.js cache: `Remove-Item -Recurse -Force WebAPP/frontend/.next`
2. Clear browser cache: `Ctrl+Shift+R`
3. Check browser console for errors (F12)

### API Calls Fail with 404

1. Verify all backend services are running
2. Check console logs for each service
3. Verify `.env` files have correct ports
4. Ensure `NEXT_PUBLIC_API_URL=http://localhost:5000` (no `/api` suffix)

### Login Fails

1. Check WebAPP Backend is running on port 5000
2. Verify credentials: `admin` / `admin123`
3. Check browser console for API errors
4. Test backend directly: 
   ```powershell
   curl http://localhost:5000/api/auth/login -Method POST -Body '{"username":"admin","password":"admin123"}' -ContentType 'application/json'
   ```

## 📝 Technology Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: Next.js 16, React 19, TailwindCSS 4
- **Authentication**: JWT
- **API Client**: Axios
- **Icons**: Lucide React

## 🔐 Security Notes

- Change `JWT_SECRET` in production
- Update default admin credentials
- Use HTTPS in production
- Store API credentials securely (environment variables, secret managers)
- Implement rate limiting for production
- Add proper CORS configuration for production domains

## 📄 License

See LICENSE file for details.

## 👥 Contributing

See CONTRIBUTING.md for guidelines.
