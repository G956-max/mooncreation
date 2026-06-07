import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Upload, CheckCircle2, ShieldCheck, Truck, Heart, Share2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useRequireAuth } from '../hooks/useRequireAuth';

export default function CustomChocolateDetail() {
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const { addToCart } = useStore();

  const [mainText, setMainText] = useState('Happy Birthday');
  const [fontFamily, setFontFamily] = useState('font-serif');
  const [recipientName, setRecipientName] = useState('John Doe');
  const [customDate, setCustomDate] = useState('12/08/2026');
  const [themeColor, setThemeColor] = useState('#D94A6E');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const price = 500; // Base price in ₹

  const fonts = [
    { name: 'Elegant Serif', value: 'font-serif' },
    { name: 'Modern Sans', value: 'font-sans' },
    { name: 'Monospace', value: 'font-mono' }
  ];

  const colors = [
    { name: 'Rose', value: '#D94A6E' },
    { name: 'Midnight', value: '#1E293B' },
    { name: 'Gold', value: '#C48B22' },
    { name: 'Mint', value: '#14B8A6' },
    { name: 'Lavender', value: '#8B5CF6' }
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPhotoUrl(url);
    }
  };

  const handleAddToCart = () => {
    requireAuth(() => {
      addToCart({
        id: `custom_chocolate_${Date.now()}`,
        name: `Customized Premium Chocolate`,
        price: price,
        category: 'Personalized Gifts',
        variant: `Color: ${themeColor}, Text: ${mainText}`,
        imageUrl: photoUrl || 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=400',
        quantity: quantity
      });
      alert('Custom chocolate added to cart!');
    });
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex text-sm font-medium text-gray-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/categories" className="hover:text-black transition-colors">Personalized Gifts</Link>
          <span className="mx-2">/</span>
          <span className="text-[#2C2C2C]">Customized Chocolates</span>
        </nav>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left: Real-time Wrapper Preview */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white rounded-2xl md:rounded-[32px] p-4 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden min-h-[480px] md:min-h-[600px]">
            <div className="absolute top-6 right-6 flex flex-col gap-2 z-10">
              <button 
                onClick={() => setIsInWishlist(!isInWishlist)}
                className="p-3 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 transition-all shadow-sm" 
              >
                <Heart size={20} className={isInWishlist ? "fill-red-500 text-red-500" : ""} />
              </button>
              <button className="p-3 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-[#2C2C2C] transition-all shadow-sm">
                <Share2 size={20} />
              </button>
            </div>

            {/* Simulated Chocolate Wrapper */}
            <div 
              className="relative w-[220px] h-[380px] sm:w-[280px] sm:h-[480px] rounded-sm shadow-2xl transition-all duration-500 overflow-hidden"
              style={{ backgroundColor: themeColor }}
            >
              {/* Foil top/bottom simulation */}
              <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-gray-300 to-transparent opacity-40"></div>
              <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-gray-300 to-transparent opacity-40"></div>
              
              {/* Zigzag edges */}
              <div className="absolute top-0 w-full h-2" style={{ backgroundImage: 'linear-gradient(135deg, transparent 5px, white 5px), linear-gradient(225deg, transparent 5px, white 5px)', backgroundSize: '10px 10px', backgroundPosition: 'left top', transform: 'translateY(-5px)' }}></div>
              <div className="absolute bottom-0 w-full h-2" style={{ backgroundImage: 'linear-gradient(45deg, transparent 5px, white 5px), linear-gradient(-45deg, transparent 5px, white 5px)', backgroundSize: '10px 10px', backgroundPosition: 'left bottom', transform: 'translateY(5px)' }}></div>

              {/* Wrapper Content */}
              <div className="absolute inset-0 p-6 flex flex-col items-center text-center text-white h-full justify-between">
                
                {/* Brand / Logo Area */}
                <div className="mt-4 border-b border-white/30 pb-4 w-full">
                  <h4 className="text-xs tracking-[0.3em] font-bold uppercase opacity-80">MoonCreation</h4>
                  <p className="text-[8px] uppercase tracking-widest opacity-60 mt-1">Premium Artisan Chocolate</p>
                </div>

                {/* Main Custom Text */}
                <h2 className={`text-xl sm:text-3xl font-bold mt-2 sm:mt-4 break-words w-full ${fontFamily} drop-shadow-md`}>
                  {mainText || 'Your Text Here'}
                </h2>

                {/* Custom Photo Area */}
                <div className="w-24 h-24 sm:w-40 sm:h-40 bg-white/10 border-2 border-dashed border-white/50 rounded-full flex items-center justify-center overflow-hidden my-2 sm:my-4 shadow-lg backdrop-blur-sm">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Custom upload" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white/70 text-sm font-medium px-4">Upload Photo</span>
                  )}
                </div>

                {/* Recipient Name & Date */}
                <div className="mb-2 sm:mb-6 w-full">
                  <h3 className={`text-sm sm:text-xl font-bold ${fontFamily} tracking-wide text-white drop-shadow-md`}>
                    {recipientName || 'Name'}
                  </h3>
                  <p className="text-[10px] sm:text-sm font-medium opacity-90 mt-0.5 sm:mt-1 tracking-widest bg-white/20 inline-block px-3 py-0.5 sm:px-4 sm:py-1 rounded-full backdrop-blur-sm">
                    {customDate || 'DD/MM/YYYY'}
                  </p>
                </div>

                <div className="w-full text-center opacity-60 text-[8px] uppercase tracking-widest pb-2">
                  100% Pure Cocoa
                </div>
              </div>

              {/* Shadow Overlay for cylindrical shape effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none mix-blend-overlay"></div>
            </div>
            
            <div className="mt-8 text-center flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 size={14} /> In Stock
              </span>
            </div>
          </div>

          {/* Right: Customization Controls */}
          <div className="w-full lg:w-1/2 space-y-5 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-xl md:text-5xl font-serif font-bold text-[#2C2C2C] leading-tight">
                Design Your Own Chocolate
              </h1>
              <p className="text-xl md:text-3xl font-bold text-[#C48B22]">₹{price}</p>
              <p className="text-gray-600 leading-relaxed text-sm md:text-lg">
                Create a sweet memory. Personalize the wrapper with your own text, photo, and favorite theme color. The perfect customized gift for any occasion.
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#2C2C2C] uppercase tracking-wider flex justify-between">
                  Main Text <span className="text-gray-400 font-normal">{mainText.length}/20</span>
                </label>
                <input 
                  type="text" 
                  maxLength={20}
                  value={mainText}
                  onChange={(e) => setMainText(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-[#C48B22] focus:ring-1 focus:ring-[#C48B22] transition-all"
                  placeholder="e.g. Happy Anniversary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#2C2C2C] uppercase tracking-wider">
                    Recipient Name
                  </label>
                  <input 
                    type="text" 
                    maxLength={15}
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-[#C48B22] transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#2C2C2C] uppercase tracking-wider">
                    Special Date
                  </label>
                  <input 
                    type="text" 
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-[#C48B22] transition-all"
                    placeholder="DD/MM/YYYY"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Font Selector */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#2C2C2C] uppercase tracking-wider">
                    Font Style
                  </label>
                  <select 
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-[#C48B22] transition-all appearance-none"
                  >
                    {fonts.map(font => (
                      <option key={font.value} value={font.value}>{font.name}</option>
                    ))}
                  </select>
                </div>

                {/* Theme Color */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#2C2C2C] uppercase tracking-wider">
                    Theme Color
                  </label>
                  <div className="flex gap-3 mt-2">
                    {colors.map(color => (
                      <button
                        key={color.value}
                        onClick={() => setThemeColor(color.value)}
                        className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm ${themeColor === color.value ? 'border-gray-900 scale-110 shadow-md' : 'border-transparent hover:scale-110'}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#2C2C2C] uppercase tracking-wider">
                  Upload Photo
                </label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white hover:bg-gray-50 hover:border-[#C48B22] transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400 group-hover:text-[#C48B22] transition-colors" />
                    <p className="mb-2 text-sm text-gray-500 font-medium"><span className="font-bold text-[#C48B22]">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-400">PNG, JPG or JPEG (Square ratio recommended)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
              </div>

            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4 md:space-y-6 pt-4 md:pt-8 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-6">
                <div className="flex items-center justify-between bg-white rounded-xl md:rounded-2xl border border-gray-100 p-1 shadow-sm w-full sm:w-auto">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 md:p-3 text-gray-400 hover:text-black transition-colors text-sm md:text-base"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-sm md:text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 md:p-3 text-gray-400 hover:text-black transition-colors text-sm md:text-base"
                  >
                    +
                  </button>
                </div>
                <div className="flex-1">
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-[#2C2C2C] text-white py-2.5 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-black text-xs md:text-sm transition-all shadow-lg md:shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} /> Add to Cart - ₹{price * quantity}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-4 text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <Truck size={18} className="text-gray-400" />
                  <span>Fast Delivery Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-gray-400" />
                  <span>Secure Customization</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
