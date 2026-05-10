import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Heart, Home as HomeIcon, Menu, X as CloseIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { useRequireAuth } from '../hooks/useRequireAuth';
import ConfirmModal from './ConfirmModal';

export default function Navbar() {
  const { isLoggedIn, role, logout } = useAuth();
  const { cartItems, wishlistItems } = useStore();
  const { t } = useLanguage();
  const requireAuth = useRequireAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // For now we navigate to categories with a search param or just keep it simple
      navigate(`/categories?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left: Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <span className="font-serif text-2xl font-bold text-[#2C2C2C] tracking-tighter">MOONCREATION</span>
            </div>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-full text-sm focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-black/5 outline-none transition-all"
                />
              </form>
            </div>

            {/* Right: Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2">
              <button 
                onClick={() => navigate('/')} 
                className={`p-2.5 rounded-full transition-all flex items-center gap-2 ${location.pathname === '/' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                title={t('home')}
              >
                <HomeIcon size={20} />
                {location.pathname === '/' && <span className="text-xs font-bold uppercase tracking-widest pr-1">{t('home')}</span>}
              </button>

              <button 
                onClick={() => navigate('/wishlist')} 
                className={`p-2.5 rounded-full transition-all relative ${location.pathname === '/wishlist' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                title={t('wishlist')}
              >
                <Heart size={20} />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => navigate('/cart')} 
                className={`p-2.5 rounded-full transition-all relative ${location.pathname === '/cart' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                title={t('cart')}
              >
                <ShoppingCart size={20} />
                {cartItems.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#2C2C2C] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {cartItems.length}
                  </span>
                )}
              </button>

              <div className="w-px h-6 bg-gray-100 mx-2"></div>

              {!isLoggedIn ? (
                <button 
                  onClick={() => navigate('/login')}
                  className="ml-2 px-6 py-2.5 bg-black text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-all shadow-sm"
                >
                  {t('login')}
                </button>
              ) : (
                <button 
                  onClick={handleProfileClick}
                  className={`p-1.5 border-2 transition-all ${location.pathname === '/profile' || location.pathname.startsWith('/admin') ? 'border-black' : 'border-transparent hover:border-gray-200'} rounded-full`}
                  title={t('myAccount')}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <User size={18} className="text-gray-600" />
                  </div>
                </button>
              )}
            </div>

            {/* Mobile: Toggle */}
            <button 
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-50 p-4 space-y-4 animate-in slide-in-from-top duration-300">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-sm outline-none"
              />
            </form>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl">
                <HomeIcon size={20} />
                <span className="text-[10px] font-bold uppercase">{t('home')}</span>
              </button>
              <button onClick={() => { navigate('/wishlist'); setIsMobileMenuOpen(false); }} className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl">
                <Heart size={20} />
                <span className="text-[10px] font-bold uppercase">{t('wishlist')}</span>
              </button>
              <button onClick={() => { navigate('/cart'); setIsMobileMenuOpen(false); }} className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl">
                <ShoppingCart size={20} />
                <span className="text-[10px] font-bold uppercase">{t('cart')}</span>
              </button>
            </div>
            {!isLoggedIn ? (
              <button 
                onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                className="w-full py-4 bg-black text-white rounded-2xl font-bold shadow-lg"
              >
                {t('login')}
              </button>
            ) : (
              <button 
                onClick={() => { handleProfileClick(); setIsMobileMenuOpen(false); }}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3"
              >
                <User size={20} />
                {t('myAccount')}
              </button>
            )}
          </div>
        )}
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
