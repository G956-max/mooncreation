import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useRequireAuth } from '../hooks/useRequireAuth';

export default function Wishlist() {
  const { wishlistItems, toggleWishlist, addToCart } = useStore();
  const requireAuth = useRequireAuth();
  
  const handleAddToCart = (item: any) => {
    requireAuth(() => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        variant: 'Standard',
        imageUrl: item.imageUrl,
        quantity: 1
      });
      toggleWishlist(item); // Optional: safely remove from wishlist once added to cart
      alert('Added to cart!');
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-20">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold text-[#2C2C2C] mb-10 flex items-center gap-3">
          <Heart className="text-red-500 fill-red-500" size={32} />
          Your Wishlist ({wishlistItems.length})
        </h1>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistItems.map((item) => (
              <div key={item.id} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative">
                <button 
                  onClick={() => toggleWishlist(item)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-red-500 hover:text-red-700 transition-all shadow-sm"
                  title="Remove from Wishlist"
                >
                  <Trash2 size={16} />
                </button>
                
                <Link to={`/product/${item.id}`} className="h-[250px] w-full overflow-hidden block">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </Link>
                
                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#2C2C2C] line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-lg font-bold text-[#2C2C2C]">${item.price}</p>
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center gap-2 bg-[#2C2C2C] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black transition-colors"
                    >
                      <ShoppingCart size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[32px] border border-dashed border-gray-200">
            <Heart size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-[#2C2C2C] mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Found something you like? Tap the heart icon on any product to save it here for later.</p>
            <Link 
              to="/categories" 
              className="bg-[#2C2C2C] text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all inline-block shadow-lg"
            >
              Start Exploring
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
