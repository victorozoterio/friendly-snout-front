import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Dashboard, ForgotPassword, SignIn } from '../pages';
import { ROUTES } from './routes.constants';

export function Router() {
  return (
    <Routes>
      <Route
        path={ROUTES.AUTH.SIGN_IN}
        element={
          <ProtectedRoute requireAuth={false}>
            <SignIn />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.AUTH.FORGOT_PASSWORD}
        element={
          <ProtectedRoute requireAuth={false}>
            <ForgotPassword />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.HOME.BASE}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
