import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Bot } from 'lucide-react';

const Auth: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (isSignUp) {
        response = await supabase.auth.signUp({ email, password });
      } else {
        response = await supabase.auth.signInWithPassword({ email, password });
      }
      if (response.error) throw response.error;
      navigate('/builder');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert('Authentication error: ' + error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-accent/20 p-4">
      <div className="w-full max-w-md space-y-8">
      <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Bot className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Agent Builder
          </h1>
          <p className="text-muted-foreground mt-2">
            Design and run custom AI pipelines
          </p>
        </div>

        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue building AI workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border rounded"
          required
        />
        <Button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
      </form>
      <Button
        onClick={() => setIsSignUp(!isSignUp)}
        className="mt-4 text-blue-500 underline"
      >
        {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
      </Button>
      <Button
        onClick={handleSignOut}
        className="mt-2 text-red-500 underline"
      >
        Sign Out
      </Button>
          </CardContent>
        </Card>
        <h1 className="text-2xl font-bold mb-4">{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
      <form onSubmit={handleAuth} className="space-y-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border rounded"
          required
        />
        <Button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
      </form>
      <Button
        onClick={() => setIsSignUp(!isSignUp)}
        className="mt-4 text-blue-500 underline"
      >
        {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
      </Button>
      <Button
        onClick={handleSignOut}
        className="mt-2 text-red-500 underline"
      >
        Sign Out
      </Button>
      </div>     
    </div>
    
  );
};

export default Auth;