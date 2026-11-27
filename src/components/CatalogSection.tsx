import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import {
  LicensePlate,
  PLATE_CATEGORIES,
  PlateCategory,
  UZ_REGIONS,
  formatPriceUZS,
  getRegionName,
} from '../types/plate';
import { UzbekPlate } from './UzbekPlate';

interface CatalogSectionProps {
  plates: LicensePlate[];
  loading: boolean;
  cartIds: string[];
  onBuyNow: (plate: LicensePlate) => void;
  onAddToCart: (plate: LicensePlate) => void;
  onPreviewInGarage: (plate: LicensePlate) => void;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc';
type StatusFilter = 'all' | 'available' | 'sold';

const ITEMS_PER_PAGE = 18;

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  plates,
  loading,
  cartIds,
  onBuyNow,
  onAddToCart,
  onPreviewInGarage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<PlateCategory | 'all'>('all');
  const [vipOnly, setVipOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [page, setPage] = useState(1);

  const filteredPlates = useMemo(() => {
    const q = searchQuery.trim().toUpperCase().replace(/\s+/g, '');
    const list = plates.filter((plate) => {
      if (selectedRegion !== 'all' && plate.region !== selectedRegion) return false;
      if (selectedCategory !== 'all' && plate.category !== selectedCategory) return false;
      if (vipOnly && !plate.isVip) return false;
      if (statusFilter !== 'all' && plate.status !== statusFilter) return false;
      if (q) {
        const compactFull = plate.fullNumber.replace(/\s+/g, '').toUpperCase();
        const compactLetters = `${plate.firstLetter}${plate.lastLetters}`.toUpperCase();
        const matches =
          compactFull.includes(q) ||
          plate.digits.includes(q) ||
          plate.region.includes(q) ||
          compactLetters.includes(q);
        if (!matches) return false;
      }
      return true;
    });

    const sorted = [...list];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      sorted.sort((a, b) => {
        if (a.status !== b.status) return a.status === 'available' ? -1 : 1;
        if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
        return b.price - a.price;
      });
    }
    return sorted;
  }, [plates, searchQuery, selectedRegion, selectedCategory, vipOnly, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredPlates.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginatedPlates = filteredPlates.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRegion('all');
    setSelectedCategory('all');
    setVipOnly(false);
    setStatusFilter('all');
    setSortBy('featured');
    setPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedRegion !== 'all' ||
    selectedCategory !== 'all' ||
    vipOnly ||
    statusFilter !== 'all' ||
    sortBy !== 'featured';

  return (
    <section id="katalog" className="py-16 sm:py-24 border-b border-white/[0.08] bg-[#070709]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-medium tracking-[0.16em] uppercase text-[#D4AF37] mb-2">
              To‘liq Raqamlar Katalogi
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F5F7] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Barcha mavjud davlat raqamlari
            </h2>
          </div>
          <p className="text-sm text-zinc-400 tabular-nums">
            Ko‘rsatilmoqda: <span className="text-[#F5F5F7] font-semibold">{filteredPlates.length}</span> / {plates.length} ta raqam
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#111216] p-4 sm:p-5 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search by number / digits / letters */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Raqam, harf yoki son kiriting (masalan: 777, 01 A, BB)..."
                aria-label="Raqam bo‘yicha qidirish"
                className="w-full pl-10 pr-9 py-2.5 rounded-lg bg-[#070709] border border-white/[0.1] text-sm text-[#F5F5F7] placeholder:text-zinc-500 focus:outline-none focus:border-[#D4AF37]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setPage(1);
                  }}
                  aria-label="Qidiruvni tozalash"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Region Code Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setPage(1);
                }}
                aria-label="Viloyat kodi bo‘yicha saralash"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#070709] border border-white/[0.1] text-sm text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">Barcha viloyatlar (01–95)</option>
                {UZ_REGIONS.map((reg) => (
                  <option key={reg.code} value={reg.code}>
                    {reg.code} — {reg.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Sort */}
            <div className="md:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  setPage(1);
                }}
                aria-label="Narx bo‘yicha saralash"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#070709] border border-white/[0.1] text-sm text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="featured">Ommabop</option>
                <option value="price-asc">Arzonroqdan</option>
                <option value="price-desc">Qimmatroqdan</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="md:col-span-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as StatusFilter);
                  setPage(1);
                }}
                aria-label="Holat bo‘yicha filtrlash"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#070709] border border-white/[0.1] text-sm text-[#F5F5F7] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">Barcha holatlar</option>
                <option value="available">Faqat mavjud</option>
                <option value="sold">Sotilganlar</option>
              </select>
            </div>
          </div>

          {/* Categories + VIP Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#D4AF37] text-[#070709] font-semibold'
                    : 'bg-[#070709] text-zinc-300 border border-white/[0.08] hover:text-white'
                }`}
              >
                Barchasi
              </button>
              {PLATE_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === category
                      ? 'bg-[#D4AF37] text-[#070709] font-semibold'
                      : 'bg-[#070709] text-zinc-300 border border-white/[0.08] hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setVipOnly((prev) => !prev);
                  setPage(1);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                  vipOnly
                    ? 'bg-[#D4AF37]/20 text-[#F8E3A1] border-[#D4AF37]/60'
                    : 'bg-[#070709] text-zinc-300 border-white/[0.08] hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Faqat VIP</span>
              </button>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Tozalash</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-56 rounded-2xl border border-white/[0.08] bg-[#111216] animate-pulse"
              />
            ))}
          </div>
        ) : paginatedPlates.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-white/[0.08] bg-[#111216] py-16 px-6 text-center space-y-4">
            <p className="font-display text-2xl text-[#F5F5F7]">
              Qidiruv bo‘yicha raqam topilmadi
            </p>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Boshqa raqam kombinatsiyasini kiriting yoki filtrlarni bekor qilib barcha 120 ta raqamni ko‘ring.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-lg bg-[#D4AF37] text-[#070709] text-sm font-semibold hover:bg-[#E7C873] transition-colors cursor-pointer"
            >
              Filtrlarni tozalash
            </button>
          </div>
        ) : (
          /* 3-Column Product Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPlates.map((plate) => {
              const inCart = cartIds.includes(plate.id);
              const isSold = plate.status === 'sold';

              return (
                <motion.article
                  key={plate.id}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#111216] p-5 hover:border-[#D4AF37]/40 transition-colors"
                >
                  <div>
                    {/* Clean Zero-Pill Metadata Line */}
                    <div className="flex items-center justify-between gap-2 text-xs text-zinc-400 mb-4">
                      <span className="truncate">
                        {plate.region} {getRegionName(plate.region)} · {plate.category}
                      </span>
                      {plate.isVip && (
                        <span className="font-semibold text-[#D4AF37] tracking-wider uppercase shrink-0">
                          VIP
                        </span>
                      )}
                    </div>

                    {/* Authentic License Plate Graphic */}
                    <div className="py-2">
                      <UzbekPlate
                        region={plate.region}
                        firstLetter={plate.firstLetter}
                        digits={plate.digits}
                        lastLetters={plate.lastLetters}
                        size="md"
                        interactive3D={!isSold}
                        isVip={plate.isVip}
                      />
                    </div>
                  </div>

                  {/* Price, Status & Actions */}
                  <div className="pt-5 mt-4 border-t border-white/[0.06] space-y-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-mono text-lg font-bold text-[#F5F5F7] tabular-nums">
                        {formatPriceUZS(plate.price)}
                      </p>
                      <span
                        className={`text-xs font-medium whitespace-nowrap ${
                          isSold ? 'text-zinc-500' : 'text-emerald-400'
                        }`}
                      >
                        {isSold ? 'Sotilgan' : 'Mavjud'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isSold}
                        onClick={() => onBuyNow(plate)}
                        className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          isSold
                            ? 'bg-white/[0.05] text-zinc-400'
                            : 'bg-[#D4AF37] text-[#070709] hover:bg-[#E7C873]'
                        }`}
                      >
                        {isSold ? 'Band qilingan' : 'Sotib olish'}
                      </button>

                      <button
                        type="button"
                        disabled={isSold}
                        onClick={() => onAddToCart(plate)}
                        aria-label={`${plate.fullNumber} ni savatchaga qo‘shish`}
                        title="Savatchaga qo‘shish"
                        className={`p-2.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          inCart
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                            : 'bg-[#070709] border-white/[0.1] text-zinc-300 hover:text-white hover:border-white/25'
                        }`}
                      >
                        {inCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => onPreviewInGarage(plate)}
                        aria-label={`${plate.fullNumber} ni avtomobilda ko‘rish`}
                        title="3D Avtosalonda ko‘rish"
                        className="p-2.5 rounded-lg bg-[#070709] border border-white/[0.1] text-zinc-300 hover:text-[#F8E3A1] hover:border-[#D4AF37]/40 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-6">
            <p className="text-xs text-zinc-400 tabular-nums">
              Sahifa {safePage} / {totalPages}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#111216] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Oldingi</span>
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pNum = idx + 1;
                return (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => {
                      setPage(pNum);
                      document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-8 h-8 rounded-lg text-xs font-mono tabular-nums transition-colors cursor-pointer ${
                      pNum === safePage
                        ? 'bg-[#D4AF37] text-[#070709] font-bold'
                        : 'bg-[#111216] text-zinc-400 border border-white/[0.08] hover:text-white'
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => {
                  setPage((p) => Math.min(totalPages, p + 1));
                  document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#111216] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white disabled:opacity-40 cursor-pointer"
              >
                <span>Keyingi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
