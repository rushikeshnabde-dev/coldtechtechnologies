import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, TrendingUp, TrendingDown, Clock, Users, DollarSign,
  Wrench, FileText, Calendar, Bell, CheckCircle, XCircle, AlertCircle,
  ArrowUp, ArrowDown, Zap, Target, Activity, BarChart3, PieChart,
  UserCheck, CreditCard, Package, Settings, Filter, RefreshCw,
  ChevronRight, Eye, Phone, Mail, MapPin, Star, Briefcase
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// Smart KPI Card with trend analysis and alerts
function SmartKPICard({ 
  title, 
  value, 
  previousValue, 
  target, 
  icon: Icon, 
  color = 'blue',
  format = 'number',
  alert = null,
  trend = null,
  onClick 
}) {
  const change = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;
  const isPositive = change >= 0;
  const targetProgress = target ? (value / target) * 100 : null;
  
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 text-blue-600 bg-blue-50',
    green: 'from-green-500 to-green-600 text-green-600 bg-green-50',
    orange: 'from-orange-500 to-orange-600 text-orange-600 bg-orange-50',
    red: 'from-red-500 to-red-600 text-red-600 bg-red-50',
    purple: 'from-purple-500 to-purple-600 text-purple-600 bg-purple-50',
    indigo: 'from-indigo-500 to-indigo-600 text-indigo-600 bg-indigo-50'
  };

  const formatValue = (val) => {
    if (format === 'currency') return `₹${val.toLocaleString()}`;
    if (format === 'percentage') return `${val}%`;
    return val.toLocaleString();
  };

  return (
    <motion.div
      whileHover={{ y: -2, shadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      onClick={onClick}
      className={`relative bg-white rounded-xl p-6 border border-gray-100 cursor-pointer transition-all duration-300 ${onClick ? 'hover:border-gray-200' : ''}`}
    >
      {alert && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <div className="text-right">
          {change !== 0 && (
            <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {Math.abs(change).toFixed(1)}%
            </div>
          )}
          {trend && (
            <div className="text-xs text-gray-500 mt-1">{trend}</div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
        
        {target && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Target: {formatValue(target)}</span>
              <span>{targetProgress?.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full bg-gradient-to-r ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} transition-all duration-500`}
                style={{ width: `${Math.min(targetProgress || 0, 100)}%` }}
              />
            </div>
          </div>
        )}
        
        {alert && (
          <div className="text-xs text-red-600 font-medium">{alert}</div>
        )}
      </div>
    </motion.div>
  );
}

// Alert Panel for critical items
function AlertPanel({ alerts, onDismiss }) {
  if (!alerts.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h3 className="font-semibold text-red-900">Urgent Attention Required</h3>
        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
          {alerts.length} items
        </span>
      </div>
      
      <div className="space-y-2">
        {alerts.slice(0, 3).map((alert, idx) => (
          <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-100">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${alert.severity === 'critical' ? 'bg-red-500' : 'bg-orange-500'}`} />
              <div>
                <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                <p className="text-xs text-gray-600">{alert.description}</p>
              </div>
            </div>
            <button
              onClick={() => onDismiss(alert.id)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      {alerts.length > 3 && (
        <button className="text-sm text-red-600 hover:text-red-700 font-medium mt-2">
          View all {alerts.length} alerts →
        </button>
      )}
    </motion.div>
  );
}

// Intelligent Activity Feed
function IntelligentActivityFeed({ activities }) {
  const getActivityIcon = (type) => {
    const icons = {
      payment: CreditCard,
      invoice: FileText,
      ticket: Wrench,
      customer: UserCheck,
      amc: Calendar,
      system: Settings
    };
    return icons[type] || Activity;
  };

  const getActivityColor = (type, status) => {
    if (status === 'urgent') return 'text-red-500 bg-red-50';
    if (status === 'success') return 'text-green-500 bg-green-50';
    if (status === 'warning') return 'text-orange-500 bg-orange-50';
    return 'text-blue-500 bg-blue-50';
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Live Activity</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, idx) => {
          const Icon = getActivityIcon(activity.type);
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActivityColor(activity.type, activity.status)}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>{activity.time}</span>
                  {activity.user && <span>by {activity.user}</span>}
                  {activity.priority && (
                    <span className={`px-2 py-1 rounded-full ${
                      activity.priority === 'high' ? 'bg-red-100 text-red-700' :
                      activity.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {activity.priority}
                    </span>
                  )}
                </div>
              </div>
              {activity.actionable && (
                <button className="text-indigo-600 hover:text-indigo-700 text-xs font-medium">
                  Action
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Service Ticket Priority Panel
function ServiceTicketPanel({ tickets }) {
  const priorityColors = {
    Critical: 'bg-red-100 text-red-800 border-red-200',
    Urgent: 'bg-orange-100 text-orange-800 border-orange-200',
    High: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Normal: 'bg-blue-100 text-blue-800 border-blue-200',
    Low: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const statusColors = {
    received: 'bg-blue-100 text-blue-800',
    diagnosing: 'bg-yellow-100 text-yellow-800',
    repairing: 'bg-orange-100 text-orange-800',
    completed: 'bg-green-100 text-green-800'
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Service Tickets</h3>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-1">
            <option>All Priorities</option>
            <option>Critical Only</option>
            <option>Overdue</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-3">
        {tickets.slice(0, 5).map((ticket, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[ticket.priority]}`}>
                  {ticket.priority}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full mt-1 ${statusColors[ticket.status]}`}>
                  {ticket.status}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">#{ticket.ticketId}</p>
                <p className="text-sm text-gray-600">{ticket.issueType} - {ticket.deviceType}</p>
                <p className="text-xs text-gray-500 mt-1">{ticket.customer}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{ticket.timeElapsed}</p>
              <p className="text-xs text-gray-500">
                {ticket.assignedTo ? `Assigned to ${ticket.assignedTo}` : 'Unassigned'}
              </p>
              {ticket.isOverdue && (
                <span className="text-xs text-red-600 font-medium">Overdue</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium py-2 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition">
        View All Tickets
      </button>
    </div>
  );
}

// Revenue Intelligence Panel
function RevenueIntelligencePanel({ data }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Intelligence</h3>
        <div className="flex items-center gap-2">
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-1">
            <option>This Month</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
        </div>
      </div>
      
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                fontSize: '12px'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#6366f1" 
              fill="url(#colorRevenue)" 
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Projected</p>
          <p className="text-lg font-bold text-green-700">₹{data.projected.toLocaleString()}</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Recurring</p>
          <p className="text-lg font-bold text-blue-700">₹{data.recurring.toLocaleString()}</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">One-time</p>
          <p className="text-lg font-bold text-purple-700">₹{data.oneTime.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

// Main Intelligent Dashboard Component
export function IntelligentDashboard() {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Simulated intelligent data - in production, this would come from APIs
  const [dashboardData, setDashboardData] = useState({
    kpis: {
      revenue: { current: 125000, previous: 98000, target: 150000 },
      tickets: { current: 23, previous: 31, target: 20 },
      customers: { current: 156, previous: 142, target: 200 },
      amc: { current: 12, previous: 15, target: 10 }
    },
    alerts: [
      {
        id: 1,
        severity: 'critical',
        title: '3 Critical Tickets Overdue',
        description: 'Tickets #TK-2024-001, #TK-2024-003, #TK-2024-007 are past SLA'
      },
      {
        id: 2,
        severity: 'warning',
        title: '5 AMC Contracts Expiring',
        description: 'Renewal required within 30 days'
      },
      {
        id: 3,
        severity: 'warning',
        title: '₹45,000 in Overdue Invoices',
        description: '8 invoices past due date'
      }
    ],
    activities: [
      {
        type: 'payment',
        status: 'success',
        title: 'Payment Received',
        description: '₹25,000 from Tech Solutions Pvt Ltd',
        time: '2 mins ago',
        user: 'System',
        actionable: false
      },
      {
        type: 'ticket',
        status: 'urgent',
        title: 'Critical Ticket Created',
        description: 'Server down at Global Infotech',
        time: '5 mins ago',
        user: 'Customer Portal',
        priority: 'high',
        actionable: true
      },
      {
        type: 'amc',
        status: 'warning',
        title: 'AMC Expiring Soon',
        description: 'Future Enterprises contract expires in 15 days',
        time: '1 hour ago',
        user: 'System',
        actionable: true
      }
    ],
    tickets: [
      {
        ticketId: 'TK-2024-001',
        priority: 'Critical',
        status: 'diagnosing',
        issueType: 'Hardware',
        deviceType: 'Server',
        customer: 'Global Infotech',
        assignedTo: 'Rahul Sharma',
        timeElapsed: '2h 15m',
        isOverdue: true
      },
      {
        ticketId: 'TK-2024-002',
        priority: 'High',
        status: 'repairing',
        issueType: 'Software',
        deviceType: 'Laptop',
        customer: 'Tech Solutions',
        assignedTo: 'Priya Patel',
        timeElapsed: '45m',
        isOverdue: false
      }
    ],
    revenueData: {
      monthlyRevenue: [
        { month: 'Jan', revenue: 85000 },
        { month: 'Feb', revenue: 92000 },
        { month: 'Mar', revenue: 78000 },
        { month: 'Apr', revenue: 105000 },
        { month: 'May', revenue: 125000 },
        { month: 'Jun', revenue: 118000 }
      ],
      projected: 145000,
      recurring: 85000,
      oneTime: 60000
    }
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1500);
    setAlerts(dashboardData.alerts);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Intelligence</h1>
          <p className="text-gray-600 mt-1">Real-time insights and operational intelligence</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Alert Panel */}
      <AlertPanel alerts={alerts} onDismiss={dismissAlert} />

      {/* Smart KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SmartKPICard
          title="Monthly Revenue"
          value={dashboardData.kpis.revenue.current}
          previousValue={dashboardData.kpis.revenue.previous}
          target={dashboardData.kpis.revenue.target}
          icon={DollarSign}
          color="green"
          format="currency"
          trend="↗ Growing steadily"
        />
        <SmartKPICard
          title="Active Tickets"
          value={dashboardData.kpis.tickets.current}
          previousValue={dashboardData.kpis.tickets.previous}
          target={dashboardData.kpis.tickets.target}
          icon={Wrench}
          color="orange"
          alert="3 overdue tickets"
          trend="↘ Improving"
        />
        <SmartKPICard
          title="Total Customers"
          value={dashboardData.kpis.customers.current}
          previousValue={dashboardData.kpis.customers.previous}
          target={dashboardData.kpis.customers.target}
          icon={Users}
          color="blue"
          trend="↗ Growing"
        />
        <SmartKPICard
          title="AMC Renewals Due"
          value={dashboardData.kpis.amc.current}
          previousValue={dashboardData.kpis.amc.previous}
          target={dashboardData.kpis.amc.target}
          icon={Calendar}
          color="purple"
          alert="5 expiring soon"
          trend="→ Stable"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueIntelligencePanel data={dashboardData.revenueData} />
        </div>
        <ServiceTicketPanel tickets={dashboardData.tickets} />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IntelligentActivityFeed activities={dashboardData.activities} />
        
        {/* Quick Actions Panel */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: FileText, label: 'Create Invoice', color: 'blue' },
              { icon: Wrench, label: 'New Ticket', color: 'orange' },
              { icon: UserCheck, label: 'Add Customer', color: 'green' },
              { icon: Calendar, label: 'Schedule AMC', color: 'purple' }
            ].map((action, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg border-2 border-dashed border-${action.color}-200 hover:border-${action.color}-300 hover:bg-${action.color}-50 transition group`}
              >
                <action.icon className={`w-6 h-6 text-${action.color}-600 mx-auto mb-2`} />
                <p className={`text-sm font-medium text-${action.color}-700`}>{action.label}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}