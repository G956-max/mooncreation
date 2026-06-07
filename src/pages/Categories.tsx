import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import CategoryGrid from '../components/CategoryGrid';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  rating?: number;
  reviews?: number;
}

export default function Categories() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery) return;
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      const filtered = productList.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProducts(filtered);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching products for search:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [searchQuery]);

  if (searchQuery) {
    return (
      <div className="pt-16 pb-12 md:pt-20 md:pb-16 min-h-screen bg-[#FAF9F6]">
        <div className="w-full px-4 sm:px-6 lg:px-8 mb-6 md:mb-12">
          <h1 className="text-xl md:text-4xl font-serif font-bold text-[#2C2C2C] mb-2 md:mb-4">
            Search Results for "{searchQuery}"
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Found {products.length} products matching your search query.
          </p>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-gray-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex justify-center items-center h-64 flex-col gap-4">
              <p className="text-lg text-gray-500">No products found matching "{searchQuery}".</p>
              <button 
                onClick={() => navigate('/categories')} 
                className="px-6 py-2 bg-[#2C2C2C] text-white rounded-md hover:bg-black transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
              {products.map((product) => (
                <div key={product.id} className="group bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-2">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      onClick={() => toggleWishlist({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        category: product.category,
                        imageUrl: product.imageUrl
                      })}
                      className={`absolute top-2 right-2 p-1.5 md:p-2 rounded-full shadow-md transition-all ${
                        isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-400 hover:bg-white hover:text-red-500'
                      }`}
                    >
                      <Heart size={14} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  
                  <div className="pt-3 pb-1 px-1">
                    <div className="flex items-center gap-1 mb-1 md:mb-2">
                      {product.rating && product.rating > 0 ? (
                        <>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={8} fill={i < product.rating ? "#FFD700" : "none"} className={i < product.rating ? "text-[#FFD700]" : "text-gray-300"} />
                          ))}
                          <span className="text-[8px] md:text-[10px] text-gray-400 ml-1">{product.rating}</span>
                        </>
                      ) : (
                        <span className="text-[8px] md:text-[10px] text-gray-400 font-medium">No ratings</span>
                      )}
                    </div>
                    <h3 className="text-xs md:text-sm font-bold text-[#2C2C2C] mb-1 line-clamp-1 group-hover:text-[#C48B22] transition-colors cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs md:text-lg font-black text-[#2C2C2C]">₹{product.price.toLocaleString()}</span>
                      <button 
                        onClick={() => addToCart({ ...product, quantity: 1, variant: 'Standard' })}
                        className="bg-[#C48B22] text-white px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-lg text-[9px] md:text-xs font-bold flex items-center gap-1 hover:bg-[#A6751C] transition-colors"
                      >
                        <ShoppingCart size={10} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-12 md:pt-20 md:pb-16 bg-[#FAF9F6] min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8 mb-6 md:mb-12">
        <h1 className="text-xl md:text-4xl font-serif font-bold text-[#2C2C2C] mb-2 md:mb-4">{t('ourCollections')}</h1>
        <p className="text-gray-600 max-w-2xl">
          {t('collectionsSubtitle')}
        </p>
      </div>
      <CategoryGrid title="" />
    </div>
  );
}
