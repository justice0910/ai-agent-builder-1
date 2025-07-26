import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './routes/_app';
import { IndexRoute } from './routes/index';
import { AuthRoute } from './routes/auth';
import { DashboardRoute } from './routes/dashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<IndexRoute />} />
          <Route path="auth" element={<AuthRoute />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardRoute />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;