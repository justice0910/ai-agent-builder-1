# AI Agent Builder

A powerful platform for creating and managing AI pipelines with a modern, intuitive interface.

## Features

- **Pipeline Builder**: Create custom AI workflows with drag-and-drop interface
- **Real-time Testing**: Test your pipelines with live input and see results instantly
- **AI Assistant**: Get help building pipelines with our intelligent chat interface
- **User Authentication**: Secure user accounts with email confirmation
- **Dashboard**: Manage and organize your AI pipelines

## Email Confirmation Flow

When users create an account, they must confirm their email address before accessing the dashboard. Here's how it works:

### 1. Account Creation
- Users sign up with their email and password
- A confirmation email is automatically sent to their email address
- Users are redirected to an email confirmation page

### 2. Email Confirmation
- Users check their email (including spam folder)
- Click the confirmation link in the email
- The link redirects back to the app with a confirmation parameter

### 3. Access to Dashboard
- Once email is confirmed, users can sign in and access the dashboard
- Users with unconfirmed emails are redirected to the auth page with a message
- The system prevents access to protected routes until email is confirmed

### 4. Manual Confirmation
- If the automatic sign-in fails after email confirmation, users can manually click "I've Confirmed My Email - Sign Me In"
- Users can also resend confirmation emails if needed

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account for authentication
- Groq API key for AI services

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-agent-builder-1
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Frontend (.env)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key

# Backend (.env)
DATABASE_URL=your_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Start the development servers:
```bash
# Start backend
cd backend
npm run dev

# Start frontend (in new terminal)
cd frontend
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Supabase** for authentication
- **Sonner** for toast notifications

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **PostgreSQL** database
- **Supabase** integration

### Database Schema
- Users table with email confirmation tracking
- Pipelines table for storing user workflows
- Pipeline steps table for individual pipeline components

## Security Features

- **Email Confirmation**: Required before accessing protected routes
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Session Management**: Secure session handling with Supabase
- **Input Validation**: Server-side validation for all user inputs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
