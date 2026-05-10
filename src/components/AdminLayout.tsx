import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Tag, 
  Settings, 
  Search, 
  Bell, 
  Plus, 
  LogOut,
  Menu,
  X,
  Folder,
  Image as ImageIcon,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { group: 'OVERVIEW', items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
      { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    ]},
    { group: 'STORE MANAGEMENT', items: [
      { name: 'Products', icon: Package, path: '/admin/products' },
      { name: 'Categories', icon: Folder, path: '/admin/categories' },
      { name: 'Subcategories', icon: Layers, path: '/admin/subcategories' },
      { name: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
      { name: 'Customers', icon: Users, path: '/admin/customers' },
      { name: 'Discounts', icon: Tag, path: '/admin/discounts' },
      { name: 'Banners', icon: ImageIcon, path: '/admin/banners' },
    ]},
    { group: 'SYSTEM', items: [
      { name: 'Settings', icon: Settings, path: '/admin/settings' },
    ]}
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 fixed h-full z-50 flex flex-col shadow-sm`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <Link to="/admin" className="text-xl font-serif font-bold text-[#2C2C2C] tracking-tight">
              MOONCREATION<span className="text-gray-400 ml-1 text-xs font-sans uppercase tracking-widest">Admin</span>
            </Link>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto">
          {menuItems.map((group) => (
            <div key={group.group}>
              {isSidebarOpen && (
                <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-4 px-2 uppercase">
                  {group.group}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-[#2C2C2C] text-white font-medium shadow-md shadow-black/10' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                      {isSidebarOpen && <span className="text-sm">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={20} className="text-gray-400 group-hover:text-red-600" />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products, orders, or customers..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2C2C2C]/10 focus:border-[#2C2C2C] transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/admin/products/add"
              className="flex items-center gap-2 bg-[#2C2C2C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors shadow-sm"
            >
              <Plus size={18} />
              Add Product
            </Link>
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#2C2C2C]">{user?.email?.split('@')[0]}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 font-medium overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.email?.[0].toUpperCase()
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
