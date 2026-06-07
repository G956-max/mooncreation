import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { 
  ChevronRight, 
  Truck, 
  ShieldCheck, 
  ArrowLeft,
  Info,
  ChevronDown,
  X,
  Smartphone,
  CheckCircle2
} from 'lucide-react';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  variant: string;
  imageUrl: string;
  quantity: number;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 
  'Lakshadweep', 'Puducherry'
];

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userData } = useAuth();
  
  const stateItems = location.state?.items;
  
  const [cartItems] = useState<CartItem[]>(stateItems || []);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const [email, setEmail] = useState(userData?.email || user?.email || '');
  const [firstName, setFirstName] = useState(userData?.firstName || '');
  const [lastName, setLastName] = useState(userData?.lastName || '');
  const [address, setAddress] = useState(userData?.location || '');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [phone, setPhone] = useState(userData?.phone || '');
  const [saveInfo, setSaveInfo] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      if (!email && userData.email) setEmail(userData.email);
      if (!firstName && userData.firstName) setFirstName(userData.firstName);
      if (!lastName && userData.lastName) setLastName(userData.lastName);
      if (!address && userData.location) setAddress(userData.location);
      if (!phone && userData.phone) setPhone(userData.phone);
    } else if (user && !email) {
      setEmail(user.email || '');
    }
  }, [userData, user]);



  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = shippingMethod === 'standard' ? 50 : 150;
  const taxes = subtotal * 0.08;
  const discount = discountApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shippingCost + taxes - discount;
  const advancePayment = total * 0.7;
  const balancePayment = total * 0.3;

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === 'ARTISAN10') {
      setDiscountApplied(true);
    } else {
      alert('Invalid code. Try "ARTISAN10"');
    }
  };

  const handlePlaceOrder = async (razorpayPaymentId?: string) => {
    setLoading(true);
    try {
      // Save info if requested
      if (saveInfo && user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          firstName,
          lastName,
          location: address,
          phone
        });
      }

      // Add to orders collection
      const orderData = {
        customerId: user?.uid || 'guest',
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        customerPhone: phone,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          category: item.category,
          variant: item.variant,
          imageUrl: item.imageUrl,
          quantity: item.quantity
        })),
        pricing: {
          subtotal,
          shippingCost,
          taxes,
          discount,
          total,
          advancePayment: paymentMethod === 'cod' ? 0 : advancePayment,
          balancePayment: paymentMethod === 'cod' ? total : balancePayment
        },
        shippingAddress: {
          firstName,
          lastName,
          address,
          apartment,
          city,
          state: selectedState,
          pinCode,
          country: 'India'
        },
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Razorpay Secure Checkout',
        paymentStatus: paymentMethod === 'cod' ? 'Unpaid' : 'Advance Paid (70%)',
        razorpayPaymentId: razorpayPaymentId || null,
        status: 'Pending',
        createdAt: serverTimestamp()
      };

      const orderRef = await addDoc(collection(db, 'orders'), orderData);

      // Clear Cart in Firestore
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { cart: [] });
      }

      setLoading(false);
      navigate('/order-success', { state: { orderId: orderRef.id } });
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Order placement failed. Please check connection.");
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Failed to load Razorpay SDK. Please check your internet connection.");
      setLoading(false);
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_ScBY1hnsOxE5u7',
      amount: Math.round(advancePayment * 100),
      currency: 'INR',
      name: 'MOONCREATION',
      description: 'Order Advance Payment (70%)',
      handler: async function (response: any) {
        if (response.razorpay_payment_id) {
          await handlePlaceOrder(response.razorpay_payment_id);
        } else {
          alert("Payment was successful but transaction ID was not returned.");
          setLoading(false);
        }
      },
      prefill: {
        name: `${firstName} ${lastName}`,
        email: email,
        contact: phone
      },
      theme: {
        color: '#C48B22'
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
        }
      }
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay Modal Error:", error);
      alert("An error occurred opening the payment gateway.");
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedState || selectedState === 'State') {
      alert("Please select a valid shipping state");
      return;
    }

    if (pinCode.length !== 6 || isNaN(Number(pinCode))) {
      alert("Please enter a valid 6-digit numeric PIN Code");
      return;
    }

    if (phone.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else {
      handlePlaceOrder();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2C2C2C] font-sans pb-16 lg:pb-0">
      <div className="w-full flex flex-col lg:flex-row min-h-screen">
        
        {/* LEFT SIDE: Shipping, Address & Payment */}
        <div className="flex-grow lg:w-3/5 p-4 sm:p-10 lg:p-16 border-r border-gray-200 order-2 lg:order-1">
          <div className="max-w-xl ml-auto">
            
            {/* Navigation Header */}
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-medium text-gray-400 mb-6 md:mb-10 uppercase tracking-widest">
              <Link to="/cart" className="hover:text-[#2C2C2C] transition-colors">Cart</Link>
              <ChevronRight size={12} />
              <span className="text-[#2C2C2C]">Information</span>
              <ChevronRight size={12} />
              <span>Shipping</span>
              <ChevronRight size={12} />
              <span>Payment</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
              
              {/* Contact Details */}
              <section className="space-y-4 md:space-y-6">
                <div className="flex justify-between items-end">
                  <h2 className="text-base md:text-xl font-serif font-bold">Contact Info</h2>
                  {!user && (
                    <Link to="/login" className="text-xs font-bold underline underline-offset-4 hover:text-gray-500 transition-colors">Log in</Link>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input 
                    type="email" 
                    required
                    placeholder="Email Address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-xs md:text-sm focus:outline-none focus:border-[#C48B22] focus:ring-2 focus:ring-[#C48B22]/10 transition-all"
                  />
                  <input 
                    type="tel" 
                    required
                    placeholder="10-digit Phone Number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-xs md:text-sm focus:outline-none focus:border-[#C48B22] focus:ring-2 focus:ring-[#C48B22]/10 transition-all"
                  />
                </div>
              </section>

              {/* Delivery Address */}
              <section className="space-y-4 md:space-y-6">
                <h2 className="text-base md:text-xl font-serif font-bold">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  
                  {/* Country locked to India */}
                  <div className="sm:col-span-2 relative">
                    <select disabled className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-xs md:text-sm appearance-none focus:outline-none cursor-not-allowed">
                      <option>India</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  <input type="text" required placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-xs md:text-sm focus:outline-none focus:border-[#C48B22] focus:ring-2 focus:ring-[#C48B22]/10 transition-all" />
                  <input type="text" required placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-xs md:text-sm focus:outline-none focus:border-[#C48B22] focus:ring-2 focus:ring-[#C48B22]/10 transition-all" />
                  <input type="text" required placeholder="Street Address, Block, Area" value={address} onChange={e => setAddress(e.target.value)} className="sm:col-span-2 w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-xs md:text-sm focus:outline-none focus:border-[#C48B22] focus:ring-2 focus:ring-[#C48B22]/10 transition-all" />
                  <input type="text" placeholder="Apartment, suite, unit, etc. (optional)" value={apartment} onChange={e => setApartment(e.target.value)} className="sm:col-span-2 w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-xs md:text-sm focus:outline-none focus:border-[#C48B22] focus:ring-2 focus:ring-[#C48B22]/10 transition-all" />
                  <input type="text" required placeholder="City / Town" value={city} onChange={e => setCity(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-xs md:text-sm focus:outline-none focus:border-[#C48B22] focus:ring-2 focus:ring-[#C48B22]/10 transition-all" />
                  
                  {/* Indian States Dropdown */}
                  <div className="relative">
                    <select 
                      required
                      value={selectedState}
                      onChange={e => setSelectedState(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-xs md:text-sm appearance-none focus:outline-none focus:border-[#C48B22] focus:ring-2 focus:ring-[#C48B22]/10 transition-all"
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  <input 
                    type="text" 
                    required 
                    maxLength={6}
                    placeholder="6-digit PIN Code" 
                    value={pinCode} 
                    onChange={e => setPinCode(e.target.value)} 
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-xs md:text-sm focus:outline-none focus:border-[#C48B22] focus:ring-2 focus:ring-[#C48B22]/10 transition-all" 
                  />
                  
                  <div className="sm:col-span-2 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" checked={saveInfo} onChange={e => setSaveInfo(e.target.checked)} className="peer appearance-none w-5 h-5 border border-gray-200 rounded-md checked:bg-[#2C2C2C] checked:border-[#2C2C2C] transition-all" />
                        <div className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                        </div>
                      </div>
                      <span className="text-xs md:text-sm text-gray-600 group-hover:text-[#2C2C2C] transition-colors">Save shipping address for next time</span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Shipping Method */}
              <section className="space-y-6">
                <h2 className="text-base md:text-xl font-serif font-bold">Shipping Speed</h2>
                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                  <label className={`flex items-center justify-between p-5 cursor-pointer transition-colors ${shippingMethod === 'standard' ? 'bg-gray-50' : 'hover:bg-gray-50/50'}`}>
                    <div className="flex items-center gap-4">
                      <input 
                        type="radio" 
                        name="shipping" 
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="peer appearance-none w-5 h-5 border border-gray-300 rounded-full checked:border-[#C48B22] checked:border-[6px] transition-all" 
                      />
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold">Standard Delivery</p>
                        <p className="text-xs text-gray-500">3–5 business days</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold">₹50.00</span>
                  </label>
                  <div className="h-[1px] bg-gray-100 mx-5"></div>
                  <label className={`flex items-center justify-between p-5 cursor-pointer transition-colors ${shippingMethod === 'express' ? 'bg-gray-50' : 'hover:bg-gray-50/50'}`}>
                    <div className="flex items-center gap-4">
                      <input 
                        type="radio" 
                        name="shipping" 
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="peer appearance-none w-5 h-5 border border-gray-300 rounded-full checked:border-[#C48B22] checked:border-[6px] transition-all" 
                      />
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold">Express Air Delivery</p>
                        <p className="text-xs text-gray-500">1–2 business days</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold">₹150.00</span>
                  </label>
                </div>
              </section>

              {/* Payment Methods: Razorpay Secure, COD */}
              <section className="space-y-6">
                <div className="space-y-1">
                  <h2 className="text-base md:text-xl font-serif font-bold">Payment Methods</h2>
                  <p className="text-xs text-gray-500">Secure transaction with instant order booking.</p>
                </div>
                
                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                  {/* Razorpay Online */}
                  <label className={`flex flex-col p-5 cursor-pointer transition-all border-b border-gray-100 ${paymentMethod === 'razorpay' ? 'bg-amber-50/10 border-l-4 border-l-[#C48B22]' : 'hover:bg-gray-50/50 border-l-4 border-l-transparent'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={paymentMethod === 'razorpay'}
                          onChange={() => setPaymentMethod('razorpay')}
                          className="peer appearance-none w-5 h-5 border border-gray-300 rounded-full checked:border-[#C48B22] checked:border-[6px] transition-all" 
                        />
                        <div>
                          <span className="text-sm font-bold flex items-center gap-2">
                            Secure Online Payment <span className="text-[10px] bg-amber-100 text-[#C48B22] px-2 py-0.5 rounded font-black">Razorpay</span>
                          </span>
                          <p className="text-xs text-gray-500 mt-1">UPI, Cards, Netbanking, Wallets</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <span className="text-[9px] border border-gray-200 text-gray-400 px-1.5 py-0.5 rounded font-mono font-bold">UPI</span>
                        <span className="text-[9px] border border-gray-200 text-gray-400 px-1.5 py-0.5 rounded font-mono font-bold">CARDS</span>
                        <span className="text-[9px] border border-gray-200 text-gray-400 px-1.5 py-0.5 rounded font-mono font-bold">NET</span>
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label className={`flex flex-col p-5 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'bg-amber-50/10 border-l-4 border-l-[#C48B22]' : 'hover:bg-gray-50/50 border-l-4 border-l-transparent'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="peer appearance-none w-5 h-5 border border-gray-300 rounded-full checked:border-[#C48B22] checked:border-[6px] transition-all" 
                        />
                        <div>
                          <span className="text-sm font-bold">Cash on Delivery (COD)</span>
                          <p className="text-xs text-gray-500 mt-1">Pay 100% in cash at the time of delivery.</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-500 border border-gray-300 px-2.5 py-1 rounded shrink-0">Pay on Delivery</span>
                    </div>
                  </label>
                </div>

                {/* Razorpay Info Alert */}
                {paymentMethod === 'razorpay' && (
                  <div className="space-y-2 mt-4 p-5 bg-amber-50/20 rounded-2xl border border-[#C48B22]/10 animate-in fade-in duration-300">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      You will pay a <strong className="text-[#C48B22]">70% advance (₹{advancePayment.toFixed(2)})</strong> online now. The remaining <strong className="text-gray-800">30% (₹{balancePayment.toFixed(2)})</strong> will be collected as Cash on Delivery.
                    </p>
                  </div>
                )}
              </section>

              {/* Complete Payment Button */}
              <div className="pt-8 space-y-6">
                <button 
                  type="submit"
                  disabled={cartItems.length === 0}
                  className="w-full bg-[#2C2C2C] text-white py-4.5 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-black/10 text-base flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentMethod === 'cod' ? 'Complete COD Order' : 'Pay Advance & Complete Order'}
                </button>
                <div className="text-center">
                  <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#2C2C2C] transition-colors">
                    <ArrowLeft size={16} />
                    Return to cart
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE: Cart items Summary */}
        <div className="lg:w-2/5 bg-white lg:bg-transparent p-4 sm:p-10 lg:p-16 order-1 lg:order-2 border-b border-gray-200 lg:border-b-0">
          <div className="max-w-md mx-auto lg:mx-0">
            <div className="space-y-8">
              
              {/* Product list */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id + '-' + item.variant} className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
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
                    <div className="flex-grow min-w-0">
                      <h4 className="text-sm font-bold text-[#2C2C2C] truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500 truncate">{item.variant}</p>
                    </div>
                    <span className="text-sm font-bold text-[#2C2C2C] shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                {cartItems.length === 0 && (
                  <p className="text-sm text-gray-400 italic">No products in cart.</p>
                )}
              </div>

              {/* Discount Code */}
              <div className="flex gap-3 py-6 border-y border-gray-200">
                <input 
                  type="text" 
                  placeholder="Discount code (e.g. ARTISAN10)" 
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-grow bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C48B22] transition-all"
                />
                <button 
                  type="button"
                  onClick={handleApplyDiscount}
                  className="bg-[#FAF9F6] border border-gray-200 text-[#2C2C2C] px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Apply
                </button>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping speed</span>
                  <span className="font-bold">₹{shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST Taxes (8%)</span>
                  <span className="font-bold">₹{taxes.toLocaleString()}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount Code (10%)</span>
                    <span className="font-bold">-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-end pt-4 border-t border-gray-200">
                  <div className="space-y-0.5">
                    <span className="text-lg font-serif font-bold text-gray-500">Total Value</span>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Includes ₹{taxes.toLocaleString()} GST</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-gray-400 font-medium uppercase font-sans">INR</span>
                    <span className="text-xl font-bold tracking-tight text-gray-500 line-through">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {paymentMethod !== 'cod' ? (
                  <>
                    <div className="flex justify-between items-end pt-4">
                      <div className="space-y-0.5">
                        <span className="text-lg font-serif font-bold text-[#C48B22]">Advance to Pay Now (70%)</span>
                        <p className="text-[10px] text-[#C48B22] uppercase tracking-widest font-bold">Payable now via UPI</p>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-[#C48B22] font-medium uppercase">INR</span>
                        <span className="text-2xl font-bold tracking-tight text-[#C48B22]">₹{advancePayment.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                      <div className="space-y-0.5">
                        <span className="text-sm font-serif font-bold text-gray-600">Balance on Delivery (30%)</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold tracking-tight text-gray-600">₹{balancePayment.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-end pt-4 border-t border-dashed border-gray-200">
                    <div className="space-y-0.5">
                      <span className="text-lg font-serif font-bold text-[#2C2C2C]">Payable on Delivery (100%)</span>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Pay in cash when delivered</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-gray-400 font-medium uppercase">INR</span>
                      <span className="text-2xl font-bold tracking-tight text-[#2C2C2C]">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Secure checkout info */}
              <div className="pt-8 border-t border-gray-100 space-y-4">
                <div className="flex items-center gap-3 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  <ShieldCheck size={16} className="text-gray-300" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  <Truck size={16} className="text-gray-300" />
                  <span>Insured shipping via MOONCREATION</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Razorpay Payment modal - No manual QR overlay needed */}
    </div>
  );
}
