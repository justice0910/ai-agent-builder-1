# AI Agent Builder

A modern React application for building AI pipelines with a beautiful UI and complete authentication system.

## Features

- 🚀 **Modern React Stack**: Built with React 19, TypeScript, and Vite
- 🎨 **Beautiful UI**: Styled with Tailwind CSS and shadcn/ui components
- 🔐 **Complete Authentication**: Supabase integration with fallback for development
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🏗️ **Remix-style Routing**: Clean route structure with nested layouts
- ⚡ **Fast Development**: Hot reload and optimized build process

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: Supabase (with development fallback)
- **Routing**: React Router DOM
- **State Management**: React Context + React Query
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-agent-builder-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (Optional for development)
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   **Note**: If you don't set up Supabase, the app will use a mock authentication system for development.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Header, etc.)
│   ├── pipeline/       # Pipeline builder components
│   └── ui/            # shadcn/ui components
├── contexts/           # React Context providers
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries and configurations
├── pages/             # Page components
├── routes/            # Remix-style route components
├── services/          # API and service layer
├── types/             # TypeScript type definitions
└── styles/            # Global styles and CSS
```

## Authentication

The application supports two authentication modes:

### 1. Supabase Authentication (Production)
- Set up your Supabase project
- Add environment variables
- Full authentication with email/password

### 2. Mock Authentication (Development)
- Works without Supabase setup
- Stores user data in localStorage
- Perfect for development and testing

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Supabase Setup (Optional)

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project

2. **Get your credentials**
   - Go to Settings > API
   - Copy your project URL and anon key

3. **Add to environment variables**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## Development

### Adding New Routes

1. Create a new route file in `src/routes/`
2. Export a component from the route file
3. Add the route to `src/App.tsx`

### Adding New Components

1. Create components in `src/components/`
2. Use TypeScript for type safety
3. Follow the existing component patterns

### Styling

- Use Tailwind CSS classes
- Custom design tokens are defined in `tailwind.config.ts`
- CSS variables are in `src/index.css`

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify

1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
