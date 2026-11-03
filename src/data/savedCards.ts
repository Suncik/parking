import { SavedCard } from '../types';

export const INITIAL_SAVED_CARDS: SavedCard[] = [
  {
    id: 'card-1',
    type: 'humo',
    number: '9860 3201 4589 4421',
    last4: '4421',
    expiry: '09/27',
    isPrimary: true,
    bankName: 'Ipak Yo\'li Banki',
  },
  {
    id: 'card-2',
    type: 'uzcard',
    number: '8600 1400 9823 9012',
    last4: '9012',
    expiry: '12/28',
    isPrimary: false,
    bankName: 'Kapitalbank',
  },
];

export const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  const parts = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }
  return parts.join(' ');
};

export const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  }
  return digits;
};

export const detectCardType = (number: string): 'humo' | 'uzcard' => {
  const clean = number.replace(/\s+/g, '');
  if (clean.startsWith('9860')) {
    return 'humo';
  }
  return 'uzcard';
};
