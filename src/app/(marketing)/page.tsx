import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  Shield, MapPin, CreditCard, Star, ArrowRight,
  Car, Clock, Globe, CheckCircle, ChevronRight
} from 'lucide-react';

export const metadata: Metadata = { title: 'AutoDeliver — Ship Your Car from Europe' };

const STATS = [
  { value: '1,240+', label: 'Verified drivers' },
  { value: '32',     label: 'Countries covered' },
  { value: '4.9',    label: 'Average rating' },
  { value: '8,500+', label: 'Cars delivered' },
];

const STEPS = [
  { n: '01', title: 'Post your order',    desc: 'Enter your car details, pickup city in Europe, and your delivery address anywhere in the world.', icon: Car },
  { n: '02', title: 'Receive offers',     desc: 'Multiple verified drivers compete for your delivery — you see their ratings, experience, and price.', icon: Globe },
  { n: '03', title: 'Choose & pay',       desc: 'Accept the best offer and pay securely. Funds are held in escrow until delivery is confirmed.', icon: CreditCard },
  { n: '04', title: 'Track in real time', desc: 'Watch your car move on the map with live GPS. Photo documentation at every checkpoint.', icon: MapPin },
];

const FEATURES = [
  { icon: Shield,     title: 'Verified drivers only',   desc: 'ID, driving license, and insurance verified before any driver can accept orders.' },
  { icon: MapPin,     title: 'Live GPS tracking',       desc: 'Real-time location updates and milestone photos throughout the entire journey.' },
  { icon: CreditCard, title: 'Escrow payments',         desc: 'Your money is protected. Released to the driver only after you confirm delivery.' },
  { icon: Clock,      title: 'Competitive pricing',     desc: 'Multiple drivers bid for your order — you always get the best market rate.' },
];

const TESTIMONIALS = [
  { name: 'Mohammed Al-Rashidi', country: 'Kuwait', rating: 5, text: 'Bought a BMW in Frankfurt and it arrived in Kuwait City in 12 days. The live tracking was incredible.' },
  { name: 'Khalid Al-Dosari',    country: 'Qatar',  rating: 5, text: 'Third time using AutoDeliver. The driver was professional and the car arrived in perfect condition.' },
  { name: 'Sara Al-Ahmad',       country: 'UAE',    rating: 5, text: 'Easy process from start to finish. Got 4 offers within 2 hours of posting my order.' },
];

export default function HomePage() {
  return (
    <>
      <Navbar transparent />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#161614]">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid-ink opacity-30" />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(29,158,117,0.18) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)' }} />

        <div className="container-site relative z-10 pt-24 pb-20">
          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-6 text-sm text-white/80 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-brand-200 animate-pulse-slow" />
              Trusted by 8,500+ customers across Europe & the Gulf
            </div>

            <h1 className="font-display text-5xl md:text-7xl text-white mb-6 animate-fade-up" style={{ lineHeight: '1.05' }}>
              Ship your car
              <br />
              <span className="text-gradient">from Europe.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-xl leading-relaxed animate-fade-up stagger-2">
              Buy any car in Europe. Our verified drivers deliver it to your door anywhere in the Gulf — with live tracking and secure payments.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-16 animate-fade-up stagger-3">
              <Link href="/register?role=client" className="btn btn-primary text-base !py-3.5 !px-7 !rounded-xl group">
                Get started free
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/register?role=driver" className="btn text-base !py-3.5 !px-7 !rounded-xl text-white/80 border border-white/15 hover:bg-white/10 transition">
                I'm a driver
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-up stagger-4">
              {STATS.map(s => (
                <div key={s.label}>
                  <div className="font-display text-3xl text-white mb-1">{s.value}</div>
                  <div className="text-sm text-white/50">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/40" />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-[#F9F8F5]">
        <div className="container-site">
          <div className="text-center mb-16">
            <div className="text-sm font-medium text-brand-400 tracking-widest uppercase mb-3">Process</div>
            <h2 className="font-display text-4xl md:text-5xl text-[#161614] mb-4">How AutoDeliver works</h2>
            <p className="text-[#5A5954] text-lg max-w-xl mx-auto">From purchase to delivery — four simple steps.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.n} className="relative group">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-px border-t border-dashed border-[#C8C7C0] z-0" style={{ width: 'calc(100% - 80px)', left: 'calc(80px + 1rem)' }} />
                )}
                <div className="bg-white rounded-2xl p-7 border border-[#E8E7E2] hover:border-brand-200 hover:shadow-md transition-all duration-300 relative z-10 h-full">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center group-hover:bg-brand-400 transition-colors duration-300">
                      <step.icon size={22} className="text-brand-400 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="font-display text-4xl text-[#E8E7E2] group-hover:text-brand-100 transition-colors">{step.n}</span>
                  </div>
                  <h3 className="font-display text-xl text-[#161614] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#8A8880] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-sm font-medium text-brand-400 tracking-widest uppercase mb-3">Why AutoDeliver</div>
              <h2 className="font-display text-4xl md:text-5xl text-[#161614] mb-6">
                Everything you need
                <br />
                <em className="not-italic text-[#8A8880]">to ship with confidence</em>
              </h2>
              <p className="text-[#5A5954] text-lg leading-relaxed mb-10">
                We've built every safeguard so your car arrives safely — from the moment it's picked up to the moment it's handed to you.
              </p>
              <Link href="/register" className="btn btn-primary !py-3.5 !px-7 !rounded-xl inline-flex group">
                Start shipping <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {FEATURES.map(f => (
                <div key={f.title} className="bg-[#F9F8F5] rounded-2xl p-6 border border-[#E8E7E2] hover:bg-[#F2F1ED] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                    <f.icon size={20} className="text-brand-400" />
                  </div>
                  <h3 className="font-display text-base text-[#161614] mb-1.5">{f.title}</h3>
                  <p className="text-xs text-[#8A8880] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="py-24 bg-[#F9F8F5]">
        <div className="container-site">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl text-[#161614] mb-2">Trusted by thousands</h2>
            <p className="text-[#8A8880]">Customers across the Gulf rely on AutoDeliver every day.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-7 border border-[#E8E7E2]">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="#EF9F27" className="text-amber-400" />)}
                </div>
                <p className="text-[#5A5954] text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-semibold text-xs">
                    {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#2C2C28]">{t.name}</div>
                    <div className="text-xs text-[#8A8880]">{t.country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-[#161614]">
        <div className="container-site">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-5xl text-white mb-4">
              Ready to ship your car?
            </h2>
            <p className="text-white/60 text-lg mb-10">
              Post your order in 5 minutes. Get your first offer within the hour.
              <br />
              <span className="text-white/40 text-sm">Platform commission: 10% only. No hidden fees.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register?role=client" className="btn btn-primary !py-4 !px-8 !rounded-xl text-base group">
                Post an order <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/register?role=driver" className="btn text-base !py-4 !px-8 !rounded-xl text-white border border-white/20 hover:bg-white/10 transition">
                Join as a driver
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
