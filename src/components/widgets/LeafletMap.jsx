import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function LeafletMap({ 
  meters = [], 
  farmers = [], 
  center = [27.7, 85.3], 
  zoom = 10,
  height = "400px" 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false
      }).setView(center, zoom);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;

    group.clearLayers();

    // Add meters
    meters.forEach(m => {
      if (m.location) {
        L.circleMarker(m.location, {
          radius: 8,
          fillColor: '#205B90',
          color: '#ffffff',
          weight: 2,
          fillOpacity: 0.9
        })
        .bindPopup(`
          <div style="font-family: Inter, sans-serif; padding: 2px;">
            <p style="font-weight: bold; font-size: 13px; color: #1F2937; margin: 0 0 2px 0;">${m.name}</p>
            <p style="font-size: 11px; color: #6B7280; font-family: monospace; margin: 0;">${m.aepcId}</p>
          </div>
        `)
        .addTo(group);
      }
    });

    // Add farmers
    farmers.forEach(f => {
      if (f.coords) {
        L.circleMarker(f.coords, {
          radius: 6,
          fillColor: '#2DA86E',
          color: '#ffffff',
          weight: 2,
          fillOpacity: 0.8
        })
        .bindPopup(`
          <div style="font-family: Inter, sans-serif; padding: 2px;">
            <p style="font-weight: bold; font-size: 13px; color: #1F2937; margin: 0 0 2px 0;">${f.name}</p>
            <p style="font-size: 11px; color: #2DA86E; font-weight: 600; margin: 0;">${f.occupation}</p>
          </div>
        `)
        .addTo(group);
      }
    });

  }, [meters, farmers, center, zoom]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height, width: '100%' }}
      className="rounded-xl overflow-hidden shadow-inner z-0"
    />
  );
}
