import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function AdminOrders() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-gray-400 gap-3">
        <ShoppingBag size={48} strokeWidth={1} />
        <p className="text-sm font-medium">No orders found</p>
      </div>
    </div>
  );
}
