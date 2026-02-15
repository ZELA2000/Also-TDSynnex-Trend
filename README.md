# 🚀 Unified API Platform

A comprehensive integration platform that unifies multiple vendor APIs (Also Marketplace, TDSynnex Ion, Trend Vision One) through a modern web interface.

## 📋 Project Structure

```
├── Also/               # Also Marketplace API wrapper
│   └── backend/        # Express API service (Port 3001)
├── TDSynnex/          # TDSynnex Ion API wrapper
│   └── backend/        # Express API service (Port 3002)
├── Trend/             # Trend Vision One API wrapper
│   └── backend/        # Express API service (Port 3003)
├── Proxy/             # Unified API aggregator
│   └── backend/        # Express proxy service (Port 4000)
├── WebAPP/            # Web application
│   ├── backend/       # Authentication service (Port 5000)
│   └── frontend/      # Next.js dashboard (Port 3000)
└── DOC/               # Documentation
```

## ✨ Features

- **🔐 Unified Authentication**: Single sign-on for all vendor APIs
- **📊 Dashboard**: Modern web interface built with Next.js 16 and React 19
- **🔄 API Aggregation**: Single proxy endpoint for multiple vendor APIs
- **🎨 Modern UI**: TailwindCSS 4 with responsive design
- **🔒 Security**: JWT-based authentication with refresh tokens
- **📱 Real-time**: Live data from multiple vendor platforms
- **🎯 Type Safety**: Full TypeScript implementation

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**
- **Git**

### Automated Setup (Recommended)

```powershell
# 1. Clone the repository
git clone <repository-url>
cd GITHUB

# 2. Run the setup script
.\setup.ps1

# 3. Start all services
.\start-all.ps1

# 4. Open your browser
# Navigate to: http://localhost:3000
# Login: admin / admin123
```

### Manual Setup

See [SETUP.md](./SETUP.md) for detailed manual installation instructions.

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup and configuration guide
- **[Also API Documentation](./Also/DOC/README.md)** - Also Marketplace API details
- **[TDSynnex API Documentation](./TDSynnex/DOC/README.md)** - TDSynnex Ion API details
- **[Trend API Documentation](./Trend/DOC/README.md)** - Trend Vision One API details
- **[Proxy Documentation](./Proxy/DOC/README.md)** - Unified proxy API details
- **[WebAPP Documentation](./WebAPP/README.md)** - Web application details

## 🎯 Service Architecture

```
┌─────────────────┐
│   Browser       │
│  (Port 3000)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ WebAPP Frontend │
│   (Next.js)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│ WebAPP Backend  │────▶│    Proxy     │
│   (Auth/API)    │     │ (Port 4000)  │
│  (Port 5000)    │     └──────┬───────┘
└─────────────────┘            │
                               ├────────────┐
                               │            │
                    ┌──────────▼───┐ ┌─────▼────────┐
                    │ Also Backend │ │ TDSynnex     │
                    │ (Port 3001)  │ │ Backend      │
                    └──────────────┘ │ (Port 3002)  │
                                     └──────────────┘
                    ┌─────────────────┐
                    │ Trend Backend   │
                    │ (Port 3003)     │
                    └─────────────────┘
```

## 🛠️ Management Scripts

### Start Services

```powershell
# Start all services in background
.\start-all.ps1

# Check status
.\status.ps1

# Stop all services
.\stop-all.ps1
```

### Individual Service Management

```powershell
# Start individual service
cd Also/backend
npm run dev

# View logs for background service
Receive-Job -Name "Also"

# List all background jobs
Get-Job
```

## 🔧 Configuration

Each service can be configured via `.env` files. Copy from `.env.example`:

```powershell
# Quick setup (creates all .env files)
.\setup.ps1

# Or manually for each service
cd Also/backend
Copy-Item .env.example .env
# ... edit .env with your credentials
```

### Default Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Also API | 3001 | http://localhost:3001 |
| TDSynnex API | 3002 | http://localhost:3002 |
| Trend API | 3003 | http://localhost:3003 |
| Proxy | 4000 | http://localhost:4000 |
| Auth Backend | 5000 | http://localhost:5000 |

## 🔐 Default Credentials

**Web Application:**
- Username: `admin`
- Password: `admin123`

⚠️ **Change these credentials in production!**

## 🧪 Demo Mode

The platform can run in demo mode with placeholder API credentials:
- All services start successfully
- UI is fully functional
- Backend integration will show warnings but won't crash
- Perfect for development and testing the platform architecture

To use with real APIs, update the `.env` files with your vendor credentials.

## 🐛 Troubleshooting

### Services Won't Start

```powershell
# Check if ports are available
netstat -ano | findstr "3000 3001 3002 3003 4000 5000"

# Kill process on specific port (e.g., 3000)
# Find PID first, then:
taskkill /PID <PID> /F
```

### Cannot Login

1. Verify WebAPP Backend is running: `http://localhost:5000/health`
2. Check browser console (F12) for errors
3. Clear browser cache and localStorage
4. Verify credentials: `admin` / `admin123`

### White Screen on Frontend

```powershell
# Clear Next.js cache
cd WebAPP/frontend
Remove-Item -Recurse -Force .next
npm run dev
```

### API Errors

1. Check all backend services are running: `.\status.ps1`
2. Verify `.env` files are configured correctly
3. Check service logs: `Receive-Job -Name "ServiceName"`

## 📝 Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **HTTP Client**: Axios
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS

### Frontend
- **Framework**: Next.js 16
- **UI Library**: React 19
- **Styling**: TailwindCSS 4
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Hooks, Zustand

### DevOps
- **Package Manager**: npm
- **TypeScript**: Full type safety
- **Hot Reload**: nodemon, Next.js Fast Refresh
- **Environment**: dotenv

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 📄 License

See [LICENSE](./LICENSE) for license information.

## 🆘 Support

For issues and questions:
1. Check [SETUP.md](./SETUP.md) for detailed setup instructions
2. Check logs with `Receive-Job -Name "ServiceName"`
3. Run `.\status.ps1` to verify all services are running
4. Check the documentation for each service

## 🎯 Roadmap

- [ ] Docker containerization
- [ ] Kubernetes deployment
- [ ] Advanced monitoring and logging
- [ ] Rate limiting and caching
- [ ] Multi-tenancy support
- [ ] Advanced analytics dashboard
- [ ] Webhook support
- [ ] Export/Import configurations

## 📊 Project Status

✅ **Phase 1**: Core infrastructure - COMPLETED
✅ **Phase 2**: API integrations - COMPLETED  
✅ **Phase 3**: Authentication system - COMPLETED
✅ **Phase 4**: Frontend dashboard - COMPLETED
✅ **Phase 5**: Documentation and tooling - COMPLETED

🚀 **Ready for deployment and customization!**

---

Made with ❤️ for unified API management
