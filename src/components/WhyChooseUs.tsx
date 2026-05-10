import { Users, Gift, Star, ShieldCheck, RotateCcw, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function WhyChooseUs() {
  const { t } = useLanguage();

  const stats = [
    { icon: <Users size={24} />, value: '10K+', label: t('happyCustomers') },
    { icon: <Gift size={24} />, value: '50K+', label: t('giftsDelivered') },
    { icon: <Star size={24} />, value: '4.9', label: t('averageRating') },
    { icon: <ShieldCheck size={24} />, value: '100%', label: t('securePayments') },
    { icon: <RotateCcw size={24} />, value: '7 Days', label: t('easyReturns') },
    { icon: <MapPin size={24} />, value: t('madeInIndia'), label: t('proudlyIndian') },
  ];

  return (
    <section className="bg-white py-20 border-t border-gray-100">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12">
        <h2 className="text-3xl font-serif font-bold text-[#2C2C2C] text-center mb-32">{t('whyChooseUs')}</h2>
        
        <div className="flex flex-wrap justify-between gap-y-12">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center w-1/2 md:w-1/3 lg:w-1/6 px-4">
              <div className="p-5 bg-[#FAF9F6] rounded-full text-[#C48B22] mb-6 hover:bg-[#C48B22] hover:text-white transition-all duration-300 shadow-sm">
                {stat.icon}
              </div>
              <div className="font-bold text-xl text-[#2C2C2C] mb-1">{stat.value}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-bold leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
