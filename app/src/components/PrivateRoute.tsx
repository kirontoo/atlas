import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { selectAuthenticated } from '../store/features/user/userSlice';
import { loginRoute } from '../utils/routes';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  // TODO: add a loading screen so that we don't flash the private page
  const isAuthenticated = useSelector(selectAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to={loginRoute} replace />;
};

export default PrivateRoute;
