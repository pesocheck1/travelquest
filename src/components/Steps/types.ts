export type StartingPoint = "Naha Airport" | "Tomari Port" | "Chatan" | "Nago";

export type Location = {
  name: string;
  desc: string;
  image: string;
  category: string;
  left: string;
  top: string;
  place_id?: string;
  lat: number;
  lng: number;
  visitTime?: number;
  arrivalTime?: string;
  endTime?: string;
  travelMins?: number;
  distanceKm?: number;
  globalLeft?: string | number;
  globalTop?: string | number;
  closestStartingPoint: StartingPoint;
};

export type LocationsData = {
  [region: string]: Location[];
};

export type Transport = "car" | "public";
export type TransportState = Transport | "";

export type RegionName =
  | "Yanbaru"
  | "Motobu"
  | "Central Okinawa"
  | "South Okinawa";

export type Step =
  | "start"
  | "avatar"
  | "preferences"
  | "map"
  | "activities"
  | "locations"
  | "done";

export type ExpandedRegion = {
  name: RegionName;
  desc: string;
  left: string;
  top: string;
  images: string[];
};
export type TravelTimeData = {
  car: number;
  public: number;
};
export const START_POINTS: Record<
  StartingPoint,
  { name: string; place_id?: string; lat: number; lng: number }
> = {
  "Naha Airport": {
    name: "Naha Airport",
    place_id: "ChIJjSyLjsRp5TQRkP5WN6rOTFA",
    lat: 26.2088,
    lng: 127.6792,
  },
  "Tomari Port": {
    name: "Tomari Port",
    place_id: "ChIJEzfBA39p5TQRP-w2OxmUkPk",
    lat: 26.218,
    lng: 127.688,
  },
  Chatan: {
    name: "Chatan",
    place_id: "ChIJzZoVCAUT5TQRzIueHYt83hs",
    lat: 26.3233,
    lng: 127.7653,
  },
  Nago: {
    name: "Nago",
    place_id: "ChIJ-e0h22j_5DQRum8XD8hJ6X8",
    lat: 26.5016,
    lng: 127.9457,
  },
};
export const categoryIcons: Record<string, string> = {
  Beach: "/icons/beach.svg",
  Food: "/icons/food.svg",
  Culture: "/icons/culture.svg",
  Shopping: "/icons/shopping.svg",
  Nature: "/icons/nature.svg",
  Outdoor: "/icons/outdoor.svg",
  Hotel: "/icons/hotel.svg",
};

export const travelTimes: Record<
  StartingPoint,
  Record<RegionName, TravelTimeData>
> = {
  "Naha Airport": {
    Yanbaru: { car: 110, public: 160 },
    Motobu: { car: 90, public: 130 },
    "Central Okinawa": { car: 35, public: 55 },
    "South Okinawa": { car: 25, public: 40 },
  },
  "Tomari Port": {
    Yanbaru: { car: 105, public: 155 },
    Motobu: { car: 85, public: 125 },
    "Central Okinawa": { car: 30, public: 50 },
    "South Okinawa": { car: 20, public: 35 },
  },
  Chatan: {
    Yanbaru: { car: 70, public: 110 },
    Motobu: { car: 55, public: 85 },
    "Central Okinawa": { car: 15, public: 25 },
    "South Okinawa": { car: 45, public: 70 },
  },
  Nago: {
    Yanbaru: { car: 40, public: 60 },
    Motobu: { car: 25, public: 40 },
    "Central Okinawa": { car: 50, public: 80 },
    "South Okinawa": { car: 80, public: 120 },
  },
};

export const getTravelTimeMinutes = (
  from: string,
  to: string,
  by: string
): number | null => {
  if (!from || !to || !by) return null;

  const start = from as StartingPoint;
  const region = to as RegionName;
  const mode = by as Transport;

  const dataForStart = travelTimes[start];
  if (!dataForStart) return null;

  const times = dataForStart[region];
  if (!times) return null;

  return times[mode] ?? null;
};

export const activities = [
  { key: "Beach", label: "Beach", icon: "/icons/beach1.svg" },
  { key: "Food", label: "Local food", icon: "/icons/noodles.svg" },
  {
    key: "Culture",
    label: "Cultural & historical sites",
    icon: "/icons/temple.svg",
  },
  { key: "Shopping", label: "Shopping", icon: "/icons/shopping1.svg" },
  { key: "Nature", label: "Natural attractions", icon: "/icons/hill.svg" },
  {
    key: "Outdoor",
    label: "Outdoor activities",
    icon: "/icons/snorkel.svg",
  },
  { key: "Hotel", label: "Hotel", icon: "/icons/hotel1.svg" },
];
