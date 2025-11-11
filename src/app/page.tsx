"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import locationsDataJson from "../../data/locations.json";
import jsPDF from "jspdf";

type Location = {
  name: string;
  desc: string;
  image: string;
  category: string;
  left: string;
  top: string;
  place_id?: string;
  lat?: number;
  lng?: number;
  visitTime?: number;
  arrivalTime?: string;
  endTime?: string;
  travelMins?: number;
  distanceKm?: number;
  globalLeft?: string | number;
  globalTop?: string | number;
};

type LocationsData = {
  [region: string]: Location[];
};
type Transport = "car" | "public";

type RegionName = "Yanbaru" | "Motobu" | "Central Okinawa" | "South Okinawa";

type StartingPoint = "Naha Airport" | "Tomari Port" | "Chatan" | "Nago";

type TravelTimeData = {
  car: number;
  public: number;
};

const modifiedAvatarMap: Record<string, string> = {
  "/avatar1.svg": "/avatar11.svg",
  "/avatar2.svg": "/avatar22.svg",
  "/avatar3.svg": "/avatar33.svg",
};

const travelTimes: Record<StartingPoint, Record<RegionName, TravelTimeData>> = {
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

const getTravelTimeMinutes = (
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

const locationsData: LocationsData = locationsDataJson;

export default function HomePage() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarMapPos, setAvatarMapPos] = useState<{
    left: string;
    top: string;
  } | null>(null);

  const handleBackToAvatar = () => {
    setStep("avatar");
    // сбрасываем данные шага preferences
    setStartingPoint("");
    setTransport("");
    setStartTime("");
  };

  const handleBackToPreferences = () => {
    setStep("preferences");
    // сбрасываем выбор региона (map)
    setSelectedRegion(null);
    setIsExpanded(false);
    setExpandedRegion(null);
  };

  const handleBackToMap = () => {
    setStep("map");
    // сбрасываем выбор activities
    setInterests([]);
  };

  const handleBackToActivities = () => {
    setStep("activities");
    // сбрасываем выбор локаций и активную карточку
    // setSelectedLocations([]);
    // setActiveLocation(null);
    // setIsExpanded(false);
    // setExpandedRegion(null);
  };

  const [startingPoint, setStartingPoint] = useState("");
  const [transport, setTransport] = useState<Transport | "">("");
  const [startTime, setStartTime] = useState<string>("");

  const [interests, setInterests] = useState<string[]>([]);
  const [step, setStep] = useState<
    | "start"
    | "avatar"
    | "preferences"
    | "map"
    | "activities"
    | "locations"
    | "done"
  >("start");
  const [finalMapsUrl, setFinalMapsUrl] = useState<string | null>(null);

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);

  const START_POINTS: Record<
    StartingPoint,
    { name: string; place_id?: string; lat?: number; lng?: number }
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

  function haversineDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) {
    const R = 6371; // км
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function getSpeed(transport: Transport) {
    return transport === "car" ? 25 : 15; // км/ч
  }

  function addMinutesToTime(time: string, mins: number) {
    const [h, m] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m + mins, 0);
    return date.toTimeString().slice(0, 5);
  }
  function recalculateSchedule(locations: Location[]) {
    let prevLat = START_POINTS[startingPoint].lat!;
    let prevLng = START_POINTS[startingPoint].lng!;
    let prevTime = startTime;

    return locations.map((loc) => {
      const dist = haversineDistance(prevLat, prevLng, loc.lat, loc.lng);
      const travelMins = Math.max(
        1,
        Math.round((dist / getSpeed(transport)) * 60)
      );

      const arrivalTime = addMinutesToTime(prevTime, travelMins);
      const endTime = addMinutesToTime(arrivalTime, loc.visitTime);

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

  async function createTextPdfAndPrint(selected: Location[]) {
    // простой текстовый PDF (без картинок) и открытие в окне печати
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    let y = 20;
    pdf.setFontSize(18);
    pdf.text("TravelQuest Route", pageWidth / 2, y, { align: "center" });
    y += 12;
    pdf.setFontSize(11);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 14, y);
    y += 10;

    if (!selected || selected.length === 0) {
      pdf.text("No locations selected", 14, y);
    } else {
      selected.forEach((loc, i) => {
        y += 8;
        pdf.setFontSize(12);
        pdf.text(`${i + 1}. ${loc.name}`, 14, y);
        y += 6;
        pdf.setFontSize(10);
        // split text to lines if long
        const lines = pdf.splitTextToSize(loc.desc || "", pageWidth - 28);
        pdf.text(lines, 14, y);
        y += lines.length * 6;
        // переход на новую страницу при необходимости
        if (y > pdf.internal.pageSize.getHeight() - 30) {
          pdf.addPage();
          y = 20;
        }
      });
    }

    const blob = pdf.output("blob");
    const url = URL.createObjectURL(blob);
    const w = window.open("");
    if (!w) {
      // fallback: скачиваем
      const a = document.createElement("a");
      a.href = url;
      a.download = "route.pdf";
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    // вставляем iframe и вызываем печать по загрузке
    w.document.write(
      `<iframe src="${url}" style="width:100%;height:100vh;border:none"></iframe>`
    );
    const tryPrint = () => {
      const iframe = w.document.querySelector("iframe");
      if (!iframe) return setTimeout(tryPrint, 200);
      iframe.onload = () => {
        try {
          w.focus();
          w.print();
        } catch (e) {
          console.error(e);
        }
      };
    };
    tryPrint();
  }

  const categoryIcons: Record<string, string> = {
    Beach: "/icons/beach.svg",
    Food: "/icons/food.svg",
    Culture: "/icons/culture.svg",
    Shopping: "/icons/shopping.svg",
    Nature: "/icons/nature.svg",
    Outdoor: "/icons/outdoor.svg",
    Hotel: "/icons/hotel.svg",
  };

  const activities = [
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

  const [expandedRegion, setExpandedRegion] = useState<{
    name: string;
    desc: string;
    left: string;
    top: string;
    images?: string[];
  } | null>(null);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const [popupImgSrc, setPopupImgSrc] = useState<string>("/placeholder.jpg");

  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  function buildGoogleMapsUrlMultipleWaypointsFixed(
    selected: Location[],
    startingPoint?: string | Location
  ): string | null {
    if (!selected || selected.length === 0) return null;

    // helper: value for URL param (place_id OR coords OR encoded name)
    const formatValue = (item: string | Location) => {
      if (typeof item === "string") return encodeURIComponent(item);
      if (item.place_id) return item.place_id;
      if (typeof item.lat === "number" && typeof item.lng === "number")
        return `${item.lat},${item.lng}`;
      return encodeURIComponent(item.name || "");
    };

    const originProvided =
      typeof startingPoint !== "undefined" && startingPoint !== null;
    const originItem: string | Location = originProvided
      ? (startingPoint as any)
      : selected[0];
    const originParam = formatValue(originItem);
    const originPlaceId =
      typeof originItem === "object"
        ? (originItem as Location).place_id
        : undefined;

    const destinationItem = selected[selected.length - 1];
    const destinationParam = formatValue(destinationItem);
    const destinationPlaceId = destinationItem.place_id;

    const rawWaypoints = originProvided
      ? selected.length > 1
        ? selected.slice(0, -1)
        : []
      : selected.length > 2
      ? selected.slice(1, -1)
      : [];

    const waypointsParams = rawWaypoints.map((w) => formatValue(w));
    const waypointsParam = waypointsParams.length
      ? waypointsParams.join("|")
      : "";

    const waypointPlaceIdsArr = rawWaypoints
      .map((w) => w.place_id)
      .filter((id): id is string => Boolean(id));

    // --- Отладочные логи: обязательно посмотри их в консоли ---
    console.log(">>> buildGoogleMapsUrlMultipleWaypointsFixed");
    console.log("selected.length =", selected.length);
    console.log(
      "startingPoint provided? ->",
      originProvided ? originItem : "(no)"
    );
    console.table(
      selected.map((s, i) => ({
        idx: i,
        name: s.name,
        place_id: s.place_id ?? "(no)",
        lat: s.lat ?? "(no)",
        lng: s.lng ?? "(no)",
      }))
    );
    console.log(
      "rawWaypoints (count):",
      rawWaypoints.length,
      rawWaypoints.map((w) => w.name)
    );
    console.log("waypointsParams:", waypointsParams);
    console.log("waypointPlaceIdsArr:", waypointPlaceIdsArr);
    // ------------------------------------------------------------

    const params: string[] = [];
    params.push("api=1");
    params.push(`origin=${originParam}`);
    if (originPlaceId) params.push(`origin_place_id=${originPlaceId}`);
    if (waypointsParam) params.push(`waypoints=${waypointsParam}`);
    if (waypointPlaceIdsArr.length)
      params.push(`waypoint_place_ids=${waypointPlaceIdsArr.join("|")}`);
    params.push(`destination=${destinationParam}`);
    if (destinationPlaceId)
      params.push(`destination_place_id=${destinationPlaceId}`);
    params.push("travelmode=driving");

    const url = `https://www.google.com/maps/dir/?${params.join("&")}`;
    console.log("final url:", url);
    return url;
  }

  // Обработчик завершения маршрута
  function handleFinish(): void {
    if (!selectedLocations || selectedLocations.length === 0) {
      alert("Please select at least one location!");
      return;
    }

    setIsExpanded(false);
    setExpandedRegion(null);

    const url = buildGoogleMapsUrlMultipleWaypointsFixed(
      selectedLocations,
      START_POINTS[startingPoint] ?? startingPoint
    );
    setFinalMapsUrl(url);
    setStep("done");

    console.log("DEBUG maps url (on finish):", url);
    setFinalMapsUrl(url);
    setStep("done");
  }

  // обновляем источник картинки, когда меняется регион или индекс
  useEffect(() => {
    const img = expandedRegion?.images?.[expandedIndex];
    setPopupImgSrc(img ?? "/placeholder.jpg");
  }, [expandedRegion, expandedIndex]);

  useEffect(() => {
    // Если пользователь уходит со шага "map", закрываем popup
    if (step !== "map") {
      setIsExpanded(false);
      setExpandedRegion(null);
    }
  }, [step]);
  useEffect(() => {
    if (!startTime) {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      setStartTime(`${h}:${m}`);
    }
  }, [startTime, setStartTime]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center">
      {/* HEADER */}
      <header className="w-full flex justify-between items-center px-6 py-1 2xl:py-6 bg-gradient-to-r from-yellow-400 to-orange-400">
        <div
          onClick={() => (window.location.href = "/")}
          className="flex items-center space-x-1 2xl:space-x-0 cursor-pointer hover:opacity-80 transition"
          style={{ fontFamily: '"Glacial Indifference", sans-serif' }}
        >
          <Image
            src="/logo.svg"
            alt="Travel Quest Logo"
            width={45}
            height={45}
            className="2xl:w-[90px] 2xl:h-[90px]"
          />
          <span className="text-white text-3xl relative top-3 2xl:text-5xl 2xl:top-4">
            TRAVEL QUEST
          </span>
        </div>
        <nav className="flex gap-6 items-center 2xl:gap-10">
          <button className="text-white font-semibold text-lg 2xl:text-2xl hover:opacity-75 transition cursor-pointer">
            About us
          </button>
          <button className="text-white font-semibold text-lg 2xl:text-2xl hover:opacity-75 transition cursor-pointer">
            Blog
          </button>
          <button className="bg-white text-orange-600 font-bold px-4 py-1 rounded-md 2xl:px-6 2xl:py-2 2xl:text-xl hover:bg-orange-100 transition cursor-pointer">
            Log in
          </button>
        </nav>
      </header>

      {/* MAIN */}
      <main className="flex flex-1 items-center justify-center w-full px-4 min-h-screen">
        <div
          className="
            bg-yellow-50 border-none rounded-2xl shadow-sm
            w-[900px] h-[550px]
            2xl:w-[1500px] 2xl:h-[850px]
            flex flex-col items-center justify-center text-center p-2 2xl:p-12
            transition-all duration-500
          "
        >
          {/* STEP 1: START */}
          {step === "start" && (
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-4xl font-bold text-[#3e2723] mb-4">
                Welcome to TRAVEL QUEST OKINAWA!
              </h1>
              <p className="text-xl text-[#3e2723] mb-4">
                Gamified route planning across Okinawa – fun and easy!
              </p>
              <Image
                src="/startinglogo.svg"
                alt="Okinawa illustration"
                width={150}
                height={150}
                className="2xl:m-16 mb-8"
              />
              <button
                onClick={() => setStep("avatar")}
                className="bg-[#e74c3c] text-white font-bold py-5 px-14 text-xl rounded-md hover:bg-[#d84333] transition cursor-pointer"
              >
                START
              </button>
            </div>
          )}

          {/* STEP 2: AVATAR */}
          {step === "avatar" && (
            <>
              <h2 className="text-2xl font-bold mb-8 text-[#3e2723]">
                Enter your name
              </h2>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border bg-white rounded-md px-4 py-2 w-2/4 mb-12 text-center focus:outline-none focus:shadow-[0_0_20px_4px_rgba(255,223,0,0.8)]
"
              />
              <h3 className="text-2xl font-bold mb-4 text-[#3e2723]">
                Select your avatar
              </h3>
              <div className="flex justify-center space-x-6 mb-8">
                {["/avatar1.svg", "/avatar2.svg", "/avatar3.svg"].map(
                  (src, i) => {
                    const isSelected = avatar === src;
                    return (
                      <button
                        key={i}
                        onClick={() => setAvatar(src)}
                        onMouseEnter={(e) => {
                          if (!isSelected)
                            e.currentTarget.style.boxShadow =
                              "0 0 15px rgba(255, 223, 0, 0.5)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected)
                            e.currentTarget.style.boxShadow = "none";
                        }}
                        className="p-1 rounded-full transition-shadow cursor-pointer duration-300 border-4 border-transparent"
                        style={{
                          boxShadow: isSelected
                            ? "0 0 20px 4px rgba(255, 223, 0, 0.8)"
                            : "none",
                        }}
                      >
                        <Image
                          src={src}
                          alt="avatar"
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                      </button>
                    );
                  }
                )}
              </div>

              <button
                disabled={!name || !avatar}
                onClick={() => setStep("preferences")}
                className={`font-bold py-3 px-10 rounded-md transition ${
                  !name || !avatar
                    ? "bg-[#F39897] text-white cursor-not-allowed"
                    : "bg-[#e74c3c] text-white cursor-pointer hover:bg-[#d84333]"
                }`}
              >
                NEXT
              </button>
            </>
          )}

          {/* STEP 3: STARTING POINT SELECTION */}
          {step === "preferences" && (
            <div className="flex flex-col w-full h-screen overflow-hidden">
              <h2 className="text-3xl font-bold text-[#3e2723] mb-2 text-center">
                Choose your starting point
              </h2>

              <div className="flex flex-row flex-1 w-full bg-yellow-50 overflow-hidden">
                {/* Левая часть — карта */}
                <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      width: "min(90vh, 650px)",
                      aspectRatio: "1 / 1",
                      maxWidth: "100%",
                    }}
                  >
                    <Image
                      src="/oki1.png"
                      alt="Okinawa map"
                      fill
                      className="object-contain"
                    />

                    {/* Точки старта */}
                    {[
                      { name: "Naha Airport", top: "80%", left: "15%" },
                      { name: "Tomari Port", top: "72%", left: "16%" },
                      { name: "Chatan", top: "63%", left: "23%" },
                      { name: "Nago", top: "38%", left: "42%" },
                    ].map((point) => {
                      const isSelected = startingPoint === point.name;
                      return (
                        <div
                          key={point.name}
                          onClick={() => setStartingPoint(point.name)}
                          className="absolute flex items-center gap-1 cursor-pointer group"
                          style={{
                            top: point.top,
                            left: point.left,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          {/* Подпись слева */}
                          <p className="text-sm font-semibold text-black w-[100px] text-right">
                            {point.name}
                          </p>

                          {/* Иконка */}
                          <div
                            className={`relative w-8 h-8 transition-all duration-300 ${
                              isSelected
                                ? "scale-125 translate-y-[-4px]"
                                : "group-hover:scale-110 group-hover:translate-y-[-3px]"
                            }`}
                          >
                            {/* Основная иконка (чёрная) */}
                            <Image
                              src="/point.svg"
                              alt={`${point.name} marker`}
                              fill
                              className="object-contain"
                            />

                            {/* Полупрозрачная заливка формы иконки */}
                            <div
                              className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                                isSelected
                                  ? "bg-[#e74c3c]/50 opacity-100"
                                  : "group-hover:bg-[#e74c3c]/50 group-hover:opacity-100 opacity-0"
                              }`}
                              style={{
                                maskImage: "url('/point.svg')",
                                WebkitMaskImage: "url('/point.svg')",
                                maskRepeat: "no-repeat",
                                WebkitMaskRepeat: "no-repeat",
                                maskPosition: "center",
                                WebkitMaskPosition: "center",
                                maskSize: "contain",
                                WebkitMaskSize: "contain",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Правая панель */}
                <div className="w-[260px] 2xl:w-[340px] bg-[#fff8e1] m-2 rounded shadow-inner p-5 flex flex-col justify-between overflow-y-auto">
                  <div>
                    <h2 className="text-xl font-bold mb-4 text-[#3e2723]">
                      Route settings
                    </h2>

                    <p className="text-[#3e2723] text-ml mb-4">
                      <span className="font-semibold mr-1">
                        Starting point:
                      </span>{" "}
                      {startingPoint ? (
                        <span className="underline underline-offset-2 decoration-[#e74c3c]">
                          {startingPoint}
                        </span>
                      ) : (
                        <span className="text-[#3e2723]/80">Not selected</span>
                      )}
                    </p>

                    {/* TRANSPORT SELECTION */}
                    <div className="mb-6">
                      <label className="block font-semibold text-ml text-[#3e2723] mb-2">
                        Transportation
                      </label>
                      <div className="flex flex-col space-y-2">
                        {[
                          { value: "car", label: "Car" },
                          { value: "public", label: "Public transport" },
                        ].map(({ value, label }) => (
                          <label
                            key={value}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              value={value}
                              checked={transport === value}
                              onChange={(e) =>
                                setTransport(e.target.value as Transport)
                              }
                              className="hidden"
                            />
                            <span
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                transport === value
                                  ? "border-[#3e2723]"
                                  : "border-[#d6ccc2]"
                              }`}
                            >
                              {transport === value && (
                                <span className="w-2.5 h-2.5 bg-[#3e2723] rounded-full"></span>
                              )}
                            </span>
                            <span className="text-[#3e2723]">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {/* DEPARTURE TIME */}
                    <div className="mb-6">
                      <label className="block font-semibold text-ml text-[#3e2723] mb-2">
                        Time of departure
                      </label>

                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="border border-[#d6ccc2] bg-white rounded-md px-2 py-2 text-sm w-full 
               focus:outline-none focus:ring-2 focus:ring-[#e74c3c]"
                      />
                    </div>
                  </div>

                  {/* Кнопки */}
                  <div className="flex justify-center gap-3 mt-4">
                    <button
                      onClick={handleBackToAvatar}
                      className="bg-[#d7ccc8] text-[#3e2723] font-bold py-3 px-6 rounded-md hover:bg-[#c0b3af] transition cursor-pointer"
                    >
                      BACK
                    </button>

                    <button
                      onClick={() => setStep("map")}
                      disabled={!startingPoint || !transport || !startTime}
                      className={`font-bold py-3 px-5 rounded-md transition ${
                        !startingPoint || !transport || !startTime
                          ? "bg-[#F39897] text-white cursor-not-allowed"
                          : "bg-[#e74c3c] text-white cursor-pointer hover:bg-[#d84333]"
                      }`}
                    >
                      NEXT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: MAP */}
          {step === "map" && (
            <div className="flex flex-col w-full h-screen overflow-hidden">
              <h2 className="text-3xl font-bold text-[#3e2723] mb-2 text-center">
                Choose your region
              </h2>
              <div className="flex flex-row flex-1 w-full bg-yellow-50 overflow-hidden">
                {/* Map */}
                <div className="flex-1 relative flex items-center justify-start pl-6 overflow-hidden">
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      width: "min(90vh, 650px)",
                      aspectRatio: "1 / 1",
                      maxWidth: "100%",
                    }}
                  >
                    <Image
                      src="/oki1.png"
                      alt="Okinawa map"
                      fill
                      className="object-contain"
                    />

                    {/* Avatar */}
                    {avatar && (avatarMapPos || startingPoint) && (
                      <div
                        className="absolute transition-all duration-500"
                        style={{
                          top: avatarMapPos
                            ? avatarMapPos.top
                            : startingPoint === "Naha Airport"
                            ? "80%"
                            : startingPoint === "Tomari Port"
                            ? "75%"
                            : startingPoint === "Chatan"
                            ? "65%"
                            : startingPoint === "Nago"
                            ? "38%"
                            : "35%",
                          left: avatarMapPos
                            ? avatarMapPos.left
                            : startingPoint === "Naha Airport"
                            ? "22%"
                            : startingPoint === "Tomari Port"
                            ? "22%"
                            : startingPoint === "Chatan"
                            ? "29%"
                            : startingPoint === "Nago"
                            ? "52%"
                            : "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <Image
                          src={avatar}
                          alt="Selected avatar"
                          width={50}
                          height={50}
                          className="rounded-full"
                          style={{
                            filter: "drop-shadow(0 0 12px rgba(89, 89, 89, 1))",
                          }}
                        />
                      </div>
                    )}

                    {/* Region cards */}
                    {[
                      {
                        name: "Yanbaru",
                        desc: "Famous for Cape Hedo, Yanbaru National Park, Tataki Falls",
                        left: "82%",
                        top: "5%",
                        images: [
                          "/regions/yanbaru1.jpg",
                          "/regions/yanbaru2.jpg",
                        ],
                      },
                      {
                        name: "Motobu",
                        desc: "Famous for Churaumi Aquarium, Junglia Okinawa and Nakijin Castle Ruins",
                        left: "13%",
                        top: "12%",
                        images: [
                          "/regions/motobu1.jpg",
                          "/regions/motobu2.jpg",
                        ],
                      },
                      {
                        name: "Central Okinawa",
                        desc: "Famous for American Village, Botanical Gardens and Sunset Beach",
                        left: "-1%",
                        top: "40%",
                        images: [
                          "/regions/central1.jpg",
                          "/regions/central2.jpg",
                        ],
                      },
                      {
                        name: "South Okinawa",
                        desc: "Famous for Shuri Castle, Kokusai-dori and Okinawa World",
                        left: "40%",
                        top: "70%",
                        images: ["/regions/south1.jpg", "/regions/south2.jpg"],
                      },
                    ].map((region) => (
                      <div key={region.name}>
                        {/* Карточка региона */}
                        <div
                          onClick={() => {
                            setSelectedRegion(region.name);
                            setExpandedRegion(region);
                            setExpandedIndex(0);
                            setIsExpanded(true);
                          }}
                          className={`absolute bg-white rounded-md shadow-md px-1 py-2 min-w-[140px] cursor-pointer transition-shadow duration-300`}
                          style={{
                            left: region.left,
                            top: region.top,
                            width: "22%",
                            boxShadow:
                              selectedRegion === region.name
                                ? "0 0 20px 4px rgba(255, 223, 0, 0.8)"
                                : "",
                          }}
                          onMouseEnter={(e) => {
                            if (selectedRegion !== region.name)
                              e.currentTarget.style.boxShadow =
                                "0 0 15px 4px rgba(255,223,0,0.5)";
                          }}
                          onMouseLeave={(e) => {
                            if (selectedRegion !== region.name)
                              e.currentTarget.style.boxShadow = "";
                          }}
                        >
                          <p className="font-bold text-[13px] mb-1">
                            {region.name}
                          </p>
                          <p className="text-[11px] leading-tight">
                            {region.desc}
                          </p>
                          {startingPoint && transport
                            ? (() => {
                                const mins = getTravelTimeMinutes(
                                  startingPoint,
                                  region.name,
                                  transport
                                );
                                return mins ? (
                                  <p className="text-[11px] font-semibold text-[#3e2723] mt-1 mb-1">
                                    Travel time: ~
                                    <span className="text-[#e74c3c]">
                                      {mins} min
                                    </span>
                                  </p>
                                ) : (
                                  <p className="text-sm text-[#3e2723]/70 mb-1">
                                    Travel time: —
                                  </p>
                                );
                              })()
                            : null}
                        </div>

                        {/* Всплывающая карточка */}
                        {isExpanded && expandedRegion?.name === region.name && (
                          <>
                            {/* Backdrop: клик по нему закрывает карточку */}
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => {
                                setIsExpanded(false);
                                setExpandedRegion(null);
                              }}
                            />

                            {/* Карточка */}
                            <div
                              className="absolute bg-white rounded-lg shadow-2xl p-4 w-[300px] max-w-[90%] transition-all duration-300 z-50"
                              style={{
                                left: `clamp(0%, calc(${region.left} + 5%), calc(100% - 300px))`,
                                top: `clamp(0%, calc(${region.top} + 8%), calc(100% - 300px))`,
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Карусель */}
                              <div className="relative w-full h-[160px] overflow-hidden rounded-md mb-2">
                                <div className="relative w-full h-full">
                                  <Image
                                    key={popupImgSrc}
                                    src={popupImgSrc}
                                    alt={region.name}
                                    fill
                                    className="object-cover"
                                    onError={() => {
                                      if (popupImgSrc !== "/placeholder.jpg") {
                                        setPopupImgSrc("/placeholder.jpg");
                                      }
                                    }}
                                  />
                                </div>

                                {/* Навигация */}
                                {(expandedRegion?.images?.length ?? 0) > 1 && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedIndex((i) => {
                                          const len =
                                            expandedRegion?.images?.length ?? 1;
                                          const next =
                                            i === 0 ? len - 1 : i - 1;
                                          return next;
                                        });
                                      }}
                                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-2 py-1"
                                    >
                                      ‹
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedIndex((i) => {
                                          const len =
                                            expandedRegion?.images?.length ?? 1;
                                          return (i + 1) % len;
                                        });
                                      }}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-2 py-1"
                                    >
                                      ›
                                    </button>
                                  </>
                                )}
                              </div>

                              <h3 className="font-bold text-[#3e2723] mb-1">
                                {region.name}
                              </h3>
                              <p className="text-sm text-[#3e2723] mb-2">
                                {region.desc}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Правая панель step 4 */}
                <div className="w-[260px] 2xl:w-[340px] bg-[#fff8e1] m-2 rounded shadow-inner p-5 flex flex-col justify-between overflow-y-auto">
                  <div>
                    <h2 className="text-xl font-bold mb-3 text-[#3e2723]">
                      Your route
                    </h2>
                    <p className="text-[#3e2723] text-sm mb-1">
                      <span className="font-semibold">Departure:</span>{" "}
                      {startingPoint && startTime
                        ? `${startingPoint} — ${startTime}`
                        : "Not selected"}
                    </p>

                    {selectedLocations.length === 0 && (
                      <p className="text-xs text-[#6d4c41] italic">
                        No locations selected
                      </p>
                    )}

                    {selectedLocations.length > 0 &&
                      selectedLocations[0].travelMins !== undefined &&
                      selectedLocations[0].distanceKm !== undefined && (
                        <div className="italic text-xs text-[#6d4c41] mb-2 pl-1">
                          ⤷ {selectedLocations[0].travelMins} min ·{" "}
                          {selectedLocations[0].distanceKm.toFixed(1)} km
                        </div>
                      )}

                    {selectedLocations.map((loc, index) => (
                      <div key={loc.name} className="mb-3">
                        <div className="flex justify-between items-center text-sm text-[#3e2723]">
                          <span>
                            {loc.name} —{" "}
                            <span className="text-xs text-[#6d4c41]">
                              {loc.arrivalTime && loc.endTime
                                ? `${loc.arrivalTime}–${loc.endTime}`
                                : ""}
                            </span>
                          </span>

                          <button
                            onClick={() => {
                              const updated = selectedLocations.filter(
                                (_, i) => i !== index
                              );
                              // если у тебя есть recalculateSchedule — используй её, иначе просто поставь updated
                              if (
                                typeof (recalculateSchedule as any) ===
                                "function"
                              ) {
                                setSelectedLocations(
                                  recalculateSchedule(updated)
                                );
                              } else {
                                setSelectedLocations(updated);
                              }
                            }}
                            className="text-[#e74c3c] font-bold ml-2 hover:text-[#c0392b] transition cursor-pointer"
                            aria-label={`Remove ${loc.name}`}
                          >
                            ✕
                          </button>
                        </div>

                        {index < selectedLocations.length - 1 &&
                          selectedLocations[index + 1].travelMins !==
                            undefined &&
                          selectedLocations[index + 1].distanceKm !==
                            undefined && (
                            <div className="italic text-xs text-[#6d4c41] mt-1 pl-1">
                              ⤷ {selectedLocations[index + 1].travelMins} min ·{" "}
                              {selectedLocations[index + 1].distanceKm!.toFixed(
                                1
                              )}{" "}
                              km
                            </div>
                          )}
                      </div>
                    ))}
                  </div>

                  {/* Кнопки: большая кнопка отсутствует на этом шаге (по твоим прошлым пожеланиям) */}
                  <div className="mt-4">
                    <div className="flex justify-between gap-3">
                      <button
                        onClick={handleBackToPreferences}
                        className="flex-1 bg-[#d7ccc8] text-[#3e2723] font-bold py-3 rounded-md hover:bg-[#c0b3af] transition"
                      >
                        BACK
                      </button>

                      <button
                        onClick={() => selectedRegion && setStep("activities")}
                        disabled={!selectedRegion}
                        className={`flex-1 font-bold py-3 rounded-md transition ${
                          !selectedRegion
                            ? "bg-[#F39897] text-white cursor-not-allowed"
                            : "bg-[#e74c3c] text-white hover:bg-[#d84333]"
                        }`}
                      >
                        NEXT
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: ACTIVITIES */}
          {step === "activities" && (
            <div className="flex flex-col w-full h-screen overflow-hidden">
              <h2 className="text-3xl font-bold text-[#3e2723] mb-2 text-center">
                Choose your experiences in {selectedRegion}
              </h2>

              <div className="flex flex-row flex-1 w-full bg-yellow-50 overflow-hidden">
                {/* Левая часть — круг с иконками */}
                <div className="flex-1 relative flex items-center justify-start pl-6 overflow-hidden">
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      width: "min(90vh, 650px)",
                      aspectRatio: "1 / 1",
                      maxWidth: "100%",
                    }}
                  >
                    {/* Иконки по кругу */}
                    {activities.map((activity, index) => {
                      const angle =
                        (2 * Math.PI * index) / activities.length - Math.PI / 2;
                      const radius = 175;
                      const ellipseFactor = 1.25;
                      const x = radius * Math.cos(angle) * ellipseFactor;
                      const y = radius * Math.sin(angle);
                      const isSelected = interests.includes(activity.key);

                      return (
                        <div
                          key={activity.key}
                          className="absolute flex flex-col items-center cursor-pointer"
                          style={{
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          {/* Контейнер для иконки и мягкого свечения */}
                          <div
                            onClick={() =>
                              setInterests((prev) =>
                                prev.includes(activity.key)
                                  ? prev.filter((k) => k !== activity.key)
                                  : [...prev, activity.key]
                              )
                            }
                            onMouseEnter={(e) => {
                              if (!isSelected)
                                e.currentTarget.style.boxShadow =
                                  "0 0 20px 8px rgba(255, 223, 0, 0.4)";
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected)
                                e.currentTarget.style.boxShadow = "none";
                            }}
                            className="w-20 h-20 rounded-full flex items-center justify-center bg-white transition-shadow duration-300"
                            style={{
                              boxShadow: isSelected
                                ? "0 0 25px 12px rgba(255, 223, 0, 0.5)"
                                : "none",
                            }}
                          >
                            <Image
                              src={activity.icon}
                              alt={activity.label}
                              width={45}
                              height={45}
                            />
                          </div>

                          {/* Подпись под иконкой */}
                          <span className="mt-2 text-sm text-[#3e2723] font-medium text-center">
                            {activity.label}
                          </span>
                        </div>
                      );
                    })}

                    {/* Центр круга — выбранный аватар */}
                    {avatar && (
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Image
                          src={modifiedAvatarMap[avatar] ?? avatar}
                          alt="avatar"
                          width={90}
                          height={90}
                          style={{
                            filter: "drop-shadow(0 0 12px rgba(89, 89, 89, 1))",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Правая панель step 5 */}
                <div className="w-[260px] 2xl:w-[340px] bg-[#fff8e1] m-2 rounded shadow-inner p-5 flex flex-col justify-between overflow-y-auto">
                  <div>
                    <h2 className="text-xl font-bold mb-3 text-[#3e2723]">
                      Your route
                    </h2>
                    <p className="text-[#3e2723] text-sm mb-1">
                      <span className="font-semibold">Departure:</span>{" "}
                      {startingPoint && startTime
                        ? `${startingPoint} — ${startTime}`
                        : "Not selected"}
                    </p>

                    {selectedLocations.length === 0 && (
                      <p className="text-xs text-[#6d4c41] italic">
                        No locations selected
                      </p>
                    )}

                    {selectedLocations.length > 0 &&
                      selectedLocations[0].travelMins !== undefined &&
                      selectedLocations[0].distanceKm !== undefined && (
                        <div className="italic text-xs text-[#6d4c41] mb-2 pl-1">
                          ⤷ {selectedLocations[0].travelMins} min ·{" "}
                          {selectedLocations[0].distanceKm.toFixed(1)} km
                        </div>
                      )}

                    {selectedLocations.map((loc, index) => (
                      <div key={loc.name} className="mb-3">
                        <div className="flex justify-between items-center text-sm text-[#3e2723]">
                          <span>
                            {loc.name} —{" "}
                            <span className="text-xs text-[#6d4c41]">
                              {loc.arrivalTime && loc.endTime
                                ? `${loc.arrivalTime}–${loc.endTime}`
                                : ""}
                            </span>
                          </span>

                          <button
                            onClick={() => {
                              const updated = selectedLocations.filter(
                                (_, i) => i !== index
                              );
                              if (
                                typeof (recalculateSchedule as any) ===
                                "function"
                              ) {
                                setSelectedLocations(
                                  recalculateSchedule(updated)
                                );
                              } else {
                                setSelectedLocations(updated);
                              }
                            }}
                            className="text-[#e74c3c] font-bold ml-2 hover:text-[#c0392b] transition cursor-pointer"
                            aria-label={`Remove ${loc.name}`}
                          >
                            ✕
                          </button>
                        </div>

                        {index < selectedLocations.length - 1 &&
                          selectedLocations[index + 1].travelMins !==
                            undefined &&
                          selectedLocations[index + 1].distanceKm !==
                            undefined && (
                            <div className="italic text-xs text-[#6d4c41] mt-1 pl-1">
                              ⤷ {selectedLocations[index + 1].travelMins} min ·{" "}
                              {selectedLocations[index + 1].distanceKm!.toFixed(
                                1
                              )}{" "}
                              km
                            </div>
                          )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between gap-3">
                      <button
                        onClick={handleBackToMap}
                        className="flex-1 bg-[#d7ccc8] text-[#3e2723] font-bold py-3 rounded-md hover:bg-[#c0b3af] transition"
                      >
                        BACK
                      </button>

                      <button
                        onClick={() => {
                          if (interests.length === 0) {
                            alert("Please select an activity!");
                            return;
                          }
                          setStep("locations");
                        }}
                        disabled={interests.length === 0}
                        className={`flex-1 font-bold py-3 rounded-md transition ${
                          interests.length === 0
                            ? "bg-[#F39897] text-white cursor-not-allowed"
                            : "bg-[#e74c3c] text-white hover:bg-[#d84333]"
                        }`}
                      >
                        NEXT
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: LOCATIONS */}
          {step === "locations" && selectedRegion && (
            <div className="flex flex-col w-full h-screen overflow-hidden">
              <h2 className="text-3xl font-bold text-[#3e2723] mb-2 text-center">
                Explore {selectedRegion}
              </h2>

              <div className="flex flex-1 w-full bg-yellow-50 overflow-hidden">
                {/* Левая часть — карта */}
                <div
                  className="flex-1 relative flex items-center justify-center overflow-hidden p-2"
                  onClick={() => setActiveLocation(null)}
                >
                  <div className="relative w-full h-full ">
                    {avatar && (
                      <div
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: "83%",
                          top: "85%",
                        }}
                      >
                        <Image
                          src={modifiedAvatarMap[avatar] ?? avatar}
                          alt="avatar"
                          width={75}
                          height={75}
                          style={{
                            filter: "drop-shadow(0 0 12px rgba(89, 89, 89, 1))",
                          }}
                        />
                      </div>
                    )}

                    <Image
                      src={`/maps/${selectedRegion}.svg`}
                      alt={`${selectedRegion} map`}
                      fill
                      className="object-contain"
                    />

                    {locationsData[selectedRegion as keyof LocationsData]
                      .filter((loc) => interests.includes(loc.category))
                      .map((loc) => {
                        const isSelected = selectedLocations.some(
                          (l) => l.name === loc.name
                        );

                        const leftPercent = parseFloat(loc.left); // "12.5%" -> 12.5
                        const topPercent = parseFloat(loc.top);

                        const H_THRESHOLD = 65;
                        const V_THRESHOLD = 59;

                        const cardStyle: React.CSSProperties = {
                          position: "absolute",
                          zIndex: 20,
                          width: "260px",
                        };

                        if (leftPercent > H_THRESHOLD) {
                          cardStyle.right = `calc(${100 - leftPercent}% + 6px)`;
                        } else {
                          cardStyle.left = `calc(${loc.left} + 6px)`;
                        }

                        if (topPercent > V_THRESHOLD) {
                          cardStyle.bottom = `calc(${100 - topPercent}% + 6px)`;
                        } else {
                          cardStyle.top = `calc(${loc.top} + 6px)`;
                        }

                        return (
                          <div key={loc.name}>
                            <div
                              className="absolute cursor-pointer group"
                              style={{
                                left: loc.left,
                                top: loc.top,
                                transform: "translate(-50%, -50%)",
                                zIndex:
                                  hoveredLocation === loc.name
                                    ? 20
                                    : isSelected
                                    ? 10
                                    : 1,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveLocation(loc);
                              }}
                              onMouseEnter={() => setHoveredLocation(loc.name)} // <-- при наведении
                              onMouseLeave={() => setHoveredLocation(null)} // <-- при уходе
                            >
                              <Image
                                src={categoryIcons[loc.category]}
                                alt={loc.category + " icon"}
                                width={34}
                                height={34}
                                className={
                                  "transition-transform duration-200 " +
                                  (isSelected
                                    ? "scale-110 drop-shadow-[0_0_12px_rgba(231,76,60,0.8)]" // выбранная точка — немного увеличена + красная тень
                                    : hoveredLocation === loc.name
                                    ? "scale-175" // ховер — увеличиваем без свечения
                                    : "group-hover:scale-110")
                                }
                              />
                            </div>

                            {activeLocation?.name === loc.name && (
                              <div
                                className="bg-white rounded-md shadow-lg p-3 transition-all duration-300"
                                style={cardStyle}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="w-[240px] h-[160px] overflow-hidden rounded-md mb-2">
                                  <Image
                                    src={activeLocation.image}
                                    alt={activeLocation.name}
                                    width={240}
                                    height={160}
                                    className="w-full h-full object-cover"
                                  />
                                </div>

                                <h3 className="font-bold text-[#3e2723] mb-1">
                                  {activeLocation.name}
                                </h3>
                                <p className="text-[13px] text-[#3e2723] mb-2">
                                  {activeLocation.desc}
                                </p>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (
                                      !selectedLocations.some(
                                        (l) => l.name === activeLocation.name
                                      )
                                    ) {
                                      const last =
                                        selectedLocations[
                                          selectedLocations.length - 1
                                        ];

                                      const prevLat = last
                                        ? last.lat
                                        : START_POINTS[
                                            startingPoint as StartingPoint
                                          ].lat!;
                                      const prevLng = last
                                        ? last.lng
                                        : START_POINTS[
                                            startingPoint as StartingPoint
                                          ].lng!;

                                      const dist = haversineDistance(
                                        prevLat,
                                        prevLng,
                                        activeLocation.lat,
                                        activeLocation.lng
                                      );
                                      const travelMins = Math.max(
                                        1,
                                        Math.round(
                                          (dist / getSpeed(transport)) * 60
                                        )
                                      );

                                      const departureTime =
                                        selectedLocations.length === 0
                                          ? startTime
                                          : last.endTime!;

                                      const arrivalTime = addMinutesToTime(
                                        departureTime,
                                        travelMins
                                      );
                                      const endTime = addMinutesToTime(
                                        arrivalTime,
                                        activeLocation.visitTime
                                      );

                                      setSelectedLocations([
                                        ...selectedLocations,
                                        {
                                          ...activeLocation,
                                          arrivalTime,
                                          endTime,
                                          travelMins,
                                          distanceKm: Number(dist.toFixed(1)),
                                        },
                                      ]);
                                      setAvatarMapPos({
                                        left:
                                          activeLocation.globalLeft ||
                                          activeLocation.left ||
                                          "50%",
                                        top:
                                          activeLocation.globalTop ||
                                          activeLocation.top ||
                                          "50%",
                                      });
                                    }
                                    setActiveLocation(null);
                                  }}
                                  className="bg-[#e74c3c] text-white py-2 px-4 rounded-md hover:bg-[#d84333] transition"
                                >
                                  Select
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Правая панель step 6 */}
                <div className="w-[260px] 2xl:w-[340px] bg-[#fff8e1] m-2 rounded shadow-inner p-5 flex flex-col h-full">
                  <div className="mb-1">
                    <h2 className="text-xl font-bold mb-3 text-[#3e2723]">
                      Your route
                    </h2>
                    <p className="text-[#3e2723] text-sm mb-0">
                      <span className="font-semibold">Departure:</span>{" "}
                      {startingPoint && startTime
                        ? `${startingPoint} — ${startTime}`
                        : "Not selected"}
                    </p>
                  </div>

                  {/* Список локаций */}
                  <div className="flex-1 overflow-y-auto">
                    {selectedLocations.length === 0 && (
                      <p className="text-xs text-[#6d4c41] italic">
                        No locations selected
                      </p>
                    )}

                    {selectedLocations.length > 0 &&
                      selectedLocations[0].travelMins !== undefined &&
                      selectedLocations[0].distanceKm !== undefined && (
                        <div className="italic text-xs text-[#6d4c41] mb-2 pl-1">
                          ⤷ {selectedLocations[0].travelMins} min ·{" "}
                          {selectedLocations[0].distanceKm.toFixed(1)} km
                        </div>
                      )}

                    {selectedLocations.map((loc, index) => (
                      <div key={loc.name} className="mb-3">
                        <div className="flex justify-between items-center text-sm text-[#3e2723]">
                          <span>
                            {loc.name} —{" "}
                            <span className="text-xs text-[#6d4c41]">
                              {loc.arrivalTime && loc.endTime
                                ? `${loc.arrivalTime}–${loc.endTime}`
                                : ""}
                            </span>
                          </span>

                          <button
                            onClick={() => {
                              const updated = selectedLocations.filter(
                                (_, i) => i !== index
                              );
                              if (
                                typeof (recalculateSchedule as any) ===
                                "function"
                              ) {
                                setSelectedLocations(
                                  recalculateSchedule(updated)
                                );
                              } else {
                                setSelectedLocations(updated);
                              }
                            }}
                            className="text-[#e74c3c] font-bold ml-2 hover:text-[#c0392b] transition cursor-pointer"
                            aria-label={`Remove ${loc.name}`}
                          >
                            ✕
                          </button>
                        </div>

                        {index < selectedLocations.length - 1 &&
                          selectedLocations[index + 1].travelMins !==
                            undefined &&
                          selectedLocations[index + 1].distanceKm !==
                            undefined && (
                            <div className="italic text-xs text-[#6d4c41] mt-1 pl-1">
                              ⤷ {selectedLocations[index + 1].travelMins} min ·{" "}
                              {selectedLocations[index + 1].distanceKm!.toFixed(
                                1
                              )}{" "}
                              km
                            </div>
                          )}
                      </div>
                    ))}
                  </div>

                  {/* Нижний блок с кнопками */}
                  <div className="mt-4">
                    <div className="mb-3">
                      <button
                        onClick={() => {
                          setSelectedRegion(null);
                          setIsExpanded(false);
                          setExpandedRegion(null);
                          setStep("map");
                        }}
                        className="w-full bg-[#d7ccc8] text-[#3e2723] font-semibold py-3 rounded-md hover:bg-[#c0b3af] transition"
                      >
                        Choose another region
                      </button>
                    </div>

                    {/* Ряд BACK / NEXT */}
                    <div className="flex justify-between gap-3">
                      <button
                        onClick={handleBackToActivities}
                        className="flex-1 bg-[#d7ccc8] text-[#3e2723] font-bold py-3 rounded-md hover:bg-[#c0b3af] transition"
                      >
                        BACK
                      </button>

                      <button
                        onClick={handleFinish}
                        disabled={selectedLocations.length === 0}
                        className={`flex-1 font-bold py-3 rounded-md transition ${
                          selectedLocations.length === 0
                            ? "bg-[#F39897] text-white cursor-not-allowed"
                            : "bg-[#e74c3c] text-white hover:bg-[#d84333]"
                        }`}
                      >
                        NEXT
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: FINAL */}
          {step === "done" && (
            <div className="flex flex-col items-center justify-center h-full w-full text-center p-6">
              <h1 className="text-4xl font-bold text-[#3e2723] mb-2">
                Congratulations!
              </h1>
              <p className="text-xl text-[#3e2723] mb-4">
                Your route is ready 🎉
              </p>
              <Image
                src="/endinglogo.svg"
                alt="Okinawa illustration"
                width={150}
                height={150}
                className="mb-8"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => createTextPdfAndPrint(selectedLocations)}
                  className="bg-[#3e2723] text-white font-bold py-3 px-6 rounded-md hover:opacity-90 transition"
                >
                  Export route to PDF
                </button>

                <button
                  onClick={() => {
                    if (!selectedLocations || selectedLocations.length === 0) {
                      alert("No locations selected");
                      return;
                    }

                    const startArg =
                      typeof startingPoint === "string" &&
                      (START_POINTS as any)?.[startingPoint as any]
                        ? (START_POINTS as any)[startingPoint as any]
                        : startingPoint || undefined;

                    const url =
                      finalMapsUrl ??
                      buildGoogleMapsUrlMultipleWaypointsFixed(
                        selectedLocations,
                        startArg as any
                      );
                    console.log("Open button url:", url);
                    if (!url) {
                      alert("Failed to build Google Maps URL");
                      return;
                    }
                    window.open(url, "_blank");
                  }}
                  className="bg-[#e74c3c] text-white font-bold py-3 px-6 rounded-md hover:bg-[#d84333] transition"
                >
                  Open route in Google Maps
                </button>
              </div>

              <button
                onClick={() => {
                  setName("");
                  setAvatar(null);
                  setTransport(null);
                  setStartingPoint(null);
                  setSelectedRegion(null);
                  setStartTime("");
                  setSelectedLocations([]);
                  setActiveLocation(null);
                  setStep("start");
                }}
                className="mt-6 text-sm text-[#3e2723]/80 underline"
              >
                Back to start
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
