import { Users, Gift, Star, ShieldCheck, RotateCcw, MapPin } from 'lucide-react';

const stats = [
  { icon: <Users size={24} />, value: '10K+', label: 'Happy Customers' },
  { icon: <Gift size={24} />, value: '50K+', label: 'Gifts Delivered' },
  { icon: <Star size={24} />, value: '4.9', label: 'Average Rating' },
  { icon: <ShieldCheck size={24} />, value: '100%', label: 'Secure Payments' },
  { icon: <RotateCcw size={24} />, value: '7 Days', label: 'Easy Returns' },
  { icon: <MapPin size={24} />, value: 'Made in India', label: 'Proudly Indian Brand' },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-serif font-bold text-[#2C2C2C] text-center mb-16">Why Choose MOONCREATION?</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="p-4 bg-[#FAF9F6] rounded-full text-[#C48B22] mb-4 group-hover:bg-[#C48B22] group-hover:text-white transition-all duration-300">
                {stat.icon}
              </div>
              <div className="font-bold text-xl text-[#2C2C2C]">{stat.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
