import React from 'react';
import { Plus, Search, Folder } from 'lucide-react';
import CategoryManager from '../components/admin/CategoryManager';

export default function AdminCategories() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#2C2C2C]">Categories</h1>
          <p className="text-sm text-gray-500">Organize your products into collections.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <CategoryManager />
      </div>
    </div>
  );
}
