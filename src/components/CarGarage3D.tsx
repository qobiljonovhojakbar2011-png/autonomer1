import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ShoppingBag, Rotate3d } from 'lucide-react';
import { LicensePlate, formatPriceUZS, getRegionName } from '../types/plate';
import { UzbekPlate } from './UzbekPlate';

interface CarModel {
  id: string;
  brand: string;
  model: string;
  subtitle: string;
  image: string;
  platePositionClass: string;
}

const GARAGE_CARS: CarModel[] = [
  {
    id: 'mercedes',
    brand: 'Mercedes-Benz',
    model: 'S-Class Executive',
    subtitle: 'Obsidian Black · Gold Trim',
    image: '/src/assets/images/hero_mercedes_maybach_1795777117956.jpg',
    platePositionClass: 'bottom-6 left-6 sm:bottom-8 sm:left-8',
  },
  {
    id: 'bmw',
    brand: 'BMW',
    model: 'M8 Competition',
    subtitle: 'Matte Slate · M Carbon',
    image: '/src/assets/images/showcase_bmw_m8_1795777119189.jpg',
    platePositionClass: 'bottom-6 left-6 sm:bottom-8 sm:left-8',
  },
  {
    id: 'lamborghini',
    brand: 'Lamborghini',
    model: 'Revuelto V12',
    subtitle: 'Nero Noctis · Gold Calipers',
    image: '/src/assets/images/showcase_lamborghini_huracan_1795777119877.jpg',
    platePositionClass: 'bottom-6 left-6 sm:bottom-8 sm:left-8',
  },
  {
    id: 'chevrolet',
    brand: 'Chevrolet',
    model: 'Tahoe High Country',
    subtitle: 'Flagship SUV · Tashkent Edition',
    image: '/src/assets/images/showcase_chevrolet_tahoe_1795777119712.jpg',
    platePositionClass: 'bottom-6 left-6 sm:bottom-8 sm:left-8',
  },
];

interface CarGarage3DProps {
  selectedPlate: LicensePlate;
  quickPlates: LicensePlate[];
  cartIds: string[];
  onSelectPlate: (plate: LicensePlate) => void;
  onAddToCart: (plate: LicensePlate) => void;
}

export const CarGarage3D: React.FC<CarGarage3DProps> = ({
  selectedPlate,
  quickPlates,
  cartIds,
  onSelectPlate,
  onAddToCart,
}) => {
  const [activeCarId, setActiveCarId] = useState<string>('lamborghini');
  const [stageTilt, setStageTilt] = useState({ rx: 0, ry: 0 });
  const activeCar = GARAGE_CARS.find((c) => c.id === activeCarId) ?? GARAGE_CARS[0];
  const inCart = cartIds.includes(selectedPlate.id);

  const handleStageMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setStageTilt({
      rx: (0.5 - y) * 5,
      ry: (x - 0.5) * 7,
    });
  };

  return (
    <section
      id="avtosalon"
      className="py-16 sm:py-24 border-b border-white/[0.08] bg-[#070709]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-medium tracking-[0.16em] uppercase text-[#D4AF37] mb-2">
              3D Avtosalon Namoyishi
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F5F7] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Raqamni hashamatli avtomobilda sinab ko‘ring
            </h2>
          </div>

          {/* Car Model Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#111216] border border-white/[0.08]">
            {GARAGE_CARS.map((car) => (
              <button
                key={car.id}
                type="button"
                onClick={() => setActiveCarId(car.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  car.id === activeCarId
                    ? 'bg-[#D4AF37] text-[#070709] font-semibold'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {car.brand}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Interactive Garage Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 3D Car Canvas */}
          <div
            className="lg:col-span-8 relative"
            style={{ perspective: '1200px' }}
            onMouseMove={handleStageMove}
            onMouseLeave={() => setStageTilt({ rx: 0, ry: 0 })}
          >
            <motion.div
              animate={{ rotateX: stageTilt.rx, rotateY: stageTilt.ry }}
              transition={{ type: 'spring', stiffness: 180, damping: 24 }}
              className="relative h-[340px] sm:h-[460px] rounded-2xl overflow-hidden border border-white/[0.1] bg-[#0D0E12]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeCar.id}
                  src={activeCar.image}
                  alt={`${activeCar.brand} ${activeCar.model}`}
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover object-center"
                />
              </AnimatePresence>

              {/* Scrim for guaranteed 4.5:1 legibility */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
              />

              {/* Top-left subtle 3D indicator */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-xs text-zinc-300 bg-black/55 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <Rotate3d className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{activeCar.brand} {activeCar.model} · {activeCar.subtitle}</span>
              </div>

              {/* 3D Mounted Plate Overlay */}
              <div
                className={`absolute ${activeCar.platePositionClass} right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4`}
                style={{ transform: 'translateZ(32px)' }}
              >
                <div className="w-[240px] sm:w-[290px]">
                  <UzbekPlate
                    region={selectedPlate.region}
                    firstLetter={selectedPlate.firstLetter}
                    digits={selectedPlate.digits}
                    lastLetters={selectedPlate.lastLetters}
                    size="md"
                    interactive3D
                    isVip={selectedPlate.isVip}
                  />
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-zinc-400">Tanlangan davlat raqami</p>
                  <p className="font-mono text-base sm:text-lg font-semibold text-[#F8E3A1] tabular-nums">
                    {formatPriceUZS(selectedPlate.price)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Selection & Quick Switcher */}
          <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#111216] p-6">
            <div className="space-y-5">
              <div>
                <p className="text-xs text-zinc-400">
                  {getRegionName(selectedPlate.region)} · {selectedPlate.category}
                </p>
                <h3 className="font-mono text-2xl font-bold text-[#F5F5F7] mt-1 tabular-nums">
                  {selectedPlate.fullNumber}
                </h3>
                <p className="font-mono text-lg font-semibold text-[#D4AF37] mt-1 tabular-nums">
                  {formatPriceUZS(selectedPlate.price)}
                </p>
              </div>

              <div className="border-t border-white/[0.08] pt-4">
                <p className="text-xs font-medium text-zinc-300 mb-3">
                  Boshqa eksklyuziv raqamlarni sinang:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickPlates.slice(0, 6).map((plate) => (
                    <button
                      key={plate.id}
                      type="button"
                      onClick={() => onSelectPlate(plate)}
                      className={`px-3 py-2 rounded-lg text-xs font-mono tabular-nums text-left transition-colors cursor-pointer border ${
                        plate.id === selectedPlate.id
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37]/60 text-[#F8E3A1]'
                          : 'bg-[#0B0C10] border-white/[0.07] text-zinc-300 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {plate.fullNumber}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/[0.08] space-y-3">
              <button
                type="button"
                disabled={selectedPlate.status === 'sold'}
                onClick={() => onAddToCart(selectedPlate)}
                className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 ${
                  inCart
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-[#D4AF37] text-[#070709] hover:bg-[#E7C873]'
                }`}
              >
                {selectedPlate.status === 'sold' ? (
                  <span>Bu raqam sotilgan</span>
                ) : inCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Savatchaga qo‘shilgan</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Savatchaga qo‘shish</span>
                  </>
                )}
              </button>
              <p className="text-xs text-zinc-500 text-center">
                Rasmiy shartnoma va YHXB orqali nomingizga o‘tkazish kafolati
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
