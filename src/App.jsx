import React, { createContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import Login from '../Components/Login';
import SignUp from '../Components/SignUp';
import Home from '../Components/pages/Home'; // Make sure this exists
import './App.css';
import { addUserDetails } from './slices/userslices'; // Adjust the path as needed
import PageNotFound from '../Components/PageNotFound';

const serverUrl = import.meta.env.VITE_SERVER_URL;
export const AppContext = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${serverUrl}`, { withCredentials: true })
      .then(res => {
        setIsAuthenticated(true);
        dispatch(addUserDetails(res.data.user));
      })
      .catch(() => {
        setIsAuthenticated(false);
        dispatch(addUserDetails(null));
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) {
    return <div className="text-center mt-10 font-semibold text-gray-600">Loading...</div>;
  }

  return (
    <AppContext.Provider value={{ setIsAuthenticated }}>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
        <Route path="/login" element={isAuthenticated ? <Home /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Home /> : <SignUp />} />
        {/* <Route path="/resetpassword" element={<ResetPassword />} /> */}
        <Route path="/app/*" element={isAuthenticated ? <Home /> : <Login />} />
        <Route path="*" element={<PageNotFound/>} />
      </Routes>
    </AppContext.Provider>
  );
}

export default App;
