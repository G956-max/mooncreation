import { Home, Grid, Search, Heart, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlistItems } = useStore();
  const { t } = useLanguage();

  const navItems = [
    { icon: <Home size={24} />, label: 'Home', path: '/' },
    { icon: <Grid size={24} />, label: 'Categories', path: '/categories' },
    { icon: <Search size={24} />, label: 'Search', path: '#' }, // This can trigger the search focus
    { icon: <Heart size={24} />, label: 'Wishlist', path: '/wishlist', count: wishlistItems.length },
    { icon: <User size={24} />, label: 'Account', path: '/profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 h-16 flex items-center justify-around px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item, index) => (
        <button
          key={index}
          onClick={() => item.path !== '#' && navigate(item.path)}
          className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 relative ${
            location.pathname === item.path ? 'text-[#C48B22]' : 'text-gray-400'
          }`}
        >
          <div className="relative">
            {item.icon}
            {item.count !== undefined && item.count > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#C48B22] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {item.count}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
