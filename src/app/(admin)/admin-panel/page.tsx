'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Package, TrendingUp, Shield, CheckCircle, XCircle, Loader2, LogOut, BarChart2 } from 'lucide-react';
import { admin as adminApi } from '@/lib/api';
import { useAuthStore } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const ADMIN_NAV = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/users',     icon: Users,           label: 'Users' },
  { href: '/admin/orders',    icon: Package,         label: 'Orders' },
  { href: '/admin/revenue',   icon: BarChart2,       label: 'Revenue' },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  return (
    <aside className="w-60 bg-white border-r border-[#E8E7E2] flex flex-col fixed h-full z-40 hidden md:flex">
      <div className="p-5 border-b border-[#E8E7E2]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-400 flex items-center justify-center">
            <Shield size={14} color="white" />
          </div>
          <span className="font-display text-sm text-[#161614]">Admin Panel</span>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {ADMIN_NAV.map(item => {
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                active ? 'bg-brand-50 text-brand-600' : 'text-[#5A5954] hover:bg-[#F5F4F0]'
              }`}>
              <item.icon size={16} /> {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-[#E8E7E2]">
        <button onClick={() => logout()}
          className="flex items-center gap-2 px-3 py-2 w-full text-sm text-[#8A8880] hover:text-red-500 hover:bg-red-50 rounded-xl transition">
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </aside>
  );
}

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn:  adminApi.dashboard,
    refetchInterval: 60_000,
  });

  const { data: usersData } = useQuery({
    queryKey: ['admin-users', 'pending'],
    queryFn:  () => adminApi.users({ status: 'pending', role: 'driver', limit: '10' }),
  });

  const verifyMutation = useMutation({
    mutationFn: (id: string) => adminApi.verifyDriver(id),
    onSuccess:  () => { toast.success('Driver verified'); queryClient.invalidateQueries({ queryKey: ['admin-users'] }); },
    onError:    (err: any) => toast.error(err.message),
  });

  const stats    = data?.data;
  const pendingDrivers = usersData?.data || [];

  return (
    <div className="flex min-h-screen bg-[#F9F8F5]">
      <AdminSidebar />
      <main className="flex-1 md:ml-60 p-6 lg:p-8">
        <div className="mb-7">
          <h1 className="font-display text-2xl text-[#161614]">Overview</h1>
          <p className="text-sm text-[#8A8880]">Platform health at a glance</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40"><Loader2 size={28} className="animate-spin text-brand-400" /></div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Total orders',    value: stats?.orders?.total,       icon: Package,     bg: 'bg-white' },
                { label: 'Active orders',   value: stats?.orders?.in_transit,  icon: TrendingUp,  bg: 'bg-amber-50' },
                { label: 'Total users',     value: stats?.users?.total,        icon: Users,       bg: 'bg-white' },
                { label: 'Drivers',         value: stats?.users?.drivers,      icon: Shield,      bg: 'bg-brand-50' },
                { label: 'Revenue (total)', value: `€${Number(stats?.payments?.total_revenue || 0).toLocaleString()}`, icon: BarChart2, bg: 'bg-white' },
                { label: 'This month',      value: `€${Number(stats?.payments?.revenue_this_month || 0).toLocaleString()}`, icon: BarChart2, bg: 'bg-green-50' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-[#E8E7E2]`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-[#8A8880] uppercase tracking-wide">{s.label}</span>
                    <s.icon size={15} className="text-[#C8C7C0]" />
                  </div>
                  <div className="font-display text-3xl text-[#161614]">{s.value ?? '—'}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              {/* Recent orders */}
              <div className="bg-white rounded-2xl border border-[#E8E7E2]">
                <div className="px-5 py-4 border-b border-[#E8E7E2] flex justify-between items-center">
                  <h2 className="font-display text-base text-[#161614]">Recent orders</h2>
                  <Link href="/admin/orders" className="text-xs text-brand-400">View all</Link>
                </div>
                <div className="divide-y divide-[#F5F4F0]">
                  {(stats?.recent_orders || []).slice(0, 5).map((o: any) => (
                    <div key={o.id} className="px-5 py-3.5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#2C2C28]">{o.car_make} {o.car_model}</p>
                        <p className="text-xs text-[#8A8880]">{o.client_first} → {o.delivery_country}</p>
                      </div>
                      <span className={`badge text-xs ${
                        o.status === 'delivered'  ? 'badge-green' :
                        o.status === 'cancelled'  ? 'badge-red' :
                        o.status === 'in_transit' ? 'badge-amber' : 'badge-blue'
                      }`}>{o.status.replace(/_/g,' ')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending driver verification */}
              <div className="bg-white rounded-2xl border border-[#E8E7E2]">
                <div className="px-5 py-4 border-b border-[#E8E7E2] flex justify-between items-center">
                  <h2 className="font-display text-base text-[#161614]">Pending verification</h2>
                  <span className="badge badge-amber">{pendingDrivers.length}</span>
                </div>
                <div className="divide-y divide-[#F5F4F0]">
                  {pendingDrivers.length === 0 ? (
                    <div className="px-5 py-8 text-center text-sm text-[#C8C7C0]">All drivers verified ✓</div>
                  ) : pendingDrivers.slice(0, 5).map((u: any) => (
                    <div key={u.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-semibold flex-shrink-0">
                          {u.first_name?.[0]}{u.last_name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#2C2C28]">{u.first_name} {u.last_name}</p>
                          <p className="text-xs text-[#8A8880]">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => verifyMutation.mutate(u.id)}
                          className="p-1.5 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 transition"
                          title="Verify">
                          <CheckCircle size={15} />
                        </button>
                        <button className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                          title="Reject">
                          <XCircle size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
