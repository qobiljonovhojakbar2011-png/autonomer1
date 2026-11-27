import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Send, ShoppingBag, Trash2, X } from 'lucide-react';
import { LicensePlate, Order, formatPriceUZS } from '../types/plate';
import { UzbekPlate } from './UzbekPlate';

interface CartDrawerProps {
  open: boolean;
  items: LicensePlate[];
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onOrderCreated: (order: Order) => void;
  onTrackOrder: (trackingCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  items,
  onClose,
  onRemoveItem,
  onOrderCreated,
  onTrackOrder,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+998 ');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || customerPhone.replace(/\D/g, '').length < 9) {
      setError('Iltimos, ismingiz va to‘g‘ri telefon raqamingizni kiriting.');
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          telegramUsername,
          note,
          plateIds: items.map((i) => i.id),
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || 'Buyurtmani yuborishda xatolik yuz berdi.');
        return;
      }
      setCreatedOrder(data.order);
      onOrderCreated(data.order);
      setCustomerName('');
      setCustomerPhone('+998 ');
      setTelegramUsername('');
      setNote('');
    } catch {
      setError('Server bilan aloqa o‘rnatilmadi. Qayta urinib ko‘ring.');
    } finally {
      setSubmitting(false);
    }
  };

  const buildTelegramShareUrl = (order: Order) => {
    const platesText = order.items
      .map((i) => `• ${i.fullNumber} (${formatPriceUZS(i.price)})`)
      .join('\n');
    const message = [
      `Premium Auto Nomer — Yangi buyurtma`,
      `Kod: ${order.trackingCode}`,
      `Mijoz: ${order.customerName}`,
      `Telefon: ${order.customerPhone}`,
      `Raqamlar:\n${platesText}`,
      `Jami: ${formatPriceUZS(order.totalAmount)}`,
    ].join('\n');

    return `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(message)}`;
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setCreatedOrder(null);
              onClose();
            }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Savatcha va buyurtma"
            className="relative z-10 w-full max-w-md h-full bg-[#0D0E12] border-l border-white/[0.1] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-display text-2xl font-semibold text-[#F5F5F7]">
                  Savatcha
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCreatedOrder(null);
                  onClose();
                }}
                aria-label="Savatchani yopish"
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {createdOrder ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-6 space-y-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-[#F5F5F7]">
                        Buyurtmangiz qabul qilindi
                      </h3>
                      <p className="text-sm text-zinc-300 mt-1">
                        Kuzatuv kodi:{' '}
                        <span className="font-mono font-bold text-[#F8E3A1]">
                          {createdOrder.trackingCode}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-white/[0.08] pt-4 space-y-2 text-xs text-zinc-300">
                    {createdOrder.items.map((item) => (
                      <div key={item.plateId} className="flex justify-between">
                        <span className="font-mono font-semibold text-white">
                          {item.fullNumber}
                        </span>
                        <span className="font-mono tabular-nums">
                          {formatPriceUZS(item.price)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-white/[0.08] text-sm font-semibold text-[#F8E3A1]">
                      <span>Jami summa</span>
                      <span className="font-mono tabular-nums">
                        {formatPriceUZS(createdOrder.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <a
                      href={buildTelegramShareUrl(createdOrder)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#2AABEE] text-white text-sm font-semibold hover:bg-[#229ED9] transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>Telegram orqali yuborish</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        const code = createdOrder.trackingCode;
                        setCreatedOrder(null);
                        onTrackOrder(code);
                      }}
                      className="w-full px-4 py-3 rounded-lg bg-[#D4AF37] text-[#070709] text-sm font-semibold hover:bg-[#E7C873] transition-colors cursor-pointer"
                    >
                      Buyurtma holatini kuzatish
                    </button>
                  </div>
                </div>
              ) : items.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto" />
                  <p className="text-base font-medium text-zinc-300">
                    Savatchangiz hozircha bo‘sh
                  </p>
                  <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                    Katalogdan o‘zingizga yoqqan davlat raqamini tanlang va buyurtma bering.
                  </p>
                </div>
              ) : (
                <>
                  {/* Cart Item List */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-white/[0.08] bg-[#111216] p-3.5 flex items-center justify-between gap-3"
                      >
                        <div className="w-[165px] shrink-0">
                          <UzbekPlate
                            region={item.region}
                            firstLetter={item.firstLetter}
                            digits={item.digits}
                            lastLetters={item.lastLetters}
                            size="sm"
                            interactive3D={false}
                            isVip={item.isVip}
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-right">
                          <p className="font-mono text-sm font-semibold text-[#F5F5F7] tabular-nums truncate">
                            {item.fullNumber}
                          </p>
                          <p className="font-mono text-xs text-[#D4AF37] tabular-nums mt-0.5">
                            {formatPriceUZS(item.price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`${item.fullNumber} ni olib tashlash`}
                          className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Subtotal */}
                  <div className="rounded-xl border border-white/[0.08] bg-[#111216] p-4 flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Jami to‘lov summasi</span>
                    <span className="font-mono text-lg font-bold text-[#F8E3A1] tabular-nums">
                      {formatPriceUZS(total)}
                    </span>
                  </div>

                  {/* Checkout Form */}
                  <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-sm font-semibold text-[#F5F5F7]">
                      Buyurtma ma’lumotlari
                    </h3>

                    {error && (
                      <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-200">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1.5">
                        Mijoz ismi *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Masalan: Jasurbek Tursunov"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#070709] border border-white/[0.1] text-sm text-[#F5F5F7] placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1.5">
                        Telefon raqami *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+998 90 123 45 67"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#070709] border border-white/[0.1] text-sm font-mono text-[#F5F5F7] placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1.5">
                        Telegram username (ixtiyoriy)
                      </label>
                      <input
                        type="text"
                        value={telegramUsername}
                        onChange={(e) => setTelegramUsername(e.target.value)}
                        placeholder="@username"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#070709] border border-white/[0.1] text-sm text-[#F5F5F7] placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1.5">
                        Qo‘shimcha izoh (ixtiyoriy)
                      </label>
                      <textarea
                        rows={2}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Avtomobil rusumi yoki rasmiylashtirish vaqti..."
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#070709] border border-white/[0.1] text-sm text-[#F5F5F7] placeholder:text-zinc-600 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-[#D4AF37] text-[#070709] text-sm font-semibold hover:bg-[#E7C873] transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <span>{submitting ? 'Yuborilmoqda...' : 'Buyurtmani tasdiqlash'}</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
