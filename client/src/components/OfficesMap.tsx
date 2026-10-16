import { useEffect, useRef, useState } from 'react';
import { MapView } from './Map';
import { AlertCircle, Loader2 } from 'lucide-react';

interface Office {
  id: number;
  name: string;
  address: string;
  latitude?: number | string;
  longitude?: number | string;
}

interface OfficesMapProps {
  offices: Office[];
  onMarkerClick?: (office: Office) => void;
  className?: string;
  initialZoom?: number;
}

export function OfficesMap({
  offices,
  onMarkerClick,
  className,
  initialZoom = 12,
}: OfficesMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate center based on offices with coordinates
  const getMapCenter = () => {
    const officesWithCoords = offices.filter(
      (o) => o.latitude && o.longitude
    );

    if (officesWithCoords.length === 0) {
      // Default to Hong Kong
      return { lat: 22.3193, lng: 114.1694 };
    }

    if (officesWithCoords.length === 1) {
      return {
        lat: parseFloat(String(officesWithCoords[0].latitude!)),
        lng: parseFloat(String(officesWithCoords[0].longitude!)),
      };
    }

    // Calculate bounds center
    const lats = officesWithCoords.map((o) =>
      parseFloat(String(o.latitude!))
    );
    const lngs = officesWithCoords.map((o) =>
      parseFloat(String(o.longitude!))
    );

    const avgLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const avgLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

    return { lat: avgLat, lng: avgLng };
  };

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    setIsLoading(false);
    setError(null);
    addMarkers(map);
  };

  const addMarkers = (map: google.maps.Map) => {
    // Clear existing markers
    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current = [];

    // Add new markers for offices with coordinates
    offices.forEach((office) => {
      if (!office.latitude || !office.longitude) {
        return;
      }

      const position = {
        lat: parseFloat(String(office.latitude)),
        lng: parseFloat(String(office.longitude)),
      };

      // Create marker content
      const markerContent = document.createElement('div');
      markerContent.className = 'flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-full font-bold text-sm cursor-pointer hover:bg-red-700 transition-colors shadow-lg';
      markerContent.textContent = '📍';
      markerContent.style.display = 'flex';
      markerContent.style.alignItems = 'center';
      markerContent.style.justifyContent = 'center';

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position,
        title: office.name,
        content: markerContent,
      });

      // Add click listener
      marker.addListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(office);
        }
        // Show info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2 max-w-xs">
              <h3 class="font-bold text-sm">${office.name}</h3>
              <p class="text-xs text-gray-600">${office.address}</p>
            </div>
          `,
        });
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });

    // Adjust map bounds to fit all markers
    if (markersRef.current.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markersRef.current.forEach((marker) => {
        if (marker.position) {
          bounds.extend(marker.position);
        }
      });

      if (markersRef.current.length === 1) {
        // Single marker: set zoom and center
        map.setZoom(initialZoom);
        map.setCenter(bounds.getCenter());
      } else {
        // Multiple markers: fit bounds
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      }
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      addMarkers(mapRef.current);
    }
  }, [offices]);

  const center = getMapCenter();
  const officesWithCoords = offices.filter((o) => o.latitude && o.longitude);
  const hasOffices = officesWithCoords.length > 0;

  if (!hasOffices) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 ${className || 'h-[400px]'}`}>
        <div className="text-center">
          <AlertCircle className="mx-auto mb-2 text-gray-400" size={32} />
          <p className="text-gray-600 text-sm">No office locations available on map</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-red-50 border border-red-200 ${className || 'h-[400px]'}`}>
        <div className="text-center">
          <AlertCircle className="mx-auto mb-2 text-red-600" size={32} />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10 rounded">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-gray-600" size={24} />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      <MapView
        initialCenter={center}
        initialZoom={initialZoom}
        onMapReady={handleMapReady}
        className={className}
      />
    </div>
  );
}
