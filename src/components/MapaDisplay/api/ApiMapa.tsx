import { LatLng } from "leaflet";

export interface MarkerData {
  folio: number;
  lat: number;
  lng: number;
}

// 1. Obtener las coordenadas de un endpoint definido
export async function getCoordinatesByFolio(folio: number): Promise<LatLng> {
  const response = await fetch(`http://localhost:8000/coordinates/${folio}`);
  if (response.ok) {
    const data = await response.json();
    return new LatLng(data.lat, data.lng);
  } else {
    throw new Error("Error al obtener las coordenadas");
  }
}

// 2. Agregar un nuevo punto al mapa
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
      folio: data.folio,
      lat: data.lat,
      lng: data.lng,
    };
  } else {
    throw new Error("Error al agregar el marcador");
  }
}

// 3. Editar un punto ya existente en el mapa
export async function updateMarker(folio: number, lat: number, lng: number): Promise<MarkerData> {
  const response = await fetch(`http://localhost:8000/markers/${folio}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ folio, lat, lng }),
  });

  if (response.ok) {
    const data = await response.json();
    return {
      folio: data.folio,
      lat: data.lat,
      lng: data.lng,
    };
  } else {
    throw new Error("Error al actualizar el marcador");
  }
}

// 4. Eliminar un punto existente
export async function deleteMarker(folio: number): Promise<void> {
  const response = await fetch(`http://localhost:8000/markers/${folio}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar el marcador");
  }
}
