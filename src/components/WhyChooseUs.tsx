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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-serif font-bold text-[#2C2C2C] text-center mb-16">{t('whyChooseUs')}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="p-4 bg-[#FAF9F6] rounded-full text-[#C48B22] mb-4 group-hover:bg-[#C48B22] group-hover:text-white transition-all duration-300">
                {stat.icon}
              </div>
              <div className="font-bold text-xl text-[#2C2C2C]">{stat.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
