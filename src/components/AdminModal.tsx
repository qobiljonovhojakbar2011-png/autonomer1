import React, { useEffect, useState } from 'react';
import {
  Check,
  Lock,
  LogOut,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  LicensePlate,
  ORDER_STATUS_LABELS,
  Order,
  OrderStatus,
  PLATE_CATEGORIES,
  PlateCategory,
  UZ_REGIONS,
  formatPriceUZS,
} from '../types/plate';
import { UzbekPlate } from './UzbekPlate';

interface AdminModalProps {
  open: boolean;
  plates: LicensePlate[];
  onClose: () => void;
  onPlatesChanged: (plates: LicensePlate[]) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  open,
  plates,
  onClose,
  onPlatesChanged,
}) => {
  const [token, setToken] = useState<string>(() =>
    typeof window !== 'undefined' ? sessionStorage.getItem('pan_admin_token') || '' : ''
  );
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<'plates' | 'orders'>('plates');
  const [orders, setOrders] = useState<Order[]>([]);
  const [adminSearch, setAdminSearch] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Add new plate form state
  const [newRegion, setNewRegion] = useState('01');
  const [newFirst, setNewFirst] = useState('A');
  const [newDigits, setNewDigits] = useState('777');
  const [newLast, setNewLast] = useState('AA');
  const [newPrice, setNewPrice] = useState('150000000');
  const [newCategory, setNewCategory] = useState<PlateCategory>('VIP raqamlar');
  const [newIsVip, setNewIsVip] = useState(true);
  const [creating, setCreating] = useState(false);

  // Inline price editing map
  const [priceEdits, setPriceEdits] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open || !token) return;
    const fetchAdminData = async () => {
      try {
        const resp = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resp.status === 401) {
          sessionStorage.removeItem('pan_admin_token');
          setToken('');
          return;
        }
        const data = await resp.json();
        if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      } catch {
        // Ignore network transient errors
      }
    };
    fetchAdminData();
  }, [open, token]);

  if (!open) return null;

  const notify = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3200);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoggingIn(true);
    try {
      const resp = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setAuthError(data.error || 'Kirish rad etildi.');
        return;
      }
      sessionStorage.setItem('pan_admin_token', data.token);
      setToken(data.token);
      setPassword('');
    } catch {
      setAuthError('Server bilan aloqa o‘rnatilmadi.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    sessionStorage.removeItem('pan_admin_token');
    setToken('');
  };

  const handleCreatePlate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const resp = await fetch('/api/plates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          region: newRegion,
          firstLetter: newFirst,
          digits: newDigits,
          lastLetters: newLast,
          price: Number(newPrice),
          category: newCategory,
          isVip: newIsVip,
          featured: newIsVip,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        notify(data.error || 'Raqam qo‘shilmadi.');
        return;
      }
      onPlatesChanged([data.plate, ...plates]);
      notify(`${data.plate.fullNumber} katalogga muvaffaqiyatli qo‘shildi.`);
    } catch {
      notify('Xatolik yuz berdi.');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (plate: LicensePlate) => {
    const nextStatus = plate.status === 'available' ? 'sold' : 'available';
    const resp = await fetch(`/api/plates/${plate.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (resp.ok) {
      const data = await resp.json();
      onPlatesChanged(plates.map((p) => (p.id === plate.id ? data.plate : p)));
      notify(
        `${plate.fullNumber} holati "${nextStatus === 'sold' ? 'Sotilgan' : 'Mavjud'}" qilib o‘zgartirildi.`
      );
    }
  };

  const handleSavePrice = async (plate: LicensePlate) => {
    const rawVal = priceEdits[plate.id];
    const numeric = Number(rawVal);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      notify('Narx musbat raqam bo‘lishi kerak.');
      return;
    }
    const resp = await fetch(`/api/plates/${plate.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ price: numeric }),
    });
    if (resp.ok) {
      const data = await resp.json();
      onPlatesChanged(plates.map((p) => (p.id === plate.id ? data.plate : p)));
      setPriceEdits((prev) => {
        const next = { ...prev };
        delete next[plate.id];
        return next;
      });
      notify(`${plate.fullNumber} narxi yangilandi.`);
    }
  };

  const handleDeletePlate = async (plate: LicensePlate) => {
    const resp = await fetch(`/api/plates/${plate.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (resp.ok) {
      onPlatesChanged(plates.filter((p) => p.id !== plate.id));
      notify(`${plate.fullNumber} katalogdan o‘chirildi.`);
    }
  };

  const handleOrderStatusChange = async (orderId: string, status: OrderStatus) => {
    const resp = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (resp.ok) {
      const data = await resp.json();
      setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
      if (Array.isArray(data.plates)) {
        onPlatesChanged(data.plates);
      }
      notify(`Buyurtma holati "${ORDER_STATUS_LABELS[status]}" ga o‘zgartirildi.`);
    }
  };

  const filteredAdminPlates = plates.filter((p) => {
    const q = adminSearch.trim().toUpperCase();
    if (!q) return true;
    return p.fullNumber.toUpperCase().includes(q) || p.category.toUpperCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl border border-white/[0.12] bg-[#0D0E12] overflow-hidden">
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="font-display text-2xl font-semibold text-[#F5F5F7]">
              Admin Boshqaruv Paneli
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Chiqish</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Admin panelni yopish"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!token ? (
          <div className="p-8 sm:p-12 flex items-center justify-center">
            <form
              onSubmit={handleLogin}
              className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#111216] p-6 space-y-5"
            >
              <div>
                <h3 className="text-lg font-semibold text-[#F5F5F7]">Admin tizimiga kirish</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Raqamlar va buyurtmalarni boshqarish uchun parolni kiriting.
                </p>
              </div>

              {authError && (
                <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                  {authError}
                </div>
              )}

              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Parol</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin parolini kiriting"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#070709] border border-white/[0.1] text-sm text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                />
                <p className="text-[11px] text-zinc-500 mt-2">
                  Standart kirish paroli: <span className="font-mono text-zinc-300">admin2026</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full px-4 py-3 rounded-lg bg-[#D4AF37] text-[#070709] text-sm font-semibold hover:bg-[#E7C873] transition-colors cursor-pointer disabled:opacity-50"
              >
                {loggingIn ? 'Tekshirilmoqda...' : 'Kirish'}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Tabs + Feedback Notice */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#111216] border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setActiveTab('plates')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'plates'
                      ? 'bg-[#D4AF37] text-[#070709]'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  Raqamlar ({plates.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-[#D4AF37] text-[#070709]'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Buyurtmalar ({orders.length})</span>
                </button>
              </div>

              {actionNotice && (
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-200">
                  <Check className="w-3.5 h-3.5" />
                  <span>{actionNotice}</span>
                </div>
              )}
            </div>

            {activeTab === 'plates' ? (
              <div className="space-y-6">
                {/* Add New Plate Panel */}
                <form
                  onSubmit={handleCreatePlate}
                  className="rounded-2xl border border-white/[0.08] bg-[#111216] p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-[#F5F5F7]">
                        Yangi davlat raqami joylashtirish
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Kiritilgan raqam darhol asosiy katalogda ko‘rinadi.
                      </p>
                    </div>
                    <div className="w-56">
                      <UzbekPlate
                        region={newRegion}
                        firstLetter={newFirst.toUpperCase() || 'A'}
                        digits={newDigits.padEnd(3, '0').slice(0, 3)}
                        lastLetters={newLast.toUpperCase() || 'AA'}
                        size="sm"
                        interactive3D={false}
                        isVip={newIsVip}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Hudud</label>
                      <select
                        value={newRegion}
                        onChange={(e) => setNewRegion(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-lg bg-[#070709] border border-white/[0.1] text-xs font-mono text-white"
                      >
                        {UZ_REGIONS.map((r) => (
                          <option key={r.code} value={r.code}>
                            {r.code}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">1-harf</label>
                      <input
                        type="text"
                        maxLength={1}
                        required
                        value={newFirst}
                        onChange={(e) => setNewFirst(e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase())}
                        className="w-full px-2.5 py-2 rounded-lg bg-[#070709] border border-white/[0.1] text-xs font-mono text-white uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">3 ta raqam</label>
                      <input
                        type="text"
                        maxLength={3}
                        required
                        value={newDigits}
                        onChange={(e) => setNewDigits(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-2.5 py-2 rounded-lg bg-[#070709] border border-white/[0.1] text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">2 ta harf</label>
                      <input
                        type="text"
                        maxLength={2}
                        required
                        value={newLast}
                        onChange={(e) => setNewLast(e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase())}
                        className="w-full px-2.5 py-2 rounded-lg bg-[#070709] border border-white/[0.1] text-xs font-mono text-white uppercase"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-2">
                      <label className="block text-[11px] text-zinc-400 mb-1">Narx (so‘m)</label>
                      <input
                        type="number"
                        min={100000}
                        step={500000}
                        required
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#070709] border border-white/[0.1] text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap items-center gap-4">
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as PlateCategory)}
                        className="px-3 py-2 rounded-lg bg-[#070709] border border-white/[0.1] text-xs text-white"
                      >
                        {PLATE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>

                      <label className="inline-flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newIsVip}
                          onChange={(e) => setNewIsVip(e.target.checked)}
                          className="accent-[#D4AF37]"
                        />
                        <span>VIP toifa</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={creating}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D4AF37] text-[#070709] text-xs font-semibold hover:bg-[#E7C873] cursor-pointer disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{creating ? 'Qo‘shilmoqda...' : 'Raqam qo‘shish'}</span>
                    </button>
                  </div>
                </form>

                {/* Search & Manage Table */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      placeholder="Jadvaldan raqam qidirish (masalan: 777)..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#111216] border border-white/[0.08] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="rounded-xl border border-white/[0.08] overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#111216] border-b border-white/[0.08] text-zinc-400">
                          <th className="py-3 px-4 font-medium">Davlat raqami</th>
                          <th className="py-3 px-4 font-medium">Kategoriya</th>
                          <th className="py-3 px-4 font-medium">Narx (so‘m)</th>
                          <th className="py-3 px-4 font-medium">Holati</th>
                          <th className="py-3 px-4 font-medium text-right">Amallar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.06]">
                        {filteredAdminPlates.slice(0, 40).map((plate) => {
                          const editingPrice = priceEdits[plate.id];
                          return (
                            <tr key={plate.id} className="hover:bg-white/[0.02]">
                              <td className="py-3 px-4 font-mono font-bold text-[#F5F5F7] tabular-nums whitespace-nowrap">
                                {plate.fullNumber}
                                {plate.isVip && (
                                  <span className="ml-2 text-[10px] text-[#D4AF37] font-sans">
                                    VIP
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-zinc-300 whitespace-nowrap">
                                {plate.category}
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    value={editingPrice ?? String(plate.price)}
                                    onChange={(e) =>
                                      setPriceEdits((prev) => ({
                                        ...prev,
                                        [plate.id]: e.target.value,
                                      }))
                                    }
                                    className="w-32 px-2 py-1 rounded bg-[#070709] border border-white/[0.1] font-mono text-xs text-white tabular-nums"
                                  />
                                  {editingPrice !== undefined &&
                                    editingPrice !== String(plate.price) && (
                                      <button
                                        type="button"
                                        onClick={() => handleSavePrice(plate)}
                                        className="px-2 py-1 rounded bg-[#D4AF37] text-[#070709] font-semibold cursor-pointer"
                                      >
                                        Saqlash
                                      </button>
                                    )}
                                </div>
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(plate)}
                                  className={`px-2.5 py-1 rounded font-medium cursor-pointer border ${
                                    plate.status === 'available'
                                      ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
                                      : 'border-zinc-600 text-zinc-400 bg-white/[0.04]'
                                  }`}
                                >
                                  {plate.status === 'available' ? 'Mavjud' : 'Sotilgan'}
                                </button>
                              </td>
                              <td className="py-3 px-4 text-right whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handleDeletePlate(plate)}
                                  aria-label={`${plate.fullNumber} ni o‘chirish`}
                                  className="p-1.5 rounded text-zinc-400 hover:text-rose-400 hover:bg-white/5 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              /* Orders Management Tab */
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-sm text-zinc-400 py-8 text-center">
                    Hozircha buyurtmalar mavjud emas.
                  </p>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-xl border border-white/[0.08] bg-[#111216] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2.5 text-xs">
                          <span className="font-mono font-bold text-[#F8E3A1]">
                            {order.trackingCode}
                          </span>
                          <span className="text-zinc-500">·</span>
                          <span className="text-white font-medium">{order.customerName}</span>
                          <span className="text-zinc-500">·</span>
                          <span className="font-mono text-zinc-300">{order.customerPhone}</span>
                          {order.telegramUsername && (
                            <>
                              <span className="text-zinc-500">·</span>
                              <span className="text-[#2AABEE]">{order.telegramUsername}</span>
                            </>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          {order.items.map((item) => (
                            <span
                              key={item.plateId}
                              className="px-2 py-0.5 rounded bg-[#070709] border border-white/[0.08] font-mono text-xs text-zinc-200"
                            >
                              {item.fullNumber}
                            </span>
                          ))}
                        </div>
                        {order.note && (
                          <p className="text-xs text-zinc-400">Izoh: {order.note}</p>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                        <span className="font-mono text-sm font-bold text-[#F5F5F7] tabular-nums">
                          {formatPriceUZS(order.totalAmount)}
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleOrderStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          aria-label={`${order.trackingCode} buyurtma holati`}
                          className="px-3 py-2 rounded-lg bg-[#070709] border border-white/[0.12] text-xs font-medium text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
                        >
                          <option value="pending">Qabul qilindi</option>
                          <option value="reviewing">Tekshirilmoqda</option>
                          <option value="processing">Rasmiylashtirilmoqda</option>
                          <option value="completed">Topshirildi (Sotildi)</option>
                          <option value="cancelled">Bekor qilindi</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
