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
              {/* Gift Box Opening Animation */}
              <div className="mb-10 flex justify-center scale-110">
                <div className="relative w-24 h-24">
                  {/* Box Base */}
                  <motion.div 
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-0 left-0 w-full h-16 bg-[#2C2C2C] rounded-xl shadow-lg flex items-center justify-center overflow-hidden"
                  >
                    <div className="absolute inset-0 border-t-4 border-[#2C2C2C]/20 flex justify-center">
                      <div className="w-4 h-full bg-yellow-400/20"></div>
                    </div>
                    <Gift size={32} className="text-white/20" />
                  </motion.div>
                  
                  {/* Box Lid */}
                  <motion.div 
                    initial={{ y: 0, rotate: 0 }}
                    animate={{ 
                      y: [0, -25, -20, -25, 0],
                      rotate: [0, -5, 5, -5, 0],
                      x: [0, 2, -2, 2, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      times: [0, 0.2, 0.4, 0.6, 1],
                      ease: "easeInOut"
                    }}
                    className="absolute top-4 left-[-4px] w-[104px] h-6 bg-[#3D3D3D] rounded-lg shadow-xl z-20 flex items-center justify-center border-b border-black/10"
                  >
                    {/* Ribbon Bow */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-end">
                      <div className="w-6 h-6 border-4 border-yellow-400 rounded-full"></div>
                      <div className="w-6 h-6 border-4 border-yellow-400 rounded-full -ml-2"></div>
                    </div>
                    <div className="w-full h-1 bg-yellow-400 absolute top-1/2 -translate-y-1/2 opacity-30"></div>
                  </motion.div>

                  {/* Sparkles inside */}
                  <motion.div
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0.5, 1.5, 0.5],
                      y: [0, -40, -60]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute top-8 left-1/2 -translate-x-1/2 text-yellow-400 z-10"
                  >
                    <Check size={20} strokeWidth={3} />
                  </motion.div>
                </div>
              </div>

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
