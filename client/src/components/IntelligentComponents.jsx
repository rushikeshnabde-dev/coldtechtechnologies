import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, X, CheckCircle, AlertTriangle, Info, Clock, 
  TrendingUp, TrendingDown, Users, DollarSign, Wrench,
  Calendar, Phone, Mail, MapPin, Star, Eye, ChevronRight,
  Filter, Search, MoreVertical, Download, Share2
} from 'lucide-react';

// Intelligent Notification System
export function NotificationCenter({ isOpen, onClose, notifications = [] }) {
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.type === filter;
  });

  const getNotificationIcon = (type) => {
    const icons = {
      success: CheckCircle,
      warning: AlertTriangle,
      info: Info,
      urgent: AlertTriangle
    };
    return icons[type] || Info;
  };

  const getNotificationColor = (type) => {
    const colors = {
      success: 'text-green-600 bg-green-50 border-green-200',
      warning: 'text-orange-600 bg-orange-50 border-orange-200',
      info: 'text-blue-600 bg-blue-50 border-blue-200',
      urgent: 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[type] || colors.info;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-25 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                  <p className="text-sm text-gray-600">{unreadCount} unread</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex gap-2 mt-4">
                {['all', 'urgent', 'warning', 'info'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-3 py-1 text-xs rounded-full transition ${
                      filter === type 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Bell className="w-12 h-12 mb-4 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {filteredNotifications.map((notification, idx) => {
                    const Icon = getNotificationIcon(notification.type);
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} ${
                          !notification.read ? 'ring-2 ring-indigo-100' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="w-5 h-5 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs text-gray-500">{notification.time}</span>
                              {notification.actionable && (
                                <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                                  Take Action
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Customer Health Score Component
export function CustomerHealthScore({ customers = [] }) {
  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getHealthLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'At Risk';
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Customer Health</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {customers.slice(0, 5).map((customer, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {customer.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{customer.name}</p>
                <p className="text-sm text-gray-600">{customer.company}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span>Last order: {customer.lastOrder}</span>
                  <span>₹{customer.totalValue.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(customer.healthScore)}`}>
                <div className="w-2 h-2 rounded-full bg-current" />
                {getHealthLabel(customer.healthScore)}
              </div>
              <p className="text-xs text-gray-500 mt-1">{customer.healthScore}% score</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Technician Workload Panel
export function TechnicianWorkload({ technicians = [] }) {
  const getWorkloadColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getWorkloadStatus = (percentage) => {
    if (percentage >= 90) return 'Overloaded';
    if (percentage >= 70) return 'Busy';
    if (percentage >= 50) return 'Moderate';
    return 'Available';
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Technician Workload</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          Manage
        </button>
      </div>
      
      <div className="space-y-4">
        {technicians.map((tech, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {tech.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium text-gray-900">{tech.name}</p>
                <p className="text-sm text-gray-600">{tech.specialization}</p>
                <p className="text-xs text-gray-500">{tech.activeTickets} active tickets</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${getWorkloadColor(tech.workloadPercentage)}`}
                    style={{ width: `${tech.workloadPercentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{tech.workloadPercentage}%</span>
              </div>
              <p className="text-xs text-gray-500">{getWorkloadStatus(tech.workloadPercentage)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// AMC Expiry Tracker
export function AMCExpiryTracker({ contracts = [] }) {
  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryStatus = (days) => {
    if (days < 0) return { label: 'Expired', color: 'bg-red-100 text-red-800' };
    if (days <= 7) return { label: 'Critical', color: 'bg-red-100 text-red-800' };
    if (days <= 30) return { label: 'Warning', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Active', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">AMC Renewals</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {contracts.slice(0, 5).map((contract, idx) => {
          const daysLeft = getDaysUntilExpiry(contract.expiryDate);
          const status = getExpiryStatus(daysLeft);
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition"
            >
              <div>
                <p className="font-medium text-gray-900">{contract.customerName}</p>
                <p className="text-sm text-gray-600">{contract.serviceType}</p>
                <p className="text-xs text-gray-500">Value: ₹{contract.value.toLocaleString()}</p>
              </div>
              
              <div className="text-right">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                </p>
                {daysLeft <= 30 && daysLeft >= 0 && (
                  <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-1">
                    Send Reminder
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Performance Metrics Component
export function PerformanceMetrics({ metrics = {} }) {
  const metricCards = [
    {
      title: 'Avg Response Time',
      value: metrics.avgResponseTime || '2.5h',
      target: '2h',
      icon: Clock,
      color: 'blue'
    },
    {
      title: 'First Call Resolution',
      value: metrics.firstCallResolution || '78%',
      target: '85%',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Customer Satisfaction',
      value: metrics.customerSatisfaction || '4.6',
      target: '4.8',
      icon: Star,
      color: 'yellow'
    },
    {
      title: 'SLA Compliance',
      value: metrics.slaCompliance || '92%',
      target: '95%',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {metricCards.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 border border-gray-100 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className={`w-4 h-4 text-${metric.color}-600`} />
              <span className="text-sm font-medium text-gray-900">{metric.title}</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{metric.value}</p>
            <p className="text-xs text-gray-500">Target: {metric.target}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Smart Search Component
export function SmartSearch({ onSearch, suggestions = [] }) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search customers, tickets, invoices..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch(suggestion.query)}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 transition first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="flex items-center gap-2">
                <suggestion.icon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-900">{suggestion.text}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}