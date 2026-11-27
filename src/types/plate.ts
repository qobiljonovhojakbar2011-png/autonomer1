export type PlateCategory =
  | 'VIP raqamlar'
  | 'GOLD raqamlar'
  | 'SILVER raqamlar'
  | 'BRONZE raqamlar'
  | '777 va 888 raqamlar'
  | '001–009 raqamlar'
  | 'Takroriy raqamlar'
  | 'Arzon raqamlar';

export type PlateStatus = 'available' | 'sold';

export type OrderStatus = 'pending' | 'reviewing' | 'processing' | 'completed' | 'cancelled';

export interface LicensePlate {
  id: string;
  region: string;       // e.g. "01", "10", "30"
  firstLetter: string;  // e.g. "A", "B", "X"
  digits: string;       // e.g. "777", "001"
  lastLetters: string;  // e.g. "AA", "BB"
  fullNumber: string;   // e.g. "01 A 777 AA"
  price: number;        // in UZS
  category: PlateCategory;
  isVip: boolean;
  status: PlateStatus;
  featured?: boolean;
  createdAt: string;
}

export interface OrderItem {
  plateId: string;
  fullNumber: string;
  price: number;
  region: string;
  category: PlateCategory;
}

export interface Order {
  id: string;
  trackingCode: string; // e.g. "AN-2026-1042"
  customerName: string;
  customerPhone: string;
  telegramUsername?: string;
  note?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export const UZ_REGIONS: { code: string; name: string }[] = [
  { code: '01', name: 'Toshkent shahri' },
  { code: '10', name: 'Toshkent viloyati' },
  { code: '20', name: 'Sirdaryo viloyati' },
  { code: '25', name: 'Jizzax viloyati' },
  { code: '30', name: 'Samarqand viloyati' },
  { code: '40', name: "Farg'ona viloyati" },
  { code: '50', name: 'Namangan viloyati' },
  { code: '60', name: 'Andijon viloyati' },
  { code: '70', name: 'Qashqadaryo viloyati' },
  { code: '75', name: 'Surxondaryo viloyati' },
  { code: '80', name: 'Buxoro viloyati' },
  { code: '85', name: 'Navoiy viloyati' },
  { code: '90', name: 'Xorazm viloyati' },
  { code: '95', name: "Qoraqalpog'iston" },
];

export const PLATE_CATEGORIES: PlateCategory[] = [
  'VIP raqamlar',
  'GOLD raqamlar',
  'SILVER raqamlar',
  'BRONZE raqamlar',
  '777 va 888 raqamlar',
  '001–009 raqamlar',
  'Takroriy raqamlar',
  'Arzon raqamlar',
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Qabul qilindi',
  reviewing: 'Tekshirilmoqda',
  processing: 'Rasmiylashtirilmoqda',
  completed: 'Topshirildi',
  cancelled: 'Bekor qilindi',
};

export function formatPriceUZS(amount: number): string {
  return new Intl.NumberFormat('uz-UZ').format(amount).replace(/,/g, ' ') + " so'm";
}

export function getRegionName(code: string): string {
  return UZ_REGIONS.find((r) => r.code === code)?.name ?? 'Hudud';
}
