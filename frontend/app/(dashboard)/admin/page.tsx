'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Users, Server, DollarSign, TrendingDown, Activity, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { apiCall, vpsSaleService, vpsPurchaseService } from '@/services/api';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({
    activeCustomers: 0,
    activeSales: 0,
    monthlyRevenue: 0,
    monthlyCost: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [customersRes, salesRes, purchasesRes] = await Promise.all([
          apiCall('/customers').catch(() => ({ data: [] })),
          vpsSaleService.getSales().catch(() => ({ data: [] })),
          vpsPurchaseService.getPurchases().catch(() => ({ data: [] }))
        ]);

        const customers = customersRes?.data || [];
        const sales = salesRes?.data || [];
        const purchases = purchasesRes?.data || [];

        const activeCustomers = customers.filter((c: any) => c.status === 'active').length;
        const activeSales = sales.filter((s: any) => s.status === 'active');
        const activePurchases = purchases.filter((p: any) => p.status === 'active');

        const monthlyRevenue = activeSales.reduce((sum: number, s: any) => sum + (s.price || 0), 0);
        const monthlyCost = activePurchases.reduce((sum: number, p: any) => sum + (p.cost || 0), 0);

        setStats({
          activeCustomers,
          activeSales: activeSales.length,
          monthlyRevenue,
          monthlyCost
        });
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setStatsLoading(false);
      }
    }

    if (user) {
      loadStats();
    }
  }, [user]);

  if (loading) {
    return <div>Loading KeplerX Core...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const statCards = [
    { label: 'Active Customers', value: statsLoading ? '...' : stats.activeCustomers.toLocaleString(), icon: Users, color: '#00E5FF' },
    { label: 'Active VPS Sales', value: statsLoading ? '...' : stats.activeSales.toLocaleString(), icon: Server, color: '#6B46C1' },
    { label: 'Monthly Revenue', value: statsLoading ? '...' : `$${stats.monthlyRevenue.toFixed(2)}`, icon: DollarSign, color: '#10b981' },
    { label: 'Monthly Vendor Cost', value: statsLoading ? '...' : `$${stats.monthlyCost.toFixed(2)}`, icon: TrendingDown, color: '#ef4444' },
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '0 8px', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>KeplerX Command Center</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back, Commander {user.name || 'Admin'}. Here is your CRM overview.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        {statCards.map((stat, i) => (
          <div key={i} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
              <p style={{ fontSize: '1.8rem', fontWeight: '700' }}>{stat.value}</p>
            </div>
            <div style={{ background: `rgba(255, 255, 255, 0.05)`, padding: '16px', borderRadius: '50%' }}>
              <stat.icon size={28} color={stat.color} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid-3">
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="var(--secondary)" /> Recent Activity
          </h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Entity</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Deal Closed</td>
                <td>Stark Industries</td>
                <td>2 hours ago</td>
                <td><span className="badge badge-success">Won</span></td>
              </tr>
              <tr>
                <td>New Customer Registered</td>
                <td>Elon Musk</td>
                <td>5 hours ago</td>
                <td><span className="badge badge-success">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '24px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => router.push('/admin/customers?add=true')}>
              <Plus size={16} /> Add Customer
            </button>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => router.push('/admin/vps/sales?add=true')}>
              <Plus size={16} /> New VPS Sale
            </button>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => router.push('/admin/vps/purchases?add=true')}>
              <Plus size={16} /> New Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
