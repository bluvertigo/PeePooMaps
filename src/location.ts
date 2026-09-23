export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function requestCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("La geolocalizzazione non è disponibile su questo dispositivo."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      () => reject(new Error("Posizione non disponibile. Puoi salvare l'evento senza GPS.")),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  });
}
