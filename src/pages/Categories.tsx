import React from 'react';
import CategoryGrid from '../components/CategoryGrid';

export default function Categories() {
  return (
    <div className="pt-20 pb-16">
      <div className="w-full px-4 sm:px-6 lg:px-8 mb-12">
        <h1 className="text-4xl font-serif font-bold text-[#2C2C2C] mb-4">Our Collections</h1>
        <p className="text-gray-600 max-w-2xl">
          Explore our curated selection of handcrafted items, organized by material and craft.
        </p>
      </div>
      <CategoryGrid title="" />
    </div>
  );
}
