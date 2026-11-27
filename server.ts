import crypto from 'crypto';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { LicensePlate, Order, OrderStatus, PlateCategory } from './src/types/plate';
import { buildSeedOrders, buildSeedPlates } from './server/seedPlates';

dotenv.config();

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin2026';

interface StoreData {
  plates: LicensePlate[];
  orders: Order[];
}

// Active admin tokens in memory (persists per server process)
const activeAdminTokens = new Set<string>();

function ensureStore(): StoreData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_FILE)) {
    const initial: StoreData = {
      plates: buildSeedPlates(),
      orders: buildSeedOrders(),
    };
    fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as StoreData;
    if (!Array.isArray(parsed.plates) || parsed.plates.length < 100) {
      const initial: StoreData = {
        plates: buildSeedPlates(),
        orders: Array.isArray(parsed.orders) ? parsed.orders : buildSeedOrders(),
      };
      fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    return parsed;
  } catch {
    const fallback: StoreData = {
      plates: buildSeedPlates(),
      orders: buildSeedOrders(),
    };
    fs.writeFileSync(STORE_FILE, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

function saveStore(data: StoreData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Admin avtorizatsiyasi talab qilinadi.' });
    return;
  }
  const token = auth.slice(7).trim();
  if (!activeAdminTokens.has(token)) {
    res.status(401).json({ error: 'Sessiya muddati tugagan. Qayta kiring.' });
    return;
  }
  next();
}

async function notifyTelegramBot(order: Order): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  const itemsText = order.items
    .map((item) => `• ${item.fullNumber} — ${item.price.toLocaleString('en-US')} so'm`)
    .join('\n');

  const text = [
    `🚘 YANGI BUYURTMA: ${order.trackingCode}`,
    `👤 Mijoz: ${order.customerName}`,
    `📞 Telefon: ${order.customerPhone}`,
    order.telegramUsername ? `✈️ Telegram: ${order.telegramUsername}` : '',
    order.note ? `📝 Izoh: ${order.note}` : '',
    '',
    '📋 Tanlangan raqamlar:',
    itemsText,
    '',
    `💰 Jami: ${order.totalAmount.toLocaleString('en-US')} so'm`,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    return resp.ok;
  } catch {
    return false;
  }
}

async function startServer() {
  let store = ensureStore();
  const app = express();
  app.use(express.json());

  // Health
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, platesCount: store.plates.length });
  });

  // Public: list all plates
  app.get('/api/plates', (_req, res) => {
    store = ensureStore();
    res.json({ plates: store.plates });
  });

  // Public: place an order
  app.post('/api/orders', async (req, res) => {
    store = ensureStore();
    const { customerName, customerPhone, telegramUsername, note, plateIds } = req.body as {
      customerName?: string;
      customerPhone?: string;
      telegramUsername?: string;
      note?: string;
      plateIds?: string[];
    };

    if (!customerName || !customerName.trim() || !customerPhone || !customerPhone.trim()) {
      res.status(400).json({ error: 'Ism va telefon raqami kiritilishi shart.' });
      return;
    }
    if (!Array.isArray(plateIds) || plateIds.length === 0) {
      res.status(400).json({ error: 'Kamida bitta davlat raqamini tanlang.' });
      return;
    }

    const selectedPlates = plateIds
      .map((id) => store.plates.find((p) => p.id === id))
      .filter((p): p is LicensePlate => Boolean(p));

    if (selectedPlates.length === 0) {
      res.status(404).json({ error: 'Tanlangan raqamlar topilmadi.' });
      return;
    }

    const unavailable = selectedPlates.find((p) => p.status === 'sold');
    if (unavailable) {
      res.status(409).json({
        error: `${unavailable.fullNumber} raqami allaqachon sotilgan.`,
      });
      return;
    }

    const nextSeq = 1001 + store.orders.length;
    const trackingCode = `AN-2026-${nextSeq}`;
    const now = new Date().toISOString();

    const order: Order = {
      id: `ord-${Date.now()}`,
      trackingCode,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      telegramUsername: telegramUsername?.trim() || undefined,
      note: note?.trim() || undefined,
      items: selectedPlates.map((p) => ({
        plateId: p.id,
        fullNumber: p.fullNumber,
        price: p.price,
        region: p.region,
        category: p.category,
      })),
      totalAmount: selectedPlates.reduce((sum, p) => sum + p.price, 0),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    store.orders.unshift(order);
    saveStore(store);

    const botDispatched = await notifyTelegramBot(order);

    res.status(201).json({ order, botDispatched });
  });

  // Public: track order by trackingCode or phone number
  app.get('/api/orders/track', (req, res) => {
    store = ensureStore();
    const query = String(req.query.q || '').trim().toLowerCase();
    if (!query) {
      res.status(400).json({ error: 'Buyurtma kodi yoki telefon raqamini kiriting.' });
      return;
    }

    const normalizedDigits = query.replace(/\D/g, '');
    const matches = store.orders.filter((ord) => {
      const codeMatch = ord.trackingCode.toLowerCase() === query;
      const phoneDigits = ord.customerPhone.replace(/\D/g, '');
      const phoneMatch = normalizedDigits.length >= 4 && phoneDigits.includes(normalizedDigits);
      return codeMatch || phoneMatch;
    });

    res.json({ orders: matches });
  });

  // Admin: login
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body as { password?: string };
    if (!password || password !== ADMIN_PASSWORD) {
      res.status(401).json({ error: 'Noto‘g‘ri parol kiritildi.' });
      return;
    }
    const token = crypto.randomBytes(24).toString('hex');
    activeAdminTokens.add(token);
    res.json({ token });
  });

  // Admin: check session
  app.get('/api/admin/me', requireAdmin, (_req, res) => {
    res.json({ authenticated: true });
  });

  // Admin: logout
  app.post('/api/admin/logout', (req, res) => {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      activeAdminTokens.delete(auth.slice(7).trim());
    }
    res.json({ ok: true });
  });

  // Admin: add new plate
  app.post('/api/plates', requireAdmin, (req, res) => {
    store = ensureStore();
    const { region, firstLetter, digits, lastLetters, price, category, isVip, featured } = req.body as {
      region?: string;
      firstLetter?: string;
      digits?: string;
      lastLetters?: string;
      price?: number;
      category?: PlateCategory;
      isVip?: boolean;
      featured?: boolean;
    };

    const cleanRegion = (region || '').trim();
    const cleanFirst = (firstLetter || '').trim().toUpperCase();
    const cleanDigits = (digits || '').trim();
    const cleanLast = (lastLetters || '').trim().toUpperCase();

    if (!/^\d{2}$/.test(cleanRegion) || !/^[A-Z]{1}$/.test(cleanFirst) || !/^\d{3}$/.test(cleanDigits) || !/^[A-Z]{2}$/.test(cleanLast)) {
      res.status(400).json({ error: 'Raqam formati noto‘g‘ri (masalan: 01 A 777 AA).' });
      return;
    }
    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      res.status(400).json({ error: 'Narx musbat son bo‘lishi kerak.' });
      return;
    }

    const fullNumber = `${cleanRegion} ${cleanFirst} ${cleanDigits} ${cleanLast}`;
    if (store.plates.some((p) => p.fullNumber === fullNumber)) {
      res.status(409).json({ error: `${fullNumber} raqami katalogda allaqachon mavjud.` });
      return;
    }

    const newPlate: LicensePlate = {
      id: `plate-${Date.now()}`,
      region: cleanRegion,
      firstLetter: cleanFirst,
      digits: cleanDigits,
      lastLetters: cleanLast,
      fullNumber,
      price: numericPrice,
      category: category || 'VIP raqamlar',
      isVip: Boolean(isVip),
      status: 'available',
      featured: Boolean(featured),
      createdAt: new Date().toISOString(),
    };

    store.plates.unshift(newPlate);
    saveStore(store);
    res.status(201).json({ plate: newPlate });
  });

  // Admin: update plate price, status, vip, category
  app.patch('/api/plates/:id', requireAdmin, (req, res) => {
    store = ensureStore();
    const { id } = req.params;
    const plate = store.plates.find((p) => p.id === id);
    if (!plate) {
      res.status(404).json({ error: 'Raqam topilmadi.' });
      return;
    }

    const { price, status, isVip, category, featured } = req.body as Partial<LicensePlate>;
    if (price !== undefined) {
      const numericPrice = Number(price);
      if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
        res.status(400).json({ error: 'Noto‘g‘ri narx qiymati.' });
        return;
      }
      plate.price = numericPrice;
    }
    if (status === 'available' || status === 'sold') {
      plate.status = status;
    }
    if (typeof isVip === 'boolean') {
      plate.isVip = isVip;
    }
    if (category) {
      plate.category = category;
    }
    if (typeof featured === 'boolean') {
      plate.featured = featured;
    }

    saveStore(store);
    res.json({ plate });
  });

  // Admin: delete plate
  app.delete('/api/plates/:id', requireAdmin, (req, res) => {
    store = ensureStore();
    const { id } = req.params;
    const index = store.plates.findIndex((p) => p.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Raqam topilmadi.' });
      return;
    }
    const [removed] = store.plates.splice(index, 1);
    saveStore(store);
    res.json({ deleted: removed });
  });

  // Admin: list all orders
  app.get('/api/orders', requireAdmin, (_req, res) => {
    store = ensureStore();
    res.json({ orders: store.orders });
  });

  // Admin: update order status (and optionally mark plates sold when completed)
  app.patch('/api/orders/:id', requireAdmin, (req, res) => {
    store = ensureStore();
    const { id } = req.params;
    const { status } = req.body as { status?: OrderStatus };
    const order = store.orders.find((o) => o.id === id);
    if (!order) {
      res.status(404).json({ error: 'Buyurtma topilmadi.' });
      return;
    }
    const validStatuses: OrderStatus[] = ['pending', 'reviewing', 'processing', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({ error: 'Noto‘g‘ri buyurtma holati.' });
      return;
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    if (status === 'completed') {
      order.items.forEach((item) => {
        const plate = store.plates.find((p) => p.id === item.plateId);
        if (plate) plate.status = 'sold';
      });
    } else if (status === 'cancelled') {
      order.items.forEach((item) => {
        const plate = store.plates.find((p) => p.id === item.plateId);
        if (plate) plate.status = 'available';
      });
    }

    saveStore(store);
    res.json({ order, plates: store.plates });
  });

  // Vite integration in dev vs static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Premium Auto Nomer server listening on http://localhost:${PORT}`);
  });
}

startServer();
