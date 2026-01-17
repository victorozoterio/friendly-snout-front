import { Route, Routes } from 'react-router-dom';
import { Dashboard, SignIn } from '../pages';
import { ROUTES } from './routes.constants';

export function Router() {
  return (
    <Routes>
      <Route path={ROUTES.AUTH.SIGN_IN} element={<SignIn />} />
      <Route path={ROUTES.HOME.BASE} element={<Dashboard />} />
    </Routes>
  );
}
