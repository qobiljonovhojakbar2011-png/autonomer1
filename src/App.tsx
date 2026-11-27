import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminModal } from './components/AdminModal';
import { CarGarage3D } from './components/CarGarage3D';
import { CartDrawer } from './components/CartDrawer';
import { CatalogSection } from './components/CatalogSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LuxuryIntroLoader } from './components/LuxuryIntroLoader';
import { OrderTrackingSection } from './components/OrderTrackingSection';
import { LicensePlate, Order } from './types/plate';

export default function App() {
  const [plates, setPlates] = useState<LicensePlate[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [cartIds, setCartIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pan_cart_ids');
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [garagePlateId, setGaragePlateId] = useState<string>('plate-001');
  const [trackingQuery, setTrackingQuery] = useState<string>('');
  const [recentTrackingCodes, setRecentTrackingCodes] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }, []);

  const fetchPlates = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const resp = await fetch('/api/plates');
      if (!resp.ok) throw new Error('Katalog yuklanmadi');
      const data = await resp.json();
      setPlates(Array.isArray(data.plates) ? data.plates : []);
    } catch {
      setLoadError('Ma’lumotlarni yuklashda xatolik yuz berdi. Sahifani yangilang.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlates();
  }, [fetchPlates]);

  useEffect(() => {
    try {
      localStorage.setItem('pan_cart_ids', JSON.stringify(cartIds));
    } catch {
      // Ignore storage errors
    }
  }, [cartIds]);

  const cartItems = useMemo(
    () =>
      cartIds
        .map((id) => plates.find((p) => p.id === id))
        .filter((p): p is LicensePlate => p !== undefined)
        .filter((p) => p.status === 'available'),
    [cartIds, plates]
  );

  const featuredPlates = useMemo(
    () => plates.filter((p) => p.featured || p.isVip).slice(0, 8),
    [plates]
  );

  const garageSelectedPlate = useMemo(
    () =>
      plates.find((p) => p.id === garagePlateId) ??
      plates[0] ?? {
        id: 'plate-001',
        region: '01',
        firstLetter: 'A',
        digits: '777',
        lastLetters: 'AA',
        fullNumber: '01 A 777 AA',
        price: 245000000,
        category: 'VIP raqamlar',
        isVip: true,
        status: 'available',
        createdAt: '',
      },
    [plates, garagePlateId]
  );

  const handleAddToCart = (plate: LicensePlate) => {
    if (plate.status === 'sold') return;
    if (!cartIds.includes(plate.id)) {
      setCartIds((prev) => [...prev, plate.id]);
      showToast(`${plate.fullNumber} savatchaga qo‘shildi`);
    } else {
      setCartOpen(true);
    }
  };

  const handleBuyNow = (plate: LicensePlate) => {
    if (plate.status === 'sold') return;
    if (!cartIds.includes(plate.id)) {
      setCartIds((prev) => [...prev, plate.id]);
    }
    setCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCartIds((prev) => prev.filter((itemId) => itemId !== id));
  };

  const handlePreviewInGarage = (plate: LicensePlate) => {
    setGaragePlateId(plate.id);
    document.getElementById('avtosalon')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOrderCreated = (order: Order) => {
    setCartIds([]);
    setRecentTrackingCodes((prev) => [order.trackingCode, ...prev]);
  };

  const handleTrackOrder = (trackingCode: string) => {
    setCartOpen(false);
    setTrackingQuery(trackingCode);
    document.getElementById('kuzatish')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#F5F5F7]">
      <LuxuryIntroLoader />

      <Header
        cartCount={cartItems.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {loadError && (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 flex items-center justify-between gap-4 text-sm text-rose-200">
            <span>{loadError}</span>
            <button
              type="button"
              onClick={fetchPlates}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/20 cursor-pointer"
            >
              Qayta urinish
            </button>
          </div>
        </div>
      )}

      <main>
        <HeroSection
          featuredPlates={featuredPlates}
          totalCount={plates.length}
          onSelectForGarage={handlePreviewInGarage}
          onBuyPlate={handleBuyNow}
        />

        <CarGarage3D
          selectedPlate={garageSelectedPlate}
          quickPlates={featuredPlates.length > 0 ? featuredPlates : plates}
          cartIds={cartIds}
          onSelectPlate={(plate) => setGaragePlateId(plate.id)}
          onAddToCart={handleAddToCart}
        />

        <CatalogSection
          plates={plates}
          loading={loading}
          cartIds={cartIds}
          onBuyNow={handleBuyNow}
          onAddToCart={handleAddToCart}
          onPreviewInGarage={handlePreviewInGarage}
        />

        <OrderTrackingSection
          initialQuery={trackingQuery}
          recentTrackingCodes={recentTrackingCodes}
        />
      </main>

      <Footer onOpenAdmin={() => setAdminOpen(true)} />

      <CartDrawer
        open={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onRemoveItem={handleRemoveFromCart}
        onOrderCreated={handleOrderCreated}
        onTrackOrder={handleTrackOrder}
      />

      <AdminModal
        open={adminOpen}
        plates={plates}
        onClose={() => setAdminOpen(false)}
        onPlatesChanged={setPlates}
      />

      {/* Subtle Toast Feedback */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl bg-[#111216] border border-[#D4AF37]/50 text-xs font-medium text-[#F8E3A1] shadow-2xl"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
