import React from 'react';
import ContactManager from '../components/admin/ContactManager';

export default function AdminContact() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#2C2C2C]">Support Inquiries</h1>
          <p className="text-sm text-gray-500">Manage messages from your customers.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <ContactManager />
      </div>
    </div>
  );
}
