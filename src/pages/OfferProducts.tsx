import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface FirebaseProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  subCategory?: string;
  imageUrl: string;
  status?: string;
}

interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  isActive: boolean;
  appliesTo: 'all' | 'specific';
  productIds: string[];
}

const offerMetadata: Record<string, { title: string; subtitle: string; icon: string }> = {
  birthday: { title: "Birthday Offers", subtitle: "Special handpicked birthday gifts and hampers.", icon: "🎁" },
  combo: { title: "Combo Offers", subtitle: "Save more when you buy curated gift combos together.", icon: "✨" },
  customized: { title: "Customized Gifts", subtitle: "Make it personal with custom engravings, prints, and custom frames.", icon: "❤️" },
  festival: { title: "Festival Offers", subtitle: "Celebrate festive occasions with joy and premium gift selections.", icon: "⭐" },
  bogo: { title: "Buy 1 Get 1 Offers", subtitle: "Limited time Buy 1 Get 1 Deals. Grab them now!", icon: "🏷️" }
};

export default function OfferProducts() {
  const { offerCode } = useParams<{ offerCode: string }>();
  const [products, setProducts] = useState<FirebaseProduct[]>([]);
  const [discountInfo, setDiscountInfo] = useState<Discount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfferProducts = async () => {
      setLoading(true);
      try {
        if (!offerCode) return;

        // Query active discounts matching the offer code in uppercase (e.g. BIRTHDAY, COMBO)
        const discountQuery = query(
          collection(db, 'discounts'),
          where('code', '==', offerCode.toUpperCase()),
          where('isActive', '==', true)
        );

        const discountSnap = await getDocs(discountQuery);
        if (discountSnap.empty) {
          setDiscountInfo(null);
          setProducts([]);
          setLoading(false);
          return;
        }

        const discountDoc = discountSnap.docs[0];
        const discountData = {
          id: discountDoc.id,
          ...discountDoc.data()
        } as Discount;
        setDiscountInfo(discountData);

        // Fetch all products
        const productsQuery = collection(db, 'products');
        const productsSnap = await getDocs(productsQuery);
        const allProducts = productsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FirebaseProduct[];

        // Filter published products
        const publishedProducts = allProducts.filter(p => p.status === 'published' || !p.status);

        // Filter products based on appliesTo
        if (discountData.appliesTo === 'all') {
          setProducts(publishedProducts);
        } else if (discountData.appliesTo === 'specific') {
          const matchedIds = discountData.productIds || [];
          const filtered = publishedProducts.filter(p => matchedIds.includes(p.id));
          setProducts(filtered);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching offer products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferProducts();
  }, [offerCode]);

  const meta = offerMetadata[offerCode?.toLowerCase() || ''] || {
    title: `${offerCode?.toUpperCase()} Offers`,
    subtitle: "Explore our exclusive promotional offers.",
    icon: "🏷️"
  };

  return (
    <div className="pt-16 pb-12 md:pt-20 md:pb-16 min-h-screen bg-[#FAF9F6]">
      <section className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-12 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl md:text-3xl">{meta.icon}</span>
              <h1 className="text-xl md:text-4xl font-serif font-bold text-[#2C2C2C]">
                {meta.title}
              </h1>
            </div>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl">
              {meta.subtitle}
            </p>
          </div>
          {discountInfo && (
            <div className="bg-[#C48B22]/10 border border-[#C48B22]/20 rounded-xl px-4 py-3 shrink-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-[#C48B22] uppercase tracking-wider">Active Offer</span>
              <span className="text-lg md:text-2xl font-black text-[#C48B22]">
                {discountInfo.type === 'percentage' ? `${discountInfo.value}% OFF` : `₹${discountInfo.value} OFF`}
              </span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 bg-white px-2 py-0.5 rounded-full border border-gray-100">
                Code: {discountInfo.code}
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex justify-center items-center h-80 flex-col gap-3 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <span className="text-4xl">🛍️</span>
            <p className="text-xl font-bold text-[#2C2C2C] tracking-tight mt-2">No More Product</p>
            <p className="text-sm text-gray-500 font-medium">No Offer</p>
            <Link to="/categories" className="mt-4 px-6 py-2 bg-[#2C2C2C] text-white rounded-md hover:bg-black transition-colors text-sm font-bold shadow-sm hover:shadow-md">
              Browse All Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {products.map((product) => (
              <Link 
                to={`/product/${product.id}`}
                key={product.id} 
                className="group cursor-pointer flex flex-col h-full bg-white p-2 rounded-xl border border-gray-50 shadow-sm"
              >
                <div className="h-[160px] md:h-[250px] w-full overflow-hidden bg-gray-100 rounded-lg mb-3 md:mb-4 relative shrink-0">
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
                    <h3 className="text-xs md:text-lg font-medium text-[#2C2C2C] line-clamp-1">{product.name}</h3>
                    <p className="text-[10px] md:text-sm text-gray-500 mt-0.5 md:mt-1">{product.subCategory || product.category}</p>
                  </div>
                  <p className="text-xs md:text-lg font-bold md:font-medium text-[#2C2C2C] ml-2 md:ml-4 shrink-0">₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
