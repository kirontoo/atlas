import './App.css';

import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Projects from './pages/Dashboard/Projects';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import SignUp from './pages/SignUp';
import { login, logout } from './store/features/user/userSlice';
import { auth } from './utils/firebase';
import * as routeNames from './utils/routes';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        dispatch(login(userAuth));
      } else {
        dispatch(logout());
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path={routeNames.homeRoute} element={<Home />} />
        <Route path={routeNames.signupRoute} element={<SignUp />} />
        <Route path={routeNames.loginRoute} element={<Login />} />
        <Route path={routeNames.dashboardRoute} element={<Dashboard />}>
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
