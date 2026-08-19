import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function SatellitePlotMap({ 
  center = [27.7, 85.3], 
  activeType = 'NDVI',
  opacity = 0.55,
  height = "420px" 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polygonRef = useRef(null);

  const colors = {
    'NDVI': '#2DA86E',
    'NDMI': '#3B82F6',
    'SAVI': '#F59E0B'
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false
      }).setView(center, 16);

      L.control.zoom({ position: 'bottomleft' }).addTo(map);

      // Satellite tile layer
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri, DigitalGlobe, GeoEye'
      }).addTo(map);

      const latlngs = [
        [center[0] - 0.0012, center[1] - 0.0014],
        [center[0] + 0.0015, center[1] - 0.0011],
        [center[0] + 0.0011, center[1] + 0.0016],
        [center[0] - 0.0014, center[1] + 0.0012]
      ];

      const poly = L.polygon(latlngs, {
        color: colors[activeType] || '#2DA86E',
        fillColor: colors[activeType] || '#2DA86E',
        fillOpacity: opacity,
        weight: 2.5
      }).addTo(map);

      map.fitBounds(poly.getBounds());
      polygonRef.current = poly;
      mapInstanceRef.current = map;
    } else {
      if (polygonRef.current) {
        const strokeColor = colors[activeType] || '#2DA86E';
        polygonRef.current.setStyle({
          color: strokeColor,
          fillColor: strokeColor,
          fillOpacity: opacity
        });
      }
    }
  }, [center, activeType, opacity]);

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
