import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Trash2, Plus, Image as ImageIcon, Upload, Loader2, X } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newBanner, setNewBanner] = useState({
    image: '',
    title: '',
    subtitle: ''
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'banners'));
      const bannersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Banner[];
      setBanners(bannersList);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImage(true);
    const file = files[0];

    if (!file.type.startsWith('image/')) {
      alert(`File ${file.name} is not an image.`);
      setUploadingImage(false);
      return;
    }

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
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
      setNewBanner({ ...newBanner, image: uploadData.secure_url });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(`Failed to process image ${file.name}. Reason: ${error.message}`);
    }
    
    setUploadingImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'banners'), newBanner);
      setNewBanner({ image: '', title: '', subtitle: '' });
      setIsAdding(false);
      fetchBanners(); // Refresh list
    } catch (error: any) {
      console.error("Error adding banner:", error);
      alert("Failed to save banner: " + error.message);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await deleteDoc(doc(db, 'banners', id));
        fetchBanners();
      } catch (error) {
        console.error("Error deleting banner:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#2C2C2C]">Hero Banners</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the image slider shown on the homepage.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-[#2C2C2C] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors"
        >
          {isAdding ? <span className="px-2">Cancel</span> : <><Plus size={18} /> Add Banner</>}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-[#2C2C2C] mb-4">Add New Banner</h2>
          <form onSubmit={handleAddBanner} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
              
              {!newBanner.image ? (
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
                            setNewBanner({...newBanner, image: val});
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
                          setNewBanner({...newBanner, image: val});
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
                        {uploadingImage ? 'Uploading...' : 'Click to upload image'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group w-full max-w-sm">
                  <img src={newBanner.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        setNewBanner({ ...newBanner, image: '' });
                      }}
                      className="p-1.5 bg-white/90 rounded-full text-red-500 hover:bg-red-50 shadow-sm"
                      title="Remove Image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newBanner.title}
                onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                placeholder="MOONCREATION Ceramics (Optional)"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2C2C]/20 focus:border-[#2C2C2C]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <textarea
                value={newBanner.subtitle}
                onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                placeholder="Elevate your dining experience... (Optional)"
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2C2C]/20 focus:border-[#2C2C2C] resize-none"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={(!newBanner.image && !newBanner.title && !newBanner.subtitle) || uploadingImage}
                className="bg-[#2C2C2C] text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition-colors disabled:opacity-50"
              >
                Save Banner
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <p className="text-gray-500">Loading banners...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm text-center">
          <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-[#2C2C2C]">No Banners Found</h3>
          <p className="text-gray-500 mt-1">If no banners are added here, the default hardcoded slides will be shown on the homepage.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col">
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-[#2C2C2C] line-clamp-1">{banner.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{banner.subtitle}</p>
                </div>
                <button
                  onClick={() => handleDeleteBanner(banner.id)}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
