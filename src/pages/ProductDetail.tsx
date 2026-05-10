import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Plus, 
  Minus, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Truck, 
  RefreshCcw, 
  ShieldCheck,
  Heart,
  Share2,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { doc, getDoc, collection, onSnapshot, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useStore } from '../context/StoreContext';
import ProductGrid from '../components/ProductGrid';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  images?: string[];
  options?: {
    name: string;
    values: string[];
  };
}

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isLoggedIn } = useAuth();
  const requireAuth = useRequireAuth();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [openAccordion, setOpenAccordion] = useState<string | null>('materials');
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasOrdered, setHasOrdered] = useState(false);

  useEffect(() => {
    if (!user || !id) {
      setHasOrdered(false);
      return;
    }
    const checkOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), where('customerId', '==', user.uid));
        const snap = await getDocs(q);
        const orders = snap.docs.map(doc => doc.data() as { items: any[] });
        const found = orders.some(order => order.items?.some(item => item.id === id));
        setHasOrdered(found);
      } catch (err) {
        console.error("Error checking orders:", err);
      }
    };
    checkOrders();
  }, [user, id]);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(data);
          if (data.options?.values?.length) {
            setSelectedOption(data.options.values[0]);
          }
        } else {
          // Fallback mock data if not in Django
          setProduct({
            id: 'mock-1',
            name: 'Handcrafted Ceramic Vase',
            price: 89,
            category: 'Home Decor',
            description: 'This elegant ceramic vase is meticulously handcrafted by our master artisans. Each piece features a unique glaze finish that captures the essence of traditional pottery techniques with a modern minimalist aesthetic.',
            imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800',
            images: [
              'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&q=80&w=800'
            ],
            options: {
              name: 'Glaze Finish',
              values: ['Satin White', 'Matte Black', 'Earthy Green']
            }
          });
          setSelectedOption('Satin White');
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(fetchedReviews);
    }, (error) => {
      // Ignore index errors if they haven't been created yet
      if (error.message.includes('index')) {
        console.warn('Firestore index missing for reviews query. Falling back to unordered fetch.');
        const fallbackQ = query(collection(db, 'reviews'), where('productId', '==', id));
        onSnapshot(fallbackQ, (fallbackSnap) => {
          const fallbackReviews = fallbackSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Review[];
          setReviews(fallbackReviews.sort((a, b) => {
            const timeA = a.createdAt?.toMillis?.() || 0;
            const timeB = b.createdAt?.toMillis?.() || 0;
            return timeB - timeA;
          }));
        });
      } else {
        console.error("Error fetching reviews:", error);
      }
    });

    return () => unsubscribe();
  }, [id]);

  const handleAddToCart = () => {
    requireAuth(() => {
      if (product) {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          variant: selectedOption,
          imageUrl: product.imageUrl,
          quantity: quantity
        });
        alert('Product added to cart!');
      }
    });
  };

  const handleToggleWishlist = () => {
    requireAuth(() => {
      if (product) {
        toggleWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          imageUrl: product.imageUrl
        });
      }
    });
  };

  const handleBuyNow = () => {
    requireAuth(() => {
      if (product) {
        navigate('/checkout', { 
          state: { 
            items: [{
              id: product.id,
              name: product.name,
              price: product.price,
              category: product.category,
              variant: selectedOption,
              imageUrl: product.imageUrl,
              quantity: quantity
            }]
          } 
        });
      }
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      requireAuth();
      return;
    }
    
    if (!reviewComment.trim()) {
      alert('Please enter a comment.');
      return;
    }

    setSubmittingReview(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        productId: product?.id,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous User',
        rating: reviewRating,
        comment: reviewComment.trim(),
        createdAt: serverTimestamp()
      });
      setReviewComment('');
      setReviewRating(5);
      alert('Review submitted successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reviews');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product?.name,
      text: `Check out this ${product?.name} on MOONCREATION!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">Product not found</div>;

  const productImages = product.images || [product.imageUrl];
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1) 
    : '5.0';

  const accordionItems = [
    {
      id: 'materials',
      title: 'Materials & Dimensions',
      content: 'Hand-thrown stoneware clay with lead-free, food-safe glaze. Dimensions: 8" Height x 5" Diameter. Weight: 1.2 lbs.'
    },
    {
      id: 'care',
      title: 'Care Instructions',
      content: 'Hand wash recommended to preserve the unique glaze finish. Microwave safe, but avoid sudden temperature changes to prevent thermal shock.'
    },
    {
      id: 'shipping',
      title: 'Shipping & Returns',
      content: 'Free standard shipping on orders over $150. Returns accepted within 30 days of delivery in original packaging.'
    }
  ];

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex text-sm font-medium text-gray-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/categories" className="hover:text-black transition-colors">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-[#2C2C2C]">{product.name}</span>
        </nav>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="aspect-square rounded-[32px] overflow-hidden bg-white shadow-sm border border-gray-100 relative group">
              <img 
                src={productImages[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 right-6 flex flex-col gap-2">
                <button 
                  onClick={handleToggleWishlist}
                  className="p-3 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 transition-all shadow-sm" 
                  title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart size={20} className={isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""} />
                </button>
                <button onClick={handleShare} className="p-3 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-[#2C2C2C] transition-all shadow-sm" title="Share Product">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImage === idx ? 'border-[#2C2C2C]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                <span>{product.category}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-[#2C2C2C]">{averageRating}</span>
                  <span className="text-gray-400 font-medium">({reviews.length} Reviews)</span>
                </div>
              </div>
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2C2C2C] leading-tight">
                  {product.name}
                </h1>
              </div>
              <p className="text-3xl font-bold text-[#2C2C2C]">${product.price}</p>
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Options */}
            {product.options && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#2C2C2C] uppercase tracking-wider">
                  {product.options.name}: <span className="text-gray-500 font-medium ml-2">{selectedOption}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.options.values.map((val) => (
                    <button
                      key={val}
                      onClick={() => setSelectedOption(val)}
                      className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all border-2 ${
                        selectedOption === val 
                          ? 'bg-[#2C2C2C] text-white border-[#2C2C2C] shadow-lg shadow-black/5' 
                          : 'bg-white text-[#2C2C2C] border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-white rounded-2xl border border-gray-100 p-1 shadow-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-400 hover:text-black transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-gray-400 hover:text-black transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex-1 flex gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-white text-[#2C2C2C] border-2 border-[#2C2C2C] py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="flex-1 bg-[#2C2C2C] text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-black/10"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-4 border-y border-gray-100 text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <Truck size={18} className="text-gray-400" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCcw size={18} className="text-gray-400" />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-gray-400" />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>

            {/* Accordion Details */}
            <div className="space-y-2">
              {accordionItems.map((item) => (
                <div key={item.id} className="border-b border-gray-100">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                  >
                    <span className="font-serif font-bold text-lg text-[#2C2C2C] group-hover:text-black transition-colors">
                      {item.title}
                    </span>
                    {openAccordion === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${
                    openAccordion === item.id ? 'max-h-40 pb-5' : 'max-h-0'
                  }`}>
                    <p className="text-gray-600 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 mt-24">
        <div className="border-t border-gray-200 pt-16">
          <div className="flex items-center gap-3 mb-10">
            <MessageSquare className="text-[#2C2C2C]" size={28} />
            <h2 className="text-3xl font-serif font-bold text-[#2C2C2C]">Customer Reviews</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Reviews List */}
            <div className={`space-y-8 ${hasOrdered ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              {reviews.length === 0 ? (
                <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-[#2C2C2C]">{review.userName}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : 'Just now'}
                        </p>
                      </div>
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            fill={i < review.rating ? "currentColor" : "none"} 
                            className={i < review.rating ? "" : "text-gray-300"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review - Only visible for verified purchasers */}
            {hasOrdered && (
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm h-fit sticky top-24">
                <h3 className="text-xl font-bold text-[#2C2C2C] mb-6">Write a Review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star 
                            size={28} 
                            fill={star <= reviewRating ? "#EAB308" : "none"} 
                            className={star <= reviewRating ? "text-yellow-500" : "text-gray-300"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="comment" className="block text-sm font-bold text-gray-700 mb-2">Your Review</label>
                    <textarea
                      id="comment"
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="What did you think about this product?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2C2C2C] focus:border-transparent transition-all resize-none"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-[#2C2C2C] text-white py-4 rounded-xl font-bold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="mt-32">
        <ProductGrid title="You Might Also Like" count={4} />
      </div>
    </div>
  );
}
