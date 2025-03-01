'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 创建自定义图标
const markerIcon = new L.Icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconSize: [40, 30],
  iconAnchor: [17, 41],
  popupAnchor: [1, -34],
});

interface Location {
  country: string;
  city: string;
  lat: number;
  lng: number;
}

interface MapProps {
  locations: Location[];
}

export default function Map({ locations }: MapProps) {
  const defaultCenter = { lat: 35.8617, lng: 104.1954 };
  const defaultZoom = 4;

  return (
    <MapContainer
      center={
        locations.length > 0
          ? [locations[0].lat, locations[0].lng]
          : [defaultCenter.lat, defaultCenter.lng]
      }
      zoom={defaultZoom}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location, index) => (
        <Marker
          key={index}
          position={[location.lat, location.lng]}
          icon={markerIcon}
        >
          <Popup>
            <div className="font-medium">
              {location.city}, {location.country}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 