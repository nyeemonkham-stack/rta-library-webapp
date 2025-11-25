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
  { category: '3ds Max', name: '3D Premium', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'Furniture Models', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'Decoration Models', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'Lighting Models', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'Kitchen Models', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'Bathroom Models', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'Doors and Windows Models', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'Tech and Music Models', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'Childroom Models', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'Models Studio Models', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'Architecture Models', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'Tree and Plants Models', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'Transport Models', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'Retail and Sport Models', link: '#', software: 'Max' },
  { category: '3ds Max', name: 'People and Animal Models', link: '#', software: 'Max' },

  // SketchUp List
  { category: 'SketchUp', name: 'Model Studio SU Models', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'People and Animals SU Models', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Doors & Windows SU Models', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Bathroom SU Models', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Furniture SU Models', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Decoration SU Models', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Architecture SU Models', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Transport SU Models', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Tech and Music SU Models', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Kitchen SU Models', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Lighting SU Models', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Tree and Plants SU Models', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Retail and Sport SU Models', link: '#', software: 'SketchUp' },
  { category: 'SketchUp', name: 'Childroom SU Models', link: '#', software: 'SketchUp' },

  // Extras
  { category: 'Textures', name: 'Premium Texture Library', link: '#', software: 'Texture' },
  { category: 'Software', name: 'Software Library - Archviz', link: '#', software: 'Software' },
  { category: 'Megascan', name: 'Megascan Library for Archviz', link: '#', software: 'Megascan' },
];
