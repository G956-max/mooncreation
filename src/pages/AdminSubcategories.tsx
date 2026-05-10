import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Plus, Trash2, Layers, Search, ChevronRight, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Category {
  id: string;
  name: string;
  subcategories?: string[];
}

export default function AdminSubcategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [subcatInput, setSubcatInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(categoriesData);
      setLoading(false);
      
      if (categoriesData.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(categoriesData[0].id);
      }
    });

    return () => unsubscribe();
  }, [selectedCategoryId]);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);

  const handleAddSubcategory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedCategoryId || !subcatInput.trim()) return;

    const trimmedSubcat = subcatInput.trim();
    if (selectedCategory?.subcategories?.includes(trimmedSubcat)) {
      alert('Subcategory already exists');
      return;
    }

    setSaving(true);
    try {
      const categoryRef = doc(db, 'categories', selectedCategoryId);
      const updatedSubcats = [...(selectedCategory?.subcategories || []), trimmedSubcat];
      await updateDoc(categoryRef, { subcategories: updatedSubcats });
      setSubcatInput('');
    } catch (err) {
      console.error('Error adding subcategory:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSubcategory = async (subcat: string) => {
    if (!selectedCategoryId) return;
    
    if (!confirm(`Are you sure you want to remove "${subcat}"? Products tagged with this subcategory will still keep it until manually updated.`)) {
      return;
    }

    setSaving(true);
    try {
      const categoryRef = doc(db, 'categories', selectedCategoryId);
      const updatedSubcats = (selectedCategory?.subcategories || []).filter(s => s !== subcat);
      await updateDoc(categoryRef, { subcategories: updatedSubcats });
    } catch (err) {
      console.error('Error removing subcategory:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2C2C2C]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#2C2C2C]">Subcategories</h1>
        <p className="text-sm text-gray-500">Manage detailed sub-groupings for your categories.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category List Sidebar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-fit">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Category</h3>
          </div>
          <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                  selectedCategoryId === cat.id 
                    ? 'bg-black text-white' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers size={16} className={selectedCategoryId === cat.id ? 'text-gray-400' : 'text-gray-400'} />
                  <span className="text-sm font-medium">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedCategoryId === cat.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {cat.subcategories?.length || 0}
                  </span>
                  <ChevronRight size={14} className={selectedCategoryId === cat.id ? 'text-white/50' : 'text-gray-300'} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Subcategories Management */}
        <div className="md:col-span-2 space-y-6">
          {selectedCategory ? (
            <motion.div
              key={selectedCategory.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#2C2C2C]">{selectedCategory.name}</h2>
                  <p className="text-xs text-gray-500">Add or remove sub-labels for this collection.</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Layers size={20} className="text-gray-400" />
                </div>
              </div>

              {/* Add New Subcategory Form */}
              <form onSubmit={handleAddSubcategory} className="flex gap-2 mb-8">
                <div className="relative flex-1">
                  <Plus size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={subcatInput}
                    onChange={(e) => setSubcatInput(e.target.value)}
                    placeholder="New subcategory name..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving || !subcatInput.trim()}
                  className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {saving ? 'Saving...' : 'Add'}
                </button>
              </form>

              {/* List of Subcategories */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">Current Subcategories</h4>
                <AnimatePresence mode="popLayout">
                  {selectedCategory.subcategories && selectedCategory.subcategories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedCategory.subcategories.map((sub) => (
                        <motion.div
                          key={sub}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group border border-transparent hover:border-gray-200 hover:bg-white transition-all"
                        >
                          <span className="text-sm font-medium text-gray-700">{sub}</span>
                          <button
                            onClick={() => handleRemoveSubcategory(sub)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                      <div className="flex justify-center mb-2">
                        <AlertCircle size={24} className="text-gray-300" />
                      </div>
                      <p className="text-sm text-gray-400">No subcategories defined for this category.</p>
                      <button 
                        onClick={() => document.querySelector('input')?.focus()}
                        className="text-xs font-bold text-black mt-2 underline"
                      >
                        Add your first one
                      </button>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
              <p className="text-gray-500">Please select a category from the sidebar to manage subcategories.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
