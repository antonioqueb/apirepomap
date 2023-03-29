import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLng } from "leaflet";
import { MarkerData, getCoordinatesByFolio, addMarker, updateMarker, deleteMarker } from "../MapaDisplay/api/ApiMapa";
import "leaflet/dist/leaflet.css";


const Map: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);

  useEffect(() => {
    // 1. Cargar los marcadores existentes al inicio
    const loadMarkers = async () => {
      try {
        const response = await fetch("http://localhost:8000/markers");
        if (response.ok) {
          const data = await response.json();
          setMarkers();
        } else {
          throw new Error("Error al cargar los marcadores");
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadMarkers();
  }, []);

  // 2. Agregar un nuevo marcador al hacer clic en el mapa
  const handleMapClick = async (event: any) => {
    try {
      const { lat, lng } = event.latlng;
      const data = await addMarker(300, lat, lng);
      setMarkers((markers) => [...markers, data]);
    } catch (error) {
      console.error(error);
    }
  };

  // 3. Actualizar la posición de un marcador existente
  // 3. Actualizar la posición de un marcador existente
  const handleMarkerDragEnd = async (folioAndEvent: { folio: number; event: any }) => {
    const { folio, event } = folioAndEvent;
    try {
      const { lat, lng } = event.target.getLatLng();
      const data = await updateMarker(folio, lat, lng);
      setMarkers((markers) => markers.map((m) => (m.folio === data.folio ? data : m)));
    } catch (error) {
      console.error(error);
    }
  };
  


  // 4. Eliminar un marcador existente
  const handleMarkerDelete = async (folio: number) => {
    try {
      await deleteMarker(folio);
      setMarkers((markers) => markers.filter((m) => m.folio !== folio));
      setSelectedMarker(null);
    } catch (error) {
      console.error(error);
    }
  };

  // 5. Obtener las coordenadas de un marcador seleccionado
  const handleMarkerPopupOpen = async (folio: number, latlng: LatLng) => {
    try {
      const data = await getCoordinatesByFolio(folio);
      setSelectedMarker({ folio, lat: data.lat, lng: data.lng });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MapContainer center={[19.8305579, -90.6148574]} zoom={9} style={{ height: "100vh" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.map((marker) => (
        <Marker
          key={marker.folio}
          position={[marker.lat, marker.lng]}
          draggable={true}
          riseOnHover={false}
          eventHandlers={{
            dragend: (event) => handleMarkerDragEnd({ folio: marker.folio, event }),
            click: () => handleMarkerPopupOpen(marker.folio, new LatLng(marker.lat, marker.lng)),
          }}
        >
          <Popup>
            <div>
              <p>Folio: {marker.folio}</p>
              <p>Latitud: {marker.lat}</p>
              <p>Longitud: {marker.lng}</p>
              <button onClick={() => handleMarkerDelete(marker.folio)}>Eliminar</button>
            </div>
          </Popup>
        </Marker>
      ))}
      {selectedMarker && (
      <Marker
        key={selectedMarker.folio}
        position={[selectedMarker.lat, selectedMarker.lng]}
        draggable={true}
        riseOnHover={false}
        eventHandlers={{
          dragend: (event) => handleMarkerDragEnd({ folio: selectedMarker.folio, event }),
          click: () => handleMarkerPopupOpen(selectedMarker.folio, new LatLng(selectedMarker.lat, selectedMarker.lng)),
          popupclose: () => setSelectedMarker(null), // Add this line
        }}
      >
        <Popup position={[selectedMarker.lat, selectedMarker.lng]}>
          <div>
            <p>Folio: {selectedMarker.folio}</p>
            <p>Latitud: {selectedMarker.lat}</p>
            <p>Longitud: {selectedMarker.lng}</p>
            <button onClick={() => handleMarkerDelete(selectedMarker.folio)}>Eliminar</button>
          </div>
        </Popup>
      </Marker>
    )}

    </MapContainer>
  );
  
      };
// Resto del código del componente Map

export default Map;
