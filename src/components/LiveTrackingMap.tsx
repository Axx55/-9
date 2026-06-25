import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from '../lib/supabase';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Bus Icon
const busIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface LocationData {
  lat: number;
  lng: number;
}

interface LiveTrackingMapProps {
  tripId: string;
  driverName: string;
  initialLocation?: LocationData;
}

export function LiveTrackingMap({ tripId, driverName, initialLocation = { lat: 24.7136, lng: 46.6753 } }: LiveTrackingMapProps) {
  const [location, setLocation] = useState<LocationData>(initialLocation);
  
  useEffect(() => {
    // Attempt to subscribe to Supabase Realtime for live tracking
    // This assumes there's a 'driver_locations' channel
    const channel = supabase.channel(`tracking_${tripId}`)
      .on('broadcast', { event: 'location_update' }, (payload) => {
        if (payload.payload && payload.payload.lat && payload.payload.lng) {
          setLocation({
            lat: payload.payload.lat,
            lng: payload.payload.lng
          });
        }
      })
      .subscribe();

    // Mock live movement for demonstration purposes if no real updates arrive
    const interval = setInterval(() => {
      setLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }));
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [tripId]);

  return (
    <div className="h-48 w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner z-0">
      <MapContainer 
        center={[location.lat, location.lng]} 
        zoom={14} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <Marker position={[location.lat, location.lng]} icon={busIcon}>
          <Popup className="font-sans font-bold" dir="rtl">
            <div className="text-center">
              <div className="text-indigo-600 mb-1">كابتن: {driverName}</div>
              <div className="text-xs text-slate-500">جاري التتبع المباشر...</div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
