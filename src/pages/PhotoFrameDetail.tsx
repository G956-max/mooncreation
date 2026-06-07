import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ShieldCheck, Truck, ArrowLeft, Heart, Share2, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useRequireAuth } from '../hooks/useRequireAuth';

export default function PhotoFrameDetail() {
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const { addToCart } = useStore();

  const [selectedSize, setSelectedSize] = useState('12x18');
  const [frameColor, setFrameColor] = useState('black');
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Pricing based on size
  const pricing: Record<string, number> = {
    '12x18': 1200,
    '18x24': 1800,
    '24x36': 2500,
  };

  const currentPrice = pricing[selectedSize];

  const handleAddToCart = () => {
    requireAuth(() => {
      addToCart({
        id: `photo_frame_${selectedSize}_${frameColor}`,
        name: `Premium Photo Frame (${selectedSize})`,
        price: currentPrice,
        category: 'Personalized Gifts',
        variant: `Size: ${selectedSize}, Frame: ${frameColor}`,
        imageUrl: 'https://images.unsplash.com/photo-1579541591970-e56e8efcdd3e?auto=format&fit=crop&q=80&w=400',
        quantity: quantity
      });
      alert('Photo frame added to cart!');
    });
  };

  // Determine relative dimensions for the 3D preview
  const getPreviewDimensions = () => {
    switch(selectedSize) {
      case '12x18': return { width: '200px', height: '300px' };
      case '18x24': return { width: '240px', height: '320px' };
      case '24x36': return { width: '280px', height: '420px' };
      default: return { width: '200px', height: '300px' };
    }
  };

  const getFrameColorValue = () => {
    switch(frameColor) {
      case 'black': return '#1a1a1a';
      case 'white': return '#f5f5f5';
      case 'wood': return '#8B5A2B';
      default: return '#1a1a1a';
    }
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
          <span className="text-[#2C2C2C]">Custom Photo Frame</span>
        </nav>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left: 3D Interactive Preview */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white rounded-2xl md:rounded-[32px] p-4 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden min-h-[350px] md:min-h-[500px]">
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

            {/* 3D Stage */}
            <div 
              className="perspective-[1000px] flex items-center justify-center transition-all duration-700 ease-in-out h-[300px] md:h-[450px]"
            >
              <div 
                className="relative transition-all duration-700 ease-in-out group"
                style={{
                  ...getPreviewDimensions(),
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(-15deg) rotateX(5deg)',
                }}
              >
                {/* Frame Body */}
                <div 
                  className="absolute inset-0 shadow-2xl transition-all duration-700"
                  style={{
                    backgroundColor: getFrameColorValue(),
                    padding: '12px',
                    borderRadius: '4px',
                    boxShadow: '20px 20px 40px rgba(0,0,0,0.2), inset 0 0 10px rgba(0,0,0,0.5)'
                  }}
                >
                  {/* Passepartout (Matte Board) */}
                  <div className="w-full h-full bg-white p-4 shadow-inner">
                    {/* Inner Photo */}
                    <img 
                      src="https://images.unsplash.com/photo-1579541591970-e56e8efcdd3e?auto=format&fit=crop&q=80&w=400" 
                      alt="Template" 
                      className="w-full h-full object-cover shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                
                {/* 3D Depth edge (Side of the frame) */}
                <div 
                  className="absolute top-0 right-0 h-full w-4 origin-right transition-colors duration-700"
                  style={{
                    backgroundColor: getFrameColorValue(),
                    transform: 'rotateY(-90deg)',
                    filter: 'brightness(0.6)'
                  }}
                />
              </div>
            </div>
            
            <div className="mt-8 text-center text-sm text-gray-500 flex items-center gap-2">
              <Info size={16} /> Interactive 3D Preview (Proportional to selected size)
            </div>
          </div>

          {/* Right: Customization Controls */}
          <div className="w-full lg:w-1/2 space-y-5 md:space-y-8">
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-xl md:text-5xl font-serif font-bold text-[#2C2C2C] leading-tight">
                Premium Custom Photo Frame
              </h1>
              <p className="text-xl md:text-3xl font-bold text-[#C48B22]">₹{currentPrice}</p>
              <p className="text-gray-600 leading-relaxed text-sm md:text-lg">
                Beautifully crafted frames to preserve your finest moments. The 3D preview dynamically adjusts proportionally to match your selected size.
              </p>
            </div>

            {/* Size Selector */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#2C2C2C] uppercase tracking-wider">
                Select Size (Inches)
              </h3>
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {Object.keys(pricing).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm transition-all border-2 flex flex-col items-center justify-center gap-1 ${
                      selectedSize === size 
                        ? 'bg-[#2C2C2C] text-white border-[#2C2C2C] shadow-lg shadow-black/10' 
                        : 'bg-white text-[#2C2C2C] border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <span>{size}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#2C2C2C] uppercase tracking-wider">
                Frame Finish
              </h3>
              <div className="flex gap-3 md:gap-4">
                <button
                  onClick={() => setFrameColor('black')}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1a1a1a] border-4 transition-all ${frameColor === 'black' ? 'border-[#C48B22] scale-110' : 'border-transparent'}`}
                  title="Matte Black"
                />
                <button
                  onClick={() => setFrameColor('white')}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#f5f5f5] border-4 transition-all ${frameColor === 'white' ? 'border-[#C48B22] scale-110' : 'border-gray-200'}`}
                  title="Pristine White"
                />
                <button
                  onClick={() => setFrameColor('wood')}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#8B5A2B] border-4 transition-all ${frameColor === 'wood' ? 'border-[#C48B22] scale-110' : 'border-transparent'}`}
                  title="Natural Wood"
                />
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4 md:space-y-6 pt-4 md:pt-6 border-t border-gray-100">
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
                    <ShoppingCart size={16} /> Add to Cart - ₹{currentPrice * quantity}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-4 text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <Truck size={18} className="text-gray-400" />
                  <span>Ships in 24 hrs</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-gray-400" />
                  <span>Quality Guarantee</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
