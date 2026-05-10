import React, { useEffect, useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Info,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Save,
  Trash2,
  Search,
  Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import imageCompression from 'browser-image-compression';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  comparePrice: string;
  status: 'draft' | 'published';
  category: string;
  subCategory?: string;
  imageUrl: string;
  images: string[];
}

const initialForm: ProductForm = {
  name: '',
  description: '',
  price: '',
  comparePrice: '',
  status: 'published',
  category: '',
  subCategory: '',
  imageUrl: '',
  images: [],
};

export default function AdminAddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<{name: string, subcategories?: string[]}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const catData = querySnapshot.docs.map(doc => ({
          name: doc.data().name,
          subcategories: doc.data().subcategories || []
        }));
        setAvailableCategories(catData);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();

    if (id) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const docRef = doc(db, 'products', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setForm({
              ...initialForm,
              ...data,
              price: data.price?.toString() || '',
              comparePrice: data.comparePrice?.toString() || '',
              images: data.images || (data.imageUrl ? [data.imageUrl] : []),
            } as ProductForm);
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImage(true);
    const newImages = [...form.images];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert(`File ${file.name} is not an image.`);
        continue;
      }

      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };
        const compressedBlob = await imageCompression(file, options);

        const formData = new FormData();
        formData.append('file', compressedBlob);
        // FIXME: Update 'demo_cloud' and 'demo_preset' with actual Cloudinary credentials
        formData.append('upload_preset', 'demo_preset');

        const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/demo_cloud/image/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errData = await uploadResponse.json();
          throw new Error(errData.error?.message || 'Upload failed');
        }
        
        const uploadData = await uploadResponse.json();
        newImages.push(uploadData.secure_url);
      } catch (error: any) {
        console.error('Error uploading image:', error);
        alert(`Failed to process image ${file.name}. Reason: ${error.message}`);
      }
    }
    
    setForm({ ...form, images: newImages, imageUrl: newImages[0] || '' });
    setUploadingImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category || form.images.length === 0) {
      alert('Please fill in all required fields (Name, Price, Category, at least one Image)');
      return;
    }

    setSaving(true);
    try {
      if (parseFloat(form.price) <= 0) {
        alert('Price must be greater than 0.');
        setSaving(false);
        return;
      }

      // Format strictly for Firestore rules to avoid Permissions error
      const productData: any = {
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
        imageUrl: form.imageUrl || form.images[0] || '',
        status: form.status,
      };

      if (form.subCategory) productData.subCategory = form.subCategory;
      if (form.description) productData.description = form.description;
      if (form.comparePrice) productData.comparePrice = parseFloat(form.comparePrice);

      if (id) {
        await setDoc(doc(db, 'products', id), productData, { merge: true });
      } else {
        productData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'products'), productData);
      }
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert('Failed to save product: ' + (error.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };


  if (loading) return <div className="flex items-center justify-center min-h-[60vh]">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/products')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit Product' : 'Add Product'}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#2C2C2C] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors shadow-sm disabled:opacity-70"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Description */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                placeholder="e.g. Handmade Ceramic Vase"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
              <textarea 
                rows={6}
                placeholder="Describe your product..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2C2C2C]/10 focus:border-[#2C2C2C] outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Media */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 mb-4">Media</label>
            <div className="space-y-4">
              
              {/* Direct URL Input */}
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  id="manual-url-input"
                  placeholder="Paste Cloudinary or any direct image URL..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2C2C2C]/10 outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (val) {
                        const newImages = [...form.images, val];
                        setForm({...form, images: newImages, imageUrl: newImages[0]});
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const input = document.getElementById('manual-url-input') as HTMLInputElement;
                    const val = input.value.trim();
                    if (val) {
                      const newImages = [...form.images, val];
                      setForm({...form, images: newImages, imageUrl: newImages[0]});
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-[#2C2C2C] hover:bg-black text-white rounded-lg text-sm font-bold transition-colors whitespace-nowrap"
                >
                  Add URL
                </button>
              </div>
              
              <div className="flex items-center py-1">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="mx-4 text-xs font-bold text-gray-400 uppercase">OR</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                multiple
                className="hidden" 
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="p-3 rounded-full bg-white shadow-sm text-gray-400 group-hover:text-[#2C2C2C] transition-colors">
                  {uploadingImage ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900">
                    {uploadingImage ? 'Uploading...' : 'Click to upload images'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                </div>
              </div>
              
              {form.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                  {form.images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                      <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {index > 0 && (
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              const newImages = [...form.images];
                              [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
                              setForm({ ...form, images: newImages, imageUrl: newImages[0] });
                            }}
                            className="p-1 bg-white/80 rounded-full text-gray-700 hover:text-black"
                            title="Move Left"
                          >
                            <ChevronLeft size={14} />
                          </button>
                        )}
                        {index < form.images.length - 1 && (
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              const newImages = [...form.images];
                              [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
                              setForm({ ...form, images: newImages, imageUrl: newImages[0] });
                            }}
                            className="p-1 bg-white/80 rounded-full text-gray-700 hover:text-black"
                            title="Move Right"
                          >
                            <ChevronRight size={14} />
                          </button>
                        )}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            const newImages = form.images.filter((_, i) => i !== index);
                            setForm({ ...form, images: newImages, imageUrl: newImages[0] || '' });
                          }}
                          className="p-1 bg-white/80 rounded-full text-red-500 hover:bg-red-50"
                          title="Remove Image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] font-bold text-center py-1">
                          Primary Image
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 mb-4">Pricing</label>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Compare at price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={form.comparePrice}
                    onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
                    className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Panel */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-bold text-gray-700 mb-4">Status</label>
            <div className="relative">
              <select 
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-[#2C2C2C]/10 outline-none transition-all cursor-pointer"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            <p className="text-[10px] text-gray-500 mt-2">This product will be {form.status === 'published' ? 'visible' : 'hidden'} on your store.</p>
          </div>

          {/* Organization */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
            <label className="block text-sm font-bold text-gray-700">Product Organization</label>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
              <input 
                type="text" 
                list="category-suggestions"
                placeholder="e.g. Ceramics (Select or type new)"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value, subCategory: '' })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
              <datalist id="category-suggestions">
                {availableCategories.map((cat, idx) => (
                  <option key={idx} value={cat.name} />
                ))}
              </datalist>
            </div>

            {availableCategories.find(c => c.name === form.category)?.subcategories?.length ? (
              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Subcategory</label>
                <div className="relative">
                  <select 
                    value={form.subCategory || ''}
                    onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-[#2C2C2C]/10 outline-none transition-all cursor-pointer"
                  >
                    <option value="">Select Subcategory (Optional)</option>
                    {availableCategories.find(c => c.name === form.category)?.subcategories?.map((sub, idx) => (
                      <option key={idx} value={sub}>{sub}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            ) : null}

          </div>
        </div>
      </div>
    </div>
  );
}
