import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingCart, User, Heart, Home as HomeIcon, Menu, X as CloseIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { useRequireAuth } from '../hooks/useRequireAuth';
import ConfirmModal from './ConfirmModal';

export default function Navbar() {
  const { isLoggedIn, role, logout } = useAuth();
  const { cartItems, wishlistItems } = useStore();
  const { t, language, setLanguage } = useLanguage();
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
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left: Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <span className="font-serif text-2xl font-black text-[#2C2C2C] tracking-tighter">MOONCREATION</span>
            </div>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-lg mx-12">
              <form onSubmit={handleSearch} className="relative w-full group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-black/5 outline-none transition-all"
                />
              </form>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button 
                onClick={() => navigate('/')} 
                className={`p-2.5 rounded-full transition-all hidden sm:flex items-center gap-2 ${location.pathname === '/' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                title={t('home')}
              >
                <HomeIcon size={20} />
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

              <div className="hidden sm:block w-px h-6 bg-gray-100 mx-1"></div>

              {/* Language Switcher */}
              <button 
                onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                title={language === 'en' ? 'தமிழ்-க்கு மாற்றவும்' : 'Switch to English'}
              >
                <div className="w-6 h-6 rounded-full bg-[#2C2C2C] text-white flex items-center justify-center text-[10px] font-bold">
                  {language === 'en' ? 'EN' : 'த'}
                </div>
                <span className="text-xs font-bold hidden lg:block">
                  {language === 'en' ? 'English' : 'தமிழ்'}
                </span>
              </button>

              <div className="hidden lg:block w-px h-6 bg-gray-100 mx-1"></div>

              {!isLoggedIn ? (
                <button 
                  onClick={() => navigate('/login')}
                  className="hidden sm:block ml-2 px-6 py-2.5 bg-black text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-all shadow-sm active:scale-95"
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

              {/* Mobile: Search & Menu Toggle */}
              <div className="md:hidden flex items-center gap-1">
                <button 
                  className="p-2.5 text-gray-500 hover:bg-gray-50 rounded-full"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <CloseIcon size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu & Search Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-white border-t border-gray-50 p-6 space-y-6 shadow-xl"
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  autoFocus
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-black/5"
                />
              </form>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => { setLanguage(language === 'en' ? 'ta' : 'en'); setIsMobileMenuOpen(false); }} 
                  className="col-span-2 flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors border border-dashed border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                      {language === 'en' ? 'EN' : 'த'}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {language === 'en' ? 'Switch to தமிழ்' : 'Switch to English'}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: language === 'en' ? 0 : 180 }}
                    className="text-gray-400"
                  >
                    <Check size={16} />
                  </motion.div>
                </button>
                <button onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-white rounded-lg shadow-sm"><HomeIcon size={18} /></div>
                  <span className="text-xs font-bold uppercase tracking-wider">{t('home')}</span>
                </button>
                <button onClick={() => { navigate('/wishlist'); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-white rounded-lg shadow-sm"><Heart size={18} /></div>
                  <span className="text-xs font-bold uppercase tracking-wider">{t('wishlist')}</span>
                </button>
                <button onClick={() => { navigate('/cart'); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                  <div className="p-2 bg-white rounded-lg shadow-sm"><ShoppingCart size={18} /></div>
                  <span className="text-xs font-bold uppercase tracking-wider">{t('cart')}</span>
                </button>
                {!isLoggedIn ? (
                  <button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-4 bg-black text-white rounded-2xl hover:bg-gray-800 transition-colors">
                    <div className="p-2 bg-white/10 rounded-lg"><User size={18} /></div>
                    <span className="text-xs font-bold uppercase tracking-wider">{t('login')}</span>
                  </button>
                ) : (
                  <button onClick={() => { handleProfileClick(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition-colors">
                    <div className="p-2 bg-white/10 rounded-lg"><User size={18} /></div>
                    <span className="text-xs font-bold uppercase tracking-wider">{t('myAccount')}</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
