import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, Send, ShieldCheck, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for subscribing!");
    setEmail('');
  };

  const policies: Record<string, { title: string; content: React.ReactNode }> = {
    faqs: {
      title: "Frequently Asked Questions",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-gray-800">1. How do I place a customized order?</h4>
            <p className="text-sm text-gray-600 mt-1">Select your preferred item (Custom Photo Frames or Custom Chocolates), upload your custom photo/message details on the product page, and click "Buy Now" or "Add to Cart" to proceed to checkout.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">2. What payment options are supported?</h4>
            <p className="text-sm text-gray-600 mt-1">We support Google Pay (G Pay), PhonePe, Paytm (UPI apps), and Cash on Delivery (COD) for shipping addresses in India.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">3. Can I modify my order after placing it?</h4>
            <p className="text-sm text-gray-600 mt-1">Since we create custom products, orders are sent to production quickly. Please contact us via phone or email within 1 hour of purchase if you need to request changes.</p>
          </div>
        </div>
      )
    },
    shipping: {
      title: "Shipping & Delivery Policy",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">We offer secure insured shipping across all cities and towns in India.</p>
          <div>
            <h4 className="font-bold text-gray-800">Delivery Timelines</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1 mt-1">
              <li><strong>Standard Shipping:</strong> 3–5 business days (Free for orders above ₹999).</li>
              <li><strong>Express Shipping:</strong> 1–2 business days (₹150 shipping fee).</li>
            </ul>
          </div>
          <p className="text-sm text-gray-600">Once your order is dispatched, you will receive a tracking link to monitor your package.</p>
        </div>
      )
    },
    returns: {
      title: "Return & Refund Policy",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Our customer satisfaction is our top priority.</p>
          <div>
            <h4 className="font-bold text-gray-800">Customized Orders</h4>
            <p className="text-sm text-gray-600 mt-1">Please note that customized products (photo frames, name-printed chocolates, etc.) cannot be returned or refunded unless they arrive damaged or defective.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Damaged items</h4>
            <p className="text-sm text-gray-600 mt-1">If your item is damaged during transit, contact us at mooncreation2019@gmail.com with photos of the package and item within 48 hours of delivery. We will issue a replacement at no extra charge.</p>
          </div>
        </div>
      )
    },
    track: {
      title: "How to Track Your Order",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">You can easily track the current delivery status of your package:</p>
          <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2 mt-1">
            <li>Log in to your account.</li>
            <li>Go to <strong>My Account</strong> or click on <strong>Dashboard</strong>.</li>
            <li>Select the <strong>My Orders</strong> tab.</li>
            <li>Find your order and view its current status (Pending, Shipped, or Delivered).</li>
          </ol>
        </div>
      )
    },
    privacy: {
      title: "Privacy & Terms Policy",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">We respect your privacy and are committed to protecting your personal data.</p>
          <div>
            <h4 className="font-bold text-gray-800">Data Security</h4>
            <p className="text-sm text-gray-600 mt-1">All transaction information is processed over highly secure 256-bit SSL encrypted networks. We never store your UPI credentials or process payments outside verified UPI gateways.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Contact Details</h4>
            <p className="text-sm text-gray-600 mt-1">Your address and contact details (email and phone number) are only used to deliver orders and communicate status updates.</p>
          </div>
        </div>
      )
    }
  };

  return (
    <footer className="bg-white text-[#2C2C2C] pt-10 pb-6 md:pt-20 md:pb-8 border-t border-gray-100">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-20">
          
          {/* Brand & Socials Column */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#C48B22] rounded-full flex items-center justify-center text-white font-serif text-lg font-bold mr-3 shadow-md">MC</div>
              <h3 className="font-serif text-lg md:text-2xl font-bold">MOONCREATION</h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              We create personalized gifts that turn your special moments into lasting memories. Handcrafted with love and care.
            </p>
            
            {/* Contact Details & Requested Icons */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#C48B22]">Connect with Us</h4>
              <div className="flex flex-col gap-2">
                <a 
                  href="https://www.instagram.com/mooncreationgift?igsh=MW5qOWhrZHh4djg2eA==" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-sm text-gray-500 hover:text-[#C48B22] transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 hover:bg-[#C48B22] hover:text-white transition-all shadow-sm">
                    <Instagram size={16} />
                  </span>
                  <span>@mooncreationgift</span>
                </a>
                <a 
                  href="mailto:mooncreation2019@gmail.com" 
                  className="flex items-center gap-3 text-sm text-gray-500 hover:text-[#C48B22] transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 hover:bg-[#C48B22] hover:text-white transition-all shadow-sm">
                    <Mail size={16} />
                  </span>
                  <span>mooncreation2019@gmail.com</span>
                </a>
                <div className="flex items-start gap-3 text-sm text-gray-500">
                  <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 shadow-sm shrink-0">
                    <Phone size={16} />
                  </span>
                  <div className="flex flex-col">
                    <a href="tel:9345876933" className="hover:text-[#C48B22] transition-colors">9345876933</a>
                    <a href="tel:9585995185" className="hover:text-[#C48B22] transition-colors">9585995185</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Newsletter Column */}
          <div className="space-y-6">
            <h4 className="font-bold text-sm md:text-lg uppercase tracking-wider">{t('newsletterTitle')}</h4>
            <p className="text-gray-500 text-sm">{t('newsletterSub')}</p>
            <form onSubmit={handleNewsletterSubmit} className="relative group">
              <input 
                type="email" 
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#C48B22] outline-none transition-all pr-14"
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 px-3 bg-[#C48B22] text-white rounded-lg hover:bg-[#A6751C] transition-colors">
                <Send size={18} />
              </button>
            </form>
          </div>
          
          {/* Quick Links Column */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div>
              <h4 className="font-bold text-sm md:text-lg mb-4 md:mb-6 uppercase tracking-wider">{t('shop')}</h4>
              <ul className="space-y-4 text-gray-500 text-sm font-medium">
                <li><Link to="/categories" className="hover:text-[#C48B22] transition-colors">{t('allProducts')}</Link></li>
                <li><Link to="/categories" className="hover:text-[#C48B22] transition-colors">Personalized Gifts</Link></li>
                <li><Link to="/categories" className="hover:text-[#C48B22] transition-colors">Gifts by Person</Link></li>
                <li><Link to="/categories" className="hover:text-[#C48B22] transition-colors">Combo Gifts</Link></li>
                <li><Link to="/categories" className="hover:text-[#C48B22] transition-colors">Customized Studio</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm md:text-lg mb-4 md:mb-6 uppercase tracking-wider">{t('helpSupport')}</h4>
              <ul className="space-y-4 text-gray-500 text-sm font-medium">
                <li><Link to="/contact" className="hover:text-[#C48B22] transition-colors">{t('contact')}</Link></li>
                <li><button onClick={() => setActivePolicy('faqs')} className="hover:text-[#C48B22] text-left transition-colors font-medium">{t('faqs')}</button></li>
                <li><button onClick={() => setActivePolicy('shipping')} className="hover:text-[#C48B22] text-left transition-colors font-medium">{t('shippingPolicy')}</button></li>
                <li><button onClick={() => setActivePolicy('returns')} className="hover:text-[#C48B22] text-left transition-colors font-medium">{t('returnRefund')}</button></li>
                <li><button onClick={() => setActivePolicy('track')} className="hover:text-[#C48B22] text-left transition-colors font-medium">{t('trackOrder')}</button></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center lg:items-start gap-2">
            <p className="text-gray-400 text-xs">
              &copy; {new Date().getFullYear()} MOONCREATION. All Rights Reserved.
            </p>
            <div className="flex items-center gap-2 text-green-600 text-[10px] font-bold uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-100">
              <ShieldCheck size={14} />
              SSL Secured
            </div>
          </div>
        </div>
      </div>

      {/* Policy Modal Overlay */}
      {activePolicy && policies[activePolicy] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100 flex flex-col max-h-[85vh] animate-slide-up">
            <button 
              onClick={() => setActivePolicy(null)}
              className="absolute top-4 right-4 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>
            <h3 className="font-serif text-2xl font-bold text-[#2C2C2C] mb-6 pr-8 border-b border-gray-100 pb-4">
              {policies[activePolicy].title}
            </h3>
            <div className="overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
              {policies[activePolicy].content}
            </div>
            <div className="mt-8 border-t border-gray-100 pt-4 flex justify-end">
              <button 
                onClick={() => setActivePolicy(null)}
                className="bg-[#2C2C2C] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
