import { LatLng } from "leaflet";

interface MarkerData {
  id: number;
  folio: number;
  lat: number;
  lng: number;
}

export async function getMarkers(): Promise<MarkerData[]> {
  const response = await fetch("http://localhost:8000/markers");
  if (response.ok) {
    const data = await response.json();
    return data.map((marker: MarkerData) => ({
      id: marker.id,
      folio: marker.folio,
      lat: marker.lat,
      lng: marker.lng,
    }));
  } else {
    throw new Error("Error al obtener los marcadores");
  }
}

export async function addMarker(folio: number, lat: number, lng: number): Promise<MarkerData> {
  const response = await fetch("http://localhost:8000/markers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ folio, lat, lng }),
  });

  if (response.ok) {
    const data = await response.json();
    return {
      id: data.id,
      folio: data.folio,
      lat: data.lat,
      lng: data.lng,
    };
  } else {
    throw new Error("Error al agregar el marcador");
  }
}

export async function updateMarker(id: number, folio: number, lat: number, lng: number): Promise<MarkerData> {
  const response = await fetch(`http://localhost:8000/markers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ folio, lat, lng }),
  });

  if (response.ok) {
    const data = await response.json();
    return {
      id: data.id,
      folio: data.folio,
      lat: data.lat,
      lng: data.lng,
    };
  } else {
    throw new Error("Error al actualizar el marcador");
  }
}

export async function updateSelectedMarker(lat: number, lng: number): Promise<void> {
    const selectedMarkerString = localStorage.getItem("selectedMarker") ?? "";
    const selectedMarker = selectedMarkerString ? JSON.parse(selectedMarkerString) : null;
    
  if (selectedMarker) {
    await updateMarker(selectedMarker.id, selectedMarker.folio, lat, lng);
  }
}

export function handleMarkerSelection(marker: MarkerData): void {
  localStorage.setItem("selectedMarker", JSON.stringify(marker));
}
