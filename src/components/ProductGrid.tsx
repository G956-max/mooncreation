import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
            <div className="flex justify-between items-start flex-1">
              <div className="flex flex-col justify-between h-full">
                <h3 className="text-lg font-medium text-[#2C2C2C] line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
              </div>
              <p className="text-lg font-medium text-[#2C2C2C] ml-4 shrink-0">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
