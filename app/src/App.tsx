import './App.css';

import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { auth } from './auth/firebase';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Dashboard/Projects';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import SignUp from './pages/SignUp';
import { login, logout } from './store/features/user/userSlice';

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
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="" element={<div> hello home</div>} />
          <Route path="projects" element={<Projects />} />
          <Route path="tickets" element={<div>tickets</div>} />
          <Route path="settings" element={<div>settings</div>} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
