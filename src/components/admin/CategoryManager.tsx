import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react';
import AdminModal from './AdminModal';
import ConfirmModal from '../ConfirmModal';
import { motion } from 'motion/react';

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  subText?: string;
  subcategories?: string[];
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', imageUrl: '', subText: '', subcategories: [] as string[] });
  const [subcatInput, setSubcatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(categoriesData);
    }, (err) => {
      console.error("Error fetching categories:", err);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, imageUrl: category.imageUrl, subText: category.subText || '', subcategories: category.subcategories || [] });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', imageUrl: '', subText: '', subcategories: [] });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 800;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      const base64String = canvas.toDataURL('image/jpeg', 0.7);
      
      setFormData({ ...formData, imageUrl: base64String });
    };
    img.src = URL.createObjectURL(file);
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
      const dataToSave = {
        name: formData.name,
        imageUrl: formData.imageUrl,
        ...(formData.subText ? { subText: formData.subText } : {}),
        subcategories: formData.subcategories
      };

      if (editingCategory) {
        await updateDoc(doc(db, 'categories', editingCategory.id), dataToSave);
      } else {
        await addDoc(collection(db, 'categories'), {
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
    setCategoryToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteDoc(doc(db, 'categories', categoryToDelete));
      } catch (err) {
        console.error("Error deleting category:", err);
      }
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#2C2C2C]">Category Management</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#2C2C2C] text-white px-4 py-2 rounded-lg font-medium hover:bg-black transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group relative"
          >
            <div className="aspect-square bg-gray-50 relative overflow-hidden">
              {category.imageUrl ? (
                <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon size={48} strokeWidth={1} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  onClick={() => handleOpenModal(category)}
                  className="p-3 bg-white text-gray-800 hover:text-[#2C2C2C] rounded-full shadow-lg transition-transform hover:scale-110"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => confirmDelete(category.id)}
                  className="p-3 bg-white text-red-500 hover:text-red-700 rounded-full shadow-lg transition-transform hover:scale-110"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="p-4 text-center">
              <h3 className="text-lg font-bold text-[#2C2C2C]">{category.name}</h3>
              {category.subText && <p className="text-sm text-gray-500 mt-1">{category.subText}</p>}
            </div>
          </motion.div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
            <p className="text-gray-500">No categories found. Add one to get started.</p>
          </div>
        )}
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2C2C]/10 focus:border-[#2C2C2C] transition-all"
              placeholder="e.g., Ceramics"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2C2C]/10 focus:border-[#2C2C2C] transition-all"
            />
            {formData.imageUrl && (
              <div className="mt-2 h-24 w-24 rounded-lg overflow-hidden border border-gray-200">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtext (Optional)</label>
            <input
              type="text"
              value={formData.subText}
              onChange={(e) => setFormData({ ...formData, subText: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2C2C]/10 focus:border-[#2C2C2C] transition-all"
              placeholder="e.g., Handcrafted with love"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategories</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={subcatInput}
                onChange={(e) => setSubcatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (subcatInput.trim() && !formData.subcategories.includes(subcatInput.trim())) {
                      setFormData({ ...formData, subcategories: [...formData.subcategories, subcatInput.trim()] });
                      setSubcatInput('');
                    }
                  }
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2C2C]/10 focus:border-[#2C2C2C] transition-all"
                placeholder="e.g., Shirts (Press Enter to add)"
              />
              <button
                type="button"
                onClick={() => {
                  if (subcatInput.trim() && !formData.subcategories.includes(subcatInput.trim())) {
                    setFormData({ ...formData, subcategories: [...formData.subcategories, subcatInput.trim()] });
                    setSubcatInput('');
                  }
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Add
              </button>
            </div>
            {formData.subcategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.subcategories.map((subcat, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-sm rounded-full text-gray-700">
                    {subcat}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          subcategories: formData.subcategories.filter((s) => s !== subcat)
                        });
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2C2C2C] text-white py-3 rounded-lg font-bold hover:bg-black transition-colors disabled:opacity-70 mt-6 shadow-sm"
          >
            {loading ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
          </button>
        </form>
      </AdminModal>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
