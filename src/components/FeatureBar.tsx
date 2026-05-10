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
    <div className="bg-white border-y border-gray-100 py-10">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-wrap justify-between items-center gap-y-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-5 group w-full sm:w-1/2 lg:w-1/4 px-2">
              <div className="p-4 bg-[#FAF9F6] rounded-2xl group-hover:bg-[#C48B22] group-hover:text-white transition-all duration-300 shrink-0 shadow-sm">
                <div className="group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-[#2C2C2C] uppercase tracking-wide">{feature.title}</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
