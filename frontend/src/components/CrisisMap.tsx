"use client";

import React, { useEffect, useState } from "react";
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin,
  InfoWindow,
  useMap
} from "@vis.gl/react-google-maps";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Info, Navigation, Globe, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const MAP_ID = "tactical_map_id";

interface ResourceTeam {
  id: string;
  type: string;
  status: string;
  lat: number;
  lng: number;
  last_update: string;
}

const center = { lat: 13.0827, lng: 80.2707 };

const dangerZones = [
  { id: 1, center: { lat: 13.0827, lng: 80.2707 }, radius: 1000, color: "#ef4444" },
  { id: 2, center: { lat: 13.0418, lng: 80.2312 }, radius: 1500, color: "#f59e0b" },
];

const safeZones = [
  { id: 1, center: { lat: 13.0125, lng: 80.2541 }, radius: 1200, color: "#10b981" },
];

// Custom components for Google Maps (Circle, Polyline)
function Circle({ center, radius, options }: { center: google.maps.LatLngLiteral, radius: number, options: google.maps.CircleOptions }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const circle = new google.maps.Circle({
      map,
      center,
      radius,
      ...options
    });
    return () => circle.setMap(null);
  }, [map, center, radius, options]);
  return null;
}

function Polyline({ path, options }: { path: google.maps.LatLngLiteral[], options: google.maps.PolylineOptions }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const polyline = new google.maps.Polyline({
      map,
      path,
      ...options
    });
    return () => polyline.setMap(null);
  }, [map, path, options]);
  return null;
}

export function CrisisMap() {
  const [mounted, setMounted] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [rescueTeams, setRescueTeams] = useState<ResourceTeam[]>([]);
  const hasApiKey = GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== "";

  useEffect(() => {
    setMounted(true);
    const fetchResources = async () => {
      try {
        const response = await fetch("http://localhost:8000/resources");
        const data = await response.json();
        setRescueTeams(data);
      } catch (error) {
        console.error("Neural Core Connection Error:", error);
      }
    };
    fetchResources();
    const interval = setInterval(fetchResources, 8000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return (
    <div className="w-full h-full bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
    </div>
  );

  // --- Tactical Radar Fallback (For missing API keys) ---
  if (!hasApiKey) {
    return (
      <div className="w-full h-full bg-[#050505] relative overflow-hidden flex items-center justify-center border border-white/5 rounded-[3rem]">
        {/* Dynamic Grid Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#10b981 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#10b981 0.5px, transparent 0.5px), linear-gradient(90deg, #10b981 0.5px, transparent 0.5px)', backgroundSize: '100px 100px' }} />
        
        {/* Radar Pulse */}
        <motion.div 
          animate={{ scale: [1, 2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute w-[500px] h-[500px] rounded-full border border-brand/20 bg-brand/5 blur-3xl pointer-events-none"
        />

        <div className="z-10 flex flex-col items-center gap-6 text-center max-w-md px-8">
            <div className="w-16 h-16 rounded-3xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-2">
                <Navigation className="w-8 h-8 text-brand animate-pulse" />
            </div>
            <div>
                <h3 className="text-xl font-black uppercase text-white tracking-[0.2em] mb-2 italic">Tactical Grid Mode</h3>
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-[0.3em] leading-relaxed">
                    Google Maps API Key missing or unauthorized. Reverting to local Neural Terrain fallback.
                </p>
            </div>
            
            {/* Visual Tactical Nodes Fallback */}
            <div className="flex justify-center gap-6 mt-4 flex-wrap">
                {rescueTeams.length > 0 ? rescueTeams.map((team) => (
                    <div key={team.id} className="flex flex-col items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 min-w-[70px]">
                        <div className={cn(
                          "w-2 h-2 rounded-full animate-pulse",
                          team.type === "Medical" ? "bg-brand" : team.type === "Fire" ? "bg-danger" : "bg-safe"
                        )} />
                        <span className="text-[9px] font-black text-white uppercase tracking-wider">{team.id}</span>
                        <span className="text-[7px] text-white/45 uppercase tracking-widest">{team.status}</span>
                    </div>
                )) : ['MED-01', 'FIRE-04', 'LOG-08'].map((id) => (
                    <div key={id} className="flex flex-col items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 min-w-[70px]">
                        <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                        <span className="text-[9px] font-black text-white uppercase tracking-wider">{id}</span>
                        <span className="text-[7px] text-white/45 uppercase tracking-widest">Active</span>
                    </div>
                ))}
            </div>

            <div className="mt-8 px-6 py-2 rounded-xl bg-brand/5 border border-brand/20 flex items-center gap-3">
                <Globe className="w-3.5 h-3.5 text-brand" />
                <span className="text-[9px] font-black text-brand uppercase tracking-widest">Awaiting Valid Satellite Uplink</span>
            </div>
        </div>

        {/* HUD Elements for consistent UI */}
        <div className="absolute top-8 left-8 z-[1] pointer-events-none">
          <div className="flex items-center gap-3 glass px-4 py-2 rounded-2xl border-white/10">
            <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white shadow-sm">Geo-Tactical Sync : LOCAL FALLBACK</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group overflow-hidden">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={center}
          defaultZoom={13}
          mapId={MAP_ID}
          disableDefaultUI={true}
          gestureHandling={"greedy"}
          styles={darkTacticalTheme}
          className="w-full h-full bg-[#050505]"
        >
          {/* Tactical Layers */}
          {dangerZones.map((zone) => (
            <Circle
              key={`danger-${zone.id}`}
              center={zone.center}
              radius={zone.radius}
              options={{
                fillColor: zone.color,
                fillOpacity: 0.2,
                strokeColor: zone.color,
                strokeWeight: 2,
                clickable: false
              }}
            />
          ))}

          {rescueTeams.map((team) => (
            <AdvancedMarker 
              key={team.id} 
              position={{ lat: team.lat, lng: team.lng }}
              onClick={() => setSelectedTeam(team.id)}
            >
               <motion.div
                 animate={{ scale: [1, 1.2, 1] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="relative"
               >
                 <Pin 
                   background={team.type === 'Medical' ? "#10b981" : team.type === 'Fire' ? "#ef4444" : "#3b82f6"} 
                   glyphColor={"#000"} 
                   borderColor={"#1e40af"} 
                 />
                 <div className="absolute inset-0 rounded-full bg-current opacity-20 animate-ping" 
                      style={{ color: team.type === 'Medical' ? "#10b981" : team.type === 'Fire' ? "#ef4444" : "#3b82f6" }} />
               </motion.div>
            </AdvancedMarker>
          ))}

          <AdvancedMarker position={center}>
             <Pin background={"#ef4444"} glyphColor={"#fff"} borderColor={"#b91c1c"} />
          </AdvancedMarker>

          {selectedTeam && (
            <InfoWindow
              position={{ 
                lat: rescueTeams.find(t => t.id === selectedTeam)?.lat || 0, 
                lng: rescueTeams.find(t => t.id === selectedTeam)?.lng || 0 
              }}
              onCloseClick={() => setSelectedTeam(null)}
            >
                <div className="p-2 text-black min-w-[120px]">
                    <h3 className="text-xs font-black uppercase text-brand">Team Status</h3>
                    <p className="text-[10px] mt-1 text-gray-700">Personnel: Alpha Unit</p>
                    <p className="text-[10px] text-gray-700">ETA: 4 mins</p>
                </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
      
      {/* HUD Overlays (HTML over Map) */}
      <div className="absolute top-8 left-8 z-[1] pointer-events-none">
        <div className="flex items-center gap-3 glass px-4 py-2 rounded-2xl border-white/10">
          <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white shadow-sm">Geo-Tactical Sync : Google Maps AI</span>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-8 z-[1] pointer-events-none">
        <div className="glass px-4 py-2 rounded-xl text-[10px] font-bold border-brand/20 text-brand uppercase tracking-tighter shadow-xl">
           Neural Terrain Map Enabled
        </div>
      </div>
    </div>
  );
}

const darkTacticalTheme: google.maps.MapTypeStyle[] = [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
    { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "poi.park", elementType: "labels.text.stroke", stylers: [{ color: "#1b1b1b" }] },
    { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
    { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#4e4e4e" }] },
    { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] }
];
