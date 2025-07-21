'use client';

import React, { useState, useEffect, useRef } from 'react';

type LatLng = {
  /**
   * Latitude coordinate
   */
  lat: number;
  
  /**
   * Longitude coordinate
   */
  lng: number;
};

type MapMarker = {
  /**
   * Unique identifier for the marker
   */
  id: string | number;
  
  /**
   * Position of the marker
   */
  position: LatLng;
  
  /**
   * Title of the marker
   */
  title?: string;
  
  /**
   * Description of the marker
   */
  description?: string;
  
  /**
   * Icon URL for the marker
   */
  icon?: string;
  
  /**
   * Whether the marker is draggable
   */
  draggable?: boolean;
};

type MapPolyline = {
  /**
   * Unique identifier for the polyline
   */
  id: string | number;
  
  /**
   * Array of positions forming the polyline
   */
  path: LatLng[];
  
  /**
   * Color of the polyline
   */
  color?: string;
  
  /**
   * Width of the polyline
   */
  width?: number;
  
  /**
   * Opacity of the polyline
   */
  opacity?: number;
};

type MapPolygon = {
  /**
   * Unique identifier for the polygon
   */
  id: string | number;
  
  /**
   * Array of positions forming the polygon
   */
  paths: LatLng[];
  
  /**
   * Fill color of the polygon
   */
  fillColor?: string;
  
  /**
   * Fill opacity of the polygon
   */
  fillOpacity?: number;
  
  /**
   * Stroke color of the polygon
   */
  strokeColor?: string;
  
  /**
   * Stroke width of the polygon
   */
  strokeWidth?: number;
  
  /**
   * Stroke opacity of the polygon
   */
  strokeOpacity?: number;
};

type MapProps = {
  /**
   * Initial center position of the map
   */
  center: LatLng;
  
  /**
   * Initial zoom level of the map
   */
  zoom?: number;
  
  /**
   * Height of the map
   */
  height?: number | string;
  
  /**
   * Width of the map
   */
  width?: number | string;
  
  /**
   * Array of markers to display on the map
   */
  markers?: MapMarker[];
  
  /**
   * Array of polylines to display on the map
   */
  polylines?: MapPolyline[];
  
  /**
   * Array of polygons to display on the map
   */
  polygons?: MapPolygon[];
  
  /**
   * Whether to show the map controls
   */
  showControls?: boolean;
  
  /**
   * Map type
   */
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  
  /**
   * Whether to enable zooming
   */
  zoomable?: boolean;
  
  /**
   * Whether to enable panning
   */
  pannable?: boolean;
  
  /**
   * Whether to enable street view
   */
  streetView?: boolean;
  
  /**
   * Whether to show the fullscreen control
   */
  fullscreenControl?: boolean;
  
  /**
   * Whether to show the map type control
   */
  mapTypeControl?: boolean;
  
  /**
   * Whether to show the zoom control
   */
  zoomControl?: boolean;
  
  /**
   * Whether to show the scale control
   */
  scaleControl?: boolean;
  
  /**
   * Whether to show the rotate control
   */
  rotateControl?: boolean;
  
  /**
   * Whether to show the street view control
   */
  streetViewControl?: boolean;
  
  /**
   * Callback when a marker is clicked
   */
  onMarkerClick?: (marker: MapMarker) => void;
  
  /**
   * Callback when a marker is dragged
   */
  onMarkerDrag?: (marker: MapMarker, position: LatLng) => void;
  
  /**
   * Callback when the map is clicked
   */
  onMapClick?: (position: LatLng) => void;
  
  /**
   * Callback when the map center changes
   */
  onCenterChange?: (center: LatLng) => void;
  
  /**
   * Callback when the map zoom changes
   */
  onZoomChange?: (zoom: number) => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
};

export default function Map({
  center,
  zoom = 10,
  height = 400,
  width = '100%',
  markers = [],
  polylines = [],
  polygons = [],
  showControls = true,
  mapType = 'roadmap',
  zoomable = true,
  pannable = true,
  streetView = true,
  fullscreenControl = true,
  mapTypeControl = true,
  zoomControl = true,
  scaleControl = true,
  rotateControl = true,
  streetViewControl = true,
  onMarkerClick,
  onMarkerDrag,
  onMapClick,
  onCenterChange,
  onZoomChange,
  className = '',
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markerInstances, setMarkerInstances] = useState<Record<string | number, google.maps.Marker>>({});
  const [polylineInstances, setPolylineInstances] = useState<Record<string | number, google.maps.Polyline>>({});
  const [polygonInstances, setPolygonInstances] = useState<Record<string | number, google.maps.Polygon>>({});
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Load Google Maps API
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }
    
    // Create a script element to load the Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoaded(true);
    };
    
    script.onerror = () => {
      setLoadError('Failed to load Google Maps API');
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Remove the script element when the component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);
  
  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstance) return;
    
    try {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: center.lat, lng: center.lng },
        zoom,
        mapTypeId: mapType,
        disableDefaultUI: !showControls,
        zoomControl: showControls && zoomControl,
        mapTypeControl: showControls && mapTypeControl,
        scaleControl: showControls && scaleControl,
        streetViewControl: showControls && streetViewControl,
        rotateControl: showControls && rotateControl,
        fullscreenControl: showControls && fullscreenControl,
        gestureHandling: pannable ? (zoomable ? 'auto' : 'cooperative') : 'none',
        streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP,
        },
      });
      
      setMapInstance(map);
      setInfoWindow(new google.maps.InfoWindow());
      
      // Add event listeners
      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (onMapClick && e.latLng) {
          onMapClick({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          });
        }
      });
      
      map.addListener('center_changed', () => {
        if (onCenterChange) {
          const center = map.getCenter();
          if (center) {
            onCenterChange({
              lat: center.lat(),
              lng: center.lng(),
            });
          }
        }
      });
      
      map.addListener('zoom_changed', () => {
        if (onZoomChange) {
          onZoomChange(map.getZoom() || zoom);
        }
      });
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
      setLoadError('Error initializing Google Maps');
    }
  }, [isLoaded, mapRef, mapInstance, center, zoom, mapType, showControls, zoomable, pannable, streetView, fullscreenControl, mapTypeControl, zoomControl, scaleControl, rotateControl, streetViewControl, onMapClick, onCenterChange, onZoomChange]);
  
  // Update map center and zoom when props change
  useEffect(() => {
    if (!mapInstance) return;
    
    mapInstance.setCenter({ lat: center.lat, lng: center.lng });
    mapInstance.setZoom(zoom);
    mapInstance.setMapTypeId(mapType);
  }, [mapInstance, center, zoom, mapType]);
  
  // Update markers
  useEffect(() => {
    if (!mapInstance || !isLoaded) return;
    
    // Remove old markers
    Object.values(markerInstances).forEach(marker => {
      marker.setMap(null);
    });
    
    const newMarkerInstances: Record<string | number, google.maps.Marker> = {};
    
    // Add new markers
    markers.forEach(marker => {
      const markerInstance = new google.maps.Marker({
        position: { lat: marker.position.lat, lng: marker.position.lng },
        map: mapInstance,
        title: marker.title,
        draggable: marker.draggable,
        icon: marker.icon,
      });
      
      // Add click event listener
      markerInstance.addListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(marker);
        }
        
        if (infoWindow && (marker.title || marker.description)) {
          const content = `
            ${marker.title ? `<h3 class="font-bold">${marker.title}</h3>` : ''}
            ${marker.description ? `<p>${marker.description}</p>` : ''}
          `;
          
          infoWindow.setContent(content);
          infoWindow.open(mapInstance, markerInstance);
        }
      });
      
      // Add drag event listener
      if (marker.draggable && onMarkerDrag) {
        markerInstance.addListener('dragend', () => {
          const position = markerInstance.getPosition();
          if (position) {
            onMarkerDrag(marker, {
              lat: position.lat(),
              lng: position.lng(),
            });
          }
        });
      }
      
      newMarkerInstances[marker.id] = markerInstance;
    });
    
    setMarkerInstances(newMarkerInstances);
  }, [mapInstance, isLoaded, markers, onMarkerClick, onMarkerDrag, infoWindow]);
  
  // Update polylines
  useEffect(() => {
    if (!mapInstance || !isLoaded) return;
    
    // Remove old polylines
    Object.values(polylineInstances).forEach(polyline => {
      polyline.setMap(null);
    });
    
    const newPolylineInstances: Record<string | number, google.maps.Polyline> = {};
    
    // Add new polylines
    polylines.forEach(polyline => {
      const polylineInstance = new google.maps.Polyline({
        path: polyline.path.map(point => ({ lat: point.lat, lng: point.lng })),
        map: mapInstance,
        strokeColor: polyline.color || '#FF0000',
        strokeOpacity: polyline.opacity || 1.0,
        strokeWeight: polyline.width || 2,
      });
      
      newPolylineInstances[polyline.id] = polylineInstance;
    });
    
    setPolylineInstances(newPolylineInstances);
  }, [mapInstance, isLoaded, polylines]);
  
  // Update polygons
  useEffect(() => {
    if (!mapInstance || !isLoaded) return;
    
    // Remove old polygons
    Object.values(polygonInstances).forEach(polygon => {
      polygon.setMap(null);
    });
    
    const newPolygonInstances: Record<string | number, google.maps.Polygon> = {};
    
    // Add new polygons
    polygons.forEach(polygon => {
      const polygonInstance = new google.maps.Polygon({
        paths: polygon.paths.map(point => ({ lat: point.lat, lng: point.lng })),
        map: mapInstance,
        strokeColor: polygon.strokeColor || '#FF0000',
        strokeOpacity: polygon.strokeOpacity || 1.0,
        strokeWeight: polygon.strokeWidth || 2,
        fillColor: polygon.fillColor || '#FF0000',
        fillOpacity: polygon.fillOpacity || 0.35,
      });
      
      newPolygonInstances[polygon.id] = polygonInstance;
    });
    
    setPolygonInstances(newPolygonInstances);
  }, [mapInstance, isLoaded, polygons]);
  
  // Render loading state
  if (!isLoaded) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
          width: typeof width === 'number' ? `${width}px` : width,
        }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-gray-700">Loading map...</p>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (loadError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
          width: typeof width === 'number' ? `${width}px` : width,
        }}
      >
        <div className="text-center text-red-500">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{loadError}</p>
          <p className="text-sm text-gray-500 mt-2">Please check your API key and internet connection.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div
      ref={mapRef}
      className={`map-container ${className}`}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width,
      }}
      aria-label="Map"
      role="application"
    />
  );
}