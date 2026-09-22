import { CatProfile, InfraPoint, SosTicket, UserBadge, MultiCatCaregiver } from '../types';

export const INITIAL_CATS: CatProfile[] = [
  {
    id: 'cat-1',
    name: 'Венцеслав (Веня)',
    aliases: ['Граф Венцекский', 'Рыжий барин'],
    district: 'Самарский',
    addressApprox: 'Исторический центр, арка дворянского двора на ул. Венцека',
    realCoords: [53.1872, 50.0894],
    fuzzedCoords: [53.1881, 50.0906], // ~120m offset
    status: 'osvv',
    estimatedAge: '4 года',
    gender: 'male',
    coat: 'Огненно-рыжий табби с белым манишком',
    specialMarks: ['V-образная метка на левом ушке (ОСВВ 2024)', 'Шрам на переносице'],
    temperament: ['friendly', 'wet_food_lover', 'calm'],
    weightKg: 4.8,
    microchipNumber: '643098100452101',
    sterilizedInfo: 'Программа ОСВВ Самара, май 2024 (клипса #САМ-088)',
    vaccinationInfo: 'Nobivac Tricat + Рабикан (ревакцинация июнь 2025)',
    parasiteControl: 'Стронгхолд Плюс (обработан 12 сентября 2026)',
    assignedShelterId: 'infra-1',
    assignedShelterName: 'Теплый котодомик №1 (двор на Венцека)',
    photos: [
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80'
    ],
    sightingsCount: 42,
    lastSeen: 'Сегодня в 14:15',
    hasCurator: true,
    curatorName: 'Анна В. (Самарский зоопатруль)',
    healthNotes: 'Вакцинирован от бешенства, обработан от паразитов. Хронических патологий нет.',
    dietRecommendation: 'Только влажный или качественный сухой премиум-корм. Не давать рыбу и молоко!',
    feedingSchedule: {
      morning: { time: '08:30', volunteer: 'Анна В.', status: 'done' },
      evening: { time: '19:00', volunteer: 'Сергей М.', status: 'pending' },
    },
    shelterQrCode: 'KD-SAM-01',
    sightingsHistory: [
      { id: 's-1', date: '21.09.2026', time: '14:15', author: 'Анна В.', condition: 'resting', note: 'Греется на солнце возле деревянных ворот, сыт и спокоен.' },
      { id: 's-2', date: '20.09.2026', time: '19:10', author: 'Михаил К.', condition: 'eating', note: 'Поужинал влажным кормом ProPlan, ушел спать в домик.' },
      { id: 's-3', date: '19.09.2026', time: '09:00', author: 'Евгения С.', condition: 'active', note: 'Встретил у калитки с громким мурчанием, ласкался об ноги.' }
    ]
  },
  {
    id: 'cat-2',
    name: 'Ширли',
    aliases: ['Мадам Клодт', 'Счастливица'],
    district: 'Ленинский',
    addressApprox: 'Сквер у Особняка Клодта / ул. Куйбышева',
    realCoords: [53.1953, 50.0988],
    fuzzedCoords: [53.1942, 50.0975],
    status: 'adoptable',
    estimatedAge: '1.5 года',
    gender: 'female',
    coat: 'Трехцветная (калико — классическая волжская кошка)',
    specialMarks: ['Белые "носочки" на всех четырех лапах', 'Шелковистая мягкая шерсть'],
    temperament: ['friendly', 'shy'],
    weightKg: 3.2,
    microchipNumber: '643098100512890',
    sterilizedInfo: 'Стерилизована в приюте «Надежда», косметический шов (июль 2025)',
    vaccinationInfo: 'Мультифел-4 + Рабикан (август 2025)',
    parasiteControl: 'Селафорт (обработана 1 сентября 2026)',
    adoptionStory: 'Ширли была спасена волонтерами из заброшенного сарая во время осенних дождей. Необыкновенно нежная, мурчащая девочка, которая обожает спать на коленях и ловить солнечные зайчики. Ищет заботливую семью в квартиру с сетками «Антикошка».',
    photos: [
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513360309081-36f20ca480d0?auto=format&fit=crop&w=800&q=80'
    ],
    sightingsCount: 19,
    lastSeen: 'Вчера в 18:40',
    hasCurator: true,
    curatorName: 'Елена К. (Приют «Надежда»)',
    healthNotes: 'Стерилизована, полностью здорова, сданы ПЦР-тесты на ВИК/ВЛК (отрицательно).',
    dietRecommendation: 'Сухой корм для стерилизованных кошек Super Premium.',
    feedingSchedule: {
      morning: { time: '09:00', volunteer: 'Елена К.', status: 'done' },
      evening: { time: '18:30', volunteer: 'Ольга П.', status: 'done' },
    },
    sightingsHistory: [
      { id: 's-4', date: '20.09.2026', time: '18:40', author: 'Елена К.', condition: 'resting', note: 'Сидела на скамейке в сквере, играла с сухим листочком.' },
      { id: 's-5', date: '18.09.2026', time: '12:30', author: 'Дмитрий Т.', condition: 'active', note: 'Дала погладить за ушком, очень доверчивая.' }
    ]
  },
  {
    id: 'cat-3',
    name: 'Дымок',
    aliases: ['Волжский пират'],
    district: 'Самарский',
    addressApprox: 'Старая Набережная, район Некрасовского спуска',
    realCoords: [53.1895, 50.0812],
    fuzzedCoords: [53.1906, 50.0825],
    status: 'sos',
    sosReason: 'Прихрамывает на заднюю правую лапу после прыжка с парапета, требуется осмотр ветеринара',
    estimatedAge: '3 года',
    gender: 'male',
    coat: 'Дымчато-серый, плотный подшерсток',
    specialMarks: ['Прижатое правое ухо', 'Зеленые раскосые глаза'],
    temperament: ['strict', 'shy'],
    weightKg: 4.1,
    photos: [
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80'
    ],
    sightingsCount: 11,
    lastSeen: '3 часа назад',
    hasCurator: false,
    healthNotes: 'ВНИМАНИЕ SOS: Требуется отлов мягким котоловом для доставки в клинику на Ново-Садовой.',
    dietRecommendation: 'Не пугать резкими движениями, приманивать паштетом.',
    treatmentStatus: {
      clinicId: 'infra-3',
      clinicName: 'Партнерская клиника «ВетСамара Экспресс»',
      stage: 'examination',
      diagnosis: 'Подозрение на закрытый перелом плюсны или растяжение связок',
      admissionDate: '21 сентября 2026',
      targetFund: 'Самарский общественный фонд помощи животным',
      billAccount: '40703810454400001290 (Рентген и стационар)',
      estimatedCost: 6500,
      collectedAmount: 4200
    },
    sightingsHistory: [
      { id: 's-6', date: '21.09.2026', time: '12:45', author: 'Алина З.', condition: 'alert', note: 'Заметила под лодочной пристанью. Прихрамывает на правую лапу, близко не подпускает.' },
      { id: 's-7', date: '20.09.2026', time: '16:00', author: 'Кирилл В.', condition: 'resting', note: 'Лежал на ступеньках спуска к Волге, выглядел вялым.' }
    ]
  },
  {
    id: 'cat-4',
    name: 'Барон Победы',
    aliases: ['Черныш с Безымянки', 'Профессор'],
    district: 'Кировский (Безымянка)',
    addressApprox: 'Двор за ДК Металлургов, ул. Победы',
    realCoords: [53.2215, 50.2789],
    fuzzedCoords: [53.2203, 50.2804],
    status: 'resident',
    estimatedAge: '6 лет',
    gender: 'male',
    coat: 'Глубокий черный угольный с янтарными глазами',
    specialMarks: ['Купирован кончик хвоста (старая травма)', 'Крупный костяк, царственная походка'],
    temperament: ['calm', 'strict'],
    weightKg: 5.6,
    microchipNumber: '643098100199432',
    sterilizedInfo: 'Кастрирован в 2021 году волонтерами Кировского района',
    vaccinationInfo: 'Ежегодная вакцинация от бешенства (последняя: май 2026)',
    parasiteControl: 'Бравекто Plus (июнь 2026)',
    assignedShelterId: 'infra-1',
    assignedShelterName: 'Теплый подвальный бокс (ул. Победы, 102)',
    photos: [
      'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80'
    ],
    sightingsCount: 58,
    lastSeen: 'Сегодня в 11:20',
    hasCurator: true,
    curatorName: 'Дворницкая артель им. Кирова (Тамара Ивановна)',
    healthNotes: 'Живет в сухом подвале с контролируемым обогревом с 2021 года. Регулярно осматривается волонтером.',
    dietRecommendation: 'Кормление строго 2 раза в день волонтером Тамарой Ивановной (сухой корм Royal Canin).',
    feedingSchedule: {
      morning: { time: '07:45', volunteer: 'Тамара Ивановна', status: 'done' },
      evening: { time: '18:00', volunteer: 'Тамара Ивановна', status: 'done' },
    },
    sightingsHistory: [
      { id: 's-8', date: '21.09.2026', time: '11:20', author: 'Тамара Ивановна', condition: 'eating', note: 'С аппетитом позавтракал, обошел свою территорию вокруг ДК.' }
    ]
  },
  {
    id: 'cat-5',
    name: 'Маруся',
    aliases: ['Котокафешная выпускница', 'Мурчалка'],
    district: 'Октябрьский',
    addressApprox: 'Сквер Фадеева, у пересечения с пр. Ленина',
    realCoords: [53.2142, 50.1481],
    fuzzedCoords: [53.2130, 50.1495],
    status: 'osvv',
    estimatedAge: '2 года',
    gender: 'female',
    coat: 'Бело-полосатая (шпротная с белой манишкой)',
    specialMarks: ['ОСВВ клипса на ушке', 'Очень громкое вибрирующее мурлыканье'],
    temperament: ['friendly', 'wet_food_lover'],
    weightKg: 3.5,
    microchipNumber: '643098100671234',
    sterilizedInfo: 'ОСВВ Программа, клипса #САМ-142 (ноябрь 2024)',
    vaccinationInfo: 'Nobivac Tricat (декабрь 2024)',
    parasiteControl: 'Стронгхолд (август 2026)',
    photos: [
      'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=800&q=80'
    ],
    sightingsCount: 34,
    lastSeen: 'Вчера в 20:10',
    hasCurator: true,
    curatorName: 'Ксения (Котокафе «Мурзик»)',
    healthNotes: 'Здорова, регулярные прививки, есть чип, очень общительная.',
    dietRecommendation: 'Любит влажные паучи для чувствительного пищеварения.',
    feedingSchedule: {
      morning: { time: '09:30', volunteer: 'Ксения', status: 'done' },
      evening: { time: '19:30', volunteer: 'Виктор', status: 'pending' },
    },
    sightingsHistory: [
      { id: 's-9', date: '20.09.2026', time: '20:10', author: 'Ксения', condition: 'active', note: 'Встретила у входа в сквер, покушала паштет, мурчала.' }
    ]
  }
];

export const INITIAL_INFRA: InfraPoint[] = [
  {
    id: 'infra-1',
    name: 'Теплый котодомик №1 «Самарский теремок»',
    type: 'shelter',
    district: 'Самарский',
    coords: [53.1870, 50.0892],
    description: 'Двухъярусный утепленный домик из влагостойкой фанеры с соломенной подстилкой и ветрозащитной шторкой. Обогрев: пассивный термос.',
    address: 'Двор ул. Венцека / Степана Разина',
    capacity: 4,
    isWinterHeated: true,
    residentsCatIds: ['cat-1'],
    qrCodeId: 'KD-SAM-01'
  },
  {
    id: 'infra-2',
    name: 'Котодомик «Октябрьский ковчег»',
    type: 'shelter',
    district: 'Октябрьский',
    coords: [53.2140, 50.1478],
    description: 'Официальный муниципальный модульный приют для зимовки стерилизованных животных двора.',
    address: 'Сквер Фадеева / пр. Ленина',
    capacity: 6,
    isWinterHeated: true,
    residentsCatIds: ['cat-5'],
    qrCodeId: 'KD-OKT-04'
  },
  {
    id: 'infra-3',
    name: 'Партнерская клиника «ВетСамара Экспресс»',
    type: 'vet_clinic',
    district: 'Октябрьский',
    coords: [53.2185, 50.1560],
    description: 'Льготная стерилизация по программе ОСВВ Самары, скидка 35% для волонтеров «Котокарты», экспресс-лаборатория.',
    address: 'ул. Ново-Садовая, 106',
    capacity: 12,
    contactPhone: '+7 (846) 205-11-22',
    clinicStatus: {
      workload: 'by_appointment',
      label: 'Принимает по записи',
      queueEstimateMinutes: 20,
      freeSurgeon: true,
      freeOsvvSlotsToday: 3,
      totalBeds: 12,
      occupiedBeds: 7,
      updatedAt: '12 минут назад',
      notice: 'Плановые операции ОСВВ по предварительной записи. Экстренный осмотр вне очереди.'
    }
  },
  {
    id: 'infra-4',
    name: 'Ветклиника «Добровет на Победе»',
    type: 'vet_clinic',
    district: 'Кировский (Безымянка)',
    coords: [53.2240, 50.2760],
    description: 'Круглосуточный стационар для травмированных уличных животных. Прямой целевой счет для волонтерских тикетов.',
    address: 'ул. Победы, 92',
    capacity: 16,
    contactPhone: '+7 (846) 270-44-88',
    clinicStatus: {
      workload: 'busy',
      label: 'Загружена',
      queueEstimateMinutes: 50,
      freeSurgeon: true,
      freeOsvvSlotsToday: 1,
      totalBeds: 16,
      occupiedBeds: 14,
      updatedAt: '7 минут назад',
      notice: 'В стационаре тяжелые пациенты с травмами, живая очередь ~50 мин.'
    }
  },
  {
    id: 'infra-4b',
    name: 'Городской ветцентр «Самарская Лука»',
    type: 'vet_clinic',
    district: 'Ленинский',
    coords: [53.1982, 50.1145],
    description: 'Партнерская хирургия и травматология. Цифровой рентген, УЗИ экспертного класса, квоты фонда на стерилизацию.',
    address: 'ул. Самарская, 148',
    capacity: 20,
    contactPhone: '+7 (846) 332-15-40',
    clinicStatus: {
      workload: 'open_admission',
      label: 'Свободный прием',
      queueEstimateMinutes: 5,
      freeSurgeon: true,
      freeOsvvSlotsToday: 4,
      totalBeds: 20,
      occupiedBeds: 6,
      updatedAt: 'Только что',
      notice: 'Дежурный хирург и рентген-кабинет свободны, открыт прием уличных животных.'
    }
  },
  {
    id: 'infra-4c',
    name: 'Ветеринарный госпиталь «АльфаВет 24»',
    type: 'vet_clinic',
    district: 'Промышленный',
    coords: [53.2450, 50.2210],
    description: 'Круглосуточная реанимация и кислородные боксы при гипотермии, инфекционный и травматологический изолятор.',
    address: 'ул. Ново-Вокзальная, 116',
    capacity: 24,
    contactPhone: '+7 (846) 995-00-11',
    clinicStatus: {
      workload: 'emergency_only',
      label: 'Только экстренные',
      queueEstimateMinutes: 10,
      freeSurgeon: true,
      freeOsvvSlotsToday: 0,
      totalBeds: 24,
      occupiedBeds: 22,
      updatedAt: '15 минут назад',
      notice: 'Реанимация и кислородные боксы работают на тяжелые травмы и обморожения.'
    }
  },
  {
    id: 'infra-5',
    name: 'Pet-friendly кофейня «Волга & Зерно»',
    type: 'pet_friendly',
    district: 'Ленинский',
    coords: [53.1965, 50.1010],
    description: 'Точка с питьевой водой для хвостатых гостей, пускают погреться в тамбур в холода, бокс сбора корма для приютов.',
    address: 'ул. Куйбышева, 84'
  },
  {
    id: 'infra-6',
    name: 'Центральная поилка и точка сухого корма',
    type: 'feeder',
    district: 'Самарский',
    coords: [53.1890, 50.0820],
    description: 'Антивандальная автоматическая гравитационная кормушка и миска с подогревом в зимнее время.',
    address: 'Некрасовский спуск набережной'
  }
];

export const INITIAL_TICKETS: SosTicket[] = [
  {
    id: 'sos-101',
    title: 'Дымок с Набережной: травма лапы, нужен автоволонтер',
    catId: 'cat-3',
    catName: 'Дымок',
    district: 'Самарский',
    priority: 'urgent',
    category: 'injury',
    description: 'Кот сильно хромает, сидит в укрытии парапета. Нужна поимка в котоловку и доставка на рентген.',
    route: 'Некрасовский спуск (Набережная) → ВетСамара (ул. Ново-Садовая, 106)',
    status: 'open',
    createdAt: 'Сегодня, 13:40',
    targetFund: 'Благотворительный фонд помощи животным Самары «ФлагманВет»',
    directClinicBillAccount: 'Счет № 4070281095440001293 (ООО «ВетСамара», назначение: За Дымка)'
  },
  {
    id: 'sos-102',
    title: 'Плановый отлов 3 кошек на стерилизацию (ОСВВ)',
    district: 'Кировский (Безымянка)',
    priority: 'high',
    category: 'trapping_osvv',
    description: 'В подвале дома по ул. Победы обнаружены три молодые кошки без метки. Забронировано окно в клинике «Добровет».',
    route: 'ул. Победы, 88 → «Добровет на Победе»',
    status: 'in_progress',
    assignedVolunteer: 'Михаил Т. (экипаж Рено Дастер)',
    createdAt: 'Вчера, 17:15',
    targetFund: 'Программа гуманного контроля численности «Кошкин Дом Самара»'
  },
  {
    id: 'sos-103',
    title: 'Утепление котодомика на Венцека перед заморозками',
    district: 'Самарский',
    priority: 'medium',
    category: 'winter_cold',
    description: 'Требуется заменить старую солому на свежую сухую ржаную солому и закрепить ветрозащитный клапан.',
    status: 'open',
    createdAt: '21 сентября, 10:00'
  }
];

export const USER_BADGES: UserBadge[] = [
  {
    id: 'b-1',
    title: 'Хранитель двора',
    description: 'Провел 5 отметок «Видел сегодня» в одном районе Самары',
    icon: 'ShieldCheck',
    unlocked: true,
    progress: 5,
    maxProgress: 5
  },
  {
    id: 'b-2',
    title: 'Кошачий шеф-повар',
    description: 'Отметил 10 выполненных графиков кормления в приютах/домиках',
    icon: 'Utensils',
    unlocked: false,
    progress: 4,
    maxProgress: 10
  },
  {
    id: 'b-3',
    title: 'Зоркий глаз Самары',
    description: 'Внес нового котика в базу с верификацией AI и куратором',
    icon: 'Eye',
    unlocked: true,
    progress: 1,
    maxProgress: 1
  },
  {
    id: 'b-4',
    title: 'Авто-ангел',
    description: 'Помог перевезти животное по волонтерскому маршруту',
    icon: 'Car',
    unlocked: false,
    progress: 0,
    maxProgress: 3
  }
];

export const SAMARA_CAREGIVERS: MultiCatCaregiver[] = [
  {
    id: 'caregiver-1',
    name: 'Нина Васильевна',
    roleTitle: 'Опекун старого фонда («Котобабушка Нина»)',
    district: 'Самарский',
    addressApprox: 'Исторический центр, район двориков ул. Фрунзе / Красноармейская',
    catCount: 16,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    story: 'Спасает бездомных кошек старого купеческого центра Самары более 18 лет. 12 котиков живут у неё в квартире с антикошачьими сетками, 4 приходят кормиться в закрытый двор. Все коты стерилизованы по программе ОСВВ Самары. Большинство — возрастные с хроническим циститом и МКБ.',
    verifiedByFund: 'Верифицировано фондом «ФлагманВет» Самара (Договор кураторства #САМ-042)',
    verifiedPhone: '+7 (846) 332-88-14',
    curatorTelegram: '@samara_curator_nina',
    ozonPvzDefault: 'Самара, ул. Фрунзе, 96 (ПВЗ Ozon)',
    wbPvzDefault: 'Самара, ул. Куйбышева, 84 (ПВЗ Wildberries)',
    volunteeringDays: ['Каждая суббота 12:00 – 15:00', 'Среда 18:00 – 20:00'],
    acceptingVolunteers: true,
    coords: [53.1895, 50.0940],
    kotoRating: {
      score: 980,
      tier: 'Легенда Самары',
      level: 18,
      rescuedTotal: 74,
      closedSosTickets: 29,
      sterilizationCount: 68,
      sterilizationStatus: '100% стерилизованы (ОСВВ Самара)',
      adoptedTotal: 48,
      yearsOfService: 18
    },
    badges: [
      {
        id: 'b-1',
        title: 'Кото-Хранитель Старого Города',
        description: '18 лет непрерывной защиты хвостатых обитателей старинных двориков ул. Фрунзе и Куйбышева.',
        icon: '🏛️',
        category: 'veteran',
        animation: 'glow-paw',
        unlockedAt: '2020-04-12',
        badgeLevel: 'legendary'
      },
      {
        id: 'b-2',
        title: 'Щит ОСВВ: 100% стерилизация',
        description: 'Все 16 подопечных и дворовые коты успешно прошли клиническую стерилизацию по самарской программе.',
        icon: '🛡️',
        category: 'sterilization',
        animation: 'pulse-slow',
        unlockedAt: '2024-05-18',
        badgeLevel: 'gold'
      },
      {
        id: 'b-3',
        title: 'SOS-Ангел: 29 спасенных жизней',
        description: 'Успешно закрыто 29 экстренных заявок: спасение из затопленных подвалов и теплотрасс.',
        icon: '🚨',
        category: 'sos',
        animation: 'bounce-gentle',
        unlockedAt: '2025-11-03',
        badgeLevel: 'gold'
      },
      {
        id: 'b-4',
        title: 'Опекун серебряных хвостиков',
        description: 'Бережный паллиативный уход за кошками с хроническим циститом и почечной недостаточностью.',
        icon: '🕊️',
        category: 'special_care',
        animation: 'shimmer',
        unlockedAt: '2026-01-15',
        badgeLevel: 'silver'
      }
    ],
    goodDeeds: [
      {
        id: 'gd-1',
        title: 'Спасен кот Тимоша из вентиляционной шахты',
        date: '14 февраля 2026',
        category: 'rescue',
        description: 'Вызволен из закрытой шахты дома на ул. Чапаевской. Обработан, привит Нобиваком и готов к семье.',
        catName: 'Тимоша',
        catPhoto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80',
        badgeIcon: '🐾',
        pointsEarned: 120
      },
      {
        id: 'gd-2',
        title: 'Закрыт SOS-тикет: 4 котенка спасены от мороза',
        date: '18 января 2026',
        category: 'sos_ticket',
        description: 'В 25-градусный мороз вывезены котята из подвала ул. Венцека, 44. Пролечены от инфекции, сейчас на передержке.',
        badgeIcon: '❄️',
        pointsEarned: 150
      },
      {
        id: 'gd-3',
        title: 'Стерилизация 6 кошек купеческого двора по квоте ОСВВ',
        date: '12 ноября 2025',
        category: 'sterilization',
        description: 'Совместно с фондом «ФлагманВет» проведена стерилизация, биркование и послеоперационный уход.',
        badgeIcon: '🩺',
        pointsEarned: 180
      },
      {
        id: 'gd-4',
        title: 'Пристроена кошка Бусинка в добрую семью на Садовой',
        date: '05 октября 2025',
        category: 'adoption',
        description: 'После 8 месяцев реабилитации ласковая трехцветка обрела уютный дом и заботливых хозяев.',
        badgeIcon: '🏡',
        pointsEarned: 100
      }
    ],
    needs: [
      {
        id: 'n-1',
        type: 'food',
        title: 'Лечебный сухой корм при МКБ (Urinary / Renal)',
        description: 'Для троих пожилых котов (Феликс, Матильда и Вася). Нужен Pro Plan UR или Royal Canin Urinary S/O.',
        urgency: 'critical',
        targetAmount: '1 мешок (10 кг)',
        collectedAmount: '3 кг из 10 кг',
        recommendedBrands: ['Pro Plan Veterinary Diets UR', 'Royal Canin Urinary S/O', 'Monge VetSolution Renal'],
        ozonPvzAddress: 'Самара, ул. Фрунзе, 96 (ПВЗ Ozon, куратор Нина В.)'
      },
      {
        id: 'n-2',
        type: 'litter',
        title: 'Древесный наполнитель (гранулы 6 мм)',
        description: 'Расход наполнителя на 12 квартирных котиков — около 25-30 кг в месяц.',
        urgency: 'high',
        targetAmount: '2 больших мешка по 15 кг',
        collectedAmount: '1 мешок',
        recommendedBrands: ['«Сибирская кошка» древесный', '«Зооник» хвоя', 'Чистые лапки'],
        ozonPvzAddress: 'Самара, ул. Фрунзе, 96'
      },
      {
        id: 'n-3',
        type: 'hands',
        title: 'Субботник «Чистый дом»: генеральная уборка и мытье лотков',
        description: 'Нине Васильевне 74 года, тяжело поднимать тяжелые мешки и делать влажную уборку лотков с эко-дезинфектором.',
        urgency: 'normal',
        targetAmount: '2 волонтера на 2 часа',
        collectedAmount: '1 волонтер записан'
      }
    ],
    cats: [
      {
        id: 'fc-1',
        name: 'Тимоша',
        photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80',
        age: '1.5 года',
        gender: 'male',
        isSterilized: true,
        character: 'Нежнейший мурчалка, тянется к человеку, идеально знает лоток.',
        healthStatus: 'Здоров, привит Нобиваком',
        readyForAdoption: true
      },
      {
        id: 'fc-2',
        name: 'Ксюша',
        photo: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80',
        age: '9 месяцев',
        gender: 'female',
        isSterilized: true,
        character: 'Скромная черепаховая кошечка, обожает спать в ногах и петь песенки.',
        healthStatus: 'Здорова, обработана Селафортом',
        readyForAdoption: true
      }
    ]
  },
  {
    id: 'caregiver-2',
    name: 'Елена и Михаил',
    roleTitle: 'Семейная передержка «Тёплый Плед»',
    district: 'Кировский (Безымянка)',
    addressApprox: 'Безымянка, район сквера им. Калинина / ул. Воронежская',
    catCount: 21,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    story: 'Молодая пара, спасающая кошек с дачных массивов Барбошиной поляны и заброшенных заводских зон Безымянки. Организовали в отдельной оборудованной комнате карантинный бокс и кошачий игровой комплекс.',
    verifiedByFund: 'Проверено ассоциацией кураторов «Кошкин Дом Самара»',
    verifiedPhone: '+7 (846) 271-90-55',
    curatorTelegram: '@teply_pled_smr',
    ozonPvzDefault: 'Самара, ул. Воронежская, 142 (ПВЗ Ozon)',
    wbPvzDefault: 'Самара, ул. Победы, 104 (ПВЗ Wildberries)',
    volunteeringDays: ['Суббота и Воскресенье по согласованию'],
    acceptingVolunteers: true,
    coords: [53.2210, 50.2820],
    kotoRating: {
      score: 840,
      tier: 'Мастер Мурлыканья',
      level: 14,
      rescuedTotal: 52,
      closedSosTickets: 21,
      sterilizationCount: 47,
      sterilizationStatus: 'Квота ОСВВ 2026 активна',
      adoptedTotal: 31,
      yearsOfService: 6
    },
    badges: [
      {
        id: 'b-5',
        title: 'Герой Безымянки: Дачный Десант',
        description: 'Спасены 52 кошки с заброшенных дач 9-й просеки и промзон Заводского шоссе.',
        icon: '🏭',
        category: 'rescue',
        animation: 'glow-paw',
        unlockedAt: '2023-09-10',
        badgeLevel: 'gold'
      },
      {
        id: 'b-6',
        title: 'Скорая Автопомощь Самары',
        description: 'Собственный теплый авто-экипаж: перевезено более 40 кошек на экстренные операции и анализы.',
        icon: '🚗',
        category: 'sos',
        animation: 'bounce-gentle',
        unlockedAt: '2024-03-22',
        badgeLevel: 'gold'
      },
      {
        id: 'b-7',
        title: 'Амбассадор Карантина и Вакцинации',
        description: 'Оборудован стерильный бокс с бактерицидным облучателем для новоприбывших котят.',
        icon: '🧪',
        category: 'special_care',
        animation: 'shimmer',
        unlockedAt: '2024-11-05',
        badgeLevel: 'silver'
      },
      {
        id: 'b-8',
        title: 'Знак ОСВВ 2026: Активный участник',
        description: 'Регулярная стерилизация подопечных совместно с ветклиникой «Друг» на Ново-Садовой.',
        icon: '✂️',
        category: 'sterilization',
        animation: 'pulse-slow',
        unlockedAt: '2025-08-19',
        badgeLevel: 'silver'
      }
    ],
    goodDeeds: [
      {
        id: 'gd-5',
        title: 'Спасение братьев Уголька и Черныша из промзоны',
        date: '20 февраля 2026',
        category: 'rescue',
        description: 'Два маленьких черных котенка вывезены с территории закрытого цеха на Заводском шоссе.',
        catName: 'Уголёк и Черныш',
        catPhoto: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=400&q=80',
        badgeIcon: '🐈‍⬛',
        pointsEarned: 130
      },
      {
        id: 'gd-6',
        title: 'Успешная доставка 3 кошек на срочное УЗИ',
        date: '02 февраля 2026',
        category: 'medical',
        description: 'Ночной авторейс в дежурную ветеринарную клинику, спасение кошки Златы от перитонита.',
        badgeIcon: '🩺',
        pointsEarned: 110
      },
      {
        id: 'gd-7',
        title: 'Закрыт SOS-тикет: эвакуация кошачьего прайда с дач Барбошиной поляны',
        date: '28 декабря 2025',
        category: 'sos_ticket',
        description: 'Спасены 5 замерзавших кошек, оставленных дачниками на зиму.',
        badgeIcon: '🏡',
        pointsEarned: 160
      }
    ],
    needs: [
      {
        id: 'n-4',
        type: 'transport',
        title: 'Автопомощь: доставка троих котиков на УЗИ и ревакцинацию',
        description: 'Маршрут: Безымянка (ул. Воронежская) → Ветклиника «Друг» на Ново-Садовой и обратно. Нужен водитель с переносками или помощь с оплатой зоотакси.',
        urgency: 'high',
        targetAmount: '1 авто-экипаж на пятницу/субботу',
        collectedAmount: 'Поиск экипажа'
      },
      {
        id: 'n-5',
        type: 'food',
        title: 'Сухой повседневный корм для стерилизованных кошек',
        description: 'Расход корма в месяц колоссальный. Подойдут качественные корма класса премиум и суперпремиум.',
        urgency: 'high',
        targetAmount: '20 кг',
        collectedAmount: '8 кг из 20 кг',
        recommendedBrands: ['Sirius Sterilized', 'AlphaPet Superpremium', 'Grandorf White Fish'],
        ozonPvzAddress: 'Самара, ул. Воронежская, 142'
      },
      {
        id: 'n-6',
        type: 'litter',
        title: 'Впитывающие одноразовые пеленки (60х90 см)',
        description: 'Для карантинного бокса и котят после вакцинации.',
        urgency: 'normal',
        targetAmount: '3 упаковки по 30 шт.',
        ozonPvzAddress: 'Самара, ул. Воронежская, 142'
      }
    ],
    cats: [
      {
        id: 'fc-3',
        name: 'Уголёк и Черныш (братья)',
        photo: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=400&q=80',
        age: '6 месяцев',
        gender: 'male',
        isSterilized: true,
        character: 'Шелковые черные пантерки, очень дружные, ищут дом вместе или по отдельности.',
        healthStatus: 'Полностью здоровы, паспорта и прививки готовы',
        readyForAdoption: true
      },
      {
        id: 'fc-4',
        name: 'Злата',
        photo: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=400&q=80',
        age: '2 года',
        gender: 'female',
        isSterilized: true,
        character: 'Золотая мраморная красавица, спокойная кошка-компаньон.',
        healthStatus: 'Здорова, чипирована',
        readyForAdoption: true
      }
    ]
  },
  {
    id: 'caregiver-3',
    name: 'Татьяна («Особенные котики»)',
    roleTitle: 'Опекунский центр реабилитации',
    district: 'Ленинский',
    addressApprox: 'Ленинский район, ул. Самарская / Вилоновская',
    catCount: 14,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    story: 'Татьяна берет на доживание и терапию тех, кому сложнее всего выжить на улице: слепышей после инфекций, спинальников и котиков с лейкозом FeLV (живут в отдельном комфортном изолированном крыле).',
    verifiedByFund: 'Официальный партнер фонда «ЗооЗабота Самара»',
    verifiedPhone: '+7 (846) 333-19-20',
    curatorTelegram: '@special_cats_samara',
    ozonPvzDefault: 'Самара, ул. Вилоновская, 20 (ПВЗ Ozon)',
    volunteeringDays: ['Вторник и Четверг 17:00 – 19:30'],
    acceptingVolunteers: true,
    coords: [53.1970, 50.1180],
    kotoRating: {
      score: 920,
      tier: 'Кот-Хранитель',
      level: 16,
      rescuedTotal: 38,
      closedSosTickets: 19,
      sterilizationCount: 38,
      sterilizationStatus: '100% стерилизованы (ОСВВ Самара)',
      adoptedTotal: 24,
      yearsOfService: 11
    },
    badges: [
      {
        id: 'b-9',
        title: 'Сердце для Особенных: Реабилитолог',
        description: 'Специализированная терапия для котиков-спинальников, трехлапиков и слепышей.',
        icon: '❤️‍🩹',
        category: 'special_care',
        animation: 'glow-paw',
        unlockedAt: '2021-06-15',
        badgeLevel: 'legendary'
      },
      {
        id: 'b-10',
        title: 'Вторая Жизнь Лучика',
        description: 'Успешная сложнейшая реабилитация трехлапого котенка после тяжелой дорожной травмы.',
        icon: '🌟',
        category: 'rescue',
        animation: 'shimmer',
        unlockedAt: '2025-09-02',
        badgeLevel: 'gold'
      },
      {
        id: 'b-11',
        title: 'Знак ОСВВ и Терапевтической Защиты',
        description: 'Все подопечные центра вакцинированы, стерилизованы и имеют электронные ветпаспорта.',
        icon: '🛡️',
        category: 'sterilization',
        animation: 'pulse-slow',
        unlockedAt: '2024-04-18',
        badgeLevel: 'gold'
      }
    ],
    goodDeeds: [
      {
        id: 'gd-8',
        title: 'Реабилитация и спасение котика Лучика',
        date: '10 января 2026',
        category: 'rescue',
        description: 'Котенок спасен после аварии на ул. Полевой. Проведена ампутация, шов зажил, котик активно бегает.',
        catName: 'Лучик',
        catPhoto: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=400&q=80',
        badgeIcon: '☀️',
        pointsEarned: 200
      },
      {
        id: 'gd-9',
        title: 'Закрыт SOS-тикет: спасение слепого котенка из колодца',
        date: '15 декабря 2025',
        category: 'sos_ticket',
        description: 'Поднят из сухого колодца теплосети на ул. Галактионовской, доставлен в клинику.',
        badgeIcon: '🚨',
        pointsEarned: 140
      }
    ],
    needs: [
      {
        id: 'n-7',
        type: 'food',
        title: 'Влажный паштет Gastro / Recovery',
        description: 'Для ослабленных подопечных, которым трудно пережевывать сухой корм.',
        urgency: 'critical',
        targetAmount: '40 паучей / баночек',
        collectedAmount: '14 баночек',
        recommendedBrands: ['Monge Gastrointestinal', 'Royal Canin Recovery', 'Animonda Integra'],
        ozonPvzAddress: 'Самара, ул. Вилоновская, 20'
      },
      {
        id: 'n-8',
        type: 'vet_care',
        title: 'Оплата контрольного биохимического анализа крови для двоих подопечных',
        description: 'Контроль почечных показателей в партнерской клинике «Друг» на Ново-Садовой.',
        urgency: 'high',
        targetAmount: '3 600 ₽ (депозит в клинике)',
        collectedAmount: '1 800 ₽'
      }
    ],
    cats: [
      {
        id: 'fc-5',
        name: 'Лучик',
        photo: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=400&q=80',
        age: '1 год',
        gender: 'male',
        isSterilized: true,
        character: 'Трехлапик после автотравмы. Бегает быстрее всех в квартире, обожает сидеть на плече!',
        healthStatus: 'Шов полностью зажил, анализы чистые, привит',
        readyForAdoption: true
      }
    ]
  },
  {
    id: 'caregiver-4',
    name: 'Ольга Николаевна',
    roleTitle: 'Мини-приют «Кошкин Дом на Волге»',
    district: 'Октябрьский',
    addressApprox: 'Октябрьский район, район Оврага Подпольщиков / ул. Ерошевского',
    catCount: 18,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    story: 'Учитель биологии на пенсии. Обустроила цокольный теплый этаж частного дома с отдельным огороженным безопасным вольером для прогулок на свежем воздухе. Ищет активную помощь в пристройстве котиков в добрые семьи.',
    verifiedByFund: 'Проверено волонтерской инспекцией Самары (Акт №114)',
    verifiedPhone: '+7 (846) 244-12-70',
    ozonPvzDefault: 'Самара, ул. Ерошевского, 18 (ПВЗ Ozon)',
    volunteeringDays: ['Суббота 11:00 – 16:00'],
    acceptingVolunteers: true,
    coords: [53.2120, 50.1680],
    kotoRating: {
      score: 790,
      tier: 'Герой Хвостиков',
      level: 12,
      rescuedTotal: 65,
      closedSosTickets: 17,
      sterilizationCount: 65,
      sterilizationStatus: '100% стерилизованы (ОСВВ Самара)',
      adoptedTotal: 47,
      yearsOfService: 9
    },
    badges: [
      {
        id: 'b-12',
        title: 'Мастер Пристройства: 47 счастливых историй',
        description: 'Рекордное число подопечных, нашедших надежные семьи с договором ответственного содержания.',
        icon: '🏡',
        category: 'rescue',
        animation: 'glow-paw',
        unlockedAt: '2023-11-20',
        badgeLevel: 'gold'
      },
      {
        id: 'b-13',
        title: 'Зеленый Вольер на Волге',
        description: 'Создание безопасной эко-зоны с травой и кошачьими лазалками для прогулок на свежем воздухе.',
        icon: '🌿',
        category: 'veteran',
        animation: 'bounce-gentle',
        unlockedAt: '2024-07-12',
        badgeLevel: 'silver'
      },
      {
        id: 'b-14',
        title: 'Знак ОСВВ Самара: Безупречный учет',
        description: '100% стерилизация, своевременная вакцинация и чипирование каждого питомца.',
        icon: '🏅',
        category: 'sterilization',
        animation: 'pulse-slow',
        unlockedAt: '2025-03-30',
        badgeLevel: 'gold'
      }
    ],
    goodDeeds: [
      {
        id: 'gd-10',
        title: 'Спасение сибирского кота Барсика от стаи собак',
        date: '25 января 2026',
        category: 'rescue',
        description: 'Кот загнан собаками на дерево в Овраге Подпольщиков. Снят волонтерами, обработан и кастрирован.',
        catName: 'Барсик',
        catPhoto: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=400&q=80',
        badgeIcon: '🌲',
        pointsEarned: 130
      },
      {
        id: 'gd-11',
        title: 'Успешная фотосессия для пристройства 5 кошек',
        date: '10 декабря 2025',
        category: 'adoption',
        description: 'Благодаря работе фотографа-волонтера две кошечки уже переехали к новым хозяевам в Самаре.',
        badgeIcon: '📸',
        pointsEarned: 90
      }
    ],
    needs: [
      {
        id: 'n-9',
        type: 'hands',
        title: 'Фотограф-волонтер для съемки котиков в портфолио пристройства',
        description: 'Нужны красивые яркие кадры подопечных для публикации в группах «ВКонтакте» Самары и на Авито.',
        urgency: 'high',
        targetAmount: '1 выезд фотографа (1.5 часа)',
        collectedAmount: 'Поиск волонтера'
      },
      {
        id: 'n-10',
        type: 'food',
        title: 'Сухой корм Grandorf / Sirius для взрослых кошек',
        description: 'Сбалансированное питание для 18 подопечных.',
        urgency: 'normal',
        targetAmount: '15 кг',
        collectedAmount: '6 кг',
        ozonPvzAddress: 'Самара, ул. Ерошевского, 18'
      }
    ],
    cats: [
      {
        id: 'fc-6',
        name: 'Ася',
        photo: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=80',
        age: '10 месяцев',
        gender: 'female',
        isSterilized: true,
        character: 'Игривая полосаточка с белыми носочками, ловит мышек-дразнилок.',
        healthStatus: 'Здорова, ветпаспорт',
        readyForAdoption: true
      },
      {
        id: 'fc-7',
        name: 'Барсик',
        photo: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=400&q=80',
        age: '3 года',
        gender: 'male',
        isSterilized: true,
        character: 'Солидный пушистый кот сибирского типажа. Умный, степенный, любит чесать за ушком.',
        healthStatus: 'Кастрирован, здоров',
        readyForAdoption: true
      }
    ]
  }
];
