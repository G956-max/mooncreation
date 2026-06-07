import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function WhatsAppButton() {
  const { t } = useLanguage();
  const phoneNumber = "7845890485";
  const message = encodeURIComponent("Hello MOONCREATION, I have a question about your products.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 group"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={28} fill="currentColor" className="text-white" />
      <span className="hidden md:block absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-[#2C2C2C] px-4 py-2 rounded-lg text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100">
        {t('chatWithUs')}
      </span>
    </a>
  );
}
