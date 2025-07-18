import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Logout() {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    // Navigate to home page after logout
    navigate('/', { replace: true });
  }, [logout, navigate]);

  return null;
}
