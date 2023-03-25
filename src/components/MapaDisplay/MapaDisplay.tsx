import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import { getMarkers, addMarker, updateSelectedMarker, handleMarkerSelection } from "./api/ApiMapa";
import L from "leaflet";

interface MarkerData {
  id: number;
  folio: number;
  lat: number;
  lng: number;
}

interface SelectedMarker {
  id: number;
  folio: number;
  lat: number;
  lng: number;
}

function MapaDisplay() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    async function fetchMarkers() {
      try {
        const data = await getMarkers();
        setMarkers(data);
      } catch (error: unknown) {
        console.log((error as Error).message);
      }
    }

    fetchMarkers();
  }, []);

  // función para manejar el evento de clic en el mapa
  function handleClick(event: L.LeafletMouseEvent) {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;
    if (selectedMarker) {
      updateSelectedMarker(lat, lng)
        .then(() => {
          setMarkers(markers.map((marker) => {
            if (marker.id === selectedMarker.id) {
              return {
                id: marker.id,
                folio: marker.folio,
                lat: lat,
                lng: lng,
              };
            } else {
              return marker;
            }
          }));
          setSelectedMarker(null);
        })
        .catch(error => {
          console.log(error.message);
        });
    }
  }

  const [selectedMarker, setSelectedMarker] = useState<SelectedMarker | null>(null); // variable para almacenar el marcador seleccionado

  return (
    <MapContainer center={[19.434, -99.142]} zoom={13} style={{ height: "100vh" }} onClick={handleClick}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.map((marker: MarkerData) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          eventHandlers={{ click: () => handleMarkerSelection(marker) }}
        >
          <Popup>
            <div>
              <p>Folio: {marker.folio}</p>
              <p>Latitud: {marker.lat}</p>
              <p>Longitud: {marker.lng}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapaDisplay;
