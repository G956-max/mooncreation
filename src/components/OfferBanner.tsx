import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Sparkles, Heart, Star, Percent } from 'lucide-react';

export default function OfferBanner() {
  const offers = [
    {
      title: "Birthday Offers",
      subtitle: "Up to 20% Off",
      icon: <Gift className="text-pink-500" size={28} />,
      color: "bg-pink-50",
      borderColor: "border-pink-200",
      link: "/offer/birthday"
    },
    {
      title: "Combo Offers",
      subtitle: "Save More Together",
      icon: <Sparkles className="text-purple-500" size={28} />,
      color: "bg-purple-50",
      borderColor: "border-purple-200",
      link: "/offer/combo"
    },
    {
      title: "Customized Gifts",
      subtitle: "Make it Personal",
      icon: <Heart className="text-red-500" size={28} />,
      color: "bg-red-50",
      borderColor: "border-red-200",
      link: "/offer/customized"
    },
    {
      title: "Festival Offers",
      subtitle: "Celebrate with Joy",
      icon: <Star className="text-yellow-500" size={28} />,
      color: "bg-yellow-50",
      borderColor: "border-yellow-200",
      link: "/offer/festival"
    },
    {
      title: "Buy 1 Get 1",
      subtitle: "Limited Time Deal",
      icon: <Percent className="text-green-500" size={28} />,
      color: "bg-green-50",
      borderColor: "border-green-200",
      link: "/offer/bogo"
    }
  ];

  return (
    <div className="w-full bg-white py-4 md:py-6 border-b border-gray-100 overflow-hidden">
      <div className="w-full flex overflow-x-auto no-scrollbar px-3 sm:px-8 lg:px-12 gap-3 md:gap-4 pb-3 snap-x">
        {offers.map((offer, idx) => (
          <Link 
            key={idx} 
            to={offer.link}
            className={`flex-shrink-0 w-56 md:w-72 p-3 md:p-4 rounded-xl md:rounded-2xl border ${offer.borderColor} ${offer.color} flex items-center gap-3 md:gap-4 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 snap-center cursor-pointer`}
          >
            <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-lg md:rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              {offer.icon}
            </div>
            <div>
              <h3 className="font-bold text-[#2C2C2C] text-sm md:text-lg leading-tight">{offer.title}</h3>
              <p className="text-[10px] md:text-xs font-medium text-gray-600 uppercase tracking-wider mt-0.5">{offer.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
