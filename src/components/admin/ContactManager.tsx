import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Edit2, Trash2, Mail, Phone, MapPin, Globe } from 'lucide-react';
import AdminModal from './AdminModal';
import ConfirmModal from '../ConfirmModal';
import { motion } from 'motion/react';

interface Contact {
  id: string;
  type: string;
  value: string;
  description?: string;
}

const CONTACT_TYPES = [
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'phone', label: 'Phone', icon: Phone },
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'social', label: 'Social Media', icon: Globe },
  { id: 'other', label: 'Other', icon: Globe },
];

export default function ContactManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({ type: 'email', value: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'contacts'), (snapshot) => {
      const contactsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Contact[];
      setContacts(contactsData);
    }, (err) => {
      console.error("Error fetching contacts:", err);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenModal = (contact?: Contact) => {
    if (contact) {
      setEditingContact(contact);
      setFormData({ 
        type: contact.type, 
        value: contact.value, 
        description: contact.description || '' 
      });
    } else {
      setEditingContact(null);
      setFormData({ type: 'email', value: '', description: '' });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataToSave = {
        type: formData.type,
        value: formData.value,
        ...(formData.description ? { description: formData.description } : {})
      };

      if (editingContact) {
        await updateDoc(doc(db, 'contacts', editingContact.id), dataToSave);
      } else {
        await addDoc(collection(db, 'contacts'), {
          ...dataToSave,
          createdAt: serverTimestamp(),
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setContactToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (contactToDelete) {
      try {
        await deleteDoc(doc(db, 'contacts', contactToDelete));
      } catch (err) {
        console.error("Error deleting contact:", err);
      }
      setContactToDelete(null);
    }
  };

  const getIconForType = (type: string) => {
    const found = CONTACT_TYPES.find(t => t.id === type);
    const Icon = found ? found.icon : Globe;
    return <Icon size={20} className="text-gray-500" />;
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Contact Management</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Contact
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                {getIconForType(contact.type)}
              </div>
              <div className="flex-1">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {CONTACT_TYPES.find(t => t.id === contact.type)?.label || contact.type}
                </h3>
                <p className="text-lg font-bold text-gray-900 mb-2 break-all">{contact.value}</p>
                {contact.description && (
                  <p className="text-sm text-gray-500">{contact.description}</p>
                )}
              </div>
            </div>
            
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleOpenModal(contact)}
                className="p-2 bg-white text-gray-400 hover:text-blue-600 rounded-full shadow-sm border border-gray-100 transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => confirmDelete(contact.id)}
                className="p-2 bg-white text-red-500 hover:text-red-700 rounded-full shadow-sm border border-gray-100 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
        {contacts.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
            <p className="text-gray-500">No contact details found. Add one to get started.</p>
          </div>
        )}
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingContact ? 'Edit Contact' : 'Add New Contact'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Type</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
            >
              {CONTACT_TYPES.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Value</label>
            <input
              type="text"
              required
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="e.g., support@mooncreation.com or +1 234 567 890"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="e.g., Main Support Email"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-70 mt-6 shadow-sm"
          >
            {loading ? 'Saving...' : (editingContact ? 'Update Contact' : 'Create Contact')}
          </button>
        </form>
      </AdminModal>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Contact"
        message="Are you sure you want to delete this contact detail? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
