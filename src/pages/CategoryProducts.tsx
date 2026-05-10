import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Product as MockProduct } from '../data/products';

interface FirebaseProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  subCategory?: string;
  imageUrl: string;
  status?: string;
}

interface CategoryData {
  name: string;
  subcategories?: string[];
}

export default function CategoryProducts() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<FirebaseProduct[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        if (!categoryName) return;

        // Fetch category details to get subcategories
        const catQuery = query(collection(db, 'categories'), where('name', '==', categoryName));
        const catDocSnap = await getDocs(catQuery);
        if (!catDocSnap.empty) {
          const catData = catDocSnap.docs[0].data() as CategoryData;
          setSubcategories(catData.subcategories || []);
        }
        
        // Query products that match the category name and are published
        const q = query(
          collection(db, 'products'),
          where('category', '==', categoryName)
        );
        
        const querySnapshot = await getDocs(q);
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FirebaseProduct[];
        
        const publishedProducts = productsList.filter(p => p.status === 'published' || !p.status);
        setProducts(publishedProducts);
      } catch (err) {
        console.error("Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  return (
    <div className="pt-20 pb-16 min-h-screen bg-[#FAF9F6]">
      <section className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold text-[#2C2C2C] mb-4">
            {categoryName} Products
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Explore our curated selection of handcrafted {categoryName?.toLowerCase()} items.
          </p>
        </div>

        {/* Subcategories Filter */}
        {subcategories.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedSubCategory('All')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedSubCategory === 'All'
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-black'
              }`}
            >
              All {categoryName}
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubCategory(sub)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedSubCategory === sub
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-black'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex justify-center items-center h-64 flex-col gap-4">
            <p className="text-lg text-gray-500">No products found for this category.</p>
            <Link to="/categories" className="px-6 py-2 bg-[#2C2C2C] text-white rounded-md hover:bg-black transition-colors">
              Browse All Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products
              .filter(p => selectedSubCategory === 'All' || p.subCategory === selectedSubCategory)
              .map((product) => (
                <Link 
                  to={`/product/${product.id}`}
                  key={product.id} 
                  className="group cursor-pointer flex flex-col h-full"
                >
                  <div className="h-[250px] w-full overflow-hidden bg-gray-100 rounded-lg mb-4 relative shrink-0">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <div className="flex justify-between items-start flex-1">
                    <div className="flex flex-col justify-between h-full">
                      <h3 className="text-lg font-medium text-[#2C2C2C] line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{product.subCategory || product.category}</p>
                    </div>
                    <p className="text-lg font-medium text-[#2C2C2C] ml-4 shrink-0">${product.price}</p>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
