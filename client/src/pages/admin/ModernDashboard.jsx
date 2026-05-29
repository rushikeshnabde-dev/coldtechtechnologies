import { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, ShoppingCart, Users, DollarSign, 
  TrendingUpIcon, FileText, UserPlus, CreditCard, Receipt,
  Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { DashboardSkeleton } from '../../components/SkeletonLoader';
import { motion } from 'framer-motion';

// Dummy data
const revenueData = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 19000 },
  { month: 'Mar', revenue: 15000 },
  { month: 'Apr', revenue: 25000 },
  { month: 'May', revenue: 22000 },
  { month: 'Jun', revenue: 29000 },
];

const recentInvoices = [
  { id: 'INV-0018', customer: 'Tech Solutions Pvt Ltd', amount: 29000, status: 'paid', date: '2024-01-15' },
  { id: 'INV-0017', customer: 'Global Infotech', amount: 18500, status: 'pending', date: '2024-01-14' },
  { id: 'INV-0016', customer: 'Future Enterprises', amount: 12750, status: 'paid', date: '2024-01-13' },
  { id: 'INV-0015', customer: 'Digital Dreams', amount: 9000, status: 'draft', date: '2024-01-12' },
];

const recentActivity = [
  { type: 'payment', text: 'Payment received from Tech Solutions', amount: 29000, time: '2 mins ago', icon: CheckCircle, color: 'text-green-500' },
  { type: 'invoice', text: 'New invoice created for Global Infotech', time: '1 hour ago', icon: FileText, color: 'text-blue-500' },
  { type: 'customer', text: 'New customer registered - Bright Future Ltd', time: '3 hours ago', icon: UserPlus, color: 'text-indigo-500' },
  { type: 'expense', text: 'Expense added - Office Supplies', amount: 2450, time: '5 hours ago', icon: Receipt, color: 'text-orange-500' },
];

const topProducts = [
  { name: 'Dell Laptop Inspiron 15', sales: 24, revenue: 24000, progress: 85 },
  { name: 'HP LaserJet Pro MFP', sales: 18, revenue: 18000, progress: 65 },
  { name: 'Canon Pixma G3070', sales: 12, revenue: 12000, progress: 45 },
  { name: 'Zebronics Keyboard', sales: 10, revenue: 5000, progress: 35 },
];

// KPI Card Component
function KPICard({ title, value, change, icon: Icon, gradient, trend }) {
  const isPositive = change >= 0;
  
  return (
    <div className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 mt-2">vs last month</p>
      </div>
    </div>
  );
}

// Quick Action Card Component
function QuickActionCard({ icon: Icon, title, description, gradient, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-left w-full"
    >
      <div className={`w-10 h-10 rounded-lg ${gradient} flex items-center justify-center mb-4`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-500">{description}</p>
    </button>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  const styles = {
    paid: 'bg-green-50 text-green-700 border-green-200',
    pending: 'bg-orange-50 text-orange-700 border-orange-200',
    draft: 'bg-gray-50 text-gray-700 border-gray-200',
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Activity Item Component
function ActivityItem({ activity }) {
  const Icon = activity.icon;
  
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className={`w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-4 h-4 ${activity.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.text}</p>
        <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
      </div>
      {activity.amount && (
        <span className="text-sm font-semibold text-gray-900">₹{activity.amount.toLocaleString()}</span>
      )}
    </div>
  );
}

// Product Progress Bar Component
function ProductProgressBar({ product }) {
  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900">{product.name}</span>
        <span className="text-sm font-semibold text-gray-900">{product.sales}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${product.progress}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 w-16 text-right">₹{(product.revenue / 1000).toFixed(0)}k</span>
      </div>
    </div>
  );
}

// Custom Tooltip for Chart
function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-100">
        <p className="text-xs text-gray-600">{payload[0].payload.month}</p>
        <p className="text-sm font-semibold text-gray-900">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
}

export function ModernDashboard() {
  const [loading, setLoading] = useState(true);
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8"
    >
      <div className="max-w-[1600px] mx-auto">
        
        {/* Greeting Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {greeting}, Rushikesh 👋
          </h1>
          <p className="text-gray-600">Here's what's happening with your business today.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Revenue"
            value="₹29,000"
            change={18.2}
            icon={DollarSign}
            gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
          />
          <KPICard
            title="Total Orders"
            value="24"
            change={12.4}
            icon={ShoppingCart}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <KPICard
            title="Total Customers"
            value="156"
            change={8.3}
            icon={Users}
            gradient="bg-gradient-to-br from-green-500 to-green-600"
          />
          <KPICard
            title="Net Profit"
            value="₹12,540"
            change={15.8}
            icon={TrendingUpIcon}
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
                <p className="text-sm text-gray-500 mt-1">Monthly revenue trend</p>
              </div>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <QuickActionCard
                icon={FileText}
                title="Create Invoice"
                description="Generate new invoice"
                gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
              />
              <QuickActionCard
                icon={UserPlus}
                title="Add Customer"
                description="Register new customer"
                gradient="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <QuickActionCard
                icon={CreditCard}
                title="Record Payment"
                description="Record incoming payment"
                gradient="bg-gradient-to-br from-green-500 to-green-600"
              />
              <QuickActionCard
                icon={Receipt}
                title="Add Expense"
                description="Record new expense"
                gradient="bg-gradient-to-br from-orange-500 to-orange-600"
              />
            </div>
          </div>
        </div>

        {/* Lower Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Invoices */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{invoice.id}</p>
                    <p className="text-xs text-gray-500 truncate">{invoice.customer}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-sm font-semibold text-gray-900">₹{invoice.amount.toLocaleString()}</span>
                    <StatusBadge status={invoice.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View All
              </button>
            </div>
            <div>
              {recentActivity.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View All
              </button>
            </div>
            <div>
              {topProducts.map((product, index) => (
                <ProductProgressBar key={index} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
