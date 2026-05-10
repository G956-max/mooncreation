import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OfferSlider from '../components/OfferSlider';
import ProductGrid from '../components/ProductGrid';
import CategoryGrid from '../components/CategoryGrid';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=2000",
    title: "Crafted for Life",
    subtitle: "Discover unique, handcrafted pieces that bring warmth and character to your everyday spaces."
  },
  {
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=2000",
    title: "MOONCREATION Ceramics",
    subtitle: "Elevate your dining experience with our hand-thrown pottery collection."
  },
  {
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=2000",
    title: "Organic Textiles",
    subtitle: "Wrap yourself in comfort with our sustainably sourced linen and cotton throws."
  }
];

export default function Home() {
  const requireAuth = useRequireAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
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
    <div className="h-auto bg-[#FAF9F6] m-0 p-0">
      <OfferSlider />
      
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden group !mt-0 !pt-0 !mb-0 !pb-0 bg-[#1a1a1a] min-h-[400px] md:min-h-[600px]">
        <div className="grid grid-cols-1">
          {slides.map((slide, index) => (
            <div 
              key={index}
              onClick={() => requireAuth(() => navigate('/categories'))}
              className={`col-start-1 row-start-1 w-full transition-opacity duration-1000 ease-in-out cursor-pointer ${
                index === currentSlide ? 'opacity-100 z-10 relative' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img 
                src={slide.image} 
                alt={slide.title || "Hero banner"} 
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            { (slide.title || slide.subtitle) && (
              <>
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-full">
                    {slide.title && (
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white font-bold mb-6 drop-shadow-xl">
                        {slide.title}
                      </h1>
                    )}
                    {slide.subtitle && (
                      <p className="text-lg md:text-xl text-white/95 mb-10 font-medium drop-shadow-md max-w-2xl px-4">
                        {slide.subtitle}
                      </p>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        requireAuth(() => navigate('/categories'));
                      }}
                      className="bg-white text-[#2C2C2C] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-xl mt-4"
                    >
                      Shop the Collection
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
        </div>

        {/* Controls */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Explore by Material */}
      <CategoryGrid title="Explore by Material" />
      
      {/* Featured Creations */}
      <ProductGrid title="Featured Creations" count={8} />
    </div>
  );
}
