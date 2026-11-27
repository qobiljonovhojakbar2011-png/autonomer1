import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { LicensePlate, formatPriceUZS, getRegionName } from '../types/plate';
import { UzbekPlate } from './UzbekPlate';

interface HeroSectionProps {
  featuredPlates: LicensePlate[];
  totalCount: number;
  onSelectForGarage: (plate: LicensePlate) => void;
  onBuyPlate: (plate: LicensePlate) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredPlates,
  totalCount,
  onSelectForGarage,
  onBuyPlate,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const heroPlates = featuredPlates.slice(0, 5);
  const currentPlate = heroPlates[activeIndex] ?? {
    id: 'plate-001',
    region: '01',
    firstLetter: 'A',
    digits: '777',
    lastLetters: 'AA',
    fullNumber: '01 A 777 AA',
    price: 245000000,
    category: 'VIP raqamlar' as const,
    isVip: true,
    status: 'available' as const,
    createdAt: '',
  };

  return (
    <section id="top" className="relative overflow-hidden border-b border-white/[0.08]">
      {/* Cinematic Mercedes-Benz Background */}
      <div className="relative max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[600px] lg:min-h-[680px]">
          {/* Left Narrative & Interactive 3D Plate Stage */}
          <div className="lg:col-span-6 relative z-10 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-14 lg:py-20 bg-[#070709]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-7"
            >
              <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#D4AF37]">
                O‘zbekiston Eksklyuziv Kolleksiyasi
              </p>

              <h1
                className="font-display font-semibold text-[#F5F5F7] leading-[1.06] tracking-tight max-w-xl"
                style={{ fontSize: 'clamp(2.5rem, 4.3vw, 4rem)', textWrap: 'balance' }}
              >
                Avtomobilingiz maqomiga munosib <span className="gold-text-gradient">davlat raqamlari</span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-lg">
                Toshkent va barcha viloyatlar uchun saralangan VIP, GOLD, 777 hamda 001–009 toifadagi rasmiy davlat raqamlari. Tezkor rasmiylashtirish va ishonchli xizmat.
              </p>

              {/* Featured 3D Interactive Plate Preview */}
              <div className="pt-2 pb-1 space-y-4 max-w-md">
                <UzbekPlate
                  region={currentPlate.region}
                  firstLetter={currentPlate.firstLetter}
                  digits={currentPlate.digits}
                  lastLetters={currentPlate.lastLetters}
                  size="hero"
                  interactive3D
                  isVip={currentPlate.isVip}
                />

                <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-400 pt-1">
                  <span>
                    {getRegionName(currentPlate.region)} · {currentPlate.category}
                  </span>
                  <span className="font-mono font-semibold text-[#F8E3A1] tabular-nums">
                    {formatPriceUZS(currentPlate.price)}
                  </span>
                </div>

                {/* Plate Switcher Tabs */}
                {heroPlates.length > 1 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {heroPlates.map((plate, idx) => (
                      <button
                        key={plate.id}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={`px-2.5 py-1 rounded text-xs font-mono tabular-nums transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          idx === activeIndex
                            ? 'bg-white/15 text-[#F8E3A1] border border-[#D4AF37]/50'
                            : 'bg-white/[0.04] text-zinc-400 border border-white/[0.06] hover:text-white'
                        }`}
                      >
                        {plate.fullNumber}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Primary CTA + Secondary Action */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#katalog"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#D4AF37] text-[#070709] text-sm font-semibold hover:bg-[#E7C873] transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Katalogni ko‘rish ({totalCount})</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => onBuyPlate(currentPlate)}
                  disabled={currentPlate.status === 'sold'}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg border border-white/15 bg-white/[0.04] text-[#F5F5F7] text-sm font-medium hover:bg-white/[0.08] hover:border-[#D4AF37]/40 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>{currentPlate.fullNumber} ni xarid qilish</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectForGarage(currentPlate)}
                  className="text-sm font-medium text-zinc-400 hover:text-[#F8E3A1] transition-colors underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  3D Avtosalonda sinash
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Cinematic Mercedes-Benz Studio Visual */}
          <div className="lg:col-span-6 relative min-h-[340px] lg:min-h-full overflow-hidden bg-[#0B0C10]">
            <img
              src="/src/assets/images/hero_mercedes_maybach_1795777117956.jpg"
              alt="Mercedes-Benz S-Class hashamatli avtomobil"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center lg:h-full"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#070709] via-[#070709]/35 to-transparent lg:block hidden"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent"
            />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-xs text-zinc-300">
              <span>Mercedes-Benz S-Class · Kolleksiya namoyishi</span>
              <span className="font-mono text-[#E7C873] tabular-nums">01 A 777 AA</span>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Proof Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-white/[0.08] bg-[#0B0C10]">
          <div className="px-6 py-5 border-b lg:border-b-0 border-r border-white/[0.08]">
            <p className="font-mono text-2xl font-bold text-[#F5F5F7] tabular-nums">{totalCount}+</p>
            <p className="text-xs text-zinc-400 mt-1">Katalogdagi rasmiy raqamlar</p>
          </div>
          <div className="px-6 py-5 border-b lg:border-b-0 lg:border-r border-white/[0.08]">
            <p className="font-mono text-2xl font-bold text-[#F5F5F7] tabular-nums">14</p>
            <p className="text-xs text-zinc-400 mt-1">O‘zbekiston hududiy kodlari</p>
          </div>
          <div className="px-6 py-5 border-r border-white/[0.08]">
            <p className="font-mono text-2xl font-bold text-[#D4AF37] tabular-nums">100%</p>
            <p className="text-xs text-zinc-400 mt-1">YHXB orqali qonuniy o‘tkazish</p>
          </div>
          <div className="px-6 py-5">
            <p className="font-mono text-2xl font-bold text-[#F5F5F7] tabular-nums">24/7</p>
            <p className="text-xs text-zinc-400 mt-1">Tezkor Telegram buyurtma</p>
          </div>
        </div>
      </div>
    </section>
  );
};
