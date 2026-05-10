import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function useRequireAuth() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return (action?: () => void) => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (action) {
      action();
    }
  };
}
