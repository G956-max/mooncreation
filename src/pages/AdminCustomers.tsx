import React from 'react';
import { Users } from 'lucide-react';

export default function AdminCustomers() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#2C2C2C]">Customers</h1>
      <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-gray-400 gap-3">
        <Users size={48} strokeWidth={1} />
        <p className="text-sm font-medium">No customers found</p>
      </div>
    </div>
  );
}
