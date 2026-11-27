import React from 'react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-[#070709] py-12 border-t border-white/[0.08]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <p className="font-display text-xl font-semibold text-[#F5F5F7]">
            Premium Auto Nomer
          </p>
          <p className="text-xs text-zinc-500">
            Toshkent shahri, Amir Temur shoh ko‘chasi · O‘zbekiston bo‘ylab rasmiy rasmiylashtirish
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400">
          <a href="#katalog" className="hover:text-[#F8E3A1] transition-colors">
            Katalog
          </a>
          <a href="#avtosalon" className="hover:text-[#F8E3A1] transition-colors">
            Avtosalon 3D
          </a>
          <a href="#kuzatish" className="hover:text-[#F8E3A1] transition-colors">
            Buyurtmani kuzatish
          </a>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="hover:text-[#F8E3A1] transition-colors cursor-pointer"
          >
            Admin panel
          </button>
          <span className="text-zinc-600">© 2026 Premium Auto Nomer</span>
        </div>
      </div>
    </footer>
  );
};
