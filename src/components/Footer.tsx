import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import { useRequireAuth } from '../hooks/useRequireAuth';

export default function Footer() {
  const requireAuth = useRequireAuth();

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    requireAuth();
  };

  return (
    <footer className="bg-[#2C2C2C] text-white pt-16 pb-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-serif text-2xl font-bold mb-6">MOONCREATION</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Curated handcrafted goods for the modern home. We believe in sustainable, ethical, and beautiful design.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-6 uppercase tracking-wider text-sm">Shop</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" onClick={handleLinkClick} className="hover:text-white transition-colors">Ceramics</a></li>
              <li><a href="#" onClick={handleLinkClick} className="hover:text-white transition-colors">Textiles</a></li>
              <li><a href="#" onClick={handleLinkClick} className="hover:text-white transition-colors">Woodwork</a></li>
              <li><a href="#" onClick={handleLinkClick} className="hover:text-white transition-colors">New Arrivals</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-6 uppercase tracking-wider text-sm">About</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" onClick={handleLinkClick} className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" onClick={handleLinkClick} className="hover:text-white transition-colors">Artisans</a></li>
              <li><a href="#" onClick={handleLinkClick} className="hover:text-white transition-colors">Sustainability</a></li>
              <li><a href="#" onClick={handleLinkClick} className="hover:text-white transition-colors">Journal</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-6 uppercase tracking-wider text-sm">Help</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" onClick={handleLinkClick} className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" onClick={handleLinkClick} className="hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" onClick={handleLinkClick} className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" onClick={handleLinkClick} className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} MOONCREATION. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
