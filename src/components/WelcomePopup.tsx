import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, X, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { setLanguage, language, t } = useLanguage();

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('has_seen_welcome_popup');
    if (!hasSeenPopup) {
      setIsOpen(true);
    }
  }, []);

  const handleSelectLanguage = (lang: 'en' | 'ta') => {
    setLanguage(lang);
    localStorage.setItem('has_seen_welcome_popup', 'true');
    // We delay closing slightly so the user sees the selection
    setTimeout(() => {
      setIsOpen(false);
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full relative"
          >
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#2C2C2C]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-[#2C2C2C]/5 rounded-full blur-3xl"></div>

            <div className="p-8 text-center relative z-10">
              {/* Gift Box Animation */}
              <motion.div 
                className="mb-6 flex justify-center"
                animate={{ 
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <div className="relative">
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="p-5 bg-[#2C2C2C] text-white rounded-2xl shadow-xl shadow-black/20"
                  >
                    <Gift size={48} strokeWidth={1.5} />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
                    className="absolute -top-2 -right-2 text-yellow-400"
                  >
                    <div className="w-4 h-4 bg-yellow-400 rounded-full blur-sm"></div>
                  </motion.div>
                </div>
              </motion.div>

              <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-2">
                Welcome to MOONCREATION
              </h2>
              <p className="text-gray-500 mb-8 font-medium">
                Choose your preferred language to continue
              </p>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => handleSelectLanguage('ta')}
                  className={`group relative flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all ${
                    language === 'ta' 
                      ? 'border-[#2C2C2C] bg-[#2C2C2C] text-white shadow-lg' 
                      : 'border-gray-100 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-lg font-bold">தமிழ்</span>
                    <span className={`text-[10px] uppercase tracking-widest ${language === 'ta' ? 'text-gray-400' : 'text-gray-400'}`}>Tamil</span>
                  </div>
                  {language === 'ta' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white text-black rounded-full p-1">
                      <Check size={16} />
                    </motion.div>
                  )}
                </button>

                <button
                  onClick={() => handleSelectLanguage('en')}
                  className={`group relative flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all ${
                    language === 'en' 
                      ? 'border-[#2C2C2C] bg-[#2C2C2C] text-white shadow-lg' 
                      : 'border-gray-100 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-lg font-bold">English</span>
                    <span className={`text-[10px] uppercase tracking-widest ${language === 'en' ? 'text-gray-400' : 'text-gray-400'}`}>English</span>
                  </div>
                  {language === 'en' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white text-black rounded-full p-1">
                      <Check size={16} />
                    </motion.div>
                  )}
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Handcrafted with love from MOONCREATION
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
