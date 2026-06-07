import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="pt-20 pb-24 bg-[#FAF9F6]">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2C2C2C] mb-4">Get in Touch</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have a question about our products or want to discuss a custom piece? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#2C2C2C] mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-full shadow-sm text-[#2C2C2C]">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-[#2C2C2C]">Email Us</p>
                    <p className="text-gray-600">hello@mooncreation.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-full shadow-sm text-[#2C2C2C]">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-[#2C2C2C]">Call Us</p>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-full shadow-sm text-[#2C2C2C]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-[#2C2C2C]">Visit Studio</p>
                    <p className="text-gray-600">123 Craft Lane, Artisan Village, CA 90210</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-serif font-bold text-[#2C2C2C] mb-4">Studio Hours</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100">
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#2C2C2C] mb-2">First Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-[#FAF9F6] border-none rounded-2xl focus:ring-2 focus:ring-black/5 outline-none transition-all"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2C2C2C] mb-2">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-[#FAF9F6] border-none rounded-2xl focus:ring-2 focus:ring-black/5 outline-none transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#2C2C2C] mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-[#FAF9F6] border-none rounded-2xl focus:ring-2 focus:ring-black/5 outline-none transition-all"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#2C2C2C] mb-2">Subject</label>
                <select className="w-full px-4 py-3 bg-[#FAF9F6] border-none rounded-2xl focus:ring-2 focus:ring-black/5 outline-none transition-all appearance-none cursor-pointer">
                  <option>General Inquiry</option>
                  <option>Custom Order</option>
                  <option>Wholesale</option>
                  <option>Press</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#2C2C2C] mb-2">Message</label>
                <textarea 
                  rows={5}
                  className="w-full px-4 py-3 bg-[#FAF9F6] border-none rounded-2xl focus:ring-2 focus:ring-black/5 outline-none transition-all resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button className="w-full bg-[#2C2C2C] text-white py-4 rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2 group shadow-lg shadow-black/10">
                Send Message
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
