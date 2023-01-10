import './App.css';

import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Dashboard/Projects';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import SignUp from './pages/SignUp';
import { login, logout } from './store/features/user/userSlice';
import { auth } from './utils/firebase';
import * as routeNames from './utils/routes';
import {
  getLocalStorageUser,
  setLoggedInUser,
  setLoggedOutUser,
} from './utils/services/AuthService';

function App() {
  const dispatch = useDispatch();
  const user = getLocalStorageUser();
  if (user !== null) {
    dispatch(login(user));
  } else {
    dispatch(logout());
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth !== null) {
        setLoggedInUser(userAuth);
      } else {
        setLoggedOutUser();
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path={routeNames.homeRoute} element={<Home />} />
        <Route path={routeNames.signupRoute} element={<SignUp />} />
        <Route path={routeNames.loginRoute} element={<Login />} />
        <Route path={routeNames.forgotPasswordRoute} element={<ForgotPassword />} />
        <Route
          path={routeNames.dashboardRoute}
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
          errorElement={<p>this aint working</p>}
        >
          <Route path="" element={<div> hello home</div>} />
          <Route path={routeNames.dashboardProjectsRoute} element={<Projects />} />
          <Route path={routeNames.dashboardTicketsRoute} element={<div>tickets</div>} />
          <Route path={routeNames.dashboardSettingsRoute} element={<div>settings</div>} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
