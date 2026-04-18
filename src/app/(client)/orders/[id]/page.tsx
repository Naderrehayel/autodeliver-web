'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Star, Shield, Clock, CheckCircle, MessageCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { orders as ordersApi, offers as offersApi } from '@/lib/api';
import { formatDistanceToNow, format } from 'date-fns';

const STATUS_STEPS = ['pending','offers_received','confirmed','in_transit','delivered'];

export default function OrderDetailPage() {
  const { id }         = useParams<{ id: string }>();
  const queryClient    = useQueryClient();
  const [activeTab, setActiveTab] = useState<'offers'|'tracking'|'messages'>('offers');

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn:  () => ordersApi.get(id),
    refetchInterval: 30_000,
  });

  const acceptMutation = useMutation({
    mutationFn: (offerId: string) => offersApi.accept(id, offerId),
    onSuccess: () => {
      toast.success('Offer accepted! Order confirmed.');
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const rejectMutation = useMutation({
    mutationFn: (offerId: string) => offersApi.reject(id, offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-brand-400" />
      </div>
    );
  }

  const order   = data?.data;
  const offers  = order?.offers || [];
  const stepIdx = STATUS_STEPS.indexOf(order?.status);

  if (!order) return <div className="p-8 text-[#8A8880]">Order not found.</div>;

  return (
    <div className="p-6 lg:p-8">

      {/* Back + header */}
      <div className="flex items-start gap-4 mb-7">
        <Link href="/orders" className="mt-1 p-1.5 rounded-lg hover:bg-[#F5F4F0] text-[#8A8880] hover:text-[#2C2C28] transition">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl text-[#161614]">
            {order.car_make} {order.car_model} {order.car_year}
          </h1>
          <p className="text-sm text-[#8A8880]">
            {order.pickup_city}, {order.pickup_country} →{' '}
            {order.delivery_city}, {order.delivery_country}
          </p>
        </div>
        <span className={`badge text-xs px-3 py-1.5 ${
          order.status === 'delivered'   ? 'badge-green' :
          order.status === 'cancelled'   ? 'badge-red' :
          order.status === 'in_transit'  ? 'badge-amber' : 'badge-blue'
        }`}>
          {order.status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-[#E8E7E2] p-6 mb-5">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-[#E8E7E2] z-0" />
          <div className="absolute top-3.5 left-0 h-0.5 bg-brand-400 z-0 transition-all duration-500"
            style={{ width: `${Math.max(0, (stepIdx / (STATUS_STEPS.length - 1)) * 100)}%` }} />
          {STATUS_STEPS.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-1.5 z-10">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                i < stepIdx  ? 'bg-brand-400 text-white' :
                i === stepIdx ? 'bg-brand-400 text-white ring-4 ring-brand-100' :
                'bg-white border-2 border-[#E8E7E2] text-[#C8C7C0]'
              }`}>
                {i < stepIdx ? '✓' : i + 1}
              </div>
              <span className="text-[10px] text-[#8A8880] capitalize whitespace-nowrap hidden sm:block">
                {s.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: tabs */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tab nav */}
          <div className="flex gap-1 bg-[#F9F8F5] rounded-xl p-1 border border-[#E8E7E2]">
            {([
              { key: 'offers',   label: `Offers (${offers.filter((o:any) => o.status === 'pending').length})` },
              { key: 'tracking', label: 'Tracking' },
              { key: 'messages', label: 'Messages' },
            ] as const).map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                  activeTab === t.key
                    ? 'bg-white text-brand-600 shadow-sm border border-[#E8E7E2]'
                    : 'text-[#8A8880] hover:text-[#5A5954]'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Offers tab */}
          {activeTab === 'offers' && (
            <div className="space-y-3">
              {offers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#E8E7E2] p-10 text-center">
                  <Clock size={32} className="text-[#C8C7C0] mx-auto mb-3" />
                  <p className="text-[#8A8880]">No offers yet — drivers will respond within a few hours.</p>
                </div>
              ) : offers.map((offer: any) => (
                <div key={offer.id}
                  className={`bg-white rounded-2xl border-2 p-6 transition ${
                    offer.status === 'accepted' ? 'border-brand-400 bg-brand-50/30' :
                    offer.status === 'rejected' ? 'border-[#E8E7E2] opacity-50' : 'border-[#E8E7E2]'
                  }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold text-sm flex-shrink-0">
                        {offer.driver?.first_name?.[0]}{offer.driver?.last_name?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-[#2C2C28]">
                          {offer.driver?.first_name} {offer.driver?.last_name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex items-center gap-0.5">
                            <Star size={12} fill="#EF9F27" className="text-amber-400" />
                            <span className="text-xs text-[#8A8880]">{offer.driver?.avg_rating}</span>
                          </div>
                          <span className="text-xs text-[#C8C7C0]">·</span>
                          <span className="text-xs text-[#8A8880]">{offer.driver?.total_deliveries} deliveries</span>
                          {offer.driver?.verified_at && (
                            <>
                              <span className="text-xs text-[#C8C7C0]">·</span>
                              <span className="flex items-center gap-0.5 text-xs text-brand-500">
                                <Shield size={11} /> Verified
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl text-[#161614]">€{offer.price?.toLocaleString()}</p>
                      {offer.eta_days && (
                        <p className="text-xs text-[#8A8880]">~{offer.eta_days} days</p>
                      )}
                    </div>
                  </div>

                  {offer.message && (
                    <p className="text-sm text-[#5A5954] bg-[#F9F8F5] rounded-xl p-3 mb-4 leading-relaxed">
                      "{offer.message}"
                    </p>
                  )}

                  {offer.status === 'pending' && order.status !== 'confirmed' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptMutation.mutate(offer.id)}
                        disabled={acceptMutation.isPending}
                        className="btn btn-primary flex-1 justify-center !py-2.5 !rounded-xl text-sm disabled:opacity-60">
                        {acceptMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : 'Accept offer'}
                      </button>
                      <button
                        onClick={() => rejectMutation.mutate(offer.id)}
                        className="btn btn-outline !py-2.5 !px-5 !rounded-xl text-sm">
                        Decline
                      </button>
                    </div>
                  )}

                  {offer.status === 'accepted' && (
                    <div className="flex items-center gap-1.5 text-brand-600 text-sm font-medium">
                      <CheckCircle size={15} /> Offer accepted
                    </div>
                  )}
                  {offer.status === 'rejected' && (
                    <div className="text-xs text-[#C8C7C0]">Declined</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tracking tab */}
          {activeTab === 'tracking' && (
            <div className="bg-white rounded-2xl border border-[#E8E7E2] p-6">
              {order.status === 'pending' || order.status === 'offers_received' || order.status === 'confirmed' ? (
                <div className="text-center py-8">
                  <MapPin size={32} className="text-[#C8C7C0] mx-auto mb-3" />
                  <p className="text-[#8A8880] text-sm">Tracking will be available once the driver picks up your car.</p>
                </div>
              ) : (
                <div>
                  <div className="bg-brand-50 rounded-xl h-48 flex items-center justify-center mb-4 border border-brand-100">
                    <div className="text-center text-brand-600">
                      <MapPin size={28} className="mx-auto mb-2" />
                      <p className="text-sm font-medium">Live GPS Map</p>
                      <p className="text-xs text-brand-400">Google Maps integration active</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#8A8880] text-center">
                    Last updated {order.updated_at ? formatDistanceToNow(new Date(order.updated_at), { addSuffix: true }) : '—'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Messages tab */}
          {activeTab === 'messages' && (
            <MessagePanel orderId={id} />
          )}
        </div>

        {/* Right: order info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8E7E2] p-5">
            <h3 className="font-display text-base text-[#161614] mb-4">Order details</h3>
            <dl className="space-y-3 text-sm">
              {[
                { label: 'Car',       value: `${order.car_make} ${order.car_model} ${order.car_year}` },
                { label: 'Color',     value: order.car_color || '—' },
                { label: 'VIN',       value: order.car_vin   || '—' },
                { label: 'Pickup',    value: format(new Date(order.pickup_date), 'd MMM yyyy') },
                { label: 'From',      value: `${order.pickup_city}, ${order.pickup_country}` },
                { label: 'To',        value: `${order.delivery_city}, ${order.delivery_country}` },
              ].map(r => (
                <div key={r.label} className="flex justify-between gap-2">
                  <dt className="text-[#8A8880]">{r.label}</dt>
                  <dd className="font-medium text-[#2C2C28] text-right">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {order.agreed_price && (
            <div className="bg-white rounded-2xl border border-[#E8E7E2] p-5">
              <h3 className="font-display text-base text-[#161614] mb-4">Payment</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[#8A8880]">Agreed price</dt>
                  <dd className="font-medium text-[#2C2C28]">€{order.agreed_price?.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#8A8880]">Platform fee (10%)</dt>
                  <dd className="text-[#8A8880]">€{order.platform_fee?.toLocaleString()}</dd>
                </div>
                <div className="h-px bg-[#E8E7E2] my-2" />
                <div className="flex justify-between font-medium text-[#2C2C28]">
                  <dt>Total</dt>
                  <dd>€{order.agreed_price?.toLocaleString()}</dd>
                </div>
              </dl>
              {order.status === 'confirmed' && (
                <Link href={`/orders/${id}/pay`}
                  className="btn btn-primary w-full justify-center !py-2.5 !rounded-xl text-sm mt-4">
                  Pay now
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MessagePanel({ orderId }: { orderId: string }) {
  const [text, setText] = useState('');
  const { data, refetch } = useQuery({
    queryKey: ['messages', orderId],
    queryFn:  () => import('@/lib/api').then(m => m.user.messages(orderId)),
    refetchInterval: 10_000,
  });
  const messages = data?.data || [];

  const send = async () => {
    if (!text.trim()) return;
    try {
      await import('@/lib/api').then(m => m.user.sendMessage(orderId, text));
      setText('');
      refetch();
    } catch {}
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8E7E2] flex flex-col" style={{ minHeight: 360 }}>
      <div className="flex-1 p-5 space-y-3 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-[#C8C7C0] text-sm">
            <MessageCircle size={20} className="mr-2" /> No messages yet
          </div>
        ) : messages.map((m: any) => (
          <div key={m.id} className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#F5F4F0] flex items-center justify-center text-xs text-[#8A8880] font-medium flex-shrink-0 mt-0.5">
              {m.sender?.first_name?.[0]}
            </div>
            <div>
              <p className="text-xs text-[#8A8880] mb-0.5">{m.sender?.first_name} · {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}</p>
              <div className="bg-[#F9F8F5] rounded-xl px-3.5 py-2.5 text-sm text-[#2C2C28] max-w-xs">{m.content}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-[#E8E7E2] flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          className="input flex-1 text-sm !py-2" placeholder="Type a message…" />
        <button onClick={send} className="btn btn-primary !py-2 !px-4 !rounded-xl text-sm">Send</button>
      </div>
    </div>
  );
}
