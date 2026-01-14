import { Route, Routes } from 'react-router-dom';
import { SignIn } from './pages/auth/sign-in/sign-in';

export function Router() {
  return (
    <Routes>
      <Route path='/auth/sign-in' element={<SignIn />} />
    </Routes>
  );
}
