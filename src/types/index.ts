export type ParkingStatus = 'free' | 'warning' | 'full';

export type SpotType = 'standard' | 'ev' | 'disabled';
export type SpotStatus = 'free' | 'occupied' | 'reserved';

export interface ParkingSpot {
  id: string;
  code: string;
  floor: string;
  type: SpotType;
  status: SpotStatus;
  vehiclePlate?: string;
}

export interface ParkingZone {
  id: string;
  codeNumber: number; // e.g., 1 for "Parking #1"
  displayName: string; // "Parking #1"
  name: string; // "Amir Temur xiyoboni"
  district: string;
  address: string;
  distance: string; // "1.2 km"
  distanceMeters: number; // 1200
  hourlyRate: number; // in UZS (so'm), e.g. 5000
  totalSpots: number; // 50
  occupiedSpots: number; // 36 -> 14 free
  status: ParkingStatus;
  image: string;
  coordinates: { x: number; y: number }; // Percentage for interactive map canvas
  features: string[];
  operatingHours: string;
  spots: ParkingSpot[];
}

export interface ActiveSession {
  id: string;
  zoneId: string;
  zoneName: string;
  spotCode: string;
  vehiclePlate: string;
  startTime: number; // timestamp
  durationMinutes: number;
  hourlyRate: number;
  paymentMethod: 'payme' | 'click' | 'uzum' | 'humo_uzcard';
  totalPaid: number;
  status: 'active' | 'completed';
}

export type MainTabType = 'map' | 'booking' | 'history' | 'profile';

export interface SavedCard {
  id: string;
  type: 'humo' | 'uzcard';
  number: string; // e.g. "9860 1234 5678 4421" or "8600 1234 5678 9012"
  last4: string; // "4421"
  expiry: string; // "09/27"
  isPrimary: boolean;
  bankName: string;
}
