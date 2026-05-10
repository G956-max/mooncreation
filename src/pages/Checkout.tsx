import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { 
  ChevronRight, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ArrowLeft,
  Info,
  ChevronDown
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  variant: string;
  imageUrl: string;
  quantity: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userData } = useAuth();
  
  // Use products from location.state if available (passed from Buy Now or Cart)
  const stateItems = location.state?.items;
  
  // Mock cart data (fallback if not in state)
  const [cartItems] = useState<CartItem[]>(stateItems || [
    {
      id: '1',
      name: 'Handcrafted Ceramic Vase',
      price: 89,
      category: 'Home Decor',
      variant: 'Satin White',
      imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=400',
      quantity: 1
    }
  ]);

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const [email, setEmail] = useState(userData?.email || user?.email || '');
  const [firstName, setFirstName] = useState(userData?.firstName || '');
  const [lastName, setLastName] = useState(userData?.lastName || '');
  const [address, setAddress] = useState(userData?.location || '');
  const [saveInfo, setSaveInfo] = useState(true);

  React.useEffect(() => {
    if (userData) {
      if (!email && userData.email) setEmail(userData.email);
      if (!firstName && userData.firstName) setFirstName(userData.firstName);
      if (!lastName && userData.lastName) setLastName(userData.lastName);
      if (!address && userData.location) setAddress(userData.location);
    } else if (user && !email) {
      setEmail(user.email || '');
    }
  }, [userData, user]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = shippingMethod === 'standard' ? 15 : 35;
  const taxes = subtotal * 0.08;
  const discount = discountApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shippingCost + taxes - discount;

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === 'ARTISAN10') {
      setDiscountApplied(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (saveInfo && user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          firstName,
          lastName,
          location: address
        });
      } catch (err) {
        console.error("Error saving user info:", err);
      }
    }
    
    alert('Order placed successfully! (Demo)');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2C2C2C] font-sans">
      <div className="w-full flex flex-col lg:flex-row min-h-screen">
        
        {/* LEFT SIDE: Checkout Form */}
        <div className="flex-grow lg:w-3/5 p-6 sm:p-10 lg:p-16 border-r border-gray-200">
          <div className="max-w-xl ml-auto">
            {/* Header / Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-10 uppercase tracking-widest">
              <Link to="/cart" className="hover:text-[#2C2C2C] transition-colors">Cart</Link>
              <ChevronRight size={12} />
              <span className="text-[#2C2C2C]">Information</span>
              <ChevronRight size={12} />
              <span>Shipping</span>
              <ChevronRight size={12} />
              <span>Payment</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Contact Section */}
              <section className="space-y-6">
                <div className="flex justify-between items-end">
                  <h2 className="text-xl font-serif font-bold">Contact</h2>
                  <Link to="/login" className="text-xs font-bold underline underline-offset-4 hover:text-gray-500 transition-colors">Log in</Link>
                </div>
                <div className="space-y-4">
                  <div className="relative group">
                    <input 
                      type="email" 
                      required
                      placeholder="Email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-[#2C2C2C] transition-all"
                    />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" className="peer appearance-none w-5 h-5 border border-gray-200 rounded-md checked:bg-[#2C2C2C] checked:border-[#2C2C2C] transition-all" />
                      <div className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-[#2C2C2C] transition-colors">Email me with news and offers</span>
                  </label>
                </div>
              </section>

              {/* Delivery Section */}
              <section className="space-y-6">
                <h2 className="text-xl font-serif font-bold">Delivery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 relative">
                    <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm appearance-none focus:outline-none focus:border-[#2C2C2C] transition-all">
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <input type="text" required placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-[#2C2C2C] transition-all" />
                  <input type="text" required placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-[#2C2C2C] transition-all" />
                  <input type="text" required placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} className="sm:col-span-2 w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-[#2C2C2C] transition-all" />
                  <input type="text" placeholder="Apartment, suite, etc. (optional)" className="sm:col-span-2 w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-[#2C2C2C] transition-all" />
                  <input type="text" required placeholder="City" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-[#2C2C2C] transition-all" />
                  <div className="relative">
                    <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm appearance-none focus:outline-none focus:border-[#2C2C2C] transition-all">
                      <option>State</option>
                      <option>California</option>
                      <option>New York</option>
                      <option>Texas</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <input type="text" required placeholder="ZIP code" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-[#2C2C2C] transition-all" />
                  
                  <div className="sm:col-span-2 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" checked={saveInfo} onChange={e => setSaveInfo(e.target.checked)} className="peer appearance-none w-5 h-5 border border-gray-200 rounded-md checked:bg-[#2C2C2C] checked:border-[#2C2C2C] transition-all" />
                        <div className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-[#2C2C2C] transition-colors">Save this information for next time</span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Shipping Method Section */}
              <section className="space-y-6">
                <h2 className="text-xl font-serif font-bold">Shipping method</h2>
                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                  <label className={`flex items-center justify-between p-5 cursor-pointer transition-colors ${shippingMethod === 'standard' ? 'bg-[#FAF9F6]' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="radio" 
                          name="shipping" 
                          checked={shippingMethod === 'standard'}
                          onChange={() => setShippingMethod('standard')}
                          className="peer appearance-none w-5 h-5 border border-gray-300 rounded-full checked:border-[#2C2C2C] checked:border-[6px] transition-all" 
                        />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold">Standard Shipping</p>
                        <p className="text-xs text-gray-500">3–5 business days</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold">$15.00</span>
                  </label>
                  <div className="h-[1px] bg-gray-100 mx-5"></div>
                  <label className={`flex items-center justify-between p-5 cursor-pointer transition-colors ${shippingMethod === 'express' ? 'bg-[#FAF9F6]' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="radio" 
                          name="shipping" 
                          checked={shippingMethod === 'express'}
                          onChange={() => setShippingMethod('express')}
                          className="peer appearance-none w-5 h-5 border border-gray-300 rounded-full checked:border-[#2C2C2C] checked:border-[6px] transition-all" 
                        />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold">Express Shipping</p>
                        <p className="text-xs text-gray-500">1–2 business days</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold">$35.00</span>
                  </label>
                </div>
              </section>

              {/* Payment Section */}
              <section className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-serif font-bold">Payment</h2>
                  <p className="text-xs text-gray-500">All transactions are secure and encrypted.</p>
                </div>
                
                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                  <div className={`p-5 space-y-6 ${paymentMethod === 'card' ? 'bg-[#FAF9F6]' : ''}`}>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-4">
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="peer appearance-none w-5 h-5 border border-gray-300 rounded-full checked:border-[#2C2C2C] checked:border-[6px] transition-all" 
                        />
                        <span className="text-sm font-bold">Credit card</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-8 h-5 bg-gray-100 rounded border border-gray-200"></div>
                        <div className="w-8 h-5 bg-gray-100 rounded border border-gray-200"></div>
                        <div className="w-8 h-5 bg-gray-100 rounded border border-gray-200"></div>
                      </div>
                    </label>

                    {paymentMethod === 'card' && (
                      <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="col-span-2 relative">
                          <input type="text" placeholder="Card number" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-[#2C2C2C] transition-all" />
                          <ShieldCheck size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <input type="text" placeholder="Expiration date (MM / YY)" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-[#2C2C2C] transition-all" />
                        <div className="relative">
                          <input type="text" placeholder="Security code" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-[#2C2C2C] transition-all" />
                          <Info size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <input type="text" placeholder="Name on card" className="col-span-2 w-full bg-white border border-gray-200 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-[#2C2C2C] transition-all" />
                      </div>
                    )}
                  </div>

                  <div className="h-[1px] bg-gray-100 mx-5"></div>

                  <label className={`flex items-center justify-between p-5 cursor-pointer transition-colors ${paymentMethod === 'paypal' ? 'bg-[#FAF9F6]' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="peer appearance-none w-5 h-5 border border-gray-300 rounded-full checked:border-[#2C2C2C] checked:border-[6px] transition-all" 
                      />
                      <span className="text-sm font-bold italic text-blue-800">PayPal</span>
                    </div>
                    <div className="w-8 h-5 bg-gray-100 rounded border border-gray-200"></div>
                  </label>
                </div>
              </section>

              {/* Action Buttons */}
              <div className="pt-8 space-y-6">
                <button 
                  type="submit"
                  className="w-full bg-[#2C2C2C] text-white py-5 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-black/10 text-lg"
                >
                  Pay Now
                </button>
                <div className="text-center">
                  <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#2C2C2C] transition-colors">
                    <ArrowLeft size={16} />
                    Return to cart
                  </Link>
                </div>
              </div>
            </form>

            {/* Footer Links */}
            <div className="pt-20 pb-10 flex flex-wrap gap-6 border-t border-gray-200 mt-20">
              <Link to="#" className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-[#2C2C2C]">Refund policy</Link>
              <Link to="#" className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-[#2C2C2C]">Shipping policy</Link>
              <Link to="#" className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-[#2C2C2C]">Privacy policy</Link>
              <Link to="#" className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-[#2C2C2C]">Terms of service</Link>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Order Summary */}
        <div className="lg:w-2/5 bg-white lg:bg-transparent p-6 sm:p-10 lg:p-16">
          <div className="max-w-md mx-auto lg:mx-0">
            <div className="space-y-8">
              {/* Items List */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold text-[#2C2C2C]">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.variant}</p>
                    </div>
                    <span className="text-sm font-bold text-[#2C2C2C]">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Discount Field */}
              <div className="flex gap-3 py-6 border-y border-gray-100">
                <input 
                  type="text" 
                  placeholder="Discount code or gift card" 
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-grow bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2C2C2C] transition-all"
                />
                <button 
                  onClick={handleApplyDiscount}
                  className="bg-[#FAF9F6] border border-gray-200 text-[#2C2C2C] px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all"
                >
                  Apply
                </button>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-bold">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estimated taxes</span>
                  <span className="font-bold">${taxes.toFixed(2)}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount (10%)</span>
                    <span className="font-bold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-end pt-4">
                  <div className="space-y-0.5">
                    <span className="text-lg font-serif font-bold">Total</span>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Including ${taxes.toFixed(2)} in taxes</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-gray-400 font-medium uppercase">USD</span>
                    <span className="text-2xl font-bold tracking-tight">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-10 grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  <ShieldCheck size={16} className="text-gray-300" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  <Truck size={16} className="text-gray-300" />
                  <span>Insured MOONCREATION shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
