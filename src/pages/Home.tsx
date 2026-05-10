import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OfferSlider from '../components/OfferSlider';
import ProductGrid from '../components/ProductGrid';
import CategoryGrid from '../components/CategoryGrid';
import FeatureBar from '../components/FeatureBar';
import SpecialOffers from '../components/SpecialOffers';
import WhyChooseUs from '../components/WhyChooseUs';
import WhatsAppButton from '../components/WhatsAppButton';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const requireAuth = useRequireAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1549465220-1d8c9d9c4701?auto=format&fit=crop&q=80&w=2000",
      title: "Create Memories That Last Forever",
      subtitle: "Personalized gifts that speak from the heart and stay in memories forever."
    },
    {
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=2000",
      title: "Unique Birthday Surprises",
      subtitle: "Make their special day unforgettable with our curated gift collections."
    }
  ];

  const [slides, setSlides] = useState(heroSlides);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBanners = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'banners'));
        const bannerDocs = querySnapshot.docs.map(doc => doc.data() as {image: string, title: string, subtitle: string});
        if (bannerDocs.length > 0) {
          setSlides(bannerDocs);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="h-auto bg-white m-0 p-0">
      <OfferSlider />
      
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden group !mt-0 !pt-0 !mb-0 !pb-0 bg-gray-50 min-h-[400px] md:min-h-[500px]">
        <div className="grid grid-cols-1 h-full">
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={`col-start-1 row-start-1 w-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10 relative' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <div className="flex flex-col md:flex-row items-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-0">
                <div className="w-full md:w-1/2 space-y-6 md:space-y-8 text-center md:text-left z-20">
                  <h1 className="text-4xl md:text-6xl font-serif text-[#2C2C2C] font-bold leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg text-gray-600 max-w-md mx-auto md:mx-0">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <button 
                      onClick={() => requireAuth(() => navigate('/categories'))}
                      className="bg-[#C48B22] text-white px-8 py-4 rounded-lg font-bold text-sm hover:bg-[#A6751C] hover:scale-105 transition-all shadow-lg uppercase tracking-wider"
                    >
                      {t('shopNow')}
                    </button>
                    <button 
                      onClick={() => requireAuth(() => navigate('/categories'))}
                      className="bg-white text-[#2C2C2C] border-2 border-gray-100 px-8 py-4 rounded-lg font-bold text-sm hover:border-[#C48B22] hover:text-[#C48B22] hover:scale-105 transition-all shadow-sm uppercase tracking-wider flex items-center gap-2"
                    >
                      {t('customizeGift')} 🎁
                    </button>
                  </div>
                </div>
                <div className="w-full md:w-1/2 h-[300px] md:h-[500px] mt-8 md:mt-0 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-transparent to-transparent z-10 hidden md:block" />
                  <img 
                    src={slide.image} 
                    alt={slide.title || "Hero banner"} 
                    className="w-full h-full object-cover rounded-3xl md:rounded-none shadow-2xl md:shadow-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        {slides.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#2C2C2C] shadow-md transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#2C2C2C] shadow-md transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide ? 'bg-[#C48B22] w-6' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Features Bar */}
      <FeatureBar />

      {/* Special Offers Banner */}
      <SpecialOffers />

      {/* Shop By Category */}
      <CategoryGrid title={t('shopByCategory')} />
      
      {/* Trending Gifts */}
      <ProductGrid title={t('trendingGifts')} count={6} />

      {/* New Arrivals */}
      <ProductGrid title={t('newArrivals')} count={6} />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
