import { Gift, Package } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SpecialOffers() {
  const { t } = useLanguage();

  return (
    <div className="w-full mx-auto px-4 md:px-12 py-6 md:py-12">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        {/* Card 1: Flat Off */}
        <div className="bg-[#FFF5F5] rounded-2xl p-4 md:p-8 border border-red-100 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="z-10 text-center md:text-left">
            <h3 className="text-red-500 font-black text-xs md:text-2xl uppercase tracking-tighter">{t('flatOff')}</h3>
            <p className="text-[#2C2C2C] text-[8px] md:text-sm font-bold mb-3">{t('onCustomizedGifts')}</p>
            <button className="bg-[#2C2C2C] text-white text-[8px] md:text-xs px-3 py-1.5 md:px-6 md:py-2 rounded-lg font-bold uppercase tracking-wider hover:bg-black transition-colors">
              {t('shopNow')}
            </button>
          </div>
          <img src="https://cdn-icons-png.flaticon.com/512/2143/2143150.png" alt="Gift Box" className="w-12 h-12 md:w-24 md:h-24 object-contain md:relative absolute -right-2 -bottom-2 md:right-0 md:bottom-0 opacity-80 md:opacity-100" />
        </div>

        {/* Card 2: Combo Gifts */}
        <div className="bg-[#F6F9FF] rounded-2xl p-4 md:p-8 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="z-10 text-center md:text-left">
            <h3 className="text-blue-600 font-bold text-[10px] md:text-lg uppercase">Combo Gifts</h3>
            <p className="text-gray-500 text-[8px] md:text-sm font-medium">Starting from</p>
            <p className="text-[#2C2C2C] text-sm md:text-2xl font-black mb-3">₹699</p>
            {/* Added small image overlay like screenshot */}
          </div>
          <div className="w-12 h-12 md:w-24 md:h-24 bg-white rounded-xl shadow-sm overflow-hidden md:relative absolute -right-2 -bottom-2 md:right-0 md:bottom-0">
            <img src="https://images.unsplash.com/photo-1549465220-1d8c9d9c4701?auto=format&fit=crop&q=80&w=200" alt="Combo" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
