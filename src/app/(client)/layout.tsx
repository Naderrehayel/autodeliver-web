'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, MapPin, Bell, User, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/hooks/useAuth';

const NAV = [
  { href: '/dashboard',       icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/orders',          icon: Package,         label: 'My Orders' },
  { href: '/orders/new',      icon: ChevronRight,    label: 'New Order' },
  { href: '/notifications',   icon: Bell,            label: 'Notifications' },
  { href: '/profile',         icon: User,            label: 'Profile' },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname    = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#F9F8F5] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E8E7E2] flex flex-col fixed h-full z-40 hidden md:flex">
        <div className="p-5 border-b border-[#E8E7E2]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-400 flex items-center justify-center">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <rect x="9" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2"/>
                <circle cx="12" cy="21" r="1" fill="white"/>
                <circle cx="20" cy="21" r="1" fill="white"/>
              </svg>
            </div>
            <span className="font-display text-base text-[#161614]">AutoDeliver</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(item => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-[#5A5954] hover:bg-[#F5F4F0] hover:text-[#2C2C28]'
                }`}>
                <item.icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#E8E7E2]">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-semibold flex-shrink-0">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#2C2C28] truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-[#8A8880] truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => logout()}
            className="flex items-center gap-2 px-3 py-2 w-full rounded-xl text-sm text-[#8A8880] hover:text-red-500 hover:bg-red-50 transition">
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
