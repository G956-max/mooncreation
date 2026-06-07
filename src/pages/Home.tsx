import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OfferBanner from '../components/OfferBanner';
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
      <OfferBanner />
      
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden group !mt-0 !pt-0 !mb-0 !pb-0 bg-gray-900 aspect-[16/9] md:aspect-auto md:min-h-[500px] flex items-center">
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
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-11 md:from-black/60 md:via-black/30" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-20 w-full mx-auto px-4 sm:px-8 lg:px-12 py-2 md:py-0">
          <div className="max-w-3xl space-y-1 md:space-y-8 text-center md:text-left mt-2 md:mt-0">
            <h1 className="text-[14px] xs:text-xl md:text-5xl font-serif text-white font-bold leading-tight drop-shadow-xl">
              {slides[currentSlide]?.title}
            </h1>
            <p className="text-[9px] xs:text-xs md:text-lg text-white/90 max-w-[220px] xs:max-w-xs md:max-w-md mx-auto md:mx-0 drop-shadow-lg line-clamp-2 md:line-clamp-none">
              {slides[currentSlide]?.subtitle}
            </p>
            <div className="flex flex-row justify-center md:justify-start gap-2 pt-1 md:pt-0">
              <button 
                onClick={() => requireAuth(() => navigate('/categories'))}
                className="bg-[#C48B22] text-white px-2 py-1.5 md:px-10 md:py-4 rounded md:rounded-lg font-bold text-[8px] md:text-sm hover:bg-[#A6751C] hover:scale-105 transition-all shadow-2xl uppercase tracking-wider"
              >
                {t('shopNow')}
              </button>
              <button 
                onClick={() => requireAuth(() => navigate('/categories'))}
                className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-2 py-1.5 md:px-10 md:py-4 rounded md:rounded-lg font-bold text-[8px] md:text-sm hover:bg-white hover:text-[#2C2C2C] hover:scale-105 transition-all shadow-2xl uppercase tracking-wider flex items-center justify-center gap-1"
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

      {/* Occasion Based */}
      <CategoryGrid 
        title="Occasion Based" 
        filterList={[
          'Birthday Gifts', 'Anniversary Gifts', 'Wedding Gifts', 'Baby Shower Gifts', 
          "Valentine's Day Gifts", "Mother's Day Gifts", "Father's Day Gifts", 
          'Friendship Day Gifts', 'Graduation Gifts'
        ]} 
      />

      {/* Personalized Gifts */}
      <CategoryGrid 
        title="Personalized Gifts" 
        filterList={[
          'Photo Gifts', 'Name Printed Gifts', 'Customized Chocolates', 
          'Customized Frames', 'Photo Lamps', 'Name Wallets', 
          'Customized Mugs', 'Spotify Frames', 'Photo Pillows'
        ]} 
      />

      {/* Gifts by Person */}
      <CategoryGrid 
        title="Gifts by Person" 
        filterList={[
          'Gifts for Him', 'Gifts for Her', 'Gifts for Husband', 'Gifts for Wife', 
          'Gifts for Boyfriend', 'Gifts for Girlfriend', 'Gifts for Kids', 
          'Gifts for Friends', 'Gifts for Parents'
        ]} 
      />

      {/* Combo Categories */}
      <CategoryGrid 
        title="Combo Categories" 
        filterList={[
          'Chocolate Combo', 'Couple Combo', 'Surprise Box Combo', 
          'Birthday Combo', 'Love Combo'
        ]} 
      />
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
