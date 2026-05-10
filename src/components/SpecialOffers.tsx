import { Gift } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SpecialOffers() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-[#FAF9F6] rounded-3xl overflow-hidden border border-[#C48B22]/10 shadow-sm flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8 relative">
        <div className="flex items-center gap-6">
          <div className="p-5 bg-white rounded-2xl shadow-sm text-[#C48B22] shrink-0">
            <Gift size={40} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2C2C2C]">{t('specialOffersTitle')}</h2>
            <p className="text-gray-500 mt-2">{t('specialOffersSubtitle')}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-red-500 font-bold text-3xl">{t('flatOff')}</span>
            <span className="text-[#2C2C2C] text-sm font-medium">{t('onCustomizedGifts')}</span>
          </div>
          <button className="text-[#C48B22] font-bold text-sm uppercase tracking-widest border-b-2 border-[#C48B22] pb-1 hover:text-[#A6751C] hover:border-[#A6751C] transition-all">
            {t('shopNow')}
          </button>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C48B22]/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C48B22]/5 rounded-full -ml-16 -mb-16 blur-3xl"></div>
      </div>
    </div>
  );
}
