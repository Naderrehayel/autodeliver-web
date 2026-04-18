'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Package, Plus, TrendingUp, Clock, CheckCircle, Truck, ArrowRight } from 'lucide-react';
import { orders as ordersApi } from '@/lib/api';
import { useAuthStore } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:          { label: 'Pending',         color: 'badge-amber',  icon: Clock },
  offers_received:  { label: 'Offers Received', color: 'badge-blue',   icon: TrendingUp },
  confirmed:        { label: 'Confirmed',        color: 'badge-green',  icon: CheckCircle },
  in_transit:       { label: 'In Transit',       color: 'badge-amber',  icon: Truck },
  delivered:        { label: 'Delivered',        color: 'badge-green',  icon: CheckCircle },
  cancelled:        { label: 'Cancelled',        color: 'badge-red',    icon: Clock },
};

export default function DashboardPage() {
  const { user, fetchMe } = useAuthStore();

  useEffect(() => { fetchMe(); }, []);

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.list({ limit: '5' }),
  });

  const orders = ordersData?.data || [];

  const stats = {
    total:      orders.length,
    active:     orders.filter((o: any) => ['pending','offers_received','confirmed','in_transit'].includes(o.status)).length,
    delivered:  orders.filter((o: any) => o.status === 'delivered').length,
    offers:     orders.reduce((acc: number, o: any) => acc + (parseInt(o.offer_count) || 0), 0),
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-[#161614]">
            Good morning, {user?.first_name} 👋
          </h1>
          <p className="text-sm text-[#8A8880] mt-0.5">Here's what's happening with your deliveries.</p>
        </div>
        <Link href="/orders/new" className="btn btn-primary !py-2.5 !px-5 !rounded-xl text-sm">
          <Plus size={16} /> New order
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total orders',    value: stats.total,     icon: Package,      bg: 'bg-[#F9F8F5]' },
          { label: 'Active',          value: stats.active,    icon: Truck,        bg: 'bg-amber-50' },
          { label: 'Delivered',       value: stats.delivered, icon: CheckCircle,  bg: 'bg-brand-50' },
          { label: 'Offers received', value: stats.offers,    icon: TrendingUp,   bg: 'bg-blue-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-[#E8E7E2]`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#8A8880] uppercase tracking-wide">{s.label}</span>
              <s.icon size={16} className="text-[#C8C7C0]" />
            </div>
            <div className="font-display text-3xl text-[#161614]">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-[#E8E7E2]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E7E2]">
          <h2 className="font-display text-lg text-[#161614]">Recent orders</h2>
          <Link href="/orders" className="text-sm text-brand-400 hover:text-brand-600 flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-[#8A8880] text-sm">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={40} className="text-[#C8C7C0] mx-auto mb-3" />
            <p className="text-[#8A8880] mb-4">No orders yet</p>
            <Link href="/orders/new" className="btn btn-primary !py-2.5 !px-6 !rounded-xl text-sm">
              Create your first order
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#F5F4F0]">
            {orders.map((order: any) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              return (
                <Link key={order.id} href={`/orders/${order.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#F9F8F5] transition group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F4F0] flex items-center justify-center flex-shrink-0">
                      <Package size={18} className="text-[#8A8880]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2C2C28]">
                        {order.car_make} {order.car_model} {order.car_year}
                      </p>
                      <p className="text-xs text-[#8A8880]">
                        {order.pickup_city} → {order.delivery_city}
                        {' · '}
                        {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {parseInt(order.offer_count) > 0 && (
                      <span className="badge badge-blue">{order.offer_count} offers</span>
                    )}
                    <span className={`badge ${cfg.color}`}>{cfg.label}</span>
                    <ArrowRight size={14} className="text-[#C8C7C0] group-hover:text-brand-400 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
