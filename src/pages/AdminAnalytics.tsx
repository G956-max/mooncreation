import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#2C2C2C]">Analytics</h1>
      <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-gray-400 gap-3">
        <BarChart3 size={48} strokeWidth={1} />
        <p className="text-sm font-medium">Analytics data will appear here</p>
      </div>
    </div>
  );
}
