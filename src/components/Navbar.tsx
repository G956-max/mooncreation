import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingCart, User, Heart, Home as HomeIcon, Menu, X as CloseIcon, Languages, ChevronDown } from 'lucide-react';
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
      navigate(`/categories?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('allProducts'), path: '/categories' },
    { name: 'Occasion', path: '#', hasDropdown: true },
    { name: 'Personalized Gifts', path: '#', hasDropdown: true },
    { name: 'Gifts by Person', path: '#', hasDropdown: true },
    { name: 'Combo Gifts', path: '#', hasDropdown: true },
    { name: 'Customized Studio', path: '#', isNew: true },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        {/* Desktop Header */}
        <div className="hidden md:block w-full px-4 sm:px-8 lg:px-12 border-b border-gray-50">
          <div className="flex justify-between items-center h-20 gap-4">
            {/* Left: Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-12 h-12 bg-[#C48B22] rounded-full flex items-center justify-center text-white font-serif text-xl font-bold mr-3 shadow-lg">
                MC
              </div>
              <span className="font-serif text-2xl font-black text-[#2C2C2C] tracking-tighter">MOONCREATION</span>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-2xl mx-4">
              <form onSubmit={handleSearch} className="relative w-full group">
                <input 
                  type="text" 
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-6 pr-14 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium placeholder-gray-400 focus:bg-white focus:border-[#C48B22] focus:ring-4 focus:ring-[#C48B22]/5 outline-none transition-all"
                />
                <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 bg-[#C48B22] text-white rounded-r-lg hover:bg-[#A6751C] transition-colors">
                  <Search size={20} />
                </button>
              </form>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-all group"
              >
                <Languages size={22} className="text-gray-600 group-hover:text-[#C48B22]" />
                <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">{language === 'en' ? 'Tamil' : 'English'}</span>
              </button>

              <button onClick={() => navigate('/wishlist')} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-all group relative">
                <Heart size={22} className="text-gray-600 group-hover:text-[#C48B22]" />
                <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">{t('wishlist')}</span>
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              <button onClick={() => navigate('/cart')} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-all group relative">
                <ShoppingCart size={22} className="text-gray-600 group-hover:text-[#C48B22]" />
                <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">{t('cart')}</span>
                {cartItems.length > 0 && (
                  <span className="absolute top-1 right-2 w-4 h-4 bg-[#C48B22] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>

              <button onClick={handleProfileClick} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-all group">
                <User size={22} className="text-gray-600 group-hover:text-[#C48B22]" />
                <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">{isLoggedIn ? t('myAccount') : t('login')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Header (Matching Screenshot) */}
        <div className="md:hidden w-full bg-white px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2">
              <Menu size={24} className="text-[#2C2C2C]" />
            </button>
            
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-[#C48B22] rounded-full flex items-center justify-center text-white font-serif text-lg font-bold shadow-md">
                MC
              </div>
              <div className="ml-2 flex flex-col -gap-1">
                <span className="font-serif text-sm font-black text-[#2C2C2C] leading-none">MOON</span>
                <span className="font-serif text-[10px] font-medium text-gray-500 tracking-[0.2em] leading-none">CREATION</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button onClick={() => navigate('/wishlist')} className="p-2 relative">
                <Heart size={22} className="text-[#2C2C2C]" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C48B22] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {wishlistItems.length}
                  </span>
                )}
              </button>
              <button onClick={() => navigate('/cart')} className="p-2 relative">
                <ShoppingCart size={22} className="text-[#2C2C2C]" />
                {cartItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C48B22] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-5 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium outline-none focus:bg-white focus:border-[#C48B22] transition-all"
            />
            <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 bg-[#C48B22] text-white rounded-r-lg">
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Desktop Bottom Row */}
        <div className="hidden md:block w-full px-4 sm:px-8 lg:px-12 bg-white border-t border-gray-50">
          <div className="flex items-center justify-start h-12 gap-8 overflow-x-auto no-scrollbar whitespace-nowrap">
            {navLinks.map((link, index) => (
              <Link 
                key={index}
                to={link.path} 
                className={`text-sm font-bold tracking-wide transition-colors ${location.pathname === link.path ? 'text-[#C48B22]' : 'text-[#2C2C2C] hover:text-[#C48B22]'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="md:hidden fixed inset-0 z-[60] bg-white p-6"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#C48B22] rounded-full flex items-center justify-center text-white font-serif text-lg font-bold">MC</div>
                  <span className="ml-3 font-serif text-xl font-bold">MOONCREATION</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-full">
                  <CloseIcon size={24} />
                </button>
              </div>
              <div className="space-y-4">
                {navLinks.map((link, index) => (
                  <Link 
                    key={index}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block p-4 bg-gray-50 rounded-xl font-bold text-sm"
                  >
                    {link.name}
                  </Link>
                ))}
                <button 
                  onClick={() => { setLanguage(language === 'en' ? 'ta' : 'en'); setIsMobileMenuOpen(false); }}
                  className="w-full text-left p-4 bg-gray-50 rounded-xl font-bold text-sm flex items-center gap-3"
                >
                  <Languages size={20} className="text-[#C48B22]" />
                  {language === 'en' ? 'Tamil (தமிழ்)' : 'English'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title={t('logout')}
        message="Are you sure you want to logout?"
        confirmText={t('logout')}
      />
    </>
  );
}
