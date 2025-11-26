import { Plan, PlanName, Duration, TelegramChannel } from './types';

export const PLANS: Plan[] = [
  {
    name: PlanName.Essential,
    features: [
      'Interior Models',
      'Exterior Models',
      '3ds Max or SketchUp',
      'Model Studio (+$5 Value Saved)',
    ],
    prices: {
      [Duration.ThreeMonths]: { monthly: 2, total: 6, save: 0, bonus: 'Get the Lowest Launch Price' },
      [Duration.SixMonths]: { monthly: 2, total: 10, save: 2, bonus: '1 Month FREE' },
      [Duration.TwelveMonths]: { monthly: 2, total: 20, save: 4, bonus: '2 Month FREE - Free Library Management Class (Worth $30)' },
    },
  },
  {
    name: PlanName.Professional,
    isPopular: true,
    features: [
      'Interior Models',
      'Exterior Models',
      '3ds Max or SketchUp',
      'Model Studio (+$5 Value Saved)',
      'Texture Library',
    ],
    prices: {
      [Duration.ThreeMonths]: { monthly: 3, total: 9, save: 0, bonus: 'Get the Lowest Launch Price' },
      [Duration.SixMonths]: { monthly: 3, total: 15, save: 3, bonus: '1 Month FREE' },
      [Duration.TwelveMonths]: { monthly: 3, total: 30, save: 6, bonus: '2 Month FREE - Free Library Management Class (Worth $30)' },
    },
  },
  {
    name: PlanName.Premium,
    features: [
      'Interior Models',
      'Exterior Models',
      'Both 3ds Max & SketchUp',
      'Model Studio (+$5 Value Saved)',
      'Texture Library',
      'Software Library FREE',
    ],
    prices: {
      [Duration.ThreeMonths]: { monthly: 5, total: 15, save: 0, bonus: 'Get the Lowest Launch Price' },
      [Duration.SixMonths]: { monthly: 5, total: 25, save: 5, bonus: '1 Month FREE' },
      [Duration.TwelveMonths]: { monthly: 5, total: 50, save: 10, bonus: '2 Month FREE - Free Library Management Class (Worth $30)' },
    },
  },
];

export const CURRENCY_RATES = {
  MMK: 4000,
  THB: 36,
};

export const BANK_DETAILS = {
  MMK: 'KBZPay: 09798886653 (Kyaw Kyaw Nyein)',
  THB: 'KBank: 664-8-47412-2 (MR. KYAW KYAW NYEIN)',
};

export const TELEGRAM_CHANNELS: TelegramChannel[] = [
  // 3ds Max List
  { category: '3ds Max', name: 'Furniture Models', link: 'https://t.me/+kKludYZah4s1ZTU1', software: 'Max' },
  { category: '3ds Max', name: 'Decoration Models', link: 'https://t.me/+Iw-k_hgquKw1NjE9', software: 'Max' },
  { category: '3ds Max', name: 'Lighting Models', link: 'https://t.me/+Z9CMWw1Av5tiNThl', software: 'Max' },
  { category: '3ds Max', name: 'Kitchen Models', link: 'https://t.me/+Z-NrRs_L7ZY1NDZl', software: 'Max' },
  { category: '3ds Max', name: 'Bathroom Models', link: 'https://t.me/+Y1nQ_Snq0200YzA1', software: 'Max' },
  { category: '3ds Max', name: 'Doors and Windows Models', link: 'https://t.me/+0bqoDWrsCWk2NzQ1', software: 'Max' },
  { category: '3ds Max', name: 'Tech and Music Models', link: 'https://t.me/+Egn3HFMT8WRjOTBl', software: 'Max' },
  { category: '3ds Max', name: 'Childroom Models', link: 'https://t.me/+S8QEZcntrHdlMzc1', software: 'Max' },
  { category: '3ds Max', name: 'Models Studio Models', link: 'https://t.me/+HFMkK7hWu0E4OTM9', software: 'Max' },
  { category: '3ds Max', name: 'Architecture Models', link: 'https://t.me/+Fl5uePhWNDxmOGY1', software: 'Max' },
  { category: '3ds Max', name: 'Tree and Plants Models', link: 'https://t.me/+sw2ZOLRDf65lNzM1', software: 'Max' },
  { category: '3ds Max', name: 'Transport Models', link: 'https://t.me/+isCr9Ma7YCY5Yzc1', software: 'Max' },
  { category: '3ds Max', name: 'Retail and Sport Models', link: 'https://t.me/+xBgytFIL0Uw2MmM1', software: 'Max' },
  { category: '3ds Max', name: 'People and Animal Models', link: 'https://t.me/+YQPMDW8Uv4c5ZTE1', software: 'Max' },

  // SketchUp List
  { category: 'SketchUp', name: 'Model Studio SU Models', link: 'https://t.me/+38ss1I5muNA4N2I1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'People and Animals SU Models', link: 'https://t.me/+IXPNrp4OUbw3NzQ1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Doors & Windows SU Models', link: 'https://t.me/+P30vSBo0F0ExOGM1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Bathroom SU Models', link: 'https://t.me/+9EFqajKIpRk0ZmM1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Furniture SU Models', link: 'https://t.me/+OepGcLQ1uo45ZGRl', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Decoration SU Models', link: 'https://t.me/+6Z4-Ek3lb6ZiM2I1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Architecture SU Models', link: 'https://t.me/+jfudYlDbPvc0NTJl', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Transport SU Models', link: 'https://t.me/+wHeah4bnM1c5NTA1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Tech and Music SU Models', link: 'https://t.me/+GX5CAQgx0a8yZDc1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Kitchen SU Models', link: 'https://t.me/+Hw_rf6ch0a1hNmU9', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Lighting SU Models', link: 'https://t.me/+_Oze5NcJQGk2ZWI1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Tree and Plants SU Models', link: 'https://t.me/+d9IJjPUxQOo4NzI1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Retail and Sport SU Models', link: 'https://t.me/+WuUjSf5lVS1jNWU1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Childroom SU Models', link: 'https://t.me/+TcocTnTR0Q5lOTNl', software: 'SketchUp' },

  // Extras
  { category: 'Textures', name: 'Premium Texture Library', link: 'https://t.me/+3D1TpiGx8lkyNDU9', software: 'Texture' },
  { category: 'Software', name: 'Software Library - Archviz', link: 'https://t.me/+EigHzPWXiisyZWNl', software: 'Software' },
  { category: 'Megascan', name: 'Megascan Library for Archviz', link: 'https://t.me/+tEIgvAcol8ViYTdl', software: 'Megascan' },
];
