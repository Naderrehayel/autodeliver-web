'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/hooks/useAuth';

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type Form = z.infer<typeof schema>;

export default function LoginPage() {
  const router   = useRouter();
  const { login } = useAuthStore();
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
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
          <h1 className="font-display text-2xl text-[#161614] mb-1">Welcome back</h1>
          <p className="text-sm text-[#8A8880] mb-7">Sign in to your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2C2C28] mb-1.5">Email address</label>
              <input {...register('email')} type="email" className="input" placeholder="you@example.com" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-[#2C2C28]">Password</label>
                <Link href="/forgot-password" className="text-xs text-brand-400 hover:text-brand-600 transition">Forgot password?</Link>
              </div>
              <div className="relative">
                <input {...register('password')} type={showPw ? 'text' : 'password'} className="input pr-11" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A8880] hover:text-[#5A5954] transition">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn btn-primary w-full justify-center !py-3 !rounded-xl text-base disabled:opacity-60">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#8A8880]">
            Don't have an account?{' '}
            <Link href="/register" className="text-brand-400 font-medium hover:text-brand-600 transition">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
