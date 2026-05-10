import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ArrowLeft, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRequireAuth } from '../hooks/useRequireAuth';

import { useStore } from '../context/StoreContext';

export default function Cart() {
  const { isLoggedIn } = useAuth();
  const requireAuth = useRequireAuth();
  const navigate = useNavigate();
  const { cartItems, updateCartQuantity, removeFromCart } = useStore();
  
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const taxes = subtotal * 0.08;
  const discount = discountApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping + taxes - discount;

  const handleCheckout = () => {
    requireAuth(() => {
      navigate('/checkout', { state: { items: cartItems } });
    });
  };

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === 'ARTISAN10') {
      setDiscountApplied(true);
      alert('Discount applied successfully!');
    } else {
      alert('Invalid discount code');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-20">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold text-[#2C2C2C] mb-10">
          Your Cart ({cartItems.length})
        </h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Cart Items */}
          <div className="flex-grow space-y-8">
            {cartItems.length > 0 ? (
              <>
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                      <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      <div className="flex-grow space-y-1">
                        <h3 className="text-xl font-serif font-bold text-[#2C2C2C]">{item.name}</h3>
                        <p className="text-sm text-gray-500 font-medium">{item.variant}</p>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-sm font-bold text-red-500 hover:text-red-700 flex items-center gap-1 mt-2 transition-colors"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>

                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                        <div className="flex items-center bg-[#FAF9F6] rounded-xl border border-gray-100 p-1">
                          <button 
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="p-2 text-gray-400 hover:text-black transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="p-2 text-gray-400 hover:text-black transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-[#2C2C2C]">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-xs text-gray-400">${item.price} each</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Link 
                  to="/categories" 
                  className="inline-flex items-center gap-2 text-[#2C2C2C] font-bold hover:gap-3 transition-all mt-4"
                >
                  <ArrowLeft size={18} />
                  Continue Shopping
                </Link>
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
                <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
                <Link 
                  to="/categories" 
                  className="bg-[#2C2C2C] text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all"
                >
                  Explore Collections
                </Link>
              </div>
            )}
          </div>

          {/* Right: Summary */}
          <div className="w-full lg:w-[400px] space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#2C2C2C] uppercase tracking-widest">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#2C2C2C]">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-bold text-[#2C2C2C]">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Tax</span>
                    <span className="font-bold text-[#2C2C2C]">${taxes.toFixed(2)}</span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10%)</span>
                      <span className="font-bold">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-lg font-serif font-bold text-[#2C2C2C]">Total</span>
                  <span className="text-3xl font-bold text-[#2C2C2C]">${total.toFixed(2)}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Discount code" 
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1 bg-[#FAF9F6] border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2C2C2C] transition-colors"
                    />
                    <button 
                      onClick={handleApplyDiscount}
                      className="bg-[#2C2C2C] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-black transition-all"
                    >
                      Apply
                    </button>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className="w-full bg-[#2C2C2C] text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                  <ShieldCheck size={16} />
                  <span>Secure checkout with 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                  <Truck size={16} />
                  <span>Free shipping on orders over $150</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                  <CreditCard size={16} />
                  <span>Flexible payment options available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
