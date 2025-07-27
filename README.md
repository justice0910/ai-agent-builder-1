# AI Agent Builder

A modern AI pipeline builder with a clean backend-frontend separation architecture.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Supabase      │
│   (React)       │◄──►│   (Express)     │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ ✅ Pure Client   │    │ ✅ Drizzle ORM  │    │ ✅ Database     │
│ ✅ No Buffer     │    │ ✅ REST API     │    │ ✅ Auth API     │
│ ✅ Clean Code    │    │ ✅ Type Safe    │    │ ✅ Hosted       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
ai-agent-builder/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   ├── contexts/       # React contexts
│   │   ├── types/          # TypeScript types
│   │   └── lib/            # Utilities and configs
│   ├── package.json
│   └── README.md
├── backend/                 # Express + Drizzle backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── types/          # TypeScript types
│   │   └── db/             # Database schema
│   ├── package.json
│   └── README.md
└── shared/                  # Shared types and utilities
    ├── types/
    └── constants/
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

### 3. Database Setup

```bash
cd backend
npm run db:generate
npm run db:push
```

## 🔧 Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **React Router** - Navigation
- **Supabase Auth** - Authentication

### Backend
- **Express.js** - Web framework
- **Drizzle ORM** - Database operations
- **PostgreSQL** - Database (via Supabase)
- **TypeScript** - Type safety
- **CORS** - Cross-origin support

### Database
- **Supabase** - PostgreSQL hosting
- **Drizzle Kit** - Schema management
- **Row Level Security** - Data protection

## 📡 API Endpoints

### Authentication (Supabase)
- User registration and login
- Session management
- Password reset

### Pipelines (Backend API)
- `POST /api/pipelines` - Create pipeline
- `GET /api/pipelines` - Get user pipelines
- `GET /api/pipelines/:id` - Get specific pipeline
- `PUT /api/pipelines/:id` - Update pipeline
- `DELETE /api/pipelines/:id` - Delete pipeline

## 🔐 Security

- **CORS** - Configured for frontend-backend communication
- **Authentication** - Supabase Auth with JWT tokens
- **Authorization** - User-specific data access
- **Input Validation** - Request validation on both ends

## 🧪 Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server
npm run db:generate  # Generate schema types
npm run db:push      # Push schema to database
npm run test         # Run tests
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
```

## 🚀 Deployment

### Backend Deployment
- Deploy to Vercel, Railway, or any Node.js hosting
- Set environment variables
- Configure CORS for frontend domain

### Frontend Deployment
- Deploy to Vercel, Netlify, or any static hosting
- Set environment variables
- Configure API base URL

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=your_supabase_connection_string
PORT=3001
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
