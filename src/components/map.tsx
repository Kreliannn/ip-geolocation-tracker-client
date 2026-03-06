import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect } from "react";
// ✅ FIX 1: Import Leaflet CSS — this is the #1 cause of "destroyed" map UI
import "leaflet/dist/leaflet.css";

// ✅ FIX 2: Fix missing default marker icons (Leaflet + Vite/Webpack issue)
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

// ✅ FIX 3: Separate component to recenter map when loc changes
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}

// ✅ FIX 4: Map fills its container — no fixed px sizes that overflow
function Map({ mapKey, loc }: { mapKey: string; loc: string }) {
  const [latStr, lngStr] = loc.split(",");
  const lat = Number(latStr);
  const lng = Number(lngStr);

  return (
    <MapContainer
      key={mapKey}
      center={[lat, lng]}
      zoom={13}
      style={{ height: "100%", width: "100%" }} // ✅ fill parent div
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
      />
      <Marker position={[lat, lng]} />
      <RecenterMap lat={lat} lng={lng} />
    </MapContainer>
  );
}

export default Map