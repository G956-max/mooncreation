import { Truck, Banknote, RotateCcw, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FeatureBar() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Truck className="w-5 h-5 md:w-8 md:h-8" />,
      title: t('freeDelivery'),
      subtitle: 'above ₹999'
    },
    {
      icon: <Banknote className="w-5 h-5 md:w-8 md:h-8" />,
      title: 'COD Available',
      subtitle: 'Pay on Delivery'
    },
    {
      icon: <RotateCcw className="w-5 h-5 md:w-8 md:h-8" />,
      title: 'Easy Returns',
      subtitle: '7 Days Return'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 md:w-8 md:h-8" />,
      title: 'Secure Payments',
      subtitle: '100% Safe'
    }
  ];

  return (
    <div className="bg-white py-6 md:py-10">
      <div className="w-full mx-auto px-4 md:px-12">
        <div className="grid grid-cols-4 gap-2 md:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="p-2 md:p-4 bg-[#FAF9F6] rounded-xl text-[#C48B22] mb-2 md:mb-4 group-hover:bg-[#C48B22] group-hover:text-white transition-all duration-300 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-[10px] md:text-sm font-bold text-[#2C2C2C] leading-tight mb-1">{feature.title}</h3>
              <p className="hidden md:block text-[11px] text-gray-500">{feature.subtitle}</p>
              <p className="md:hidden text-[8px] text-gray-500 leading-none">{feature.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
