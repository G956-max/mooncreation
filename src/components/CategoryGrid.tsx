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
  // Occasion Based
  { id: '1', name: 'Birthday Gifts', imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400' },
  { id: '2', name: 'Anniversary Gifts', imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400' },
  { id: '3', name: 'Wedding Gifts', imageUrl: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=400' },
  { id: '4', name: 'Baby Shower Gifts', imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=400' },
  { id: '5', name: "Valentine's Day Gifts", imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400' },
  { id: '6', name: "Mother's Day Gifts", imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400' },
  { id: '7', name: "Father's Day Gifts", imageUrl: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=400' },
  { id: '8', name: 'Friendship Day Gifts', imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953eb1f5ff?auto=format&fit=crop&q=80&w=400' },
  { id: '9', name: 'Graduation Gifts', imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400' },
  
  // Personalized Gifts
  { id: '10', name: 'Photo Gifts', imageUrl: 'https://images.unsplash.com/photo-1579541591970-e56e8efcdd3e?auto=format&fit=crop&q=80&w=400' },
  { id: '11', name: 'Name Printed Gifts', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400' },
  { id: '12', name: 'Customized Chocolates', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=400' },
  { id: '13', name: 'Customized Frames', imageUrl: 'https://images.unsplash.com/photo-1579541591970-e56e8efcdd3e?auto=format&fit=crop&q=80&w=400' },
  { id: '14', name: 'Photo Lamps', imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=400' },
  { id: '15', name: 'Name Wallets', imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=400' },
  { id: '16', name: 'Customized Mugs', imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=400' },
  { id: '17', name: 'Spotify Frames', imageUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80&w=400' },
  { id: '18', name: 'Photo Pillows', imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&q=80&w=400' },
  
  // Gifts by Person
  { id: '19', name: 'Gifts for Him', imageUrl: 'https://images.unsplash.com/photo-1490578474895-699bc4e3f44f?auto=format&fit=crop&q=80&w=400' },
  { id: '20', name: 'Gifts for Her', imageUrl: 'https://images.unsplash.com/photo-1512413914561-12501cb9b1e9?auto=format&fit=crop&q=80&w=400' },
  { id: '21', name: 'Gifts for Husband', imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400' },
  { id: '22', name: 'Gifts for Wife', imageUrl: 'https://images.unsplash.com/photo-1512413914561-12501cb9b1e9?auto=format&fit=crop&q=80&w=400' },
  { id: '23', name: 'Gifts for Boyfriend', imageUrl: 'https://images.unsplash.com/photo-1490578474895-699bc4e3f44f?auto=format&fit=crop&q=80&w=400' },
  { id: '24', name: 'Gifts for Girlfriend', imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400' },
  { id: '25', name: 'Gifts for Kids', imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=400' },
  { id: '26', name: 'Gifts for Friends', imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953eb1f5ff?auto=format&fit=crop&q=80&w=400' },
  { id: '27', name: 'Gifts for Parents', imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=400' },

  // Combo Categories
  { id: '28', name: 'Chocolate Combo', imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=400' },
  { id: '29', name: 'Couple Combo', imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400' },
  { id: '30', name: 'Surprise Box Combo', imageUrl: 'https://images.unsplash.com/photo-1549465220-1d8c9d9c4701?auto=format&fit=crop&q=80&w=400' },
  { id: '31', name: 'Birthday Combo', imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8892bf309c?auto=format&fit=crop&q=80&w=400' },
  { id: '32', name: 'Love Combo', imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400' },
];

interface CategoryGridProps {
  title: string;
  filterList?: string[];
}

export default function CategoryGrid({ title, filterList }: CategoryGridProps) {
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
    <section className="w-full px-3 md:px-12 py-5 md:py-16 bg-white">
      <div className="flex justify-between items-center mb-4 md:mb-10">
        <h2 className="text-base md:text-2xl font-bold text-[#2C2C2C]">{title}</h2>
        <button 
          onClick={() => navigate('/categories')}
          className="text-[10px] md:text-xs font-bold text-[#C48B22] uppercase tracking-widest hover:text-[#A6751C] transition-colors"
        >
          {t('viewAll')}
        </button>
      </div>
      
      <div className="grid grid-cols-4 md:grid-cols-8 gap-y-5 md:gap-y-8 gap-x-2">
        {categories
          .filter(c => !filterList || filterList.includes(c.name))
          .slice(0, filterList ? filterList.length : 7)
          .map((category) => (
          <div 
            key={category.id} 
            className="group cursor-pointer flex flex-col items-center gap-1.5 md:gap-4"
            onClick={() => navigate(`/category/${encodeURIComponent(category.name)}`)}
          >
            <div className="w-12 h-12 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-gray-50 group-hover:border-[#C48B22] transition-all duration-300 shadow-sm">
              <img 
                src={category.imageUrl} 
                alt={category.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="text-[8px] md:text-xs font-bold text-[#2C2C2C] text-center leading-tight group-hover:text-[#C48B22] transition-colors px-0.5">
              {category.name}
            </h3>
          </div>
        ))}
        
        {/* "More" button */}
        <div 
          className="group cursor-pointer flex flex-col items-center gap-1.5 md:gap-4"
          onClick={() => navigate('/categories')}
        >
          <div className="w-12 h-12 md:w-24 md:h-24 rounded-full bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200 group-hover:border-[#C48B22] group-hover:bg-white transition-all duration-300">
            <MoreHorizontal size={20} className="text-gray-300 group-hover:text-[#C48B22] transition-colors md:w-6 md:h-6" />
          </div>
          <h3 className="text-[8px] md:text-xs font-bold text-[#2C2C2C] text-center leading-tight group-hover:text-[#C48B22] transition-colors">
            {t('more')}
          </h3>
        </div>
      </div>
    </section>
  );
}
