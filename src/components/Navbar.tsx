import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingCart, User, Heart, Home as HomeIcon, Menu, X as CloseIcon, Languages, Check, ChevronDown } from 'lucide-react';
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
    { name: 'Home', path: '/' },
    { name: 'All Categories', path: '/categories' },
    { name: 'Occasion', path: '#', hasDropdown: true },
    { name: 'Personalized Gifts', path: '#', hasDropdown: true },
    { name: 'Gifts by Person', path: '#', hasDropdown: true },
    { name: 'Combo Gifts', path: '#', hasDropdown: true },
    { name: 'Customized Studio', path: '#', isNew: true },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        {/* Top Row: Logo, Search, Actions */}
        <div className="w-full px-4 sm:px-6 lg:px-8 border-b border-gray-50">
          <div className="flex justify-between items-center h-20 gap-4">
            {/* Left: Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-12 h-12 bg-[#C48B22] rounded-full flex items-center justify-center text-white font-serif text-xl font-bold mr-3 shadow-lg">
                MC
              </div>
              <span className="font-serif text-2xl font-black text-[#2C2C2C] tracking-tighter hidden lg:block">MOONCREATION</span>
            </div>

            {/* Center: Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <form onSubmit={handleSearch} className="relative w-full group">
                <input 
                  type="text" 
                  placeholder="Search for gifts, occasions, products..."
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
            <div className="flex items-center gap-1 sm:gap-4">
              {/* Language Switcher */}
              <button 
                onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-all group"
                title={language === 'en' ? 'தமிழ்-க்கு மாற்றவும்' : 'Switch to English'}
              >
                <div className="relative">
                  <Languages size={22} className="text-gray-600 group-hover:text-[#C48B22] transition-colors" />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">
                  {language === 'en' ? 'Tamil' : 'English'}
                </span>
              </button>

              <button 
                onClick={() => navigate('/wishlist')} 
                className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-all group relative"
              >
                <Heart size={22} className="text-gray-600 group-hover:text-[#C48B22] transition-colors" />
                <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">Wishlist</span>
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => navigate('/cart')} 
                className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-all group relative"
              >
                <ShoppingCart size={22} className="text-gray-600 group-hover:text-[#C48B22] transition-colors" />
                <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">Cart</span>
                {cartItems.length > 0 && (
                  <span className="absolute top-1 right-2 w-4 h-4 bg-[#C48B22] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>

              {!isLoggedIn ? (
                <button 
                  onClick={() => navigate('/login')}
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-all group"
                >
                  <User size={22} className="text-gray-600 group-hover:text-[#C48B22] transition-colors" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">Login</span>
                </button>
              ) : (
                <button 
                  onClick={handleProfileClick}
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-all group"
                >
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                    <User size={16} className="text-gray-600" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase mt-1">Account</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden p-2.5 text-gray-500 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Navigation Links (Desktop) */}
        <div className="hidden md:block w-full px-4 sm:px-6 lg:px-8 bg-white overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-start h-12 gap-8 whitespace-nowrap">
            <button className="p-2.5 text-gray-500 hover:text-[#C48B22] transition-colors">
              <Menu size={20} />
            </button>
            {navLinks.map((link, index) => (
              <div key={index} className="relative group/link h-full flex items-center">
                <Link 
                  to={link.path} 
                  className={`text-sm font-bold tracking-wide flex items-center gap-1.5 transition-colors ${location.pathname === link.path ? 'text-[#C48B22]' : 'text-[#2C2C2C] hover:text-[#C48B22]'}`}
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown size={14} className="group-hover/link:rotate-180 transition-transform" />}
                  {link.isNew && <span className="bg-[#C48B22]/10 text-[#C48B22] text-[8px] font-black px-1.5 py-0.5 rounded uppercase">New</span>}
                </Link>
                {/* Underline effect */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#C48B22] transition-all duration-300 scale-x-0 group-hover/link:scale-x-100 ${location.pathname === link.path ? 'scale-x-100' : ''}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="md:hidden fixed inset-0 z-50 bg-white p-6 space-y-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#C48B22] rounded-full flex items-center justify-center text-white font-serif text-lg font-bold mr-3">MC</div>
                  <span className="font-serif text-xl font-black text-[#2C2C2C]">MOONCREATION</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-full">
                  <CloseIcon size={24} />
                </button>
              </div>

              <form onSubmit={handleSearch} className="relative">
                <input 
                  type="text" 
                  placeholder="Search for gifts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-6 pr-14 py-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium outline-none"
                />
                <button type="submit" className="absolute right-2 top-2 bottom-2 px-3 bg-[#C48B22] text-white rounded-lg">
                  <Search size={18} />
                </button>
              </form>

              <div className="space-y-2">
                {navLinks.map((link, index) => (
                  <Link 
                    key={index}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm font-bold text-[#2C2C2C]">{link.name}</span>
                    {link.isNew && <span className="bg-[#C48B22] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">New</span>}
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                 <button 
                  onClick={() => { setLanguage(language === 'en' ? 'ta' : 'en'); setIsMobileMenuOpen(false); }} 
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl gap-2"
                >
                  <Languages size={24} className="text-[#C48B22]" />
                  <span className="text-xs font-bold">{language === 'en' ? 'Switch to தமிழ்' : 'Switch to English'}</span>
                </button>
                <button 
                  onClick={() => { navigate('/wishlist'); setIsMobileMenuOpen(false); }}
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl gap-2"
                >
                  <Heart size={24} className="text-[#C48B22]" />
                  <span className="text-xs font-bold">Wishlist</span>
                </button>
                <button 
                  onClick={() => { navigate('/cart'); setIsMobileMenuOpen(false); }}
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl gap-2"
                >
                  <ShoppingCart size={24} className="text-[#C48B22]" />
                  <span className="text-xs font-bold">Cart</span>
                </button>
                <button 
                  onClick={() => { handleProfileClick(); setIsMobileMenuOpen(false); }}
                  className="flex flex-col items-center justify-center p-4 bg-[#2C2C2C] text-white rounded-xl gap-2"
                >
                  <User size={24} />
                  <span className="text-xs font-bold">{isLoggedIn ? 'Account' : 'Login'}</span>
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
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
      />
    </>
  );
}
