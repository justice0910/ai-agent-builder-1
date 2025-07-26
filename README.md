# AI Agent Builder

Create powerful AI workflows in minutes with our intuitive drag-and-drop interface.

## Features

- 🔧 **Visual Pipeline Builder**: Drag and drop AI components
- 🤖 **AI Integration**: Connect to various AI services
- 📊 **Real-time Testing**: Test your pipelines instantly
- 🔒 **Secure Authentication**: Supabase-powered user management and session handling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ai-agent-builder-1
```

2. Install dependencies
```bash
npm install
```

3. Set up Supabase environment variables
Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**To get these values:**
1. Go to [Supabase](https://supabase.com)
2. Create a new project or select existing one
3. Go to Settings > API
4. Copy the Project URL and anon/public key

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Authentication

The app uses **Supabase Authentication** for secure user management:

- **Email/password signup and login**
- **Email confirmation** for new accounts
- **Session persistence** across page navigations and browser tabs
- **Secure token management** with automatic refresh
- **PKCE flow** for enhanced security

## Troubleshooting

### Login Persistence Issues

If you're experiencing login persistence issues (being logged out when navigating between pages or returning from external sites), check:

1. **Environment Variables**: Ensure your `.env` file has valid Supabase credentials
2. **Browser Console**: Check for authentication-related errors
3. **Network Tab**: Verify Supabase API calls are successful
4. **Session Storage**: Check if Supabase tokens are being stored in localStorage

### Common Issues

- **"User not found" errors**: Check if Supabase is properly configured
- **Session not persisting**: Verify environment variables are set correctly
- **Email confirmation**: Ensure users confirm their email before signing in

### Debugging

The app includes comprehensive logging for authentication events. Open browser console to see:
- Session restoration attempts
- Authentication state changes
- Page visibility events (when returning from external sites)
- Token refresh operations

## Build

```bash
npm run build
```

## License

MIT
