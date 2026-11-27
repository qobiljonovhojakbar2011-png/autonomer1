import { LicensePlate, Order, PlateCategory } from '../src/types/plate';

interface RawPlateSeed {
  region: string;
  firstLetter: string;
  digits: string;
  lastLetters: string;
  price: number;
  category: PlateCategory;
  isVip: boolean;
  status?: 'available' | 'sold';
  featured?: boolean;
}

const SIGNATURE_SEEDS: RawPlateSeed[] = [
  { region: '01', firstLetter: 'A', digits: '777', lastLetters: 'AA', price: 245000000, category: 'VIP raqamlar', isVip: true, featured: true },
  { region: '01', firstLetter: 'B', digits: '888', lastLetters: 'BB', price: 210000000, category: 'VIP raqamlar', isVip: true, featured: true },
  { region: '10', firstLetter: 'A', digits: '001', lastLetters: 'AA', price: 195000000, category: '001–009 raqamlar', isVip: true, featured: true },
  { region: '01', firstLetter: 'C', digits: '999', lastLetters: 'CC', price: 185000000, category: 'VIP raqamlar', isVip: true, featured: true },
  { region: '10', firstLetter: 'B', digits: '555', lastLetters: 'BB', price: 145000000, category: 'GOLD raqamlar', isVip: true, featured: true },
  { region: '01', firstLetter: 'D', digits: '007', lastLetters: 'DD', price: 230000000, category: '001–009 raqamlar', isVip: true, featured: true },
  { region: '01', firstLetter: 'A', digits: '111', lastLetters: 'AA', price: 175000000, category: 'Takroriy raqamlar', isVip: true, featured: true },
  { region: '30', firstLetter: 'B', digits: '777', lastLetters: 'BB', price: 165000000, category: '777 va 888 raqamlar', isVip: true, featured: true },
  { region: '75', firstLetter: 'A', digits: '888', lastLetters: 'AA', price: 138000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '01', firstLetter: 'X', digits: '777', lastLetters: 'XX', price: 260000000, category: 'VIP raqamlar', isVip: true, featured: true },
  { region: '01', firstLetter: 'Z', digits: '777', lastLetters: 'ZZ', price: 240000000, category: 'VIP raqamlar', isVip: true },
  { region: '01', firstLetter: 'M', digits: '001', lastLetters: 'MM', price: 220000000, category: 'VIP raqamlar', isVip: true },
  { region: '01', firstLetter: 'O', digits: '001', lastLetters: 'OO', price: 255000000, category: 'VIP raqamlar', isVip: true, status: 'sold' },
  { region: '01', firstLetter: 'S', digits: '777', lastLetters: 'SS', price: 198000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '01', firstLetter: 'V', digits: '888', lastLetters: 'VV', price: 192000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '01', firstLetter: 'K', digits: '007', lastLetters: 'KK', price: 188000000, category: '001–009 raqamlar', isVip: true },
  { region: '01', firstLetter: 'R', digits: '555', lastLetters: 'RR', price: 162000000, category: 'GOLD raqamlar', isVip: true },
  { region: '01', firstLetter: 'E', digits: '333', lastLetters: 'EE', price: 134000000, category: 'Takroriy raqamlar', isVip: true },
  { region: '01', firstLetter: 'F', digits: '444', lastLetters: 'FF', price: 118000000, category: 'Takroriy raqamlar', isVip: true },
  { region: '01', firstLetter: 'H', digits: '222', lastLetters: 'HH', price: 129000000, category: 'Takroriy raqamlar', isVip: true },
  { region: '01', firstLetter: 'N', digits: '666', lastLetters: 'NN', price: 112000000, category: 'Takroriy raqamlar', isVip: false },
  { region: '01', firstLetter: 'T', digits: '005', lastLetters: 'TT', price: 158000000, category: '001–009 raqamlar', isVip: true },
  { region: '01', firstLetter: 'U', digits: '008', lastLetters: 'UU', price: 149000000, category: '001–009 raqamlar', isVip: true },
  { region: '01', firstLetter: 'P', digits: '009', lastLetters: 'PP', price: 154000000, category: '001–009 raqamlar', isVip: true },
  { region: '01', firstLetter: 'G', digits: '100', lastLetters: 'GG', price: 96000000, category: 'GOLD raqamlar', isVip: false },
  { region: '01', firstLetter: 'L', digits: '200', lastLetters: 'LL', price: 89000000, category: 'GOLD raqamlar', isVip: false },
  { region: '01', firstLetter: 'Q', digits: '500', lastLetters: 'QQ', price: 92000000, category: 'GOLD raqamlar', isVip: false },
  { region: '01', firstLetter: 'Y', digits: '700', lastLetters: 'YY', price: 115000000, category: 'GOLD raqamlar', isVip: true },
  { region: '01', firstLetter: 'J', digits: '800', lastLetters: 'JJ', price: 108000000, category: 'GOLD raqamlar', isVip: true },
  { region: '01', firstLetter: 'W', digits: '900', lastLetters: 'WW', price: 121000000, category: 'GOLD raqamlar', isVip: true },
];

const CURATED_MATRIX: RawPlateSeed[] = [
  // Tashkent Region (10)
  { region: '10', firstLetter: 'C', digits: '777', lastLetters: 'CC', price: 168000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '10', firstLetter: 'D', digits: '888', lastLetters: 'DD', price: 156000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '10', firstLetter: 'E', digits: '007', lastLetters: 'EE', price: 142000000, category: '001–009 raqamlar', isVip: true },
  { region: '10', firstLetter: 'M', digits: '999', lastLetters: 'MM', price: 139000000, category: 'VIP raqamlar', isVip: true },
  { region: '10', firstLetter: 'K', digits: '111', lastLetters: 'KK', price: 114000000, category: 'Takroriy raqamlar', isVip: false },
  { region: '10', firstLetter: 'S', digits: '333', lastLetters: 'SS', price: 98000000, category: 'Takroriy raqamlar', isVip: false },
  { region: '10', firstLetter: 'N', digits: '010', lastLetters: 'NN', price: 78000000, category: 'GOLD raqamlar', isVip: false },
  { region: '10', firstLetter: 'T', digits: '070', lastLetters: 'TT', price: 64000000, category: 'SILVER raqamlar', isVip: false },
  { region: '10', firstLetter: 'R', digits: '303', lastLetters: 'RR', price: 32000000, category: 'BRONZE raqamlar', isVip: false },
  { region: '10', firstLetter: 'V', digits: '212', lastLetters: 'VV', price: 14500000, category: 'Arzon raqamlar', isVip: false },

  // Samarkand (30)
  { region: '30', firstLetter: 'A', digits: '001', lastLetters: 'AA', price: 159000000, category: '001–009 raqamlar', isVip: true },
  { region: '30', firstLetter: 'C', digits: '888', lastLetters: 'CC', price: 148000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '30', firstLetter: 'M', digits: '777', lastLetters: 'MM', price: 155000000, category: '777 va 888 raqamlar', isVip: true, status: 'sold' },
  { region: '30', firstLetter: 'D', digits: '555', lastLetters: 'DD', price: 94000000, category: 'GOLD raqamlar', isVip: false },
  { region: '30', firstLetter: 'E', digits: '007', lastLetters: 'EE', price: 132000000, category: '001–009 raqamlar', isVip: true },
  { region: '30', firstLetter: 'S', digits: '101', lastLetters: 'SS', price: 54000000, category: 'SILVER raqamlar', isVip: false },
  { region: '30', firstLetter: 'K', digits: '404', lastLetters: 'KK', price: 39000000, category: 'BRONZE raqamlar', isVip: false },
  { region: '30', firstLetter: 'T', digits: '323', lastLetters: 'TT', price: 16500000, category: 'Arzon raqamlar', isVip: false },

  // Fergana (40)
  { region: '40', firstLetter: 'A', digits: '777', lastLetters: 'AA', price: 149000000, category: 'VIP raqamlar', isVip: true },
  { region: '40', firstLetter: 'B', digits: '001', lastLetters: 'BB', price: 136000000, category: '001–009 raqamlar', isVip: true },
  { region: '40', firstLetter: 'F', digits: '888', lastLetters: 'FF', price: 128000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '40', firstLetter: 'M', digits: '444', lastLetters: 'MM', price: 76000000, category: 'Takroriy raqamlar', isVip: false },
  { region: '40', firstLetter: 'N', digits: '040', lastLetters: 'NN', price: 68000000, category: 'SILVER raqamlar', isVip: false },
  { region: '40', firstLetter: 'S', digits: '505', lastLetters: 'SS', price: 42000000, category: 'BRONZE raqamlar', isVip: false },
  { region: '40', firstLetter: 'R', digits: '242', lastLetters: 'RR', price: 13500000, category: 'Arzon raqamlar', isVip: false },

  // Namangan (50)
  { region: '50', firstLetter: 'A', digits: '777', lastLetters: 'AA', price: 141000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '50', firstLetter: 'B', digits: '888', lastLetters: 'BB', price: 129000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '50', firstLetter: 'C', digits: '005', lastLetters: 'CC', price: 91000000, category: '001–009 raqamlar', isVip: false },
  { region: '50', firstLetter: 'D', digits: '222', lastLetters: 'DD', price: 74000000, category: 'Takroriy raqamlar', isVip: false },
  { region: '50', firstLetter: 'K', digits: '050', lastLetters: 'KK', price: 59000000, category: 'SILVER raqamlar', isVip: false },
  { region: '50', firstLetter: 'L', digits: '707', lastLetters: 'LL', price: 48000000, category: 'SILVER raqamlar', isVip: false },
  { region: '50', firstLetter: 'M', digits: '313', lastLetters: 'MM', price: 24000000, category: 'BRONZE raqamlar', isVip: false },
  { region: '50', firstLetter: 'T', digits: '141', lastLetters: 'TT', price: 9800000, category: 'Arzon raqamlar', isVip: false },

  // Andijan (60)
  { region: '60', firstLetter: 'A', digits: '001', lastLetters: 'AA', price: 146000000, category: '001–009 raqamlar', isVip: true },
  { region: '60', firstLetter: 'M', digits: '777', lastLetters: 'MM', price: 138000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '60', firstLetter: 'B', digits: '999', lastLetters: 'BB', price: 119000000, category: 'GOLD raqamlar', isVip: true },
  { region: '60', firstLetter: 'D', digits: '060', lastLetters: 'DD', price: 66000000, category: 'SILVER raqamlar', isVip: false },
  { region: '60', firstLetter: 'E', digits: '808', lastLetters: 'EE', price: 52000000, category: 'SILVER raqamlar', isVip: false },
  { region: '60', firstLetter: 'F', digits: '616', lastLetters: 'FF', price: 29000000, category: 'BRONZE raqamlar', isVip: false },
  { region: '60', firstLetter: 'H', digits: '191', lastLetters: 'HH', price: 11200000, category: 'Arzon raqamlar', isVip: false },

  // Kashkadarya (70) & Surkhandarya (75)
  { region: '70', firstLetter: 'A', digits: '777', lastLetters: 'AA', price: 134000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '70', firstLetter: 'B', digits: '007', lastLetters: 'BB', price: 118000000, category: '001–009 raqamlar', isVip: true },
  { region: '70', firstLetter: 'C', digits: '555', lastLetters: 'CC', price: 82000000, category: 'GOLD raqamlar', isVip: false },
  { region: '70', firstLetter: 'D', digits: '070', lastLetters: 'DD', price: 58000000, category: 'SILVER raqamlar', isVip: false },
  { region: '70', firstLetter: 'K', digits: '272', lastLetters: 'KK', price: 27000000, category: 'BRONZE raqamlar', isVip: false },
  { region: '70', firstLetter: 'M', digits: '171', lastLetters: 'MM', price: 12800000, category: 'Arzon raqamlar', isVip: false },
  { region: '75', firstLetter: 'B', digits: '777', lastLetters: 'BB', price: 131000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '75', firstLetter: 'C', digits: '001', lastLetters: 'CC', price: 122000000, category: '001–009 raqamlar', isVip: true },
  { region: '75', firstLetter: 'D', digits: '075', lastLetters: 'DD', price: 51000000, category: 'SILVER raqamlar', isVip: false },
  { region: '75', firstLetter: 'E', digits: '515', lastLetters: 'EE', price: 22000000, category: 'BRONZE raqamlar', isVip: false },

  // Bukhara (80) & Navoi (85)
  { region: '80', firstLetter: 'A', digits: '777', lastLetters: 'AA', price: 144000000, category: 'VIP raqamlar', isVip: true },
  { region: '80', firstLetter: 'B', digits: '888', lastLetters: 'BB', price: 132000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '80', firstLetter: 'C', digits: '008', lastLetters: 'CC', price: 96000000, category: '001–009 raqamlar', isVip: false },
  { region: '80', firstLetter: 'D', digits: '080', lastLetters: 'DD', price: 62000000, category: 'SILVER raqamlar', isVip: false },
  { region: '80', firstLetter: 'M', digits: '414', lastLetters: 'MM', price: 26500000, category: 'BRONZE raqamlar', isVip: false },
  { region: '80', firstLetter: 'N', digits: '181', lastLetters: 'NN', price: 10500000, category: 'Arzon raqamlar', isVip: false },
  { region: '85', firstLetter: 'A', digits: '001', lastLetters: 'AA', price: 118000000, category: '001–009 raqamlar', isVip: true },
  { region: '85', firstLetter: 'B', digits: '777', lastLetters: 'BB', price: 116000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '85', firstLetter: 'C', digits: '333', lastLetters: 'CC', price: 69000000, category: 'Takroriy raqamlar', isVip: false },
  { region: '85', firstLetter: 'D', digits: '085', lastLetters: 'DD', price: 44000000, category: 'BRONZE raqamlar', isVip: false },

  // Khorezm (90) & Karakalpakstan (95)
  { region: '90', firstLetter: 'A', digits: '777', lastLetters: 'AA', price: 136000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '90', firstLetter: 'B', digits: '001', lastLetters: 'BB', price: 124000000, category: '001–009 raqamlar', isVip: true },
  { region: '90', firstLetter: 'M', digits: '888', lastLetters: 'MM', price: 121000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '90', firstLetter: 'D', digits: '090', lastLetters: 'DD', price: 54000000, category: 'SILVER raqamlar', isVip: false },
  { region: '90', firstLetter: 'K', digits: '919', lastLetters: 'KK', price: 28000000, category: 'BRONZE raqamlar', isVip: false },
  { region: '95', firstLetter: 'A', digits: '777', lastLetters: 'AA', price: 129000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '95', firstLetter: 'B', digits: '007', lastLetters: 'BB', price: 109000000, category: '001–009 raqamlar', isVip: true },
  { region: '95', firstLetter: 'N', digits: '095', lastLetters: 'NN', price: 49000000, category: 'SILVER raqamlar', isVip: false },
  { region: '95', firstLetter: 'R', digits: '195', lastLetters: 'RR', price: 8900000, category: 'Arzon raqamlar', isVip: false },

  // Sirdarya (20) & Jizzakh (25)
  { region: '20', firstLetter: 'A', digits: '777', lastLetters: 'AA', price: 126000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '20', firstLetter: 'B', digits: '001', lastLetters: 'BB', price: 112000000, category: '001–009 raqamlar', isVip: true },
  { region: '20', firstLetter: 'C', digits: '555', lastLetters: 'CC', price: 78000000, category: 'GOLD raqamlar', isVip: false },
  { region: '20', firstLetter: 'D', digits: '020', lastLetters: 'DD', price: 46000000, category: 'SILVER raqamlar', isVip: false },
  { region: '20', firstLetter: 'E', digits: '212', lastLetters: 'EE', price: 15200000, category: 'Arzon raqamlar', isVip: false },
  { region: '25', firstLetter: 'A', digits: '888', lastLetters: 'AA', price: 124000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '25', firstLetter: 'B', digits: '007', lastLetters: 'BB', price: 104000000, category: '001–009 raqamlar', isVip: true },
  { region: '25', firstLetter: 'C', digits: '025', lastLetters: 'CC', price: 45000000, category: 'BRONZE raqamlar', isVip: false },
  { region: '25', firstLetter: 'M', digits: '252', lastLetters: 'MM', price: 19500000, category: 'Arzon raqamlar', isVip: false },

  // Additional Tashkent (01) Silver, Bronze, Gold, 001-009, Takroriy & Arzon listings
  { region: '01', firstLetter: 'A', digits: '002', lastLetters: 'AA', price: 142000000, category: '001–009 raqamlar', isVip: true },
  { region: '01', firstLetter: 'B', digits: '003', lastLetters: 'BB', price: 138000000, category: '001–009 raqamlar', isVip: true },
  { region: '01', firstLetter: 'C', digits: '004', lastLetters: 'CC', price: 128000000, category: '001–009 raqamlar', isVip: true },
  { region: '01', firstLetter: 'E', digits: '006', lastLetters: 'EE', price: 124000000, category: '001–009 raqamlar', isVip: true },
  { region: '01', firstLetter: 'A', digits: '010', lastLetters: 'BA', price: 79000000, category: 'SILVER raqamlar', isVip: false },
  { region: '01', firstLetter: 'B', digits: '020', lastLetters: 'CA', price: 68000000, category: 'SILVER raqamlar', isVip: false },
  { region: '01', firstLetter: 'C', digits: '030', lastLetters: 'DA', price: 64000000, category: 'SILVER raqamlar', isVip: false },
  { region: '01', firstLetter: 'D', digits: '050', lastLetters: 'EA', price: 72000000, category: 'SILVER raqamlar', isVip: false },
  { region: '01', firstLetter: 'E', digits: '070', lastLetters: 'FA', price: 84000000, category: 'SILVER raqamlar', isVip: false },
  { region: '01', firstLetter: 'F', digits: '080', lastLetters: 'GA', price: 76000000, category: 'SILVER raqamlar', isVip: false },
  { region: '01', firstLetter: 'G', digits: '090', lastLetters: 'HA', price: 74000000, category: 'SILVER raqamlar', isVip: false },
  { region: '01', firstLetter: 'H', digits: '101', lastLetters: 'KA', price: 59000000, category: 'SILVER raqamlar', isVip: false },
  { region: '01', firstLetter: 'K', digits: '202', lastLetters: 'LA', price: 47000000, category: 'SILVER raqamlar', isVip: false },
  { region: '01', firstLetter: 'L', digits: '303', lastLetters: 'MA', price: 49000000, category: 'BRONZE raqamlar', isVip: false },
  { region: '01', firstLetter: 'M', digits: '404', lastLetters: 'NA', price: 44000000, category: 'BRONZE raqamlar', isVip: false },
  { region: '01', firstLetter: 'N', digits: '505', lastLetters: 'OA', price: 52000000, category: 'BRONZE raqamlar', isVip: false },
  { region: '01', firstLetter: 'P', digits: '606', lastLetters: 'PA', price: 41000000, category: 'BRONZE raqamlar', isVip: false },
  { region: '01', firstLetter: 'Q', digits: '707', lastLetters: 'QA', price: 63000000, category: 'GOLD raqamlar', isVip: false },
  { region: '01', firstLetter: 'R', digits: '808', lastLetters: 'RA', price: 61000000, category: 'GOLD raqamlar', isVip: false },
  { region: '01', firstLetter: 'S', digits: '909', lastLetters: 'SA', price: 57000000, category: 'BRONZE raqamlar', isVip: false },
  { region: '01', firstLetter: 'T', digits: '121', lastLetters: 'TA', price: 23000000, category: 'BRONZE raqamlar', isVip: false },
  { region: '01', firstLetter: 'U', digits: '232', lastLetters: 'UA', price: 18500000, category: 'Arzon raqamlar', isVip: false },
  { region: '01', firstLetter: 'V', digits: '343', lastLetters: 'VA', price: 17200000, category: 'Arzon raqamlar', isVip: false },
  { region: '01', firstLetter: 'X', digits: '454', lastLetters: 'XA', price: 16400000, category: 'Arzon raqamlar', isVip: false },
  { region: '01', firstLetter: 'Y', digits: '565', lastLetters: 'YA', price: 15800000, category: 'Arzon raqamlar', isVip: false },
  { region: '01', firstLetter: 'Z', digits: '676', lastLetters: 'ZA', price: 14900000, category: 'Arzon raqamlar', isVip: false },
  { region: '01', firstLetter: 'A', digits: '787', lastLetters: 'AB', price: 19400000, category: 'Arzon raqamlar', isVip: false },
  { region: '01', firstLetter: 'B', digits: '898', lastLetters: 'BC', price: 21000000, category: 'BRONZE raqamlar', isVip: false },
  { region: '01', firstLetter: 'C', digits: '123', lastLetters: 'CD', price: 38000000, category: 'BRONZE raqamlar', isVip: false },
  { region: '01', firstLetter: 'D', digits: '234', lastLetters: 'DE', price: 29500000, category: 'BRONZE raqamlar', isVip: false },
  { region: '01', firstLetter: 'E', digits: '345', lastLetters: 'EF', price: 26000000, category: 'BRONZE raqamlar', isVip: false },
  { region: '01', firstLetter: 'F', digits: '456', lastLetters: 'FG', price: 24500000, category: 'Arzon raqamlar', isVip: false },
  { region: '01', firstLetter: 'G', digits: '567', lastLetters: 'GH', price: 25000000, category: 'Arzon raqamlar', isVip: false },
  { region: '01', firstLetter: 'H', digits: '678', lastLetters: 'HK', price: 22500000, category: 'Arzon raqamlar', isVip: false },
  { region: '01', firstLetter: 'K', digits: '789', lastLetters: 'KL', price: 27800000, category: 'BRONZE raqamlar', isVip: false },
  { region: '01', firstLetter: 'M', digits: '717', lastLetters: 'MB', price: 34000000, category: 'BRONZE raqamlar', isVip: false },
  { region: '01', firstLetter: 'S', digits: '818', lastLetters: 'SC', price: 31500000, category: 'BRONZE raqamlar', isVip: false },
  { region: '01', firstLetter: 'A', digits: '919', lastLetters: 'AD', price: 18900000, category: 'Arzon raqamlar', isVip: false, status: 'sold' },
  { region: '10', firstLetter: 'P', digits: '777', lastLetters: 'PA', price: 122000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '01', firstLetter: 'W', digits: '888', lastLetters: 'WA', price: 135000000, category: '777 va 888 raqamlar', isVip: true },
  { region: '01', firstLetter: 'Z', digits: '555', lastLetters: 'ZA', price: 96000000, category: 'Takroriy raqamlar', isVip: false },
  { region: '01', firstLetter: 'X', digits: '333', lastLetters: 'XA', price: 88000000, category: 'Takroriy raqamlar', isVip: false },
  { region: '01', firstLetter: 'V', digits: '222', lastLetters: 'VA', price: 85000000, category: 'Takroriy raqamlar', isVip: false },
];

export function buildSeedPlates(): LicensePlate[] {
  const combined = [...SIGNATURE_SEEDS, ...CURATED_MATRIX];
  const baseTime = new Date('2026-11-20T10:00:00Z').getTime();

  return combined.map((item, idx) => ({
    id: `plate-${String(idx + 1).padStart(3, '0')}`,
    region: item.region,
    firstLetter: item.firstLetter,
    digits: item.digits,
    lastLetters: item.lastLetters,
    fullNumber: `${item.region} ${item.firstLetter} ${item.digits} ${item.lastLetters}`,
    price: item.price,
    category: item.category,
    isVip: item.isVip,
    status: item.status ?? 'available',
    featured: item.featured ?? false,
    createdAt: new Date(baseTime - idx * 3600 * 1000).toISOString(),
  }));
}

export function buildSeedOrders(): Order[] {
  return [
    {
      id: 'ord-1001',
      trackingCode: 'AN-2026-1001',
      customerName: 'Sardorbek Alimov',
      customerPhone: '+998 90 912 45 00',
      telegramUsername: '@sardor_alimov',
      note: 'Mercedes S-Class uchun rasmiylashtirish',
      items: [
        {
          plateId: 'plate-013',
          fullNumber: '01 O 001 OO',
          price: 255000000,
          region: '01',
          category: 'VIP raqamlar',
        },
      ],
      totalAmount: 255000000,
      status: 'completed',
      createdAt: '2026-11-22T09:15:00Z',
      updatedAt: '2026-11-23T14:30:00Z',
    },
    {
      id: 'ord-1002',
      trackingCode: 'AN-2026-1002',
      customerName: 'Dilshodbek Karimov',
      customerPhone: '+998 97 745 88 77',
      telegramUsername: '@dkarimov_uz',
      note: 'Samarqand YHXB orqali topshirish',
      items: [
        {
          plateId: 'plate-043',
          fullNumber: '30 M 777 MM',
          price: 155000000,
          region: '30',
          category: '777 va 888 raqamlar',
        },
      ],
      totalAmount: 155000000,
      status: 'processing',
      createdAt: '2026-11-25T16:40:00Z',
      updatedAt: '2026-11-26T11:20:00Z',
    },
  ];
}
