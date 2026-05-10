import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut, 
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Camera,
  Lock,
  Trash2,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db, storage } from '../firebase';
import imageCompression from 'browser-image-compression';

type Tab = 'profile' | 'orders' | 'wishlist' | 'settings';

export default function UserDashboard() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(user?.photoURL || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dashboardProducts, setDashboardProducts] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().photoURL) {
            setProfileImage(docSnap.data().photoURL);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      };
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDashboardProducts(productsList);
      } catch (err) {
        console.error('Error fetching dashboard products:', err);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    setUploadingImage(true);
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 400,
        useWebWorker: true,
      };
      const compressedBlob = await imageCompression(file, options);

      const formData = new FormData();
      formData.append('file', compressedBlob);
      // FIXME: Update 'demo_cloud' and 'demo_preset' with actual Cloudinary credentials
      formData.append('upload_preset', 'demo_preset');

      const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/demo_cloud/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error('Upload failed');
      const uploadData = await uploadResponse.json();
      const downloadURL = uploadData.secure_url;
      
      await updateProfile(user, { photoURL: downloadURL });
      await setDoc(doc(db, 'users', user.uid), { photoURL: downloadURL }, { merge: true });
      setProfileImage(downloadURL);
      setUploadingImage(false);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert('Failed to update profile image.');
      setUploadingImage(false);
    }
  };

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  const orders = [
    {
      id: '#ORD-9281',
      product: 'Handcrafted Ceramic Vase',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=200',
      date: 'Mar 15, 2024',
      status: 'Delivered',
      price: '$89.00'
    },
    {
      id: '#ORD-9282',
      product: 'Organic Linen Throw',
      image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=200',
      date: 'Mar 10, 2024',
      status: 'Pending',
      price: '$124.00'
    },
    {
      id: '#ORD-9283',
      product: 'Hand-carved Oak Bowl',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=200',
      date: 'Feb 28, 2024',
      status: 'Cancelled',
      price: '$56.00'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 text-center border-b border-gray-50">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-[#FAF9F6] flex items-center justify-center text-2xl font-bold text-[#2C2C2C] overflow-hidden">
                    {uploadingImage ? (
                      <Loader2 size={24} className="animate-spin text-gray-400" />
                    ) : profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      user.email?.[0].toUpperCase()
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 text-gray-500 hover:text-black transition-colors disabled:opacity-50"
                  >
                    <Camera size={14} />
                  </button>
                </div>
                <h2 className="text-xl font-serif font-bold text-[#2C2C2C] truncate">
                  {user.displayName || user.email?.split('@')[0]}
                </h2>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id as Tab)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                          activeTab === item.id 
                            ? 'bg-[#2C2C2C] text-white shadow-lg shadow-black/5' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={18} />
                          <span className="font-medium text-sm">{item.label}</span>
                        </div>
                        <ChevronRight size={14} className={activeTab === item.id ? 'opacity-100' : 'opacity-0'} />
                      </button>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 pt-4 border-t border-gray-50">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-medium text-sm"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12 min-h-[600px]">
              
              {/* Profile Section */}
              {activeTab === 'profile' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-[#2C2C2C] mb-2">My Profile</h1>
                    <p className="text-gray-500">Manage your personal information and account security.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 bg-[#FAF9F6] rounded-3xl border border-gray-100">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white rounded-2xl text-[#2C2C2C] shadow-sm">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</p>
                          <p className="font-medium text-[#2C2C2C]">{user.displayName || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-[#FAF9F6] rounded-3xl border border-gray-100">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white rounded-2xl text-[#2C2C2C] shadow-sm">
                          <Mail size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                          <p className="font-medium text-[#2C2C2C]">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-[#FAF9F6] rounded-3xl border border-gray-100">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white rounded-2xl text-[#2C2C2C] shadow-sm">
                          <Phone size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
                          <p className="font-medium text-[#2C2C2C]">+1 (555) 000-0000</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 bg-[#FAF9F6] rounded-3xl border border-gray-100">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white rounded-2xl text-[#2C2C2C] shadow-sm">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</p>
                          <p className="font-medium text-[#2C2C2C]">California, USA</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-50 flex justify-end">
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className="bg-[#2C2C2C] text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-black/5"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}

              {/* Orders Section */}
              {activeTab === 'orders' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-[#2C2C2C] mb-2">My Orders</h1>
                    <p className="text-gray-500">Track your recent purchases and order history.</p>
                  </div>
                  
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="p-6 bg-[#FAF9F6] rounded-3xl border border-gray-100 flex flex-col md:flex-row items-center gap-6 group hover:border-gray-200 transition-all">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 flex-shrink-0">
                          <img src={order.image} alt={order.product} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        
                        <div className="flex-1 text-center md:text-left">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                            <h3 className="font-serif font-bold text-lg text-[#2C2C2C]">{order.product}</h3>
                            <span className="text-sm font-bold text-blue-600">{order.id}</span>
                          </div>
                          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              {order.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-[#2C2C2C]">{order.price}</span>
                            </div>
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'Pending' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {order.status === 'Delivered' && <CheckCircle size={10} />}
                              {order.status === 'Cancelled' && <XCircle size={10} />}
                              {order.status}
                            </div>
                          </div>
                        </div>
                        
                        <button className="p-4 bg-white rounded-2xl text-[#2C2C2C] hover:bg-black hover:text-white transition-all shadow-sm border border-gray-100 group-hover:translate-x-1">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wishlist Section */}
              {activeTab === 'wishlist' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-end">
                    <div>
                      <h1 className="text-3xl font-serif font-bold text-[#2C2C2C] mb-2">Available Products</h1>
                      <p className="text-gray-500">Discover all MOONCREATION pieces.</p>
                    </div>
                    <button className="text-sm font-bold text-red-500 hover:text-red-700 flex items-center gap-2 mb-1">
                      <Trash2 size={16} />
                      Clear All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {dashboardProducts.map((product) => (
                      <Link 
                        to={`/product/${product.id}`}
                        key={product.id} 
                        className="group cursor-pointer flex flex-col h-full"
                      >
                        <div className="h-[250px] w-full overflow-hidden bg-gray-100 rounded-3xl mb-4 relative shrink-0">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-red-500 shadow-sm hover:bg-white transition-all">
                            <Heart size={18} fill="currentColor" />
                          </button>
                        </div>
                        <div className="flex justify-between items-start flex-1 px-2">
                          <div>
                            <h3 className="text-lg font-serif font-bold text-[#2C2C2C] line-clamp-1">{product.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                          </div>
                          <p className="text-lg font-bold text-[#2C2C2C] ml-4 shrink-0">${product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Section */}
              {activeTab === 'settings' && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-[#2C2C2C] mb-2">Account Settings</h1>
                    <p className="text-gray-500">Update your account details and security preferences.</p>
                  </div>
                  
                  <div className="space-y-8">
                    <section>
                      <h2 className="text-xl font-serif font-bold text-[#2C2C2C] mb-6 flex items-center gap-3">
                        <User size={20} className="text-gray-400" />
                        Edit Profile
                      </h2>
                      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-[#2C2C2C]">Display Name</label>
                          <input 
                            type="text" 
                            defaultValue={user.displayName || ''}
                            className="w-full px-5 py-3 bg-[#FAF9F6] border-none rounded-2xl focus:ring-2 focus:ring-black/5 outline-none transition-all"
                            placeholder="Your Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-[#2C2C2C]">Email Address</label>
                          <input 
                            type="email" 
                            defaultValue={user.email || ''}
                            disabled
                            className="w-full px-5 py-3 bg-[#FAF9F6] border-none rounded-2xl opacity-60 cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-[#2C2C2C]">Phone Number</label>
                          <input 
                            type="tel" 
                            className="w-full px-5 py-3 bg-[#FAF9F6] border-none rounded-2xl focus:ring-2 focus:ring-black/5 outline-none transition-all"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                        <div className="flex items-end">
                          <button type="button" className="bg-[#2C2C2C] text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-black/5 w-full md:w-auto">
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </section>
                    
                    <div className="h-px bg-gray-50" />
                    
                    <section>
                      <h2 className="text-xl font-serif font-bold text-[#2C2C2C] mb-6 flex items-center gap-3">
                        <Lock size={20} className="text-gray-400" />
                        Change Password
                      </h2>
                      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-[#2C2C2C]">Current Password</label>
                          <input 
                            type="password" 
                            className="w-full px-5 py-3 bg-[#FAF9F6] border-none rounded-2xl focus:ring-2 focus:ring-black/5 outline-none transition-all"
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-[#2C2C2C]">New Password</label>
                          <input 
                            type="password" 
                            className="w-full px-5 py-3 bg-[#FAF9F6] border-none rounded-2xl focus:ring-2 focus:ring-black/5 outline-none transition-all"
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="flex items-end">
                          <button type="button" className="bg-white text-[#2C2C2C] border border-gray-200 px-8 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-all w-full md:w-auto">
                            Update Password
                          </button>
                        </div>
                      </form>
                    </section>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
