import React, { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070709]/85 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#F5F5F7] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded"
        >
          Premium Auto Nomer
        </a>

        {/* Zone 2: 4 Concise Single-Line Navigation Links */}
        <nav
          aria-label="Asosiy navigatsiya"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300"
        >
          <a
            href="#katalog"
            className="hover:text-[#F8E3A1] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#D4AF37]/60"
          >
            Katalog
          </a>
          <a
            href="#avtosalon"
            className="hover:text-[#F8E3A1] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#D4AF37]/60"
          >
            Avtosalon 3D
          </a>
          <a
            href="#kuzatish"
            className="hover:text-[#F8E3A1] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#D4AF37]/60"
          >
            Kuzatish
          </a>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="hover:text-[#F8E3A1] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#D4AF37]/60 cursor-pointer"
          >
            Admin
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37] text-[#070709] text-sm font-semibold hover:bg-[#E7C873] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F8E3A1]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Savatcha</span>
            {cartCount > 0 && (
              <span className="tabular-nums font-mono text-xs font-bold bg-[#070709] text-[#F8E3A1] px-1.5 py-0.5 rounded">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Menyuni yopish' : 'Menyuni ochish'}
            className="md:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0B0C10] px-4 py-3 flex flex-col gap-2">
          <a
            href="#katalog"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2.5 text-sm font-medium text-zinc-200 hover:text-[#F8E3A1] rounded-lg hover:bg-white/5"
          >
            Katalog
          </a>
          <a
            href="#avtosalon"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2.5 text-sm font-medium text-zinc-200 hover:text-[#F8E3A1] rounded-lg hover:bg-white/5"
          >
            Avtosalon 3D
          </a>
          <a
            href="#kuzatish"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2.5 text-sm font-medium text-zinc-200 hover:text-[#F8E3A1] rounded-lg hover:bg-white/5"
          >
            Kuzatish
          </a>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdmin();
            }}
            className="text-left px-3 py-2.5 text-sm font-medium text-zinc-200 hover:text-[#F8E3A1] rounded-lg hover:bg-white/5 cursor-pointer"
          >
            Admin
          </button>
        </div>
      )}
    </header>
  );
};
