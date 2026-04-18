'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, Car, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { auth as authApi, setToken, setRefresh } from '@/lib/api';
import { useAuthStore } from '@/hooks/useAuth';

const schema = z.object({
  first_name:       z.string().min(1, 'First name required'),
  last_name:        z.string().min(1, 'Last name required'),
  email:            z.string().email('Enter a valid email'),
  phone:            z.string().optional(),
  password:         z.string().min(8, 'Minimum 8 characters'),
  confirm_password: z.string(),
  role:             z.enum(['client', 'driver']),
  country:          z.string().min(1, 'Country required'),
}).refine(d => d.password === d.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});
type Form = z.infer<typeof schema>;

const COUNTRIES = [
  'Kuwait','Saudi Arabia','UAE','Qatar','Bahrain','Oman',
  'Germany','France','Switzerland','Austria','Netherlands','Belgium','Other'
];

export default function RegisterPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { setUser }  = useAuthStore();
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultRole = (searchParams.get('role') || 'client') as 'client' | 'driver';

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { role: defaultRole },
  });

  const role = watch('role');

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      const res = await authApi.register(data);
      setToken(res.data.accessToken);
      setRefresh(res.data.refreshToken);
      setUser(res.data.user);
      toast.success('Account created! Please check your email to verify.');
      router.push(role === 'driver' ? '/driver-panel' : '/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-brand-400 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <rect x="9" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2"/>
                <circle cx="12" cy="21" r="1" fill="white"/>
                <circle cx="20" cy="21" r="1" fill="white"/>
              </svg>
            </div>
            <span className="font-display text-xl text-[#161614]">AutoDeliver</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E7E2] p-8 shadow-sm">
          <h1 className="font-display text-2xl text-[#161614] mb-1">Create your account</h1>
          <p className="text-sm text-[#8A8880] mb-6">Join AutoDeliver today</p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(['client', 'driver'] as const).map(r => (
              <button key={r} type="button" onClick={() => setValue('role', r)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  role === r
                    ? 'border-brand-400 bg-brand-50'
                    : 'border-[#E8E7E2] hover:border-[#C8C7C0]'
                }`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${role === r ? 'bg-brand-400' : 'bg-[#F5F4F0]'}`}>
                  {r === 'client'
                    ? <Car  size={18} className={role === r ? 'text-white' : 'text-[#8A8880]'} />
                    : <Truck size={18} className={role === r ? 'text-white' : 'text-[#8A8880]'} />
                  }
                </div>
                <div>
                  <div className={`text-sm font-medium ${role === r ? 'text-brand-600' : 'text-[#2C2C28]'}`}>
                    {r === 'client' ? 'Ship a car' : 'Be a driver'}
                  </div>
                  <div className="text-xs text-[#8A8880]">
                    {r === 'client' ? 'I want delivery' : 'I deliver cars'}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#2C2C28] mb-1.5">First name</label>
                <input {...register('first_name')} className="input" placeholder="Ahmed" />
                {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C28] mb-1.5">Last name</label>
                <input {...register('last_name')} className="input" placeholder="Hassan" />
                {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C2C28] mb-1.5">Email address</label>
              <input {...register('email')} type="email" className="input" placeholder="you@example.com" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C2C28] mb-1.5">Phone (optional)</label>
              <input {...register('phone')} type="tel" className="input" placeholder="+966 5X XXX XXXX" />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C2C28] mb-1.5">Country</label>
              <select {...register('country')} className="input">
                <option value="">Select country</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C2C28] mb-1.5">Password</label>
              <div className="relative">
                <input {...register('password')} type={showPw ? 'text' : 'password'} className="input pr-11" placeholder="Min. 8 characters" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A8880]">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C2C28] mb-1.5">Confirm password</label>
              <input {...register('confirm_password')} type="password" className="input" placeholder="••••••••" />
              {errors.confirm_password && <p className="text-xs text-red-500 mt-1">{errors.confirm_password.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn btn-primary w-full justify-center !py-3 !rounded-xl text-base disabled:opacity-60 mt-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create account'}
            </button>
          </form>

          <p className="text-center text-xs text-[#8A8880] mt-4">
            By signing up you agree to our{' '}
            <Link href="/terms" className="text-brand-400 hover:underline">Terms</Link> and{' '}
            <Link href="/privacy" className="text-brand-400 hover:underline">Privacy Policy</Link>.
          </p>

          <div className="divider" />

          <div className="text-center text-sm text-[#8A8880]">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-400 font-medium hover:text-brand-600 transition">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
