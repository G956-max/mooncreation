import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  subText?: string;
}

const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Ceramics', imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800' },
  { id: '2', name: 'Textiles', imageUrl: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&q=80&w=800' },
  { id: '3', name: 'Woodwork', imageUrl: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800' },
  { id: '4', name: 'Glassware', imageUrl: 'https://images.unsplash.com/photo-1576020799627-0cb4effc8c31?auto=format&fit=crop&q=80&w=800' },
];

interface CategoryGridProps {
  title: string;
}

export default function CategoryGrid({ title }: CategoryGridProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const firebaseCategories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      
      if (firebaseCategories.length > 0) {
        setCategories(firebaseCategories);
      } else {
        setCategories(MOCK_CATEGORIES);
      }
    }, (err) => {
      console.error("Error fetching categories:", err);
      setCategories(MOCK_CATEGORIES);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-end mb-4 m-0 p-0">
        <h2 className="text-3xl font-serif font-bold text-[#2C2C2C] m-0 leading-none">{title}</h2>
        {title !== "" && (
          <button 
            onClick={() => navigate('/categories')}
            className="text-sm font-medium text-gray-500 hover:text-black transition-colors border-b border-transparent hover:border-black pb-1"
          >
            View All
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.slice(0, title === "" ? categories.length : 4).map((category) => (
          <div 
            key={category.id} 
            className="group cursor-pointer relative overflow-hidden rounded-lg aspect-square w-full"
            onClick={() => navigate(`/category/${encodeURIComponent(category.name)}`)}
          >
            <img 
              src={category.imageUrl} 
              alt={category.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
              <h3 className="text-2xl font-serif font-bold tracking-wide">{category.name}</h3>
              {category.subText && <p className="text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{category.subText}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
