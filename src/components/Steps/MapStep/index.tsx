/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import {
  Location,
  Transport,
  RegionName,
  Step,
  ExpandedRegion,
  StartingPoint,
} from "../types";

import { recalculateSchedule } from "../timeDistance";

type Props = {
  step: Step;
  avatar: string | null;
  avatarMapPos: { top: string | number; left: string | number } | null;
  startingPoint: StartingPoint;
  transport: Transport;
  startTime: string;
  selectedRegion: RegionName | null;
  setSelectedRegion: (region: RegionName) => void;
  expandedRegion: ExpandedRegion | null;
  setExpandedRegion: (region: ExpandedRegion | null) => void;

  expandedIndex: number;
  setExpandedIndex: React.Dispatch<React.SetStateAction<number>>;

  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
  selectedLocations: Location[];
  setSelectedLocations: (locs: Location[]) => void;
  formatTravelTime: (mins: number) => string;
  getTravelTimeMinutes: (
    fromPoint: string,
    toRegion: RegionName,
    transport: Transport | ""
  ) => number | null;
  //   popupImgSrc: string;
  //   setPopupImgSrc: (src: string) => void;
  handleBackToPreferences: () => void;
  // recalculateSchedule?: (locs: Location[]) => Location[];
  setStep: React.Dispatch<React.SetStateAction<Step>>;
};

export default function MapStep({
  step,
  avatar,
  avatarMapPos,
  startingPoint,
  transport,
  startTime,
  selectedRegion,
  setSelectedRegion,
  expandedRegion,
  setExpandedRegion,
  expandedIndex,
  setExpandedIndex,
  isExpanded,
  setIsExpanded,
  selectedLocations,
  setSelectedLocations,
  formatTravelTime,
  getTravelTimeMinutes,
  //   popupImgSrc,
  //   setPopupImgSrc,
  handleBackToPreferences,
  // recalculateSchedule,
  setStep,
}: Props) {
  if (step !== "map") return null;

  const regions = [
    {
      name: "Yanbaru" as RegionName,
      desc: "Famous for Cape Hedo, Yanbaru National Park, Tataki Falls",
      left: "82%",
      top: "5%",
      images: ["/locations/y1.png", "/locations/y6.png"],
    },
    {
      name: "Motobu" as RegionName,
      desc: "Famous for Churaumi Aquarium, Junglia Okinawa and Nakijin Castle Ruins",
      left: "13%",
      top: "12%",
      images: ["/locations/m2.png", "/locations/m1.png"],
    },
    {
      name: "Central Okinawa" as RegionName,
      desc: "Famous for American Village, Botanical Gardens and Sunset Beach",
      left: "-1%",
      top: "40%",
      images: ["/locations/CO1.png", "/locations/CO3.png"],
    },
    {
      name: "South Okinawa" as RegionName,
      desc: "Famous for Shuri Castle, Kokusai-dori and Okinawa World",
      left: "40%",
      top: "70%",
      images: ["/locations/SO4.png", "/locations/SO7.png"],
    },
  ];

  return (
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
            {regions.map((region) => (
              <div key={region.name}>
                <div
                  onClick={() => {
                    setSelectedRegion(region.name);
                    setExpandedRegion(region);
                    setExpandedIndex(0);
                    setIsExpanded(true);
                  }}
                  className="absolute bg-white rounded-md shadow-md px-1 py-2 min-w-[140px] cursor-pointer transition-shadow duration-300"
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
                  <p className="font-bold text-[13px] mb-1">{region.name}</p>
                  <p className="text-[11px] leading-tight">{region.desc}</p>

                  {/* Travel time from last location */}
                  {startingPoint &&
                    transport &&
                    (() => {
                      const last = selectedLocations.at(-1);
                      const fromPoint = last
                        ? last.closestStartingPoint
                        : startingPoint;
                      const mins = getTravelTimeMinutes(
                        fromPoint,
                        region.name,
                        transport
                      );
                      return (
                        <p className="text-[11px] font-semibold text-[#3e2723] mt-1 mb-1">
                          Travel time:{" "}
                          {mins ? (
                            <span className="text-[#e74c3c]">
                              {formatTravelTime(mins)}
                            </span>
                          ) : (
                            "—"
                          )}
                        </p>
                      );
                    })()}
                </div>

                {/* Expanded popup */}
                {isExpanded && expandedRegion?.name === region.name && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => {
                        setIsExpanded(false);
                        setExpandedRegion(null);
                      }}
                    />
                    <div
                      className="absolute bg-white rounded-lg shadow-2xl p-4 w-[300px] max-w-[90%] transition-all duration-300 z-50"
                      style={{
                        left: `clamp(0%, calc(${region.left} + 5%), calc(100% - 300px))`,
                        top: `clamp(0%, calc(${region.top} + 8%), calc(100% - 300px))`,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative w-full h-[160px] overflow-hidden rounded-md mb-2">
                        <Image
                          key={expandedRegion.images[expandedIndex]}
                          src={expandedRegion.images[expandedIndex]}
                          alt={region.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = "/placeholder.jpg";
                          }}
                        />
                        {expandedRegion.images.length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedIndex((i) =>
                                  i === 0
                                    ? expandedRegion.images.length - 1
                                    : i - 1
                                );
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 text-2xl text-white font-bold px-1 cursor-pointer"
                            >
                              ‹
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedIndex(
                                  (i) => (i + 1) % expandedRegion.images.length
                                );
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl text-white font-bold px-1 cursor-pointer"
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

                      {/* Время выбранной локации (если она выбрана) */}
                      {selectedLocations
                        .filter((loc) => loc.name === region.name)
                        .map((loc) => (
                          <div
                            key={loc.name}
                            className="flex flex-col text-sm font-bold text-[#3e2723] mb-1"
                          >
                            <span>Arrival: {loc.arrivalTime || "—"}</span>
                            <span>End: {loc.endTime || "—"}</span>
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Правая панель */}
        <div className="w-[260px] 2xl:w-[340px] bg-[#fff8e1] m-2 rounded shadow-inner p-5 flex flex-col h-full overflow-y-auto">
          <h2 className="text-xl font-bold mb-3 text-[#3e2723]">Your route</h2>

          {/* Стартовая строка */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-[#3e2723]">
              <div className="flex flex-col items-start font-bold text-sm">
                <span>{startTime || ""}</span>
              </div>

              <div className="flex items-center flex-1 ml-2 gap-2">
                <span className="text-[#3e2723] font-bold">—</span>
                <span className="text-[#3e2723] text-sm font-bold break-words">
                  {startingPoint || "Not selected"}
                </span>
              </div>
            </div>
          </div>

          {/* Время + расстояние до первой точки */}
          {selectedLocations.length > 0 &&
            selectedLocations[0].travelMins !== undefined &&
            selectedLocations[0].distanceKm !== undefined && (
              <div className="relative flex items-center justify-between text-xs italic font-light text-[#6d4c41] mb-2">
                <div className="flex items-center gap-1 ml-3">
                  <img src="/icons/clock.svg" alt="time" className="w-4 h-4" />
                  <span>
                    {formatTravelTime(selectedLocations[0].travelMins!)}
                  </span>
                </div>

                <img
                  src="/icons/arrow-down.svg"
                  alt="to"
                  className="absolute left-1/2 -translate-x-1/2 w-5 h-5"
                />

                <div className="flex items-center gap-1 mr-3">
                  <img
                    src={
                      transport === "car"
                        ? "/icons/car.svg"
                        : "/icons/public.svg"
                    }
                    alt="transport"
                    className="w-5 h-5"
                  />
                  <span>{selectedLocations[0].distanceKm!.toFixed(1)} km</span>
                </div>
              </div>
            )}

          {/* Список локаций */}
          <div>
            {selectedLocations.length === 0 && (
              <p className="text-xs text-[#6d4c41] italic">
                No locations selected
              </p>
            )}

            {selectedLocations.map((loc, index) => (
              <div key={loc.name} className="mb-3">
                <div className="flex items-center justify-between text-[#3e2723]">
                  <div className="flex flex-col items-start font-bold text-sm">
                    <span>{loc.arrivalTime || ""}</span>
                    <span>{loc.endTime || ""}</span>
                  </div>

                  <div className="table w-full ml-2">
                    <div className="table-row">
                      <div className="table-cell w-4 text-center align-middle font-bold text-[#3e2723]">
                        —
                      </div>
                      <div className="table-cell align-middle text-left text-[#3e2723] text-sm font-bold break-words pl-2">
                        {String(loc.name || "Not selected").trimStart()}
                      </div>

                      <div className="table-cell w-auto align-middle">
                        <button
                          onClick={() => {
                            const updated = selectedLocations.filter(
                              (_, i) => i !== index
                            );
                            if (updated.length > 0) {
                              const updatedLocations = recalculateSchedule(
                                updated,
                                startingPoint,
                                startTime,
                                transport
                              );
                              setSelectedLocations(updatedLocations);
                            } else {
                              setSelectedLocations([]);
                            }
                          }}
                          className="text-[#e74c3c] font-bold ml-2 hover:text-[#c0392b] transition cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {index < selectedLocations.length - 1 &&
                  selectedLocations[index + 1].travelMins !== undefined &&
                  selectedLocations[index + 1].distanceKm !== undefined && (
                    <div className="relative flex items-center justify-between text-xs italic font-light text-[#6d4c41] mt-2 mb-2">
                      <div className="flex items-center gap-1 ml-3">
                        <img
                          src="/icons/clock.svg"
                          alt="time"
                          className="w-4 h-4"
                        />
                        <span>
                          {formatTravelTime(
                            selectedLocations[index + 1].travelMins!
                          )}
                        </span>
                      </div>

                      <img
                        src="/icons/arrow-down.svg"
                        alt="to"
                        className="absolute left-1/2 -translate-x-1/2 w-5 h-5"
                      />

                      <div className="flex items-center gap-1 mr-3">
                        <img
                          src={
                            transport === "car"
                              ? "/icons/car.svg"
                              : "/icons/public.svg"
                          }
                          alt="transport"
                          className="w-5 h-5"
                        />
                        <span>
                          {selectedLocations[index + 1].distanceKm!.toFixed(1)}{" "}
                          km
                        </span>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>

          {/* Итоговое время */}
          {selectedLocations.length > 0 && (
            <div className="mt-3 border-t border-[#d7ccc8] pt-3 text-sm text-[#3e2723] font-bold flex flex-col items-center">
              <div className="flex items-center gap-2">
                <img
                  src="/icons/clock.svg"
                  alt="total time"
                  className="w-4 h-4"
                />
                <span>
                  Total time:{" "}
                  {formatTravelTime(
                    selectedLocations.reduce(
                      (sum, loc) =>
                        sum + (loc.travelMins || 0) + (loc.visitTime || 0),
                      0
                    )
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <img
                  src={
                    transport === "car" ? "/icons/car.svg" : "/icons/public.svg"
                  }
                  alt="total distance"
                  className="w-5 h-5"
                />
                <span>
                  Total distance:{" "}
                  {selectedLocations
                    .reduce((sum, loc) => sum + (loc.distanceKm || 0), 0)
                    .toFixed(1)}{" "}
                  km
                </span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleBackToPreferences}
              className="flex-1 bg-[#d7ccc8] text-[#3e2723] font-bold py-3 rounded-md hover:bg-[#c0b3af] transition cursor-pointer"
            >
              BACK
            </button>
            <button
              onClick={() => selectedRegion && setStep("activities")}
              disabled={!selectedRegion}
              className={`flex-1 font-bold py-3 cursor-pointer rounded-md transition ${
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
  );
}
