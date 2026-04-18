'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Package, TrendingUp, Star, ToggleLeft, ToggleRight, MapPin, Clock, Loader2, ChevronRight, LogOut, LayoutDashboard, FileText, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { orders as ordersApi, offers as offersApi, user as userApi } from '@/lib/api';
import { useAuthStore } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

/* ── Sidebar ───────────────────────────────────────────────── */
const DRIVER_NAV = [
  { href: '/driver/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/driver/orders',    icon: Package,          label: 'Available Orders' },
  { href: '/driver/offers',    icon: FileText,         label: 'My Offers' },
  { href: '/profile',          icon: User,             label: 'Profile' },
];

export function DriverSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-64 bg-[#161614] flex flex-col fixed h-full z-40 hidden md:flex">
      <div className="p-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-400 flex items-center justify-center">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <rect x="9" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="21" r="1" fill="white"/>
              <circle cx="20" cy="21" r="1" fill="white"/>
            </svg>
          </div>
          <span className="font-display text-base text-white">AutoDeliver</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {DRIVER_NAV.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active ? 'bg-brand-400 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}>
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <div className="w-8 h-8 rounded-full bg-brand-400 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.first_name} {user?.last_name}</p>
            <p className="text-xs text-white/40 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={() => logout()}
          className="flex items-center gap-2 px-3 py-2 w-full rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/10 transition">
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </aside>
  );
}

/* ── Driver Dashboard Page ─────────────────────────────────── */
export default function DriverDashboardPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isAvailable, setIsAvailable] = useState(true);

  const { data: availableData, isLoading } = useQuery({
    queryKey: ['available-orders'],
    queryFn:  () => ordersApi.available({ limit: '8' }),
  });

  const availabilityMutation = useMutation({
    mutationFn: (val: boolean) => userApi.setAvailability(val),
    onSuccess: (_, val) => {
      setIsAvailable(val);
      toast.success(val ? 'You are now available' : 'You are now offline');
    },
  });

  const availableOrders = availableData?.data || [];

  return (
    <div className="flex min-h-screen bg-[#F9F8F5]">
      <DriverSidebar />

      <main className="flex-1 md:ml-64 p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl text-[#161614]">Driver Dashboard</h1>
            <p className="text-sm text-[#8A8880]">Welcome back, {user?.first_name}</p>
          </div>
          <button
            onClick={() => availabilityMutation.mutate(!isAvailable)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition border ${
              isAvailable
                ? 'bg-brand-50 text-brand-600 border-brand-200'
                : 'bg-[#F5F4F0] text-[#8A8880] border-[#E8E7E2]'
            }`}>
            {isAvailable
              ? <ToggleRight size={18} className="text-brand-400" />
              : <ToggleLeft  size={18} />
            }
            {isAvailable ? 'Available' : 'Offline'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total earned',  value: '€0',  icon: TrendingUp, color: 'bg-brand-50' },
            { label: 'Deliveries',    value: '0',    icon: Package,   color: 'bg-blue-50' },
            { label: 'Rating',        value: '—',    icon: Star,      color: 'bg-amber-50' },
            { label: 'New requests',  value: availableOrders.length.toString(), icon: Clock, color: 'bg-[#F9F8F5]' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-2xl p-5 border border-[#E8E7E2]`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[#8A8880] uppercase tracking-wide">{s.label}</span>
                <s.icon size={15} className="text-[#C8C7C0]" />
              </div>
              <div className="font-display text-3xl text-[#161614]">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Available orders */}
        <div className="bg-white rounded-2xl border border-[#E8E7E2]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E7E2]">
            <h2 className="font-display text-lg text-[#161614]">Available orders</h2>
            <span className="badge badge-green">{availableOrders.length} open</span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 size={24} className="animate-spin text-brand-400" />
            </div>
          ) : availableOrders.length === 0 ? (
            <div className="p-12 text-center">
              <Package size={36} className="text-[#C8C7C0] mx-auto mb-3" />
              <p className="text-[#8A8880]">No available orders right now.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F5F4F0]">
              {availableOrders.map((order: any) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function OrderCard({ order }: { order: any }) {
  const [open, setOpen]         = useState(false);
  const [price, setPrice]       = useState('');
  const [message, setMessage]   = useState('');
  const [eta, setEta]           = useState('');
  const [loading, setLoading]   = useState(false);
  const queryClient             = useQueryClient();

  const submit = async () => {
    if (!price) return toast.error('Enter your price');
    setLoading(true);
    try {
      await offersApi.submit(order.id, {
        price: parseFloat(price),
        message,
        eta_days: eta ? parseInt(eta) : undefined,
      });
      toast.success('Offer submitted!');
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['available-orders'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="font-medium text-[#2C2C28]">
            {order.car_make} {order.car_model} {order.car_year}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-[#8A8880] mt-1">
            <MapPin size={11} />
            {order.pickup_city}, {order.pickup_country}
            <span className="text-[#C8C7C0]">→</span>
            {order.delivery_city || order.delivery_country}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="badge badge-ink">{order.offer_count} offers</span>
            <span className="text-xs text-[#8A8880]">
              Posted {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
        <button onClick={() => setOpen(!open)}
          className="btn btn-primary !py-2 !px-4 !rounded-xl text-xs flex-shrink-0">
          Make offer
        </button>
      </div>

      {open && (
        <div className="mt-4 pt-4 border-t border-[#F5F4F0] space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#2C2C28] mb-1">Your price (EUR) *</label>
              <input value={price} onChange={e => setPrice(e.target.value)}
                type="number" className="input text-sm" placeholder="1500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#2C2C28] mb-1">Est. days</label>
              <input value={eta} onChange={e => setEta(e.target.value)}
                type="number" className="input text-sm" placeholder="12" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#2C2C28] mb-1">Message to client</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)}
              rows={2} className="input text-sm resize-none"
              placeholder="Introduce yourself and your experience…" />
          </div>
          <div className="flex gap-2">
            <button onClick={submit} disabled={loading}
              className="btn btn-primary !py-2 !px-5 !rounded-xl text-sm disabled:opacity-60">
              {loading ? <Loader2 size={14} className="animate-spin" /> : 'Submit offer'}
            </button>
            <button onClick={() => setOpen(false)} className="btn btn-outline !py-2 !px-4 !rounded-xl text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
