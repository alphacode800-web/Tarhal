import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    position: { lat: number; lng: number };
    title?: string;
    info?: string;
  }>;
  height?: string;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
    L?: any;
  }
}

function loadStylesheet(id: string, href: string) {
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.getAttribute('data-loaded') === 'true') {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)));
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.setAttribute('data-loaded', 'true');
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

async function waitForLeaflet(maxAttempts = 30): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    if (window.L) return;
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('Leaflet failed to initialize');
}

export default function GoogleMap({
  center,
  zoom = 12,
  markers = [],
  height = '400px',
  className = '',
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const markersKey = JSON.stringify(markers);

  useEffect(() => {
    let cancelled = false;

    const initLeaflet = async () => {
      try {
        loadStylesheet('leaflet-css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
        await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
        await waitForLeaflet();
        if (cancelled || !mapRef.current || !window.L) return;

        if (mapInstanceRef.current?.remove) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const L = window.L;
        const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap',
        }).addTo(map);

        const icon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });

        markers.forEach((marker) => {
          const m = L.marker([marker.position.lat, marker.position.lng], { icon }).addTo(map);
          if (marker.title || marker.info) {
            m.bindPopup(`<strong>${marker.title || ''}</strong><br/>${marker.info || ''}`);
          }
        });

        if (markers.length > 1) {
          const bounds = L.latLngBounds(markers.map((m) => [m.position.lat, m.position.lng]));
          map.fitBounds(bounds, { padding: [40, 40] });
        }

        mapInstanceRef.current = map;
        requestAnimationFrame(() => {
          map.invalidateSize();
          if (!cancelled) {
            setMapLoaded(true);
            setMapError(null);
          }
        });
      } catch {
        if (!cancelled) setMapError('تعذّر تحميل الخريطة');
      }
    };

    const initGoogle = () => {
      if (!mapRef.current || !window.google?.maps) return;

      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current = null;
        }

        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        });

        markers.forEach((marker) => {
          const mapMarker = new window.google.maps.Marker({
            position: marker.position,
            map,
            title: marker.title || '',
          });

          if (marker.info) {
            const infoWindow = new window.google.maps.InfoWindow({
              content: `<div style="padding:8px;max-width:220px;"><h3 style="margin:0 0 8px;font-weight:bold;">${marker.title || ''}</h3><p style="margin:0;color:#64748b;font-size:14px;">${marker.info}</p></div>`,
            });
            mapMarker.addListener('click', () => infoWindow.open(map, mapMarker));
          }
        });

        if (markers.length > 1) {
          const bounds = new window.google.maps.LatLngBounds();
          markers.forEach((m) => bounds.extend(m.position));
          map.fitBounds(bounds);
        }

        mapInstanceRef.current = map;
        setMapLoaded(true);
        setMapError(null);
      } catch {
        setMapError('تعذّر تحميل الخريطة');
      }
    };

    setMapLoaded(false);
    setMapError(null);

    const run = async () => {
      if (!apiKey) {
        await initLeaflet();
        return;
      }

      if (window.google?.maps) {
        initGoogle();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;

      window.initMap = () => {
        if (!cancelled) initGoogle();
      };
      script.onerror = () => {
        if (!cancelled) initLeaflet();
      };
      document.head.appendChild(script);
    };

    run();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current?.remove) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      delete window.initMap;
    };
  }, [apiKey, center.lat, center.lng, zoom, markersKey]);

  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-lg z-0 ${className}`}
      style={{ height, minHeight: height }}
    >
      <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />

      {mapError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
          <div className="text-center p-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{mapError}</p>
          </div>
        </div>
      )}

      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-tarhal-orange border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">جاري تحميل الخريطة...</p>
          </div>
        </div>
      )}
    </div>
  );
}
