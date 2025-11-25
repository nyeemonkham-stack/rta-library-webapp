
export enum PlanName {
  Essential = 'Essential',
  Professional = 'Professional',
  Premium = 'Premium',
}

export enum Duration {
  ThreeMonths = 3,
  SixMonths = 6,
  TwelveMonths = 12,
}

export enum Country {
  Myanmar = 'Myanmar',
  Thailand = 'Thailand',
}

export enum PaymentMethod {
  KPay = 'KPay',
  ThaiBank = 'Thai Bank',
}

export enum SoftwareFormat {
    Max = '3ds Max',
    SketchUp = 'SketchUp',
    Both = 'Both 3ds Max & SketchUp'
}

export interface PriceInfo {
  monthly: number;
  total: number;
  save: number;
  bonus: string;
}

export interface Plan {
  name: PlanName;
  features: string[];
  prices: { [key in Duration]: PriceInfo };
  isPopular?: boolean;
}

// Changed name from FormData to SubscriptionFormData to avoid conflict
export interface SubscriptionFormData {
  fullName: string;
  email: string;
  phone: string;
  telegram: string;
  country: Country;
  plan: PlanName | null;
  duration: Duration;
  format: SoftwareFormat | null;
  isRtaStudent: boolean;
  screenshot: File | null;
}

export interface TelegramChannel {
    category: string;
    name: string;
    link: string;
    software: 'Max' | 'SketchUp' | 'Texture' | 'Software' | 'Megascan';
}
