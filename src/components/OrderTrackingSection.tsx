import React, { useEffect, useState } from 'react';
import { Check, Clock, Search, ShieldCheck, XCircle } from 'lucide-react';
import { ORDER_STATUS_LABELS, Order, OrderStatus, formatPriceUZS } from '../types/plate';

interface OrderTrackingSectionProps {
  initialQuery?: string;
  recentTrackingCodes: string[];
}

const PROGRESS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'pending', label: 'Qabul qilindi' },
  { key: 'reviewing', label: 'Tekshirilmoqda' },
  { key: 'processing', label: 'Rasmiylashtirilmoqda' },
  { key: 'completed', label: 'Topshirildi' },
];

export const OrderTrackingSection: React.FC<OrderTrackingSectionProps> = ({
  initialQuery = '',
  recentTrackingCodes,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performTrack = async (searchText: string) => {
    const clean = searchText.trim();
    if (!clean) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const resp = await fetch(`/api/orders/track?q=${encodeURIComponent(clean)}`);
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || 'Qidirishda xatolik yuz berdi.');
        setOrders([]);
        return;
      }
      setOrders(data.orders || []);
    } catch {
      setError('Server bilan aloqa uzildi.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performTrack(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performTrack(query);
  };

  const quickExamples = Array.from(
    new Set([...recentTrackingCodes, 'AN-2026-1001', 'AN-2026-1002'])
  ).slice(0, 4);

  return (
    <section id="kuzatish" className="py-16 sm:py-24 border-b border-white/[0.08] bg-[#0B0C10]">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-medium tracking-[0.16em] uppercase text-[#D4AF37] mb-2">
            Buyurtma Holati
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F5F7] tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            Buyurtmangizni real vaqtda kuzating
          </h2>
          <p className="text-sm text-zinc-400 mt-3">
            Buyurtma kodini (masalan, AN-2026-1002) yoki buyurtmada ko‘rsatilgan telefon raqamingizni kiriting.
          </p>
        </div>

        {/* Tracking Search Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Kuzatuv kodi (AN-2026-1002) yoki telefon raqami..."
              aria-label="Buyurtma kodini kiriting"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#070709] border border-white/[0.1] text-sm font-mono text-[#F5F5F7] placeholder:text-zinc-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 rounded-xl bg-[#D4AF37] text-[#070709] text-sm font-semibold hover:bg-[#E7C873] transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Tekshirilmoqda...' : 'Holatni tekshirish'}
          </button>
        </form>

        {/* Quick Lookup Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-8 text-xs text-zinc-400">
          <span>Namuna kodlar:</span>
          {quickExamples.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setQuery(code);
                performTrack(code);
              }}
              className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] font-mono text-zinc-300 hover:text-[#F8E3A1] hover:border-[#D4AF37]/40 transition-colors cursor-pointer"
            >
              {code}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200 mb-6">
            {error}
          </div>
        )}

        {/* Tracking Results */}
        {searched && !loading && orders.length === 0 && !error && (
          <div className="rounded-2xl border border-white/[0.08] bg-[#111216] p-8 text-center">
            <p className="text-base font-medium text-zinc-300">
              Ushbu kod yoki telefon raqami bo‘yicha buyurtma topilmadi.
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Kodni tekshirib qayta kiriting yoki yuqoridagi namuna kodlardan birini bosing.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order) => {
            const isCancelled = order.status === 'cancelled';
            const stepIndex = PROGRESS_STEPS.findIndex((s) => s.key === order.status);

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-white/[0.08] bg-[#111216] p-6 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                  <div>
                    <p className="text-xs text-zinc-400">
                      Mijoz: {order.customerName} · {order.customerPhone}
                    </p>
                    <h3 className="font-mono text-xl font-bold text-[#F5F5F7] mt-1 tabular-nums">
                      {order.trackingCode}
                    </h3>
                  </div>
                  <div className="text-left sm:text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        isCancelled
                          ? 'text-rose-400'
                          : order.status === 'completed'
                          ? 'text-emerald-400'
                          : 'text-[#F8E3A1]'
                      }`}
                    >
                      {isCancelled ? (
                        <XCircle className="w-4 h-4" />
                      ) : order.status === 'completed' ? (
                        <ShieldCheck className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                      <span>{ORDER_STATUS_LABELS[order.status]}</span>
                    </span>
                    <p className="font-mono text-base font-bold text-[#F5F5F7] mt-1 tabular-nums">
                      {formatPriceUZS(order.totalAmount)}
                    </p>
                  </div>
                </div>

                {/* 4-Step Progress Bar */}
                {!isCancelled && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PROGRESS_STEPS.map((step, idx) => {
                      const done = idx <= stepIndex;
                      return (
                        <div
                          key={step.key}
                          className={`rounded-xl border p-3.5 ${
                            done
                              ? 'border-[#D4AF37]/50 bg-[#D4AF37]/10'
                              : 'border-white/[0.07] bg-[#070709]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono text-xs text-zinc-400 tabular-nums">
                              0{idx + 1}
                            </span>
                            {done && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                          </div>
                          <p
                            className={`text-xs font-medium ${
                              done ? 'text-[#F8E3A1]' : 'text-zinc-500'
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Ordered Plates */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-zinc-400">Buyurtmadagi raqamlar:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {order.items.map((item) => (
                      <div
                        key={item.plateId}
                        className="flex items-center justify-between rounded-lg bg-[#070709] border border-white/[0.06] px-4 py-2.5"
                      >
                        <span className="font-mono text-sm font-bold text-white tabular-nums">
                          {item.fullNumber}
                        </span>
                        <span className="font-mono text-xs text-[#D4AF37] tabular-nums">
                          {formatPriceUZS(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
