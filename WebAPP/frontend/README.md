# 🚀 Unified API Dashboard - Frontend

Next.js dashboard application for managing Also, TDSynnex, and Trend Vision One APIs.

## ✨ Features

- 🔐 **JWT Authentication** with auto-refresh
- 🛍️ **Product Catalog** with advanced filters and comparison
- 📋 **Subscription Management** with CRUD operations
- 📊 **Dashboard** with real-time statistics
- 🔒 **Route Protection** with middleware
- 🎨 **Modern UI** with Tailwind CSS and Shadcn/ui
- 🎮 **Demo Mode** with mock data (no backend required!)
- 📱 **Responsive Design** for all devices

## 🎮 Demo Mode

**The application works out-of-the-box with demo data!**

No backend or API configuration required. The app includes intelligent fallback to mock data:

- ✅ 12 sample products (Also + TDSynnex)
- ✅ 6 sample subscriptions
- ✅ Dashboard statistics
- ✅ All features fully functional

See [DEMO_MODE.md](DEMO_MODE.md) for complete details.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

**Note**: In demo mode, use any credentials to login (authentication is mocked).

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── dashboard/               # Dashboard page
│   ├── products/                # Product catalog & details
│   │   ├── [id]/               # Product detail page
│   │   └── compare/            # Product comparison
│   ├── subscriptions/          # Subscription management
│   │   ├── [id]/               # Subscription detail
│   │   └── new/                # Create subscription
│   └── login/                   # Login page
├── components/                  # React components
│   ├── auth/                    # Auth-related components
│   ├── layout/                  # Layout components (Sidebar, Navbar)
│   ├── products/                # Product components
│   ├── subscriptions/           # Subscription components
│   └── ui/                      # Reusable UI components
├── lib/                         # Utilities and helpers
│   ├── stores/                  # Zustand state management
│   │   ├── products.ts         # Products store (with mock data)
│   │   └── subscriptions.ts    # Subscriptions store (with mock data)
│   ├── api.ts                   # API endpoints
│   ├── api-client.ts            # API client with retry logic
│   └── auth-context.tsx         # Authentication context
├── types/                       # TypeScript types
└── middleware.ts                # Route protection
```

## 🗺️ Available Routes

### Public
- `/login` - Login page

### Protected (require authentication)
- `/` or `/dashboard` - Main dashboard
- `/products` - Product catalog with filters
- `/products/[id]` - Product detail page
- `/products/compare?ids=...` - Compare up to 4 products
- `/subscriptions` - Subscriptions list
- `/subscriptions/[id]` - Subscription detail
- `/subscriptions/new` - Create new subscription
- `/customers` - Customers list
- `/alerts` - Security alerts (Trend)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: Zustand
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Authentication**: JWT with auto-refresh

## 🎨 Features Showcase

### Product Catalog
- Grid and List view modes
- Advanced filters (Provider, Category, Price, Availability)
- Real-time search with debounce
- Product comparison (up to 4 products)
- Shareable comparison URLs

### Subscription Management
- List all subscriptions with filters
- Create, edit, delete subscriptions
- Provider-specific handling (Also/TDSynnex)
- Status management (active/suspended/cancelled)

### Dashboard
- Real-time statistics
- Trend indicators
- Quick action cards
- Recent activity

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Optional: Disable demo mode banner
NEXT_PUBLIC_DEMO_MODE=false
```

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
