import React, { useState, useEffect } from 'react';
import { 
  CatProfile, 
  InfraPoint, 
  SosTicket, 
  UserRole, 
  UserBadge, 
  CatDexEntry 
} from './types';
import { 
  INITIAL_CATS, 
  INITIAL_INFRA, 
  INITIAL_TICKETS, 
  USER_BADGES,
  SAMARA_CAREGIVERS
} from './data/samaraData';
import { MapView } from './components/MapView';
import { Header } from './components/Header';
import { CatPassportModal } from './components/CatPassportModal';
import { InfraModal } from './components/InfraModal';
import { AddCatModal } from './components/AddCatModal';
import { VolunteerHubModal } from './components/VolunteerHubModal';
import { CatDexModal } from './components/CatDexModal';
import { AboutSafetyModal } from './components/AboutSafetyModal';
import { OnboardingModal } from './components/OnboardingModal';
import { VetClinicsModal } from './components/VetClinicsModal';
import { QuickDrawer } from './components/QuickDrawer';
import { SamaraUrbanWidget } from './components/SamaraUrbanWidget';
import { CaregiversHubModal } from './components/CaregiversHubModal';

const STORAGE_KEYS = {
  CATS: 'kotokarta_v1_cats',
  TICKETS: 'kotokarta_v1_tickets',
  BADGES: 'kotokarta_v1_badges',
  DEX: 'kotokarta_v1_dex',
  ROLE: 'kotokarta_v1_role',
};

export default function App() {
  const [cats, setCats] = useState<CatProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_CATS;
  });

  const [infraPoints, setInfraPoints] = useState<InfraPoint[]>(INITIAL_INFRA);

  const [tickets, setTickets] = useState<SosTicket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_TICKETS;
  });

  const [badges, setBadges] = useState<UserBadge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BADGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return USER_BADGES;
  });

  const [dexEntries, setDexEntries] = useState<CatDexEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEX);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return [
      { catId: 'cat-1', metAt: 'Сегодня в 14:15', note: 'Грелся на солнце во дворе на Венцека' }
    ];
  });

  // Privacy Context: default to 'guest' to demonstrate Zero-Harm Policy
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      if (saved === 'verified_curator' || saved === 'guest') return saved;
    } catch {
      // Fallback
    }
    return 'guest';
  });

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATS, JSON.stringify(cats));
    } catch {}
  }, [cats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    } catch {}
  }, [tickets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
    } catch {}
  }, [badges]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEX, JSON.stringify(dexEntries));
    } catch {}
  }, [dexEntries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, userRole);
    } catch {}
  }, [userRole]);

  // Filters
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [infraFilter, setInfraFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');

  // Quick Drawer on map
  const [isQuickDrawerOpen, setIsQuickDrawerOpen] = useState(false);

  // Modals
  const [selectedCat, setSelectedCat] = useState<CatProfile | null>(null);
  const [selectedInfra, setSelectedInfra] = useState<InfraPoint | null>(null);
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [isVolunteerHubOpen, setIsVolunteerHubOpen] = useState(false);
  const [isCatDexOpen, setIsCatDexOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isClinicsOpen, setIsClinicsOpen] = useState(false);
  const [isCaregiversOpen, setIsCaregiversOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    return !localStorage.getItem('kotokarta_onboarding_completed');
  });

  // Handlers
  const handleToggleRole = () => {
    setUserRole((prev) => (prev === 'guest' ? 'verified_curator' : 'guest'));
  };

  const handleSightingReport = (
    catId: string,
    extra?: { condition: 'active' | 'resting' | 'eating' | 'alert'; note: string }
  ) => {
    const newEntry = extra
      ? {
          id: `s-${Date.now()}`,
          date: new Date().toLocaleDateString('ru-RU'),
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          author: 'Вы (житель Самары)',
          condition: extra.condition,
          note: extra.note,
        }
      : {
          id: `s-${Date.now()}`,
          date: new Date().toLocaleDateString('ru-RU'),
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          author: 'Вы (житель Самары)',
          condition: 'active' as const,
          note: 'Быстрая отметка присутствия.',
        };

    setCats((prev) =>
      prev.map((cat) => {
        if (cat.id === catId) {
          return {
            ...cat,
            sightingsCount: cat.sightingsCount + 1,
            lastSeen: 'Только что (подтверждено горожанином)',
            sightingsHistory: [newEntry, ...(cat.sightingsHistory || [])],
          };
        }
        return cat;
      })
    );

    // Add to CatDex journal
    setDexEntries((prev) => [
      { catId, metAt: 'Только что', note: extra?.note || 'Отметка «Видел сегодня»' },
      ...prev,
    ]);

    // Update badge progress
    setBadges((prev) =>
      prev.map((b) => {
        if (b.id === 'b-1') {
          const next = b.progress + 1;
          return { ...b, progress: next, unlocked: next >= b.maxProgress };
        }
        return b;
      })
    );

    // Refresh selected cat if open
    setSelectedCat((prev) =>
      prev && prev.id === catId
        ? {
            ...prev,
            sightingsCount: prev.sightingsCount + 1,
            lastSeen: 'Только что (подтверждено горожанином)',
            sightingsHistory: [newEntry, ...(prev.sightingsHistory || [])],
          }
        : prev
    );
  };

  const handleDonateTreatment = (catId: string, amount: number) => {
    setCats((prev) =>
      prev.map((c) => {
        if (c.id === catId && c.treatmentStatus) {
          const currentCollected = c.treatmentStatus.collectedAmount || 0;
          return {
            ...c,
            treatmentStatus: {
              ...c.treatmentStatus,
              collectedAmount: currentCollected + amount,
            },
          };
        }
        return c;
      })
    );

    setSelectedCat((prev) => {
      if (prev && prev.id === catId && prev.treatmentStatus) {
        const currentCollected = prev.treatmentStatus.collectedAmount || 0;
        return {
          ...prev,
          treatmentStatus: {
            ...prev.treatmentStatus,
            collectedAmount: currentCollected + amount,
          },
        };
      }
      return prev;
    });
  };

  const handleCreateSosForCat = (cat: CatProfile, customReason?: string) => {
    const newTicket: SosTicket = {
      id: `sos-${Date.now()}`,
      title: `Срочно: ${cat.name} (${cat.district})`,
      catId: cat.id,
      catName: cat.name,
      district: cat.district,
      priority: 'urgent',
      category: 'injury',
      description: customReason || cat.sosReason || `Требуется срочная помощь коту ${cat.name}`,
      status: 'open',
      createdAt: 'Только что',
      targetClinicName: cat.treatmentStatus?.clinicName || 'Партнерская клиника «ВетСамара Экспресс»',
    };
    setTickets((prev) => [newTicket, ...prev]);
    setSelectedCat(null);
    setIsVolunteerHubOpen(true);
  };

  const handleOpenShelterFromCat = (shelterId: string) => {
    const found = infraPoints.find((i) => i.id === shelterId);
    if (found) {
      setSelectedCat(null);
      setSelectedInfra(found);
    }
  };

  const handleBecomeCurator = (catId: string) => {
    setCats((prev) =>
      prev.map((cat) => {
        if (cat.id === catId) {
          return {
            ...cat,
            hasCurator: true,
            curatorName: 'Вы (заявка на кураторство)',
          };
        }
        return cat;
      })
    );
    setSelectedCat((prev) =>
      prev && prev.id === catId
        ? { ...prev, hasCurator: true, curatorName: 'Вы (заявка на кураторство)' }
        : prev
    );
  };

  const handleToggleFeedingSlot = (catId: string, slot: 'morning' | 'evening') => {
    setCats((prev) =>
      prev.map((cat) => {
        if (cat.id === catId && cat.feedingSchedule) {
          const currentSlot = cat.feedingSchedule[slot];
          const newStatus = currentSlot.status === 'done' ? 'pending' : 'done';
          return {
            ...cat,
            feedingSchedule: {
              ...cat.feedingSchedule,
              [slot]: {
                ...currentSlot,
                status: newStatus,
                volunteer: newStatus === 'done' ? 'Вы (волонтер)' : currentSlot.volunteer,
              },
            },
          };
        }
        return cat;
      })
    );

    // Update badge progress
    setBadges((prev) =>
      prev.map((b) => {
        if (b.id === 'b-2') {
          const next = b.progress + 1;
          return { ...b, progress: next, unlocked: next >= b.maxProgress };
        }
        return b;
      })
    );

    // Update modal
    setSelectedCat((prev) => {
      if (prev && prev.id === catId && prev.feedingSchedule) {
        const currentSlot = prev.feedingSchedule[slot];
        const newStatus = currentSlot.status === 'done' ? 'pending' : 'done';
        return {
          ...prev,
          feedingSchedule: {
            ...prev.feedingSchedule,
            [slot]: {
              ...currentSlot,
              status: newStatus,
              volunteer: newStatus === 'done' ? 'Вы (волонтер)' : currentSlot.volunteer,
            },
          },
        };
      }
      return prev;
    });
  };

  const handleAddCat = (newCat: CatProfile) => {
    setCats((prev) => [newCat, ...prev]);
    setSelectedCat(newCat);

    // Update badge
    setBadges((prev) =>
      prev.map((b) => (b.id === 'b-3' ? { ...b, unlocked: true, progress: 1 } : b))
    );
  };

  const handleTakeTicket = (ticketId: string, volunteerName: string) => {
    const targetTicket = tickets.find((t) => t.id === ticketId);
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: 'in_progress', assignedVolunteer: volunteerName }
          : t
      )
    );

    // Update Auto-angel badge progress if it is an auto-volunteer route
    if (targetTicket && targetTicket.route) {
      setBadges((prev) =>
        prev.map((b) => {
          if (b.id === 'b-4') {
            const next = b.progress + 1;
            return { ...b, progress: next, unlocked: next >= b.maxProgress };
          }
          return b;
        })
      );
    }
  };

  const handleCreateTicket = (newTicket: SosTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleScanQr = (qrCodeId: string) => {
    // Find matching shelter
    const matchingInfra = infraPoints.find((i) => i.qrCodeId === qrCodeId);
    if (matchingInfra) {
      setSelectedInfra(matchingInfra);
    }
  };

  const openCatFromOther = (cat: CatProfile) => {
    setSelectedInfra(null);
    setSelectedCat(cat);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#FAF2E8] texture-felt font-sans">
      {/* Header with Navigation and Role Switcher */}
      <Header
        userRole={userRole}
        onToggleRole={handleToggleRole}
        activeFilter={activeFilter}
        onChangeFilter={setActiveFilter}
        infraFilter={infraFilter}
        onChangeInfraFilter={setInfraFilter}
        districtFilter={districtFilter}
        onChangeDistrict={setDistrictFilter}
        onOpenAddCat={() => setIsAddCatOpen(true)}
        onOpenVolunteerHub={() => setIsVolunteerHubOpen(true)}
        onOpenCatDex={() => setIsCatDexOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenTutorial={() => setIsOnboardingOpen(true)}
        onOpenClinics={() => setIsClinicsOpen(true)}
        onOpenCaregiversHub={() => setIsCaregiversOpen(true)}
        sosCount={tickets.filter((t) => t.status === 'open').length}
      />

      {/* Main Map Container */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        <MapView
          cats={cats}
          infraPoints={infraPoints}
          selectedCatId={selectedCat?.id || null}
          userRole={userRole}
          activeFilter={activeFilter}
          infraFilter={infraFilter}
          districtFilter={districtFilter}
          onSelectCat={(cat) => setSelectedCat(cat)}
          onSelectInfra={(infra) => setSelectedInfra(infra)}
        />

        {/* Floating Live Samara Weather & Shelter Widget */}
        <SamaraUrbanWidget
          totalCatsCount={cats.length}
          osvvCount={cats.filter((c) => c.status === 'osvv').length}
          activeSheltersCount={infraPoints.filter((i) => i.type === 'shelter').length}
          openTicketsCount={tickets.filter((t) => t.status === 'open').length}
          onOpenSheltersList={() => setIsQuickDrawerOpen(true)}
          onOpenVolunteerHub={() => setIsVolunteerHubOpen(true)}
        />

        {/* Floating Quick Drawer & Cat Register */}
        <QuickDrawer
          cats={cats}
          infraPoints={infraPoints}
          selectedCatId={selectedCat?.id || null}
          isOpen={isQuickDrawerOpen}
          onToggle={() => setIsQuickDrawerOpen((prev) => !prev)}
          onSelectCat={(cat) => setSelectedCat(cat)}
          onSelectInfra={(infra) => setSelectedInfra(infra)}
          onOpenClinics={() => setIsClinicsOpen(true)}
          onOpenVolunteerHub={() => setIsVolunteerHubOpen(true)}
          onOpenCaregiversHub={() => setIsCaregiversOpen(true)}
        />
      </main>

      {/* Modals */}
      {selectedCat && (
        <CatPassportModal
          cat={selectedCat}
          userRole={userRole}
          onClose={() => setSelectedCat(null)}
          onSightingReport={handleSightingReport}
          onBecomeCurator={handleBecomeCurator}
          onToggleFeedingSlot={handleToggleFeedingSlot}
          onDonateTreatment={handleDonateTreatment}
          onCreateSosTicket={handleCreateSosForCat}
          onOpenShelter={handleOpenShelterFromCat}
          onOpenClinics={() => setIsClinicsOpen(true)}
        />
      )}

      {selectedInfra && (
        <InfraModal
          infra={selectedInfra}
          allCats={cats}
          onClose={() => setSelectedInfra(null)}
          onOpenCat={openCatFromOther}
          onScanQr={handleScanQr}
        />
      )}

      {isAddCatOpen && (
        <AddCatModal
          onClose={() => setIsAddCatOpen(false)}
          onAddCat={handleAddCat}
        />
      )}

      {isVolunteerHubOpen && (
        <VolunteerHubModal
          tickets={tickets}
          cats={cats}
          clinics={infraPoints.filter((i) => i.type === 'vet_clinic')}
          userRole={userRole}
          onClose={() => setIsVolunteerHubOpen(false)}
          onTakeTicket={handleTakeTicket}
          onCreateTicket={handleCreateTicket}
          onToggleFeedingSlot={handleToggleFeedingSlot}
          onOpenClinicsList={() => setIsClinicsOpen(true)}
          onOpenCaregiversHub={() => setIsCaregiversOpen(true)}
        />
      )}

      {/* Multi-Cat Caregivers Support Hub Modal */}
      {isCaregiversOpen && (
        <CaregiversHubModal
          caregivers={SAMARA_CAREGIVERS}
          onClose={() => setIsCaregiversOpen(false)}
        />
      )}

      {/* Partner Veterinary Clinics Modal */}
      {isClinicsOpen && (
        <VetClinicsModal
          clinics={infraPoints.filter((i) => i.type === 'vet_clinic')}
          onClose={() => setIsClinicsOpen(false)}
          onSelectClinicForSos={(clinic) => {
            setIsClinicsOpen(false);
            setIsVolunteerHubOpen(true);
          }}
          onSelectOnMap={(clinic) => {
            setSelectedInfra(clinic);
          }}
        />
      )}

      {isCatDexOpen && (
        <CatDexModal
          cats={cats}
          badges={badges}
          dexEntries={dexEntries}
          onClose={() => setIsCatDexOpen(false)}
          onOpenCat={openCatFromOther}
          onScanCode={handleScanQr}
        />
      )}

      {isAboutOpen && (
        <AboutSafetyModal onClose={() => setIsAboutOpen(false)} />
      )}

      {/* Zero-Harm Interactive Onboarding */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
}
