import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, Users, FileText,
  Wrench, Package, Clock, BarChart3, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, Tooltip as RechartTooltip,
} from 'recharts';

const spark = (base, variance, len = 12) =>
  Array.from({ length: len }, (_, i) => ({
    v: Math.max(0, base + Math.sin(i * 0.8) * variance + (Math.random() - 0.5) * variance * 0.6),
  }));

const KPI_METRICS = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: '₹24,18,500',
    rawValue: 2418500,
    change: 12.4,
    period: 'vs last month',
    icon: DollarSign,
    color: '#3B82F6',
    glow: 'rgba(59,130,246,0.25)',
    sparkData: spark(6000, 2000),
    sparkColor: '#3B82F6',
  },
  {
    id: 'profit',
    label: 'Monthly Profit',
    value: '₹6,84,200',
    rawValue: 684200,
    change: 8.7,
    period: 'vs last month',
    icon: TrendingUp,
    color: '#10B981',
    glow: 'rgba(16,185,129,0.25)',
    sparkData: spark(4000, 1500),
    sparkColor: '#10B981',
  },
  {
    id: 'pending',
    label: 'Pending Payments',
    value: '₹3,42,000',
    rawValue: 342000,
    change: -4.2,
    period: 'vs last month',
    icon: Clock,
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.25)',
    sparkData: spark(3000, 1200),
    sparkColor: '#F59E0B',
  },
  {
    id: 'customers',
    label: 'Active Customers',
    value: '1,284',
    rawValue: 1284,
    change: 18.3,
    period: 'vs last month',
    icon: Users,
    color: '#8B5CF6',
    glow: 'rgba(139,92,246,0.25)',
    sparkData: spark(800, 300),
    sparkColor: '#8B5CF6',
  },
  {
    id: 'tickets',
    label: 'Open Tickets',
    value: '47',
    rawValue: 47,
    change: -12.0,
    period: 'vs last month',
    icon: FileText,
    color: '#EF4444',
    glow: 'rgba(239,68,68,0.25)',
    sparkData: spark(40, 20),
    sparkColor: '#EF4444',
  },
  {
    id: 'repairs',
    label: 'Devices in Repair',
    value: '23',
    rawValue: 23,
    change: 5.6,
    period: 'this week',
    icon: Wrench,
    color: '#06B6D4',
    glow: 'rgba(6,182,212,0.25)',
    sparkData: spark(20, 10),
    sparkColor: '#06B6D4',
  },
  {
    id: 'inventory',
    label: 'Inventory Value',
    value: '₹12,94,300',
    rawValue: 1294300,
    change: 3.1,
    period: 'vs last week',
    icon: Package,
    color: '#F97316',
    glow: 'rgba(249,115,22,0.25)',
    sparkData: spark(10000, 2000),
    sparkColor: '#F97316',
  },
  {
    id: 'productivity',
    label: 'Staff Productivity',
    value: '87.4%',
    rawValue: 87.4,
    change: 2.8,
    period: 'vs last week',
    icon: BarChart3,
    color: '#EC4899',
    glow: 'rgba(236,72,153,0.25)',
    sparkData: spark(80, 15),
    sparkColor: '#EC4899',
  },
];

function SparkCard({ metric, index }) {
  const [hovered, setHovered] = useState(false);
  const isPositive = metric.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(31,41,55,0.85)' : 'rgba(31,41,55,0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: hovered ? `1px solid ${metric.color}40` : '1px solid rgba(255,255,255,0.07)',
        borderRadius: '1rem',
        padding: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'all 0.25s ease',
        boxShadow: hovered ? `0 0 0 1px ${metric.color}20, 0 8px 32px ${metric.glow}` : '0 1px 8px rgba(0,0,0,0.3)',
      }}
    >
      {/* Background glow orb */}
      <div style={{
        position: 'absolute', right: -20, bottom: -20,
        width: 100, height: 100, borderRadius: '50%',
        background: metric.color,
        opacity: hovered ? 0.06 : 0.03,
        filter: 'blur(24px)',
        transition: 'opacity 0.3s',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
        {/* Icon */}
        <div style={{
          width: 38, height: 38, borderRadius: '0.625rem',
          background: `${metric.color}18`,
          border: `1px solid ${metric.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: hovered ? `0 0 12px ${metric.glow}` : undefined,
          transition: 'box-shadow 0.25s',
        }}>
          <metric.icon size={17} style={{ color: metric.color }} />
        </div>

        {/* Trend badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.25rem',
          padding: '0.25rem 0.5rem', borderRadius: '0.375rem',
          background: isPositive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
          border: `1px solid ${isPositive ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
        }}>
          {isPositive
            ? <ArrowUpRight size={12} style={{ color: '#10B981' }} />
            : <ArrowDownRight size={12} style={{ color: '#EF4444' }} />
          }
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem', fontWeight: 600,
            color: isPositive ? '#10B981' : '#EF4444',
          }}>
            {isPositive ? '+' : ''}{metric.change}%
          </span>
        </div>
      </div>

      {/* Value */}
      <div style={{ marginBottom: '0.25rem' }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.375rem', fontWeight: 700,
          color: '#F9FAFB', margin: 0, letterSpacing: '-0.02em',
          filter: hovered ? `drop-shadow(0 0 8px ${metric.color}60)` : undefined,
          transition: 'filter 0.25s',
        }}>
          {metric.value}
        </p>
      </div>

      <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0 0 0.75rem', fontWeight: 500 }}>
        {metric.label}
      </p>

      {/* Sparkline */}
      <div style={{ height: 44, marginBottom: '0.25rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={metric.sparkData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`spark-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metric.sparkColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={metric.sparkColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={metric.sparkColor}
              strokeWidth={1.5}
              fill={`url(#spark-${metric.id})`}
              dot={false}
              activeDot={{ r: 3, fill: metric.sparkColor, strokeWidth: 0 }}
            />
            <RechartTooltip
              content={() => null}
              cursor={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Period */}
      <p style={{
        fontSize: '0.6875rem', color: '#4B5563', margin: 0,
        fontFamily: 'var(--font-mono)',
      }}>
        {metric.period}
      </p>
    </motion.div>
  );
}

export default function KPISection({ metrics = KPI_METRICS }) {
  return (
    <section>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}>
        {metrics.map((metric, i) => (
          <SparkCard key={metric.id} metric={metric} index={i} />
        ))}
      </div>
    </section>
  );
}

export { KPI_METRICS };
