import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import AdminModal from './AdminModal';
import ConfirmModal from '../ConfirmModal';
import { motion } from 'motion/react';

interface Offer {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function OfferManager() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', imageUrl: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'offers'), (snapshot) => {
      const offersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Offer[];
      setOffers(offersData);
    }, (err) => {
      console.error("Error fetching offers:", err);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenModal = (offer?: Offer) => {
    if (offer) {
      setEditingOffer(offer);
      setFormData({ title: offer.title, description: offer.description, imageUrl: offer.imageUrl });
    } else {
      setEditingOffer(null);
      setFormData({ title: '', description: '', imageUrl: '' });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, imageUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl) {
      setError('Please upload an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingOffer) {
        await updateDoc(doc(db, 'offers', editingOffer.id), {
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl,
        });
      } else {
        await addDoc(collection(db, 'offers'), {
          title: formData.title,
          description: formData.description,
          imageUrl: formData.imageUrl,
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
    setOfferToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (offerToDelete) {
      try {
        await deleteDoc(doc(db, 'offers', offerToDelete));
      } catch (err) {
        console.error("Error deleting offer:", err);
      }
      setOfferToDelete(null);
    }
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-[#2C2C2C]">Offer Management</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#2C2C2C] text-white px-4 py-2 rounded-lg font-medium hover:bg-black transition-colors"
        >
          <Plus size={18} />
          Add Offer
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {offers.map((offer) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row h-auto md:h-48 relative group"
          >
            <div className="w-full md:w-1/3 h-48 md:h-full bg-gray-100 relative">
              {offer.imageUrl ? (
                <img src={offer.imageUrl} alt={offer.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon size={48} />
                </div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center">
              <h3 className="text-xl font-serif font-bold text-[#2C2C2C] mb-2">{offer.title}</h3>
              <p className="text-gray-600 line-clamp-2">{offer.description}</p>
            </div>
            
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleOpenModal(offer)}
                className="p-2 bg-white text-gray-600 hover:text-[#2C2C2C] rounded-full shadow-sm border border-gray-100 transition-colors"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => confirmDelete(offer.id)}
                className="p-2 bg-white text-red-500 hover:text-red-700 rounded-full shadow-sm border border-gray-100 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
        {offers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
            <p className="text-gray-500">No offers found. Add one to get started.</p>
          </div>
        )}
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOffer ? 'Edit Offer' : 'Add New Offer'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2C2C] transition-all"
              placeholder="e.g., Summer Sale 50% Off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2C2C] transition-all min-h-[100px]"
              placeholder="Offer details..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2C2C] transition-all"
            />
            {formData.imageUrl && (
              <div className="mt-2 h-24 w-24 rounded-lg overflow-hidden border border-gray-200">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2C2C2C] text-white py-3 rounded-lg font-medium hover:bg-black transition-colors disabled:opacity-70 mt-6"
          >
            {loading ? 'Saving...' : (editingOffer ? 'Update Offer' : 'Create Offer')}
          </button>
        </form>
      </AdminModal>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Offer"
        message="Are you sure you want to delete this offer? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
