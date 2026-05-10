import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Product as MockProduct, getRandomProducts } from '../data/products';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';

interface ProductGridProps {
  title: string;
  count?: number;
}

interface FirebaseProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  status?: string;
}

export default function ProductGrid({ title, count = 8 }: ProductGridProps) {
  const [products, setProducts] = useState<FirebaseProduct[] | MockProduct[]>([]);
  const requireAuth = useRequireAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FirebaseProduct[];
        
        const publishedProducts = productsList.filter(p => p.status === 'published' || !p.status);
        if (publishedProducts.length > 0) {
          setProducts(publishedProducts.slice(0, count));
        } else {
          setProducts(getRandomProducts(count));
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts(getRandomProducts(count));
      }
    };
    fetchProducts();
  }, [count]);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-end mb-4 m-0 p-0">
        <h2 className="text-3xl font-serif font-bold text-[#2C2C2C] m-0 leading-none">{title}</h2>
        <button 
          onClick={() => requireAuth()}
          className="text-sm font-medium text-gray-500 hover:text-black transition-colors border-b border-transparent hover:border-black pb-1"
        >
          View All
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Link 
            to={`/product/${product.id}`}
            key={product.id} 
            className="group cursor-pointer flex flex-col h-full"
          >
            <div className="h-[250px] w-full overflow-hidden bg-gray-100 rounded-lg mb-4 relative shrink-0">
              <img 
                src={'imageUrl' in product ? product.imageUrl : product.image} 
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            <div className="flex flex-col flex-1 p-2">
              <h3 className="text-sm font-bold text-[#2C2C2C] line-clamp-1 group-hover:text-[#C48B22] transition-colors">{product.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <p className="text-lg font-black text-[#2C2C2C]">₹{product.price}</p>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md">
                  <span className="text-[10px] font-bold text-yellow-700">4.9</span>
                  <Star size={10} className="fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
