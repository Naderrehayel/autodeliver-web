'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Car, MapPin, Calendar, FileText, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { orders as ordersApi } from '@/lib/api';

const schema = z.object({
  car_make:           z.string().min(1, 'Required'),
  car_model:          z.string().min(1, 'Required'),
  car_year:           z.coerce.number().min(1990).max(new Date().getFullYear() + 1),
  car_color:          z.string().optional(),
  car_vin:            z.string().optional(),
  car_plate:          z.string().optional(),
  car_value:          z.coerce.number().optional(),
  pickup_country:     z.string().min(1, 'Required'),
  pickup_city:        z.string().min(1, 'Required'),
  pickup_address:     z.string().min(1, 'Required'),
  pickup_date:        z.string().min(1, 'Required'),
  delivery_country:   z.string().min(1, 'Required'),
  delivery_city:      z.string().min(1, 'Required'),
  delivery_address:   z.string().min(1, 'Required'),
  client_notes:       z.string().optional(),
});
type Form = z.infer<typeof schema>;

const EU_COUNTRIES = ['Germany','France','Netherlands','Belgium','Austria','Switzerland','Italy','Spain','Poland','Czech Republic','Hungary','Romania','Other EU'];
const DEST_COUNTRIES = ['Kuwait','Saudi Arabia','UAE','Qatar','Bahrain','Oman','Jordan','Lebanon','Other'];

const STEPS = [
  { id: 1, label: 'Car details',  icon: Car },
  { id: 2, label: 'Route',        icon: MapPin },
  { id: 3, label: 'Schedule',     icon: Calendar },
  { id: 4, label: 'Notes',        icon: FileText },
];

export default function NewOrderPage() {
  const router = useRouter();
  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, trigger, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { car_year: new Date().getFullYear() },
  });

  const nextStep = async () => {
    const fieldsByStep: Record<number, (keyof Form)[]> = {
      1: ['car_make','car_model','car_year'],
      2: ['pickup_country','pickup_city','pickup_address','delivery_country','delivery_city','delivery_address'],
      3: ['pickup_date'],
    };
    const valid = await trigger(fieldsByStep[step]);
    if (valid) setStep(s => Math.min(s + 1, 4));
  };

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      const res = await ordersApi.create(data);
      toast.success('Order posted! Waiting for driver offers.');
      router.push(`/orders/${res.data.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl text-[#161614] mb-1">New delivery order</h1>
        <p className="text-sm text-[#8A8880]">Post your car for delivery — drivers will send you offers.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <button onClick={() => step > s.id && setStep(s.id)}
              className={`flex items-center gap-2 text-sm font-medium transition ${
                step === s.id ? 'text-brand-600' :
                step > s.id  ? 'text-brand-400 cursor-pointer' : 'text-[#C8C7C0]'
              }`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition ${
                step === s.id ? 'bg-brand-400 text-white' :
                step > s.id  ? 'bg-brand-100 text-brand-600' : 'bg-[#F5F4F0] text-[#C8C7C0]'
              }`}>
                {step > s.id ? '✓' : s.id}
              </div>
              <span className="hidden sm:block">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-1 ${step > s.id ? 'bg-brand-200' : 'bg-[#E8E7E2]'}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-2xl border border-[#E8E7E2] p-7">

          {/* Step 1: Car details */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-display text-lg text-[#161614] mb-5">Car details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C28] mb-1.5">Make *</label>
                  <input {...register('car_make')} className="input" placeholder="BMW, Mercedes, Audi…" />
                  {errors.car_make && <p className="text-xs text-red-500 mt-1">{errors.car_make.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C2C28] mb-1.5">Model *</label>
                  <input {...register('car_model')} className="input" placeholder="X5, C-Class, Q7…" />
                  {errors.car_model && <p className="text-xs text-red-500 mt-1">{errors.car_model.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C2C28] mb-1.5">Year *</label>
                  <input {...register('car_year')} type="number" className="input" />
                  {errors.car_year && <p className="text-xs text-red-500 mt-1">{errors.car_year.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C2C28] mb-1.5">Color</label>
                  <input {...register('car_color')} className="input" placeholder="Black, White, Silver…" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C2C28] mb-1.5">VIN number</label>
                  <input {...register('car_vin')} className="input" placeholder="17-character VIN" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C2C28] mb-1.5">License plate</label>
                  <input {...register('car_plate')} className="input" placeholder="XX-XXX-XX" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C28] mb-1.5">Estimated car value (EUR)</label>
                <input {...register('car_value')} type="number" className="input" placeholder="35000" />
                <p className="text-xs text-[#8A8880] mt-1">Used to calculate insurance coverage</p>
              </div>
            </div>
          )}

          {/* Step 2: Route */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-display text-lg text-[#161614] mb-5">Delivery route</h2>
              <div className="p-4 bg-[#F9F8F5] rounded-xl border border-[#E8E7E2] space-y-4">
                <p className="text-xs font-semibold text-[#8A8880] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs">A</span>
                  Pickup location (Europe)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#2C2C28] mb-1">Country *</label>
                    <select {...register('pickup_country')} className="input text-sm">
                      <option value="">Select country</option>
                      {EU_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.pickup_country && <p className="text-xs text-red-500 mt-1">{errors.pickup_country.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#2C2C28] mb-1">City *</label>
                    <input {...register('pickup_city')} className="input text-sm" placeholder="Frankfurt" />
                    {errors.pickup_city && <p className="text-xs text-red-500 mt-1">{errors.pickup_city.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2C2C28] mb-1">Full address *</label>
                  <input {...register('pickup_address')} className="input text-sm" placeholder="Dealer name / street address" />
                  {errors.pickup_address && <p className="text-xs text-red-500 mt-1">{errors.pickup_address.message}</p>}
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-px h-4 bg-[#C8C7C0]" />
                  <MapPin size={18} className="text-[#C8C7C0]" />
                  <div className="w-px h-4 bg-[#C8C7C0]" />
                </div>
              </div>

              <div className="p-4 bg-[#F9F8F5] rounded-xl border border-[#E8E7E2] space-y-4">
                <p className="text-xs font-semibold text-[#8A8880] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">B</span>
                  Delivery destination
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#2C2C28] mb-1">Country *</label>
                    <select {...register('delivery_country')} className="input text-sm">
                      <option value="">Select country</option>
                      {DEST_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.delivery_country && <p className="text-xs text-red-500 mt-1">{errors.delivery_country.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#2C2C28] mb-1">City *</label>
                    <input {...register('delivery_city')} className="input text-sm" placeholder="Kuwait City" />
                    {errors.delivery_city && <p className="text-xs text-red-500 mt-1">{errors.delivery_city.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2C2C28] mb-1">Full address *</label>
                  <input {...register('delivery_address')} className="input text-sm" placeholder="Street, area, postal code" />
                  {errors.delivery_address && <p className="text-xs text-red-500 mt-1">{errors.delivery_address.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Date */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-display text-lg text-[#161614] mb-5">Schedule</h2>
              <div>
                <label className="block text-sm font-medium text-[#2C2C28] mb-1.5">Car pickup date *</label>
                <input {...register('pickup_date')} type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="input" />
                {errors.pickup_date && <p className="text-xs text-red-500 mt-1">{errors.pickup_date.message}</p>}
                <p className="text-xs text-[#8A8880] mt-1.5">The date the driver should pick up your car</p>
              </div>
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
                <p className="text-sm text-brand-800 font-medium mb-1">How long will delivery take?</p>
                <p className="text-xs text-brand-600">Typical delivery times: Germany → Kuwait: 10–14 days · France → UAE: 12–16 days</p>
              </div>
            </div>
          )}

          {/* Step 4: Notes */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="font-display text-lg text-[#161614] mb-5">Special instructions</h2>
              <div>
                <label className="block text-sm font-medium text-[#2C2C28] mb-1.5">Notes for the driver</label>
                <textarea {...register('client_notes')} rows={5} className="input resize-none"
                  placeholder="Any special instructions… e.g. 'Please take photos of all body panels before pickup. Contact me 24 hours before delivery.'" />
              </div>
              <div className="bg-[#F9F8F5] rounded-xl p-4 border border-[#E8E7E2]">
                <p className="text-sm font-medium text-[#2C2C28] mb-2">Before you post</p>
                <ul className="text-xs text-[#8A8880] space-y-1.5">
                  {[
                    'Drivers will be notified and can submit offers within 48 hours',
                    'You can accept the best offer at any time',
                    'Payment is held in escrow until delivery is confirmed',
                    'You can cancel the order before confirming an offer',
                  ].map(t => (
                    <li key={t} className="flex items-start gap-1.5">
                      <span className="text-brand-400 mt-0.5">✓</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5">
          <button type="button" onClick={() => setStep(s => Math.max(s - 1, 1))}
            className={`btn btn-outline !py-2.5 !px-5 !rounded-xl text-sm ${step === 1 ? 'invisible' : ''}`}>
            Back
          </button>

          {step < 4 ? (
            <button type="button" onClick={nextStep}
              className="btn btn-primary !py-2.5 !px-6 !rounded-xl text-sm">
              Continue <ChevronRight size={15} />
            </button>
          ) : (
            <button type="submit" disabled={loading}
              className="btn btn-primary !py-2.5 !px-6 !rounded-xl text-sm disabled:opacity-60">
              {loading ? <Loader2 size={15} className="animate-spin" /> : 'Post order'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
