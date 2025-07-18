import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';

import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
// Renamed import for clarity
import Blogs from './pages/Blogs'; 
import BlogDetails from './pages/BlogDetails';
import Logout from './pages/Logout';
import Loading from './components/Loading';

function App() {
  const [user, setUser] = useState({ id: null, isAdmin: false, username: null });
  const [isLoading, setIsLoading] = useState(true);

  // BACKEND API URL - UNCHANGED
  const API_URL = 'https://blog-app-api-l14y.onrender.com';

  const logout = useCallback((  ) => {
    localStorage.removeItem('token');
    setUser({ id: null, isAdmin: false, username: null });
  }, []);

  // fetch URL is UNCHANGED
  const fetchUserProfile = useCallback((token) => {
    fetch(`${API_URL}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data && data._id) {
        setUser({ id: data._id, username: data.username, isAdmin: data.isAdmin });
      } else {
        logout();
      }
    })
    .catch(() => logout())
    .finally(() => setIsLoading(false));
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    } else {
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <UserProvider value={{ user, setUser, logout, API_URL, fetchUserProfile }}>
      <Router>
        <AppNavbar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:postId" element={<BlogDetails />} />
            <Route path="/login" element={user.id ? <Navigate to="/blogs" /> : <Login />} />
            <Route path="/register" element={user.id ? <Navigate to="/blogs" /> : <Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </Router>
    </UserProvider>
  );
}

export default App;
