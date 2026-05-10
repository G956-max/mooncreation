import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Activity,
  ArrowRight,
  Plus,
  Package,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
  { name: 'Aug', revenue: 4000 },
  { name: 'Sep', revenue: 3000 },
  { name: 'Oct', revenue: 2000 },
  { name: 'Nov', revenue: 2780 },
  { name: 'Dec', revenue: 1890 },
];

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  isUp: boolean;
  icon: React.ElementType;
  color: string;
}

const StatCard = ({ title, value, trend, isUp, icon: Icon, color }: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={20} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
        {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {trend}
      </div>
    </div>
    <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
  </div>
);

export default function AdminDashboard() {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

  useEffect(() => {
    // Mock recent orders for now as we don't have an orders collection yet
    setRecentOrders([
      { id: '#ORD-7281', customer: 'Sarah Johnson', date: 'Oct 24, 2023', status: 'Delivered', amount: '$124.00' },
      { id: '#ORD-7282', customer: 'Michael Chen', date: 'Oct 24, 2023', status: 'Processing', amount: '$56.50' },
      { id: '#ORD-7283', customer: 'Emma Wilson', date: 'Oct 23, 2023', status: 'Shipped', amount: '$89.00' },
      { id: '#ORD-7284', customer: 'James Brown', date: 'Oct 23, 2023', status: 'Delivered', amount: '$210.00' },
      { id: '#ORD-7285', customer: 'Olivia Davis', date: 'Oct 22, 2023', status: 'Cancelled', amount: '$45.00' },
    ]);

    // Fetch low stock products
    const q = query(collection(db, 'products'), orderBy('availableQuantity', 'asc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLowStockProducts(products.filter((p: any) => (p.availableQuantity || 0) < 10));
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Overview</h1>
          <p className="text-sm text-gray-500">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          <button className="px-3 py-1.5 text-xs font-bold text-[#2C2C2C] bg-gray-100 rounded-md">Today</button>
          <button className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-md transition-colors">7 Days</button>
          <button className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-md transition-colors">30 Days</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="$45,231.89" 
          trend="+20.1%" 
          isUp={true} 
          icon={DollarSign} 
          color="bg-[#2C2C2C]"
        />
        <StatCard 
          title="Orders" 
          value="356" 
          trend="+12.5%" 
          isUp={true} 
          icon={ShoppingBag} 
          color="bg-gray-600"
        />
        <StatCard 
          title="Customers" 
          value="2,420" 
          trend="+18.2%" 
          isUp={true} 
          icon={Users} 
          color="bg-gray-500"
        />
        <StatCard 
          title="Conversion Rate" 
          value="3.24%" 
          trend="-2.4%" 
          isUp={false} 
          icon={Activity} 
          color="bg-gray-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-[#2C2C2C]">Revenue Overview</h3>
            <select className="text-xs font-bold text-gray-500 bg-gray-50 border-none rounded-md focus:ring-0">
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94A3B8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94A3B8' }}
                />
                <Tooltip 
                  cursor={{ fill: '#FAF9F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 7 ? '#2C2C2C' : '#E5E7EB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Inventory */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#2C2C2C] mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                to="/admin/products/add"
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 text-[#2C2C2C] hover:bg-gray-100 transition-colors group border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <Plus size={20} />
                  <span className="text-sm font-bold">Upload New Product</span>
                </div>
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
              <button className="flex items-center justify-between p-4 rounded-lg bg-gray-50 text-[#2C2C2C] hover:bg-gray-100 transition-colors w-full group border border-gray-100">
                <div className="flex items-center gap-3">
                  <UserPlus size={20} />
                  <span className="text-sm font-bold">Add Customer</span>
                </div>
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#2C2C2C]">Inventory Alerts</h3>
              <Link to="/admin/products" className="text-xs font-bold text-gray-500 hover:text-[#2C2C2C] hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 overflow-hidden border border-gray-100">
                        <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#2C2C2C] line-clamp-1">{product.name}</p>
                        <p className="text-[10px] font-bold text-red-500 uppercase">{product.availableQuantity || 0} in stock</p>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-red-50 rounded text-[10px] font-bold text-red-600">Low Stock</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <AlertCircle className="mx-auto text-gray-300 mb-2" size={24} />
                  <p className="text-xs text-gray-500">No inventory alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-[#2C2C2C]">Recent Orders</h3>
          <button className="text-xs font-bold text-gray-500 hover:text-[#2C2C2C] transition-colors">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-[#2C2C2C]">{order.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      order.status === 'Delivered' ? 'bg-green-50 text-green-600' :
                      order.status === 'Processing' ? 'bg-gray-100 text-gray-600' :
                      order.status === 'Shipped' ? 'bg-gray-50 text-gray-500' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.amount}</td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-[#2C2C2C] transition-colors">
                      <ArrowRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
