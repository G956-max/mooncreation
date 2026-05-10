import { useEffect, useState } from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { useLanguage } from '../context/LanguageContext';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  rating?: number;
  reviews?: number;
}

interface ProductGridProps {
  title: string;
  count?: number;
}

export default function ProductGrid({ title, count = 8 }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productList.slice(0, count));
    });

    return () => unsubscribe();
  }, [count]);

  return (
    <section className="w-full px-4 md:px-12 py-12 md:py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl md:text-3xl font-serif font-bold text-[#2C2C2C]">{title}</h2>
        <button 
          onClick={() => navigate('/categories')}
          className="text-[10px] md:text-xs font-bold text-[#C48B22] uppercase tracking-widest hover:text-[#A6751C] transition-colors"
        >
          {t('viewAll')}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {products.map((product) => (
          <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              />
              <button 
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all ${
                  isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-400 hover:bg-white hover:text-red-500'
                }`}
              >
                <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-[#C48B22] text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={14} />
                  Add to Cart
                </button>
              </div>
            </div>
            
            <div className="p-3 md:p-5">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} fill={i < (product.rating || 4.5) ? "#FFD700" : "none"} className={i < (product.rating || 4.5) ? "text-[#FFD700]" : "text-gray-300"} />
                ))}
                <span className="text-[10px] text-gray-400 ml-1">{product.rating || 4.5}</span>
              </div>
              <h3 className="text-xs md:text-sm font-bold text-[#2C2C2C] mb-1 line-clamp-1 group-hover:text-[#C48B22] transition-colors cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                {product.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm md:text-lg font-black text-[#2C2C2C]">₹{product.price.toLocaleString()}</span>
                <span className="text-[10px] text-gray-400 line-through">₹{(product.price * 1.2).toFixed(0)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
