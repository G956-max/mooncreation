import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, Heart, Settings, LogOut, ChevronRight, MapPin, Phone, Mail, Edit3, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type TabType = 'profile' | 'orders' | 'wishlist' | 'settings';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'orders':
        return <OrdersTab />;
      case 'wishlist':
        return <WishlistTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-semibold text-gray-400">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.displayName || 'User'}</h2>
              <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <nav className="flex flex-col">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                My Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Package className="w-5 h-5 mr-3" />
                My Orders
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'wishlist'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Heart className="w-5 h-5 mr-3" />
                Wishlist
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                Account Settings
              </button>
              <div className="h-px bg-gray-100 my-2"></div>
              <button
                onClick={handleLogout}
                className="flex items-center px-6 py-4 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  const { user } = useAuth();
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <p className="text-gray-500 mt-1">Manage your personal information</p>
        </div>
        <button className="flex items-center text-sm font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <div className="flex items-center text-gray-500 mb-1">
            <User className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Full Name</span>
          </div>
          <p className="text-gray-900 font-medium">{user?.displayName || 'Not provided'}</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <div className="flex items-center text-gray-500 mb-1">
            <Mail className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Email Address</span>
          </div>
          <p className="text-gray-900 font-medium">{user?.email}</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <div className="flex items-center text-gray-500 mb-1">
            <Phone className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Phone Number</span>
          </div>
          <p className="text-gray-900 font-medium">+1 (555) 000-0000</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
          <div className="flex items-center text-gray-500 mb-1">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Location</span>
          </div>
          <p className="text-gray-900 font-medium">New York, USA</p>
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  const orders = [
    {
      id: 'ORD-84392',
      product: 'Ceramic Pour-Over Set',
      date: 'Oct 24, 2023',
      price: '$89.00',
      status: 'Delivered',
      image: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?w=500&q=80',
    },
    {
      id: 'ORD-73218',
      product: 'Linen Apron',
      date: 'Nov 12, 2023',
      price: '$45.00',
      status: 'Pending',
      image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&q=80',
    },
    {
      id: 'ORD-65421',
      product: 'Handcrafted Wooden Bowl',
      date: 'Dec 05, 2023',
      price: '$120.00',
      status: 'Cancelled',
      image: 'https://images.unsplash.com/photo-1596414086775-3e321507ed8c?w=500&q=80',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="flex flex-col sm:flex-row items-center p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow bg-white">
            <img src={order.image} alt={order.product} className="w-20 h-20 object-cover rounded-lg mb-4 sm:mb-0" />
            
            <div className="flex-1 sm:ml-6 text-center sm:text-left">
              <h3 className="text-lg font-semibold text-gray-900">{order.product}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 mt-1 space-y-1 sm:space-y-0 sm:space-x-4">
                <span>{order.date}</span>
                <span className="hidden sm:inline">•</span>
                <span className="font-medium text-gray-900">{order.price}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center sm:items-end mt-4 sm:mt-0 space-y-2">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">{order.id}</span>
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WishlistTab() {
  const wishlistItems = [
    {
      id: 1,
      name: 'Minimalist Desk Lamp',
      category: 'Lighting',
      price: '$145.00',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80',
    },
    {
      id: 2,
      name: 'Artisan Coffee Mug',
      category: 'Ceramics',
      price: '$28.00',
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80',
    },
    {
      id: 3,
      name: 'Woven Throw Blanket',
      category: 'Textiles',
      price: '$85.00',
      image: 'https://images.unsplash.com/photo-1580828369019-18a320237df1?w=500&q=80',
    },
    {
      id: 4,
      name: 'Leather Notebook',
      category: 'Stationery',
      price: '$42.00',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80',
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Wishlist</h2>
        <button className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="group relative border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
              <img
                src={item.image}
                alt={item.name}
                className="h-48 w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 hover:scale-110 transition-all shadow-sm">
                <Heart className="w-4 h-4 fill-current" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{item.category}</p>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 truncate">{item.name}</h3>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-900">{item.price}</p>
                <button className="text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  const { user } = useAuth();
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h2>
      
      <div className="space-y-10">
        {/* Edit Profile Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Edit Profile</h3>
          <form className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.displayName?.split(' ')[0] || ''}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.displayName?.split(' ')[1] || ''}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                defaultValue={user?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email address cannot be changed.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                defaultValue="+1 (555) 000-0000"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="pt-2">
              <button type="button" className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Save Changes
              </button>
            </div>
          </form>
        </section>

        {/* Change Password Section */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Change Password</h3>
          <form className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="pt-2">
              <button type="button" className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Update Password
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
