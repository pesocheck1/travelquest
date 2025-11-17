import { Location, Transport, START_POINTS, StartingPoint } from "./types";

// export type Transport = "car" | "public";

/** Форматирует минуты в читаемый вид, например "1 h 25 min" */
export function formatTravelTime(minutes: number): string {
  if (minutes >= 60) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins === 0 ? `${hrs} h` : `${hrs} h ${mins} min`;
  } else {
    return `${minutes} min`;
  }
}

/** Расстояние между двумя координатами (lat/lng) в км */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // радиус Земли в км
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Скорость движения в км/ч в зависимости от транспорта */
export function getSpeed(transport: Transport): number {
  return transport === "car" ? 30 : 20;
}

/** Прибавляет минуты к строке времени вида "HH:MM" */
export function addMinutesToTime(time: string, mins: number): string {
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m + mins, 0);
  return date.toTimeString().slice(0, 5);
}

export function recalculateSchedule(
  locations: Location[],
  startingPoint: StartingPoint,
  startTime: string,
  transport: Transport
): Location[] {
  let prevLat = START_POINTS[startingPoint].lat;
  let prevLng = START_POINTS[startingPoint].lng;

  let prevTime = startTime;

  return locations.map((loc) => {
    const dist = haversineDistance(
      prevLat,
      prevLng,
      loc.lat || 0,
      loc.lng || 0
    );

    const travelMins = Math.max(
      1,
      Math.round((dist / getSpeed(transport)) * 60)
    );
    const arrivalTime = addMinutesToTime(prevTime, travelMins);
    const endTime = addMinutesToTime(arrivalTime, loc.visitTime || 0);

    prevLat = loc.lat;
    prevLng = loc.lng;
    prevTime = endTime;

    return {
      ...loc,
      arrivalTime,
      endTime,
      travelMins,
      distanceKm: Number(dist.toFixed(1)),
    };
  });
}
