import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './routes/_app';
import { IndexRoute } from './routes/index';
import { AuthRoute } from './routes/auth';
import { DashboardRoute } from './routes/dashboard';
import { AuthGuard, GuestGuard } from './components/auth/AuthGuard';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={
            <GuestGuard>
              <IndexRoute />
            </GuestGuard>
          } />
          <Route path="auth" element={
            <GuestGuard>
              <AuthRoute />
            </GuestGuard>
          } />
          <Route
            path="dashboard"
            element={
              <AuthGuard>
                <DashboardRoute />
              </AuthGuard>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;