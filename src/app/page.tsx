"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import locationsDataJson from "../../data/locations.json";

type Location = {
  name: string;
  desc: string;
  image: string;
  category: string;
  left: string;
  top: string;
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
  // в верхней части компонента (рядом с useState)
  const handleBackToAvatar = () => {
    setStep("avatar");
    // сбрасываем данные шага preferences
    setStartingPoint("");
    setTransport("");
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
    setSelectedLocations([]);
    setActiveLocation(null);
    setIsExpanded(false);
    setExpandedRegion(null);
  };

  const [startingPoint, setStartingPoint] = useState("");
  const [transport, setTransport] = useState<Transport | "">("");

  const [interests, setInterests] = useState<string[]>([]);
  const [step, setStep] = useState<
    "start" | "avatar" | "preferences" | "map" | "activities" | "locations"
  >("start");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);

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
                      disabled={!startingPoint || !transport}
                      className={`font-bold py-3 px-5 rounded-md transition ${
                        !startingPoint || !transport
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
                    {avatar && startingPoint && (
                      <div
                        className="absolute transition-all duration-500"
                        style={{
                          top:
                            startingPoint === "Naha Airport"
                              ? "80%"
                              : startingPoint === "Tomari Port"
                              ? "75%"
                              : startingPoint === "Chatan"
                              ? "65%"
                              : startingPoint === "Nago"
                              ? "38%"
                              : "35%",
                          left:
                            startingPoint === "Naha Airport"
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

                            {/* Собственно карточка — клики внутри не закрывают */}
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
                                    // key принудительно перерендерит <Image> при смене popupImgSrc
                                    key={popupImgSrc}
                                    src={popupImgSrc}
                                    alt={region.name}
                                    fill
                                    className="object-cover"
                                    onError={() => {
                                      // если загрузка провалилась — подставляем placeholder
                                      if (popupImgSrc !== "/placeholder.jpg") {
                                        setPopupImgSrc("/placeholder.jpg");
                                      }
                                    }}
                                  />
                                </div>

                                {/* Навигация — показываем только если есть >1 изображений */}
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

                {/* Right panel */}
                <div className="w-[260px] 2xl:w-[340px] bg-[#fff8e1] m-2 rounded shadow-inner p-5 flex flex-col justify-between overflow-y-auto">
                  <div>
                    <h2 className="text-xl font-bold mb-3 text-[#3e2723]">
                      Your route
                    </h2>
                    <p className="text-[#3e2723] text-sm mb-4">
                      <span className="font-semibold">Starting point:</span>{" "}
                      {startingPoint || "Not selected"}
                    </p>
                    {/* <p className="text-[#3e2723] text-sm">
                      <span className="font-semibold">Region:</span>{" "}
                      {selectedRegion || "Not selected"}
                    </p> */}
                  </div>

                  <div className="flex justify-center gap-3 mt-4">
                    <button
                      onClick={handleBackToPreferences}
                      className="bg-[#d7ccc8] text-[#3e2723] font-bold py-3 px-6 rounded-md hover:bg-[#c0b3af] transition cursor-pointer"
                    >
                      BACK
                    </button>

                    <button
                      onClick={() => selectedRegion && setStep("activities")}
                      disabled={!selectedRegion}
                      className={`font-bold py-3 px-5 rounded-md transition ${
                        !selectedRegion
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
                          src={avatar}
                          alt="avatar"
                          width={80}
                          height={80}
                          className="rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Правая панель */}
                <div className="w-[260px] 2xl:w-[340px] bg-[#fff8e1] m-2 rounded shadow-inner p-5 flex flex-col justify-between overflow-y-auto">
                  <div>
                    <h2 className="text-xl font-bold mb-3 text-[#3e2723]">
                      Your route
                    </h2>
                    <p className="text-[#3e2723] text-sm mb-2">
                      <span className="font-semibold">Starting point:</span>{" "}
                      {startingPoint || "Not selected"}
                    </p>
                    {/* <p className="text-[#3e2723] text-sm mb-2">
                      <span className="font-semibold">Region:</span>{" "}
                      {selectedRegion || "Not selected"}
                    </p> */}
                    {/* <p className="text-[#3e2723] text-sm">
                      <span className="font-semibold">Activities:</span>{" "}
                      {interests.length > 0
                        ? interests[0]
                        : "No activity selected"}
                    </p> */}
                  </div>

                  <div className="flex justify-center gap-3 mt-4">
                    <button
                      onClick={handleBackToMap}
                      className="bg-[#d7ccc8] text-[#3e2723] font-bold py-3 px-6 rounded-md hover:bg-[#c0b3af] transition cursor-pointer"
                    >
                      BACK
                    </button>

                    <button
                      onClick={() => {
                        if (interests.length === 0) {
                          alert("Please select an activity!");
                          return;
                        }
                        setStep("locations"); // ← вот здесь переход к следующему шагу
                      }}
                      className={`font-bold py-3 px-5 rounded-md transition ${
                        interests.length === 0
                          ? "bg-[#F39897] text-white cursor-not-allowed"
                          : "bg-[#e74c3c] text-white cursor-pointer hover:bg-[#d84333]"
                      }`}
                      disabled={interests.length === 0}
                    >
                      NEXT
                    </button>
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
                  onClick={() => setActiveLocation(null)} // клик по пустому месту закрывает карточку
                >
                  <div className="relative w-full h-full ">
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

                        const H_THRESHOLD = 65; // если точка правее 75% — показываем карточку вправо/слева меняем на right
                        const V_THRESHOLD = 59; // если точка ниже 75% — показываем карточку выше (используем bottom)

                        // Подготовим стиль карточки: используем либо left/top, либо right/bottom
                        const cardStyle: React.CSSProperties = {
                          position: "absolute",
                          zIndex: 20,
                          width: "260px", // соответствует классу w-[260px]
                        };

                        // Если точка правее порога — ставим карточку "слева" от точки (через right)
                        if (leftPercent > H_THRESHOLD) {
                          cardStyle.right = `calc(${100 - leftPercent}% + 6px)`; // +12px отступ от точки
                        } else {
                          cardStyle.left = `calc(${loc.left} + 6px)`; // смещение вправо от точки
                        }

                        // Если точка ниже порога — ставим карточку над точкой (через bottom)
                        if (topPercent > V_THRESHOLD) {
                          cardStyle.bottom = `calc(${100 - topPercent}% + 6px)`;
                        } else {
                          cardStyle.top = `calc(${loc.top} + 6px)`;
                        }

                        return (
                          <div key={loc.name}>
                            {/* Точка: клики не всплывают, контейнер не будет закрывать карточку */}
                            <div
                              className="absolute cursor-pointer group"
                              style={{
                                left: loc.left,
                                top: loc.top,
                                transform: "translate(-50%, -50%)",
                                zIndex: isSelected ? 10 : 1,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveLocation(loc);
                              }}
                            >
                              <Image
                                src={categoryIcons[loc.category]}
                                alt={loc.category + " icon"}
                                width={34}
                                height={34}
                                className={
                                  "transition-transform duration-200 " +
                                  (isSelected
                                    ? "scale-110 drop-shadow-[0_0_12px_rgba(231,76,60,0.8)]"
                                    : "group-hover:scale-175")
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
                                      setSelectedLocations([
                                        ...selectedLocations,
                                        activeLocation,
                                      ]);
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

                {/* Правая панель */}
                <div className="w-[260px] 2xl:w-[340px] bg-[#fff8e1] m-2 rounded shadow-inner p-5 flex flex-col justify-between overflow-y-auto">
                  <div>
                    <h2 className="text-xl font-bold mb-3 text-[#3e2723]">
                      Your route
                    </h2>
                    <p className="text-[#3e2723] text-sm mb-2">
                      <span className="font-semibold">Starting point:</span>{" "}
                      {startingPoint || "Not selected"}
                    </p>
                    {/* <p className="text-[#3e2723] text-sm mb-2">
                      <span className="font-semibold">Region:</span>{" "}
                      {selectedRegion || "Not selected"}
                    </p> */}
                    {/* <p className="text-[#3e2723] text-sm mb-2">
                      <span className="font-semibold">Activity:</span>{" "}
                      {interests[0] || "No activity selected"}
                    </p> */}
                    <p className="text-[#3e2723] text-sm mb-2 font-semibold">
                      Selected locations:
                    </p>
                    {selectedLocations.length > 0 ? (
                      selectedLocations.map((loc) => (
                        <div
                          key={loc.name}
                          className="flex justify-between items-center text-sm text-[#3e2723] mb-1"
                        >
                          <span>• {loc.name}</span>

                          <button
                            onClick={() => {
                              setSelectedLocations(
                                selectedLocations.filter(
                                  (l) => l.name !== loc.name
                                )
                              );
                            }}
                            className="text-[#e74c3c] font-bold ml-2 hover:text-[#c0392b] transition cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#3e2723]">
                        No locations selected
                      </p>
                    )}
                  </div>

                  <div className="flex justify-center gap-3 mt-4">
                    <button
                      onClick={handleBackToActivities}
                      className="bg-[#d7ccc8] text-[#3e2723] font-bold py-3 px-6 rounded-md hover:bg-[#c0b3af] transition cursor-pointer"
                    >
                      BACK
                    </button>

                    <button
                      onClick={() => {
                        if (selectedLocations.length === 0) {
                          alert("Please select at least one location!");
                          return;
                        }
                        alert("Next step coming soon!");
                      }}
                      className={`font-bold py-3 px-5 rounded-md transition ${
                        selectedLocations.length === 0
                          ? "bg-[#F39897] text-white cursor-not-allowed"
                          : "bg-[#e74c3c] text-white cursor-pointer hover:bg-[#d84333]"
                      }`}
                      disabled={selectedLocations.length === 0}
                    >
                      NEXT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
