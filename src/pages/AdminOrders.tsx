import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, query, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ShoppingBag, Search, Clock, Eye, Trash2, Calendar, CreditCard, MapPin } from 'lucide-react';

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    variant: string;
  }[];
  pricing: {
    total: number;
    subtotal: number;
    shippingCost: number;
  };
  shippingAddress: {
    address: string;
    apartment?: string;
    city: string;
    state: string;
    pinCode: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  razorpayPaymentId?: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: any;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(list);
      setLoading(false);
    }, (err) => {
      console.error("Error loading admin orders:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        status: newStatus,
        paymentStatus: newStatus === 'Delivered' ? 'Paid' : (newStatus === 'Cancelled' ? 'Refunded/Void' : 'Advance Paid (70%)')
      });
      alert(`Order status updated to ${newStatus}`);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch (err) {
      console.error("Failed updating order status:", err);
      alert("Error updating order status.");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to delete this order record? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
        setSelectedOrder(null);
        alert("Order record deleted successfully.");
      } catch (err) {
        console.error("Failed to delete order:", err);
      }
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2C2C2C]">Order Management</h1>
        <p className="text-sm text-gray-500">View customer purchases, shipping details, and manage delivery states.</p>
      </div>

      {/* Stats Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Pending</p>
          <h3 className="text-2xl font-bold text-blue-600 mt-1">{orders.filter(o => o.status === 'Pending').length}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Shipped</p>
          <h3 className="text-2xl font-bold text-indigo-600 mt-1">{orders.filter(o => o.status === 'Shipped').length}</h3>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
          <p className="text-xs font-bold text-green-400 uppercase tracking-widest">Delivered</p>
          <h3 className="text-2xl font-bold text-green-600 mt-1">{orders.filter(o => o.status === 'Delivered').length}</h3>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Orders Table Panel */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          {/* Controls Bar */}
          <div className="p-4 md:p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-gray-50/50">
            <div className="relative flex-1 max-w-md">
              <input 
                type="text" 
                placeholder="Search by name, ID or email..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2C2C2C] transition-colors"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status:</span>
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2C2C2C]"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Table list */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading order records...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center justify-center text-gray-400 gap-2">
                <ShoppingBag size={48} strokeWidth={1} />
                <p className="text-sm font-medium">No matching orders found</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${selectedOrder?.id === order.id ? 'bg-[#FAF9F6]' : ''}`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        #ORD-{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-[#2C2C2C]">{order.customerName}</p>
                        <p className="text-xs text-gray-400">{order.customerEmail}</p>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                        {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-700' :
                          order.status === 'Pending' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-gray-900">
                        ₹{(order.pricing?.total || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 bg-gray-50 text-gray-600 hover:text-black rounded-lg border border-gray-200 transition-colors"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-1.5 bg-red-50 text-red-500 hover:text-red-700 rounded-lg border border-red-100 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Order Details Panel Sidecar */}
        {selectedOrder && (
          <div className="w-full lg:w-96 bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6 self-start animate-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900">Order details</h3>
                <p className="text-xs text-blue-600 font-bold mt-0.5">#ORD-{selectedOrder.id.slice(0, 10).toUpperCase()}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500"
              >
                <X size={16} />
              </button>
            </div>

            {/* Status updates */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Update Order Status</label>
              <select 
                value={selectedOrder.status}
                onChange={e => handleUpdateStatus(selectedOrder.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2C2C2C]"
              >
                <option value="Pending">Pending (Processing)</option>
                <option value="Shipped">Shipped (In Transit)</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Items inside this order */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-1">Items List</label>
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-start text-sm">
                    <div className="max-w-[70%]">
                      <p className="font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.variant} • Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary details */}
            <div className="space-y-2.5 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-bold">{selectedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status</span>
                <span className={`font-bold ${selectedOrder.paymentStatus === 'Paid' ? 'text-green-600' : 'text-[#C48B22]'}`}>{selectedOrder.paymentStatus}</span>
              </div>
              {selectedOrder.razorpayPaymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Razorpay Ref</span>
                  <span className="font-mono font-bold text-blue-600">{selectedOrder.razorpayPaymentId}</span>
                </div>
              )}
              <div className="h-[1px] bg-gray-200 my-1"></div>
              <div className="flex justify-between text-sm">
                <span className="font-bold text-gray-700">Total Price</span>
                <span className="font-black text-gray-900">₹{(selectedOrder.pricing?.total || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Customer Shipping Address details */}
            <div className="space-y-3 text-xs text-gray-600">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-1">Shipping Info</label>
              <div className="flex gap-2">
                <Calendar size={14} className="text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Contact Name & Phone</p>
                  <p>{selectedOrder.customerName} ({selectedOrder.customerPhone || 'No Phone'})</p>
                </div>
              </div>
              <div className="flex gap-2">
                <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Shipping Destination</p>
                  <p className="leading-relaxed">
                    {selectedOrder.shippingAddress.address}
                    {selectedOrder.shippingAddress.apartment ? `, ${selectedOrder.shippingAddress.apartment}` : ''}
                    <br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pinCode}
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

// Small helper for closing panel
const X = ({ size, className, ...props }: { size: number; className?: string; [key: string]: any }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
