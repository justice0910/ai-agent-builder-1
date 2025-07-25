import React, { useState } from 'react';
import { Landing } from './Landing';
import { Dashboard } from './Dashboard';
import { AuthForm } from '@/components/auth/AuthForm';
import { useToast } from '@/hooks/use-toast';

type AppState = 'landing' | 'auth' | 'dashboard';
type AuthMode = 'login' | 'signup';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGetStarted = () => {
    setAppState('auth');
    setAuthMode('signup');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAuth = async (_email: string, _password: string) => {
    setLoading(true);
    try {
      // TODO: Integrate with Supabase authentication
      // For now, simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsAuthenticated(true);
      setAppState('dashboard');
      toast({
        title: "Welcome!",
        description: "You've successfully signed in to AI Agent Builder.",
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // const handleLogout = () => {
  //   setIsAuthenticated(false);
  //   setAppState('landing');
  //   toast({
  //     title: "Signed out",
  //     description: "You've been successfully signed out.",
  //   });
  // };

  // const handleCreatePipeline = () => {
  //   // TODO: Navigate to pipeline builder
  //   toast({
  //     title: "Coming soon!",
  //     description: "Pipeline builder will be available soon.",
  //   });
  // };

  // const handleEditPipeline = (id: string) => {
  //   // TODO: Navigate to pipeline editor
  //   toast({
  //     title: "Coming soon!",
  //     description: `Pipeline editor for ${id} will be available soon.`,
  //   });
  // };

  // const handleRunPipeline = (id: string) => {
  //   // TODO: Navigate to pipeline runner
  //   toast({
  //     title: "Coming soon!",
  //     description: `Pipeline runner for ${id} will be available soon.`,
  //   });
  // };

  if (appState === 'landing') {
    return <Landing onGetStarted={handleGetStarted} />;
  }

  if (appState === 'auth') {
    return (
      <AuthForm
        mode={authMode}
        onSubmit={handleAuth}
        onModeChange={setAuthMode}
        loading={loading}
      />
    );
  }

  if (appState === 'dashboard' && isAuthenticated) {
    return (
      <Dashboard
        // onLogout={handleLogout}
        // onCreatePipeline={handleCreatePipeline}
        // onEditPipeline={handleEditPipeline}
        // onRunPipeline={handleRunPipeline}
      />
    );
  }

  return <Landing onGetStarted={handleGetStarted} />;
};

export default Index;
