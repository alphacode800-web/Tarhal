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
  }
}

export default function GoogleMap({ 
  center, 
  zoom = 12, 
  markers = [], 
  height = '400px',
  className = '' 
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      initializeMap();
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
    
    if (!apiKey) {
      setMapError('Google Maps API key is not configured');
      return;
    }

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    window.initMap = () => {
      setMapLoaded(true);
      initializeMap();
    };

    script.onerror = () => {
      setMapError('Failed to load Google Maps');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      delete window.initMap;
    };
  }, []);

  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      initializeMap();
    }
  }, [mapLoaded, center, zoom, markers]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      });

      // Add markers
      markers.forEach((marker) => {
        const mapMarker = new window.google.maps.Marker({
          position: marker.position,
          map: map,
          title: marker.title || '',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="#f97316"/>
                <circle cx="16" cy="16" r="8" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 40),
            anchor: new window.google.maps.Point(16, 40)
          }
        });

        // Add info window if info is provided
        if (marker.info) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #0f172a;">${marker.title || ''}</h3>
                <p style="margin: 0; color: #64748b; font-size: 14px;">${marker.info}</p>
              </div>
            `
          });

          mapMarker.addListener('click', () => {
            infoWindow.open(map, mapMarker);
          });
        }
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Error initializing map');
    }
  };

  if (mapError) {
    return (
      <div 
        className={`bg-gray-100 rounded-xl flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center p-8">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{mapError}</p>
          <p className="text-sm text-gray-500 mt-2">
            Please configure VITE_GOOGLE_MAPS_API_KEY in your .env file
          </p>
        </div>
      </div>
    );
  }

  if (!mapLoaded) {
    return (
      <div 
        className={`bg-gray-100 rounded-xl flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-tarhal-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className={`rounded-xl overflow-hidden shadow-lg ${className}`}
      style={{ height }}
    />
  );
}

