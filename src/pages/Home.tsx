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
      <section className="relative w-full overflow-hidden group !mt-0 !pt-0 !mb-0 !pb-0 bg-gray-900 min-h-[450px] md:min-h-[600px] flex items-center">
        {/* Full Banner Images */}
        <div className="absolute inset-0 w-full h-full">
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img 
                src={slide.image} 
                alt={slide.title || "Hero banner"} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-11 md:from-black/60 md:via-black/30" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-20 w-full mx-auto px-4 sm:px-8 lg:px-12 py-20 md:py-0">
          <div className="max-w-3xl space-y-6 md:space-y-8 text-center md:text-left">
            <h1 className="text-3xl md:text-6xl font-serif text-white font-bold leading-tight drop-shadow-xl">
              {slides[currentSlide]?.title}
            </h1>
            <p className="text-base md:text-xl text-white/90 max-w-sm md:max-w-md mx-auto md:mx-0 drop-shadow-lg line-clamp-2 md:line-clamp-none">
              {slides[currentSlide]?.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 sm:gap-4 px-8 sm:px-0">
              <button 
                onClick={() => requireAuth(() => navigate('/categories'))}
                className="bg-[#C48B22] text-white px-6 sm:px-10 py-3.5 sm:py-4 rounded-lg font-bold text-xs sm:text-sm hover:bg-[#A6751C] hover:scale-105 transition-all shadow-2xl uppercase tracking-wider"
              >
                {t('shopNow')}
              </button>
              <button 
                onClick={() => requireAuth(() => navigate('/categories'))}
                className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-6 sm:px-10 py-3.5 sm:py-4 rounded-lg font-bold text-xs sm:text-sm hover:bg-white hover:text-[#2C2C2C] hover:scale-105 transition-all shadow-2xl uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {t('customizeGift')} 🎁
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        {slides.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#2C2C2C] backdrop-blur-sm shadow-xl transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#2C2C2C] backdrop-blur-sm shadow-xl transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2 md:gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-[#C48B22] w-6 md:w-10' : 'bg-white/40 hover:bg-white/60'
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
