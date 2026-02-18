import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import { statsApi } from '../api/endpoints';
import { DashboardStats } from '../types';

const tooltipStyle = {
  backgroundColor: '#0a0a0a',
  border: '1px solid #262626',
  borderRadius: 0,
  color: '#fff',
  fontSize: 12
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsApi.dashboard().then((d) => {
      setStats(d);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        eyebrow="Overview"
        subtitle="Real-time activity, sales and store metrics."
      />
      <div className="space-y-8 p-10">
        {loading || !stats ? (
          <div className="text-ink-400">Loading metrics...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatsCard
                num="01"
                title="Total Revenue"
                value={`$${Number(stats.totalRevenue).toLocaleString()}`}
                subtitle="All time"
                accent
              />
              <StatsCard
                num="02"
                title="Orders"
                value={stats.totalOrders}
                subtitle={`${stats.pendingOrders} pending`}
              />
              <StatsCard num="03" title="Guitars" value={stats.totalProducts} subtitle="Active catalog" />
              <StatsCard num="04" title="Customers" value={stats.totalUsers} subtitle="Registered" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="border border-ink-700 bg-ink-900 p-6 lg:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-blood-500">
                      Revenue
                    </div>
                    <h3 className="mt-1 font-display text-2xl text-white">
                      LAST 6 MONTHS
                    </h3>
                  </div>
                  <div className="font-mono text-[10px] text-ink-400">USD</div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.salesByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke="#1a1a1a" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#737373' }} stroke="#262626" />
                    <YAxis tick={{ fontSize: 11, fill: '#737373' }} stroke="#262626" />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v: number) => `$${Number(v).toLocaleString()}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#e30613"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#e30613', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#fff', stroke: '#e30613', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="border border-ink-700 bg-ink-900 p-6">
                <div className="mb-6">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-blood-500">
                    Volume
                  </div>
                  <h3 className="mt-1 font-display text-2xl text-white">ORDERS / MO</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.salesByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke="#1a1a1a" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#737373' }} stroke="#262626" />
                    <YAxis tick={{ fontSize: 11, fill: '#737373' }} stroke="#262626" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 11, color: '#737373' }} />
                    <Bar dataKey="orders" fill="#e30613" radius={0} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="hatched h-16 border-y border-ink-700" />
          </>
        )}
      </div>
    </div>
  );
}
