import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Instagram, Star, Copy, Check, ArrowRight } from 'lucide-react';

export default function OrderSuccess() {
  const [copiedReview, setCopiedReview] = useState<number | null>(null);

  const suggestedReviews = [
    "Absolutely love the quality! The customization was perfect and it arrived right on time. Highly recommend MoonCreation for personalized gifts! ⭐⭐⭐⭐⭐",
    "Beautiful packaging and amazing product quality. The attention to detail is just stunning. Will definitely buy again! ⭐⭐⭐⭐⭐"
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedReview(index);
    setTimeout(() => setCopiedReview(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-[40px] shadow-xl p-8 sm:p-12 border border-gray-100">
        
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} className="text-green-500" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#2C2C2C] mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-500 text-lg">
            Thank you for shopping with MoonCreation. We've received your order and are preparing it with care.
          </p>
        </div>

        <div className="h-[1px] bg-gray-100 w-full mb-12"></div>

        {/* Join Community Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <a 
            href="#" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-8 bg-green-50 rounded-3xl hover:bg-green-100 transition-colors group"
          >
            <MessageCircle size={40} className="text-green-600 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-green-900 mb-2">Join Our WhatsApp VIP</h3>
            <p className="text-sm text-green-700 text-center">Get exclusive early access to offers and track your orders directly.</p>
          </a>
          
          <a 
            href="#" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-8 bg-pink-50 rounded-3xl hover:bg-pink-100 transition-colors group"
          >
            <Instagram size={40} className="text-pink-600 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-pink-900 mb-2">Follow on Instagram</h3>
            <p className="text-sm text-pink-700 text-center">Tag us in your unboxing videos to get featured and win surprises!</p>
          </a>
        </div>

        {/* Review Section */}
        <div className="bg-[#FAF9F6] rounded-3xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-3">Loved your experience?</h3>
            <p className="text-gray-600">Your feedback helps us grow. Leave a 5-star review on Google!</p>
            <div className="flex justify-center gap-2 mt-4 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={32} fill="currentColor" />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Not sure what to say? Copy a suggestion:</p>
            {suggestedReviews.map((review, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-start gap-4 shadow-sm hover:shadow-md transition-all">
                <p className="text-gray-600 text-sm flex-grow italic">"{review}"</p>
                <button 
                  onClick={() => handleCopy(review, idx)}
                  className="flex-shrink-0 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-[#2C2C2C]"
                  title="Copy to clipboard"
                >
                  {copiedReview === idx ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
              </div>
            ))}
          </div>

          <a 
            href="#" 
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            Leave Google Review <ArrowRight size={20} />
          </a>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[#C48B22] font-bold hover:text-[#A6751C] transition-colors"
          >
            <ArrowRight className="rotate-180" size={20} /> Return to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
