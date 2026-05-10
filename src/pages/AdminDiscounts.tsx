import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Plus, Edit2, Trash2, Tag, Percent, DollarSign } from 'lucide-react';
import AdminModal from '../components/admin/AdminModal';
import ConfirmModal from '../components/ConfirmModal';

interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  isActive: boolean;
  appliesTo: 'all' | 'specific';
  productIds: string[];
}

interface Product {
  id: string;
  name: string;
  imageUrl: string;
}

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState<string | null>(null);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    isActive: true,
    appliesTo: 'all' as 'all' | 'specific',
    productIds: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribeDiscounts = onSnapshot(collection(db, 'discounts'), (snapshot) => {
      const discountData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Discount[];
      setDiscounts(discountData);
    }, (err) => {
      console.error("Error fetching discounts:", err);
    });

    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productData = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        imageUrl: doc.data().imageUrl,
      })) as Product[];
      setProducts(productData);
    }, (err) => {
      console.error("Error fetching products:", err);
    });

    return () => {
      unsubscribeDiscounts();
      unsubscribeProducts();
    };
  }, []);

  const handleOpenModal = (discount?: Discount) => {
    if (discount) {
      setEditingDiscount(discount);
      setFormData({
        code: discount.code,
        type: discount.type,
        value: discount.value,
        isActive: discount.isActive,
        appliesTo: discount.appliesTo || 'all',
        productIds: discount.productIds || [],
      });
    } else {
      setEditingDiscount(null);
      setFormData({
        code: '',
        type: 'percentage',
        value: 0,
        isActive: true,
        appliesTo: 'all',
        productIds: [],
      });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || formData.value <= 0) {
      setError('Please provide a valid code and value.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const dataToSave = {
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: Number(formData.value),
        isActive: formData.isActive,
        appliesTo: formData.appliesTo,
        productIds: formData.appliesTo === 'specific' ? formData.productIds : [],
      };

      if (editingDiscount) {
        await updateDoc(doc(db, 'discounts', editingDiscount.id), dataToSave);
      } else {
        await addDoc(collection(db, 'discounts'), {
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
    setDiscountToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (discountToDelete) {
      try {
        await deleteDoc(doc(db, 'discounts', discountToDelete));
      } catch (err) {
        console.error("Error deleting discount:", err);
      }
      setDiscountToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#2C2C2C]">Discounts</h1>
          <p className="text-sm text-gray-500">Manage promotional codes and discounts.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#2C2C2C] text-white px-4 py-2 rounded-lg font-medium hover:bg-black transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Discount
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                <th className="p-4 font-medium">Code</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Value</th>
                <th className="p-4 font-medium">Applies To</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {discounts.map((discount) => (
                <tr key={discount.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-gray-400" />
                      <span className="font-semibold text-[#2C2C2C]">{discount.code}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="capitalize text-gray-600">{discount.type}</span>
                  </td>
                  <td className="p-4 text-gray-900 font-medium">
                    {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value.toFixed(2)}`}
                  </td>
                  <td className="p-4 text-gray-600">
                    {discount.appliesTo === 'all' ? 'All Products' : `${discount.productIds?.length || 0} Products`}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${discount.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {discount.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(discount)}
                        className="p-2 text-gray-400 hover:text-[#2C2C2C] transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => confirmDelete(discount.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {discounts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    No discount codes created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDiscount ? 'Edit Discount' : 'Add New Discount'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code</label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2C2C]/10 focus:border-[#2C2C2C] transition-all uppercase"
              placeholder="e.g., SUMMER20"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2C2C]/10 focus:border-[#2C2C2C] transition-all"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {formData.type === 'percentage' ? <Percent size={16} className="text-gray-400" /> : <DollarSign size={16} className="text-gray-400" />}
                </div>
                <input
                  type="number"
                  required
                  min="0"
                  step={formData.type === 'percentage' ? "1" : "0.01"}
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2C2C]/10 focus:border-[#2C2C2C] transition-all"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700">Applies To</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="appliesTo"
                  checked={formData.appliesTo === 'all'}
                  onChange={() => setFormData({ ...formData, appliesTo: 'all' })}
                  className="w-4 h-4 text-[#2C2C2C] border-gray-300 focus:ring-[#2C2C2C]"
                />
                <span className="text-sm text-gray-700">All Products</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="appliesTo"
                  checked={formData.appliesTo === 'specific'}
                  onChange={() => setFormData({ ...formData, appliesTo: 'specific' })}
                  className="w-4 h-4 text-[#2C2C2C] border-gray-300 focus:ring-[#2C2C2C]"
                />
                <span className="text-sm text-gray-700">Specific Products</span>
              </label>
            </div>

            {formData.appliesTo === 'specific' && (
              <div className="mt-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1 bg-gray-50">
                {products.length === 0 ? (
                  <p className="text-sm text-gray-500 p-2 text-center">No products available.</p>
                ) : (
                  products.map(product => (
                    <label key={product.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-md cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                      <input
                        type="checkbox"
                        checked={formData.productIds.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, productIds: [...formData.productIds, product.id] });
                          } else {
                            setFormData({ ...formData, productIds: formData.productIds.filter(id => id !== product.id) });
                          }
                        }}
                        className="w-4 h-4 text-[#2C2C2C] border-gray-300 rounded focus:ring-[#2C2C2C]"
                      />
                      <img src={product.imageUrl} alt={product.name} className="w-8 h-8 rounded object-cover border border-gray-100" />
                      <span className="text-sm font-medium text-gray-700">{product.name}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-[#2C2C2C] border-gray-300 rounded focus:ring-[#2C2C2C]"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active (can be used by customers)
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2C2C2C] text-white py-3 rounded-lg font-bold hover:bg-black transition-colors disabled:opacity-70 mt-6 shadow-sm"
          >
            {loading ? 'Saving...' : (editingDiscount ? 'Update Discount' : 'Create Discount')}
          </button>
        </form>
      </AdminModal>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Discount"
        message="Are you sure you want to delete this discount code? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
