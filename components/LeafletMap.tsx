
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  lat: number;
  lng: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  readOnly?: boolean;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ lat, lng, onLocationSelect, readOnly = false }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current).setView([lat, lng], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapInstanceRef.current);
    } else {
       mapInstanceRef.current.setView([lat, lng]);
    }

    // Handle Marker
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: '#0ea5e9',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(mapInstanceRef.current);
    }

    // Click Handler
    if (!readOnly && onLocationSelect) {
       mapInstanceRef.current.on('click', (e) => {
         onLocationSelect(e.latlng.lat, e.latlng.lng);
       });
    }

    // Cleanup: We usually reuse map instance in SPA, but if component unmounts we could remove
    // In this simplified version, keeping instance is safer for re-renders
    
  }, [lat, lng, readOnly]);

  return <div ref={mapContainerRef} className="w-full h-full rounded-lg z-0" />;
};

export default LeafletMap;
