import React, { useState } from 'react';
import { Instagram, Twitter, Facebook, Youtube, Send, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { useRequireAuth } from '../hooks/useRequireAuth';

export default function Footer() {
  const requireAuth = useRequireAuth();
  const [email, setEmail] = useState('');

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    requireAuth();
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for subscribing!");
    setEmail('');
  };

  return (
    <footer className="bg-white text-[#2C2C2C] pt-20 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#C48B22] rounded-full flex items-center justify-center text-white font-serif text-lg font-bold mr-3 shadow-md">MC</div>
              <h3 className="font-serif text-2xl font-bold">MOONCREATION</h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              We create personalized gifts that turn your special moments into lasting memories. Handcrafted with love and care.
            </p>
            <div className="flex space-x-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" onClick={handleLinkClick} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#C48B22] hover:text-white transition-all shadow-sm">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          
          {/* Newsletter Column */}
          <div className="space-y-6">
            <h4 className="font-bold text-lg">Subscribe to our newsletter</h4>
            <p className="text-gray-500 text-sm">Get latest updates and exclusive offers</p>
            <form onSubmit={handleNewsletterSubmit} className="relative group">
              <input 
                type="email" 
                placeholder="Enter your email address"
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
              <h4 className="font-bold text-lg mb-6">SHOP</h4>
              <ul className="space-y-4 text-gray-500 text-sm font-medium">
                <li><a href="#" onClick={handleLinkClick} className="hover:text-[#C48B22] transition-colors">All Products</a></li>
                <li><a href="#" onClick={handleLinkClick} className="hover:text-[#C48B22] transition-colors">Personalized Gifts</a></li>
                <li><a href="#" onClick={handleLinkClick} className="hover:text-[#C48B22] transition-colors">Gifts by Person</a></li>
                <li><a href="#" onClick={handleLinkClick} className="hover:text-[#C48B22] transition-colors">Combo Gifts</a></li>
                <li><a href="#" onClick={handleLinkClick} className="hover:text-[#C48B22] transition-colors">Customized Studio</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">HELP & SUPPORT</h4>
              <ul className="space-y-4 text-gray-500 text-sm font-medium">
                <li><a href="#" onClick={handleLinkClick} className="hover:text-[#C48B22] transition-colors">Contact Us</a></li>
                <li><a href="#" onClick={handleLinkClick} className="hover:text-[#C48B22] transition-colors">FAQs</a></li>
                <li><a href="#" onClick={handleLinkClick} className="hover:text-[#C48B22] transition-colors">Shipping Policy</a></li>
                <li><a href="#" onClick={handleLinkClick} className="hover:text-[#C48B22] transition-colors">Return & Refund</a></li>
                <li><a href="#" onClick={handleLinkClick} className="hover:text-[#C48B22] transition-colors">Track Order</a></li>
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

          {/* Payment Icons */}
          <div className="flex flex-wrap justify-center gap-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png" alt="RuPay" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
          </div>
        </div>
      </div>
    </footer>
  );
}
