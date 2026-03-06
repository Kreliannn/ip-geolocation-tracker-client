import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect } from "react";

import "leaflet/dist/leaflet.css";


import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}


function Map({ mapKey, loc }: { mapKey: string; loc: string }) {
  const [latStr, lngStr] = loc.split(",");
  const lat = Number(latStr);
  const lng = Number(lngStr);

  return (
    <MapContainer
      key={mapKey}
      center={[lat, lng]}
      zoom={13}
      style={{ height: "100%", width: "100%" }} 
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[lat, lng]} />
      <RecenterMap lat={lat} lng={lng} />
    </MapContainer>
  );
}

export default Map