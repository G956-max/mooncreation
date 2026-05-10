import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useRequireAuth } from '../hooks/useRequireAuth';
import ConfirmModal from './ConfirmModal';

export default function Navbar() {
  const { isLoggedIn, role, logout } = useAuth();
  const { cartItems, wishlistItems } = useStore();
  const requireAuth = useRequireAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const isLoginActive = location.pathname === '/login';
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleProfileClick = () => {
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/profile');
    }
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo - Always navigate to store home */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <span className="font-serif text-2xl font-bold text-[#2C2C2C] tracking-tight">MOONCREATION</span>
            </div>

            {/* Center: Links */}
            <div className="hidden md:flex space-x-8">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-black transition-colors font-medium"
              >
                Home
              </Link>
              <Link 
                to="/categories" 
                className="text-gray-700 hover:text-black transition-colors font-medium"
              >
                Categories
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-black transition-colors font-medium"
              >
                Contact
              </Link>
            </div>

            {/* Right: Icons & Login */}
            <div className="flex items-center space-x-6">
              <button onClick={() => navigate('/wishlist')} className="text-gray-700 hover:text-red-500 transition-colors relative">
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              <button onClick={() => navigate('/cart')} className="text-gray-700 hover:text-black transition-colors relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#2C2C2C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
              
              {!isLoggedIn ? (
                <button 
                  onClick={() => navigate('/login')}
                  className={`px-5 py-2 rounded-full font-medium transition-colors ${
                    isLoginActive 
                      ? 'bg-black text-white shadow-md' 
                      : 'bg-[#2C2C2C] text-white hover:bg-black animate-pulse'
                  }`}
                >
                  Login
                </button>
              ) : (
                <button 
                  onClick={handleProfileClick} 
                  className={`transition-colors ${location.pathname === '/profile' ? 'text-black bg-gray-100 p-2 rounded-full' : 'text-gray-700 hover:text-black p-2'}`}
                  title={role === 'admin' ? "Admin Dashboard" : "Profile"}
                >
                  <User className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
      />
    </>
  );
}
