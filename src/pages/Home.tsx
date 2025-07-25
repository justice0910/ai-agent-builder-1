import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';
import type { User } from 'lucide-react';

interface User {
  id: string;
  email: string;
}

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
        setUser(data.user as User);
        setLoading(false);
    });
  }, []);

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome to AI Agent Builder</h1>
      <p className="text-lg mb-4 text-gray-700 text-center">
        Design and run custom AI pipelines with ease. Create sequences like summarize, translate, or rewrite to process your text.
      </p>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          <Link
            to="/builder"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Go to Builder
          </Link>
        ) : (
          <>
            <Link
              to="/auth"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Sign In
            </Link>
            <Link
              to="/auth"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;