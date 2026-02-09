# Trend Vision One Backend

Backend service for integrating with Trend Vision One API. Provides REST endpoints for managing XDR alerts, endpoint security, and authentication.

## Features

- ✅ **Authentication & Setup**: Test API connectivity
- ✅ **Workbench Alerts**: List, view details, update status, and add notes
- ✅ **Endpoint Security**: List endpoints, isolate/restore compromised machines

## Prerequisites

- Node.js 18+ 
- Trend Vision One API Key
- npm or yarn

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Edit `.env` and fill in your credentials:
```env
TREND_API_KEY=your_api_key_here
TREND_BASE_URL=https://api.xdr.trendmicro.com  # Use your region's URL
PORT=3000
```

### Regional Base URLs

- **United States**: `https://api.xdr.trendmicro.com`
- **Europe (Germany)**: `https://api.eu.xdr.trendmicro.com`
- **Japan**: `https://api.xdr.trendmicro.co.jp`
- **Australia**: `https://api.au.xdr.trendmicro.com`
- **Singapore**: `https://api.sg.xdr.trendmicro.com`

## Usage

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `GET /api/auth/test` - Test API connectivity

### Alerts
- `GET /api/alerts?startDateTime=...&endDateTime=...&severity=...&status=...` - List alerts
- `GET /api/alerts/:alertId` - Get alert details
- `PATCH /api/alerts/:alertId` - Update alert status
  ```json
  { "status": "in_progress" }
  ```
- `POST /api/alerts/:alertId/notes` - Add investigation note
  ```json
  { "content": "Investigating suspicious activity..." }
  ```

### Endpoints
- `GET /api/endpoints` - List managed endpoints
- `POST /api/endpoints/isolate` - Isolate endpoint
  ```json
  { "agentGuid": "...", "description": "Alert WB-1234" }
  ```
- `POST /api/endpoints/restore` - Restore endpoint
  ```json
  { "agentGuid": "..." }
  ```

## Testing

Test the connection:
```bash
curl http://localhost:3000/api/auth/test
```

## Project Structure

```
backend/
├── src/
│   ├── config/           # Environment configuration
│   ├── controllers/      # Request handlers
│   ├── routes/           # API route definitions
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utilities (API client)
│   └── index.ts          # Application entry point
├── .env.example          # Environment template
├── package.json
└── tsconfig.json
```

## License

ISC
