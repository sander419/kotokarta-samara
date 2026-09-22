import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { CatProfile, InfraPoint, UserRole } from '../types';
import { 
  Locate, 
  Compass, 
  Plus, 
  Minus, 
  MapPin, 
  ShieldCheck
} from 'lucide-react';
import { playPurrHaptic } from '../utils/haptics';

interface MapViewProps {
  cats: CatProfile[];
  infraPoints: InfraPoint[];
  selectedCatId: string | null;
  userRole: UserRole;
  activeFilter: string;
  infraFilter: string;
  districtFilter: string;
  onSelectCat: (cat: CatProfile) => void;
  onSelectInfra: (infra: InfraPoint) => void;
}

const DISTRICT_CENTERS: Record<string, [number, number, number]> = {
  all: [53.2001, 50.1500, 12],
  'Самарский': [53.1885, 50.0880, 15],
  'Ленинский': [53.1970, 50.1030, 15],
  'Октябрьский': [53.2160, 50.1520, 14],
  'Кировский (Безымянка)': [53.2220, 50.2780, 14],
  'Промышленный': [53.2420, 50.2240, 14],
  'Железнодорожный': [53.1930, 50.1650, 14],
  'Советский': [53.2080, 50.2150, 14],
  'Красноглинский': [53.3850, 50.2100, 13],
};

export const MapView: React.FC<MapViewProps> = ({
  cats,
  infraPoints,
  selectedCatId,
  userRole,
  activeFilter,
  infraFilter,
  districtFilter,
  onSelectCat,
  onSelectInfra,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);
  const userAccuracyCircleRef = useRef<L.Circle | null>(null);

  const [isLocating, setIsLocating] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(true);

  // Initialize Map with OpenStreetMap Standard layer
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered on Samara historical center
    const map = L.map(mapContainerRef.current, {
      center: [53.1950, 50.1000],
      zoom: 14,
      minZoom: 10,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: true,
      fadeAnimation: true,
      zoomAnimation: true,
      markerZoomAnimation: true,
    });

    // OpenStreetMap standard tile layer with parallel subdomains
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add crisp metric scale bar
    L.control.scale({ 
      imperial: false, 
      metric: true, 
      position: 'bottomleft',
      maxWidth: 140 
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    // Handle dynamic resize container
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map view when district filter changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const centerConfig = DISTRICT_CENTERS[districtFilter] || DISTRICT_CENTERS.all;
    mapInstanceRef.current.flyTo([centerConfig[0], centerConfig[1]], centerConfig[2], {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [districtFilter]);

  // Smooth pan to selected cat when clicked
  useEffect(() => {
    if (!selectedCatId || !mapInstanceRef.current) return;
    const targetCat = cats.find((c) => c.id === selectedCatId);
    if (!targetCat) return;
    const coords = userRole === 'verified_curator' ? targetCat.realCoords : targetCat.fuzzedCoords;
    mapInstanceRef.current.flyTo(coords, Math.max(mapInstanceRef.current.getZoom(), 16), {
      duration: 0.8,
      easeLinearity: 0.25,
    });
  }, [selectedCatId, cats, userRole]);

  // Render markers and fuzzing circles
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const layer = layerGroupRef.current;
    layer.clearLayers();

    // 1. Render Cats
    cats.forEach((cat) => {
      // Filter logic
      if (activeFilter !== 'all' && cat.status !== activeFilter) return;
      if (districtFilter !== 'all' && cat.district !== districtFilter) return;

      const isCurator = userRole === 'verified_curator';
      const coords = isCurator ? cat.realCoords : cat.fuzzedCoords;

      if (!isCurator) {
        // Zero-Harm Fuzzing circle (radius ~100m)
        const circle = L.circle(coords, {
          color: cat.status === 'sos' ? '#FF8EAB' : '#F59E42',
          fillColor: cat.status === 'sos' ? '#FFA3BA' : '#FBBF24',
          fillOpacity: 0.18,
          weight: 1.5,
          dashArray: '4, 6',
          radius: 110,
        });

        circle.bindTooltip(
          `<div class="text-xs font-sans font-medium text-[#3B2822]">
            <strong>🛡️ Зона Zero-Harm (~100м)</strong><br/>
            ${cat.name} (${cat.status === 'sos' ? '⚠️ SOS' : 'ОСВВ'})<br/>
            <span class="text-[#8C6D62]">Точные координаты защищены</span>
          </div>`,
          { direction: 'top', opacity: 0.95 }
        );

        circle.on('click', () => {
          playPurrHaptic();
          onSelectCat(cat);
        });
        layer.addLayer(circle);
      }

      // Cat Marker Icon
      const isSelected = selectedCatId === cat.id;

      let iconHtml = '';

      if (cat.status === 'sos') {
        // SOS Pin: Розовая тревожная лапка с легкой пульсирующей аурой (radar-effect)
        iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-115 ${isSelected ? 'scale-125 z-50' : ''}">
            <!-- Radar Aura -->
            <div class="absolute -inset-2 rounded-full bg-[#FF8EAB] animate-radar opacity-80 pointer-events-none"></div>
            <!-- Main Paw Pin -->
            <div class="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF8EAB] to-[#FFA3BA] shadow-lg border-2 border-white flex items-center justify-center text-white">
              <svg class="w-5 h-5 fill-current drop-shadow-xs" viewBox="0 0 24 24">
                <ellipse cx="6.5" cy="8" rx="2" ry="3"/>
                <ellipse cx="12" cy="6" rx="2" ry="3.2"/>
                <ellipse cx="17.5" cy="8" rx="2" ry="3"/>
                <ellipse cx="3.5" cy="13" rx="1.8" ry="2.5"/>
                <path d="M12 11c-3.5 0-6 2.5-6 6.5 0 2.2 1.8 3.5 3.5 3.5 1.5 0 2.5-.8 2.5-.8s1 .8 2.5 .8c1.7 0 3.5-1.3 3.5-3.5 0-4-2.5-6.5-6-6.5z"/>
              </svg>
              <span class="absolute -top-1.5 -right-1.5 bg-[#E11D48] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-xs animate-pulse">SOS</span>
            </div>
          </div>
        `;
      } else {
        // Standard Cozy Pin: Теплый кошачий аватар
        const badgeColor =
          cat.status === 'osvv'
            ? 'bg-[#10B981] text-white'
            : cat.status === 'adoptable'
            ? 'bg-[#FBBF24] text-slate-900'
            : cat.status === 'foster'
            ? 'bg-[#3B82F6] text-white'
            : 'bg-[#F59E42] text-white';

        const badgeIcon =
          cat.status === 'osvv'
            ? '✂️'
            : cat.status === 'adoptable'
            ? '💖'
            : cat.status === 'foster'
            ? '🏡'
            : '🐾';

        iconHtml = `
          <div class="relative flex flex-col items-center cursor-pointer transition-transform hover:scale-115 ${isSelected ? 'scale-125 z-50' : ''}">
            <div class="w-10 h-10 rounded-2xl p-0.5 bg-[#FFF9F2] shadow-md border-2 ${isSelected ? 'border-[#F59E42] ring-2 ring-[#F59E42]/40' : 'border-[#E7D6C3]'} overflow-hidden relative">
              <img src="${cat.photos[0]}" alt="${cat.name}" class="w-full h-full object-cover rounded-xl" />
              <!-- Status Mini-Badge -->
              <span class="absolute bottom-0 right-0 ${badgeColor} text-[8px] rounded-full w-4 h-4 flex items-center justify-center border border-white shadow-2xs">
                ${badgeIcon}
              </span>
            </div>
            <!-- Pin Pointer -->
            <div class="w-2 h-2 bg-[#FFF9F2] border-r-2 border-b-2 ${isSelected ? 'border-[#F59E42]' : 'border-[#E7D6C3]'} transform rotate-45 -mt-1 shadow-xs"></div>
          </div>
        `;
      }

      const catIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-cat-marker',
        iconSize: [40, 44],
        iconAnchor: [20, 42],
        popupAnchor: [0, -40],
      });

      const marker = L.marker(coords, { icon: catIcon });
      marker.on('click', () => {
        playPurrHaptic();
        onSelectCat(cat);
      });

      const isEarTipped = cat.specialMarks?.some((m) => m.toLowerCase().includes('ушко') || m.toLowerCase().includes('освв')) || cat.status === 'osvv';

      // Rich Popover Tooltip
      marker.bindTooltip(
        `<div class="p-1 font-sans">
          <div class="font-bold text-[#3B2822] text-xs flex items-center gap-1 font-comfortaa">
            ${cat.name} ${isEarTipped ? '✂️' : ''}
          </div>
          <div class="text-[11px] text-[#8C6D62]">${cat.district} · ${cat.coat}</div>
          ${cat.status === 'sos' ? '<div class="text-[10px] text-[#E11D48] font-bold mt-0.5">⚠️ ТРЕБУЕТСЯ СРОЧНАЯ ПОМОЩЬ</div>' : ''}
        </div>`,
        { direction: 'top', offset: [0, -28] }
      );

      layer.addLayer(marker);
    });

    // 2. Render Infrastructure Points
    infraPoints.forEach((infra) => {
      if (infraFilter !== 'all' && infra.type !== infraFilter) return;

      let infraColor = '#8C6D62';
      let infraEmoji = '🛖';
      if (infra.type === 'shelter') {
        infraColor = '#965C38';
        infraEmoji = '🛖';
      } else if (infra.type === 'vet_clinic') {
        infraColor = '#10B981';
        infraEmoji = '🏥';
      } else if (infra.type === 'pet_friendly') {
        infraColor = '#F59E42';
        infraEmoji = '☕';
      } else if (infra.type === 'feeder') {
        infraColor = '#3B82F6';
        infraEmoji = '🥣';
      }

      const infraHtml = `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-115">
          <div class="w-8 h-8 rounded-xl shadow-md border-2 border-white flex items-center justify-center text-sm font-bold text-white shadow-xs" style="background-color: ${infraColor}">
            ${infraEmoji}
          </div>
        </div>
      `;

      const infraIcon = L.divIcon({
        html: infraHtml,
        className: 'custom-infra-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker(infra.coords, { icon: infraIcon });
      marker.on('click', () => {
        playPurrHaptic();
        onSelectInfra(infra);
      });

      marker.bindTooltip(
        `<div class="p-1 font-sans">
          <div class="font-bold text-[#3B2822] text-xs font-comfortaa">${infra.name}</div>
          <div class="text-[11px] text-[#8C6D62]">${infra.address}</div>
          ${infra.isWinterHeated ? '<div class="text-[10px] text-[#F59E42] font-bold mt-0.5">❄️ Утепленный зимний котодомик</div>' : ''}
        </div>`,
        { direction: 'top', offset: [0, -14] }
      );

      layer.addLayer(marker);
    });
  }, [cats, infraPoints, selectedCatId, userRole, activeFilter, infraFilter, districtFilter, onSelectCat, onSelectInfra]);

  // Geolocation Handler
  const handleLocateUser = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) return;
    playPurrHaptic();
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude, accuracy } = pos.coords;
        const map = mapInstanceRef.current;
        if (!map) return;

        map.flyTo([latitude, longitude], 16, { duration: 1.2 });

        if (userLocationMarkerRef.current) {
          userLocationMarkerRef.current.remove();
        }
        if (userAccuracyCircleRef.current) {
          userAccuracyCircleRef.current.remove();
        }

        // Accuracy circle
        const accCircle = L.circle([latitude, longitude], {
          radius: Math.min(accuracy, 180),
          color: '#F59E42',
          fillColor: '#F59E42',
          fillOpacity: 0.15,
          weight: 1.5,
          dashArray: '3, 5',
        }).addTo(map);
        userAccuracyCircleRef.current = accCircle;

        // User Paw icon
        const userIcon = L.divIcon({
          className: 'user-location-paw',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="absolute w-9 h-9 rounded-full bg-[#F59E42]/30 animate-ping"></div>
              <div class="w-8 h-8 rounded-2xl bg-[#3B2822] text-[#FFF9F2] border-2 border-white shadow-lg flex items-center justify-center text-sm font-bold">
                🐾
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([latitude, longitude], { icon: userIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-2.5 text-center font-comfortaa">
              <div class="font-bold text-xs text-[#3B2822]">Вы здесь 🐾</div>
              <div class="text-[10px] text-[#8C6D62] mt-0.5">Точность: ~${Math.round(accuracy)} м</div>
            </div>
          `);
        userLocationMarkerRef.current = marker;
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation warning:', err.message);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 20000 }
    );
  };

  const handleResetToSamara = () => {
    playPurrHaptic();
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([53.1950, 50.1000], 14, { duration: 1 });
  };

  return (
    <div className="relative w-full h-full select-none">
      <div id="samara-gis-map" ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top-Right Map Tools Bar */}
      <div className="absolute top-20 right-4 z-10 flex items-center gap-2">
        {/* OpenStreetMap Active Badge */}
        <div 
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#FFF9F2]/95 backdrop-blur-md border-2 border-[#E7D6C3] text-[#3B2822] shadow-md text-xs font-bold font-comfortaa fur-shadow select-none"
          title="Картооснова: OpenStreetMap"
        >
          <span className="text-sm">🧭</span>
          <span className="hidden sm:inline">OpenStreetMap</span>
          <span className="px-1.5 py-0.5 rounded-full bg-[#FAF2E8] border border-[#E7D6C3] text-[9px] text-[#8C6D62] font-mono">
            OSM
          </span>
        </div>

        {/* Legend Toggle Button */}
        <button
          onClick={() => {
            playPurrHaptic();
            setIsLegendOpen((prev) => !prev);
          }}
          className={`p-2.5 rounded-2xl bg-[#FFF9F2]/95 backdrop-blur-md border-2 shadow-md transition-all fur-shadow ${
            isLegendOpen ? 'border-[#F59E42] text-[#F59E42]' : 'border-[#E7D6C3] text-[#8C6D62] hover:text-[#3B2822]'
          }`}
          title="Включить / скрыть пушистую легенду"
        >
          <span className="text-sm">🐾</span>
        </button>
      </div>

      {/* Interactive Floating Map Legend (Meow-morphism style) */}
      {isLegendOpen && (
        <div className="absolute top-32 right-4 z-10 hidden sm:flex flex-col gap-1.5 bg-[#FFF9F2]/95 backdrop-blur-md p-3 rounded-2xl border-2 border-[#E7D6C3] shadow-md text-[11px] text-[#3B2822] fur-shadow animate-fade-in max-w-[210px]">
          <span className="font-bold text-[10px] uppercase tracking-wider text-[#8C6D62] px-1 font-comfortaa">Пушистая легенда</span>
          <div className="flex items-center gap-2 px-1">
            <span className="w-3.5 h-3.5 rounded-md bg-[#FF8EAB] text-white flex items-center justify-center text-[9px] shadow-xs">🐾</span>
            <span className="font-medium">SOS / Нужна помощь</span>
          </div>
          <div className="flex items-center gap-2 px-1">
            <span className="w-3.5 h-3.5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[9px]">✂️</span>
            <span className="font-medium">ОСВВ (стерилизован)</span>
          </div>
          <div className="flex items-center gap-2 px-1">
            <span className="w-3.5 h-3.5 rounded-full bg-[#FBBF24] text-white flex items-center justify-center text-[9px]">💖</span>
            <span className="font-medium">Ищет семью</span>
          </div>
          <div className="flex items-center gap-2 px-1">
            <span className="w-3.5 h-3.5 rounded-md bg-[#965C38] text-white text-[9px] flex items-center justify-center font-bold">🛖</span>
            <span className="font-medium">Зимний котодомик</span>
          </div>
          <div className="flex items-center gap-2 px-1">
            <span className="w-3.5 h-3.5 rounded-md bg-[#10B981] text-white text-[9px] flex items-center justify-center font-bold">🏥</span>
            <span className="font-medium">Ветклиника</span>
          </div>
        </div>
      )}

      {/* Floating Tactical Map Controls (Bottom-Right) */}
      <div className="absolute bottom-6 right-4 z-10 flex flex-col gap-2">
        {/* Tactile Zoom Buttons */}
        <div className="flex flex-col rounded-2xl bg-[#FFF9F2]/95 backdrop-blur-md border-2 border-[#E7D6C3] shadow-md overflow-hidden fur-shadow">
          <button
            onClick={() => {
              playPurrHaptic();
              mapInstanceRef.current?.zoomIn();
            }}
            className="p-2.5 text-[#3B2822] hover:bg-[#F3E8DB] transition-colors flex items-center justify-center border-b border-[#E7D6C3]"
            title="Приблизить карту"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              playPurrHaptic();
              mapInstanceRef.current?.zoomOut();
            }}
            className="p-2.5 text-[#3B2822] hover:bg-[#F3E8DB] transition-colors flex items-center justify-center"
            title="Отдалить карту"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Locate Me Button */}
        <button
          onClick={handleLocateUser}
          disabled={isLocating}
          className={`p-2.5 rounded-2xl bg-[#FFF9F2]/95 backdrop-blur-md border-2 border-[#E7D6C3] text-[#3B2822] shadow-md hover:border-[#F59E42] fur-shadow transition-all flex items-center justify-center ${
            isLocating ? 'animate-pulse text-[#F59E42]' : ''
          }`}
          title="Мое местоположение на карте"
        >
          <Locate className="w-4 h-4 text-[#F59E42]" />
        </button>

        {/* Reset to Samara Center */}
        <button
          onClick={handleResetToSamara}
          className="p-2.5 rounded-2xl bg-[#FFF9F2]/95 backdrop-blur-md border-2 border-[#E7D6C3] text-[#3B2822] shadow-md hover:border-[#F59E42] fur-shadow transition-all flex items-center justify-center"
          title="В исторический центр Самары"
        >
          <Compass className="w-4 h-4 text-[#8C6D62] hover:rotate-45 transition-transform" />
        </button>
      </div>
    </div>
  );
};
