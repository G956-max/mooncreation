import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../context/LanguageContext';
import { MoreHorizontal } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Birthday', imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400' },
  { id: '2', name: 'Anniversary', imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400' },
  { id: '3', name: "Valentine's Day", imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400' },
  { id: '4', name: 'Wedding', imageUrl: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=400' },
  { id: '5', name: "Mother's Day", imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400' },
  { id: '6', name: "Father's Day", imageUrl: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=400' },
  { id: '7', name: 'Graduation', imageUrl: 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?auto=format&fit=crop&q=80&w=400' },
];

interface CategoryGridProps {
  title: string;
}

export default function CategoryGrid({ title }: CategoryGridProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const { t } = useLanguage();

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
    <section className="w-full px-4 md:px-12 py-8 md:py-16 bg-white">
      <div className="flex justify-between items-center mb-6 md:mb-10">
        <h2 className="text-lg md:text-2xl font-bold text-[#2C2C2C]">{title}</h2>
        <button 
          onClick={() => navigate('/categories')}
          className="text-[10px] md:text-xs font-bold text-[#C48B22] uppercase tracking-widest hover:text-[#A6751C] transition-colors"
        >
          {t('viewAll')}
        </button>
      </div>
      
      <div className="grid grid-cols-4 md:grid-cols-8 gap-y-8 gap-x-2">
        {categories.slice(0, 7).map((category) => (
          <div 
            key={category.id} 
            className="group cursor-pointer flex flex-col items-center gap-2 md:gap-4"
            onClick={() => navigate(`/category/${encodeURIComponent(category.name)}`)}
          >
            <div className="w-14 h-14 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-gray-50 group-hover:border-[#C48B22] transition-all duration-300 shadow-sm">
              <img 
                src={category.imageUrl} 
                alt={category.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="text-[9px] md:text-xs font-bold text-[#2C2C2C] text-center leading-tight group-hover:text-[#C48B22] transition-colors px-1">
              {category.name}
            </h3>
          </div>
        ))}
        
        {/* "More" button */}
        <div 
          className="group cursor-pointer flex flex-col items-center gap-2 md:gap-4"
          onClick={() => navigate('/categories')}
        >
          <div className="w-14 h-14 md:w-24 md:h-24 rounded-full bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200 group-hover:border-[#C48B22] group-hover:bg-white transition-all duration-300">
            <MoreHorizontal size={24} className="text-gray-300 group-hover:text-[#C48B22] transition-colors" />
          </div>
          <h3 className="text-[9px] md:text-xs font-bold text-[#2C2C2C] text-center leading-tight group-hover:text-[#C48B22] transition-colors">
            {t('more')}
          </h3>
        </div>
      </div>
    </section>
  );
}
