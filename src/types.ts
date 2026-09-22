export type UserRole = 'guest' | 'verified_curator';

export type CatStatus = 
  | 'osvv' // Стерилизован / ОСВВ (метка на ухе)
  | 'adoptable' // Ищет дом
  | 'sos' // Нужна медпомощь (SOS)
  | 'foster' // На передержке
  | 'resident'; // Местный житель (сыт, есть опекун)

export type InfraType =
  | 'shelter' // Теплый котодомик / зимнее убежище
  | 'feeder' // Точка кормления
  | 'pet_friendly' // Pet-friendly заведение (кафе/магазин где пускают греться)
  | 'vet_clinic'; // Партнерская ветклиника

export type SamaraDistrict = 
  | 'Ленинский'
  | 'Самарский'
  | 'Октябрьский'
  | 'Промышленный'
  | 'Кировский (Безымянка)'
  | 'Железнодорожный'
  | 'Советский'
  | 'Красноглинский';

export interface CatProfile {
  id: string;
  name: string;
  aliases: string[];
  district: SamaraDistrict;
  addressApprox: string; // e.g., "Двор купцов Шихобаловых, ул. Венцека"
  // Real coordinates (only visible to verified curators)
  realCoords: [number, number];
  // Fuzzed coordinates (visible to public / guests with 80-150m noise)
  fuzzedCoords: [number, number];
  status: CatStatus;
  estimatedAge: string;
  gender: 'male' | 'female' | 'unknown';
  coat: string; // Окрас
  specialMarks: string[]; // Особые приметы (обрезанное ушко, белая лапка)
  temperament: ('friendly' | 'shy' | 'strict' | 'wet_food_lover' | 'calm')[];
  photos: string[];
  sightingsCount: number;
  lastSeen: string;
  hasCurator: boolean;
  curatorName?: string;
  healthNotes?: string;
  dietRecommendation?: string;
  feedingSchedule?: {
    morning: { time: string; volunteer: string; status: 'done' | 'pending' };
    evening: { time: string; volunteer: string; status: 'done' | 'pending' };
  };
  sosReason?: string;
  shelterQrCode?: string;
  weightKg?: number;
  sterilizedInfo?: string;
  vaccinationInfo?: string;
  parasiteControl?: string;
  microchipNumber?: string;
  assignedShelterId?: string;
  assignedShelterName?: string;
  adoptionStory?: string;
  sightingsHistory?: Array<{
    id: string;
    date: string;
    time: string;
    author: string;
    condition: 'active' | 'resting' | 'eating' | 'alert';
    note: string;
  }>;
  treatmentStatus?: {
    clinicId?: string;
    clinicName: string;
    stage: 'examination' | 'surgery' | 'rehabilitation' | 'ready_for_discharge';
    diagnosis: string;
    admissionDate: string;
    targetFund?: string;
    billAccount?: string;
    estimatedCost?: number;
    collectedAmount?: number;
  };
}

export type ClinicWorkloadStatus = 
  | 'open_admission'      // Свободный прием / дежурный врач свободен
  | 'by_appointment'     // Принимает по записи
  | 'busy'               // Загружена / очередь
  | 'emergency_only'     // Только экстренные / травмы
  | 'closed';            // Закрыта

export interface ClinicLiveStatus {
  workload: ClinicWorkloadStatus;
  label: string; // e.g. "Принимает по записи" | "Загружена" | "Свободный прием"
  queueEstimateMinutes?: number;
  freeSurgeon?: boolean;
  freeOsvvSlotsToday?: number;
  updatedAt: string;
  notice?: string;
  // Visual capacity metrics
  totalBeds?: number; // Total capacity / inpatient hospital boxes
  occupiedBeds?: number; // Occupied beds
}

export interface InfraPoint {
  id: string;
  name: string;
  type: InfraType;
  district: SamaraDistrict;
  coords: [number, number];
  description: string;
  address: string;
  capacity?: number;
  isWinterHeated?: boolean;
  residentsCatIds?: string[];
  contactPhone?: string;
  curatorContact?: string;
  qrCodeId?: string;
  clinicStatus?: ClinicLiveStatus;
}

export interface SosTicket {
  id: string;
  title: string;
  catId?: string;
  catName?: string;
  district: SamaraDistrict;
  priority: 'urgent' | 'high' | 'medium';
  category: 'injury' | 'trapping_osvv' | 'winter_cold' | 'kittens' | 'transport';
  description: string;
  route?: string; // For auto-volunteers: "Безымянка (ул. Победы) → Клиника на Ново-Садовой"
  assignedVolunteer?: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  targetFund?: string;
  directClinicBillAccount?: string;
  targetClinicId?: string;
  targetClinicName?: string;
}

export interface CatDexEntry {
  catId: string;
  metAt: string;
  photoUrl?: string;
  note: string;
}

export interface UserBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export type CaregiverNeedType = 'food' | 'litter' | 'vet_care' | 'hands' | 'transport';

export interface CaregiverNeedItem {
  id: string;
  type: CaregiverNeedType;
  title: string;
  description: string;
  urgency: 'critical' | 'high' | 'normal';
  targetAmount?: string;
  collectedAmount?: string;
  recommendedBrands?: string[];
  ozonPvzAddress?: string;
}

export interface FosterCatBrief {
  id: string;
  name: string;
  photo: string;
  age: string;
  gender: 'male' | 'female';
  isSterilized: boolean;
  character: string;
  healthStatus?: string;
  readyForAdoption: boolean;
}

export interface CaregiverBadge {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji or visual symbol
  category: 'rescue' | 'sos' | 'sterilization' | 'veteran' | 'special_care';
  animation: 'pulse-slow' | 'bounce-gentle' | 'shimmer' | 'spin-slow' | 'glow-paw';
  unlockedAt: string;
  badgeLevel?: 'bronze' | 'silver' | 'gold' | 'legendary';
}

export interface CaregiverGoodDeed {
  id: string;
  title: string;
  date: string;
  category: 'rescue' | 'sos_ticket' | 'sterilization' | 'adoption' | 'medical';
  description: string;
  catName?: string;
  catPhoto?: string;
  badgeIcon?: string;
  pointsEarned: number;
}

export interface MultiCatCaregiver {
  id: string;
  name: string;
  roleTitle: string; // e.g. "Домашний мини-приют", "Опекун старого фонда", "Котобабушка Нина"
  district: SamaraDistrict;
  addressApprox: string; // Zero-harm районное описание без квартиры
  catCount: number;
  avatarUrl: string;
  story: string;
  verifiedByFund: string; // "Проверено фондом «ФлагманВет» Самара"
  verifiedPhone?: string;
  curatorTelegram?: string;
  ozonPvzDefault?: string;
  wbPvzDefault?: string;
  cats: FosterCatBrief[];
  needs: CaregiverNeedItem[];
  volunteeringDays?: string[];
  acceptingVolunteers: boolean;
  coords?: [number, number]; // fuzz coordinates
  
  // Кото-рейтинг и статистика добрых дел
  kotoRating: {
    score: number; // Общий рейтинг, например 980 очков добра
    tier: 'Кот-Хранитель' | 'Мастер Мурлыканья' | 'Легенда Самары' | 'Герой Хвостиков';
    level: number;
    rescuedTotal: number; // Всего спасенных кошек за все годы
    closedSosTickets: number; // Количество закрытых SOS-тикетов
    sterilizationCount: number; // Стерилизовано лично / по квотам ОСВВ
    sterilizationStatus: '100% стерилизованы (ОСВВ Самара)' | 'Квота ОСВВ 2026 активна' | 'В процессе программы ОСВВ';
    adoptedTotal: number; // Успешно пристроены в добрые семьи
    yearsOfService: number; // Стаж опекунства (в годах)
  };
  badges: CaregiverBadge[];
  goodDeeds: CaregiverGoodDeed[];
}
