import { Truck, Banknote, RotateCcw, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FeatureBar() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Truck className="w-8 h-8 text-[#C48B22]" />,
      title: t('freeDelivery'),
      subtitle: t('freeDeliverySub')
    },
    {
      icon: <Banknote className="w-8 h-8 text-[#C48B22]" />,
      title: t('codAvailable'),
      subtitle: t('codAvailableSub')
    },
    {
      icon: <RotateCcw className="w-8 h-8 text-[#C48B22]" />,
      title: t('easyReturns'),
      subtitle: t('easyReturnsSub')
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#C48B22]" />,
      title: t('securePayments'),
      subtitle: t('securePaymentsSub')
    }
  ];

  return (
    <div className="bg-white border-y border-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4 group">
              <div className="p-3 bg-[#FAF9F6] rounded-xl group-hover:scale-110 transition-transform duration-300 shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#2C2C2C]">{feature.title}</h3>
                <p className="text-xs text-gray-500">{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
