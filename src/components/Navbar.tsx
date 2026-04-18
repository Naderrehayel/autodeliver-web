'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Globe, ChevronDown, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuthStore } from '@/hooks/useAuth';

const LANGS = [
  { code: 'en',    label: 'English',          flag: '🇬🇧' },
  { code: 'ar',    label: 'العربية',           flag: '🇸🇦' },
  { code: 'de',    label: 'Deutsch',           flag: '🇩🇪' },
  { code: 'fr',    label: 'Français',          flag: '🇫🇷' },
  { code: 'de-CH', label: 'Deutsch (Schweiz)', flag: '🇨🇭' },
];

export function Navbar({ transparent = false }: { transparent?: boolean }) {
  const { user, logout } = useAuthStore();
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [langOpen,    setLangOpen]    = useState(false);
  const [userOpen,    setUserOpen]    = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  const navBase = transparent
    ? 'absolute top-0 left-0 right-0 z-50'
    : 'sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8E7E2]';

  const textColor = transparent ? 'text-white' : 'text-[#2C2C28]';

  return (
    <nav className={`${navBase}`}>
      <div className="container-site">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-brand-400 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <rect x="9" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2"/>
                <circle cx="12" cy="21" r="1" fill="white"/>
                <circle cx="20" cy="21" r="1" fill="white"/>
              </svg>
            </div>
            <span className={`font-display text-lg font-medium tracking-tight ${transparent ? 'text-white' : 'text-[#161614]'}`}>
              AutoDeliver
            </span>
          </Link>

          {/* Desktop nav */}
          <div className={`hidden md:flex items-center gap-6 text-sm font-medium ${textColor}`}>
            <Link href="/#how-it-works" className="hover:text-brand-400 transition-colors">How it works</Link>
            <Link href="/#pricing"      className="hover:text-brand-400 transition-colors">Pricing</Link>
            <Link href="/#about"        className="hover:text-brand-400 transition-colors">About</Link>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">

            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-black/10 transition text-sm ${textColor}`}
              >
                <Globe size={15} />
                <span>{LANGS.find(l => l.code === currentLang)?.flag}</span>
                <ChevronDown size={12} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl border border-[#E8E7E2] shadow-lg w-48 py-1 z-50">
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setCurrentLang(l.code); setLangOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-[#F5F4F0] transition"
                    >
                      <span className="text-base">{l.flag}</span>
                      <span className={l.code === currentLang ? 'font-medium text-brand-400' : 'text-[#5A5954]'}>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl border border-[#E8E7E2] bg-white hover:bg-[#F5F4F0] transition text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-semibold">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </div>
                  <span className="text-[#2C2C28] font-medium">{user.first_name}</span>
                  <ChevronDown size={12} className="text-[#8A8880]" />
                </button>
                {userOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-xl border border-[#E8E7E2] shadow-lg w-52 py-1 z-50">
                    <Link href={user.role === 'driver' ? '/driver/dashboard' : '/dashboard'}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#2C2C28] hover:bg-[#F5F4F0] transition">
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#2C2C28] hover:bg-[#F5F4F0] transition">
                      <User size={15} /> Profile
                    </Link>
                    <div className="h-px bg-[#E8E7E2] my-1" />
                    <button onClick={() => logout()}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-[#FFF0F0] transition">
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login"    className={`text-sm font-medium ${transparent ? 'text-white hover:text-white/80' : 'text-[#5A5954] hover:text-[#2C2C28]'} transition`}>Log in</Link>
                <Link href="/register" className="btn btn-primary text-sm !py-2 !px-4">Get started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-lg ${textColor}`}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-[#E8E7E2] mt-2 pt-4 space-y-1">
            <Link href="/#how-it-works" className="block py-2.5 px-3 rounded-lg hover:bg-[#F5F4F0] text-[#2C2C28] text-sm font-medium">How it works</Link>
            <Link href="/#pricing"      className="block py-2.5 px-3 rounded-lg hover:bg-[#F5F4F0] text-[#2C2C28] text-sm font-medium">Pricing</Link>
            {user ? (
              <>
                <Link href={user.role === 'driver' ? '/driver/dashboard' : '/dashboard'}
                  className="block py-2.5 px-3 rounded-lg hover:bg-[#F5F4F0] text-[#2C2C28] text-sm font-medium">Dashboard</Link>
                <button onClick={() => logout()} className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-red-50 text-red-500 text-sm font-medium">Logout</button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link href="/login"    className="flex-1 btn btn-outline text-center justify-center">Log in</Link>
                <Link href="/register" className="flex-1 btn btn-primary text-center justify-center">Sign up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
