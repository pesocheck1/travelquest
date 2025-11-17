/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  RegionName,
  Location,
  LocationsData,
  Transport,
  StartingPoint,
  START_POINTS,
  Step,
  ExpandedRegion,
} from "../types";

import {
  addMinutesToTime,
  formatTravelTime,
  getSpeed,
  haversineDistance,
  recalculateSchedule,
} from "../timeDistance";
import { handleFinish as handleFinishUtil } from "../routeUtils";

type Props = {
  selectedRegion: RegionName | null;
  setSelectedRegion: (region: RegionName | null) => void;

  selectedLocations: Location[];
  setSelectedLocations: (l: Location[]) => void;

  interests: string[];
  setInterests: (v: string[]) => void;

  startingPoint: StartingPoint;
  setStartingPoint: (v: string) => void;

  transport: Transport;

  setTransport: (v: Transport | "") => void;

  startTime: string;
  setStartTime: (v: string) => void;

  avatar?: string;
  modifiedAvatarMap?: Record<string, string>;
  setAvatarMapPos: (pos: {
    left: string | number;
    top: string | number;
  }) => void;

  locationsData: LocationsData;
  categoryIcons: Record<string, string>;

  setStep: (v: Step) => void;
  handleBackToActivities: () => void;
  // handleFinish: () => void;

  expandedRegion: ExpandedRegion | null;
  setExpandedRegion: (r: ExpandedRegion | null) => void;
  setIsExpanded: (v: boolean) => void;
  // recalculateSchedule?: (locations: Location[]) => Location[];
};

export default function LocationsStep({
  selectedRegion,
  setSelectedRegion,
  selectedLocations,
  setSelectedLocations,
  interests,
  startingPoint,
  transport,
  startTime,
  avatar,
  modifiedAvatarMap,
  setAvatarMapPos,
  locationsData,
  categoryIcons,
  setStep,
  handleBackToActivities,
  // handleFinish,
  setExpandedRegion,
  setIsExpanded,
}: // recalculateSchedule,
Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [finalMapsUrl, setFinalMapsUrl] = useState<string | null>(null);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <h2 className="text-3xl font-bold text-[#3e2723] mb-2 text-center">
        Explore {selectedRegion}
      </h2>

      <div className="flex flex-1 w-full bg-yellow-50 overflow-hidden">
        {/* Левая часть — карта */}
        <div
          className="flex-1 relative flex items-center justify-center overflow-hidden p-2"
          ref={mapRef}
          onClick={() => setActiveLocation(null)}
        >
          <div className="relative w-full h-full">
            {/* Аватар */}
            {avatar && (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: "83%", top: "85%" }}
              >
                <Image
                  src={modifiedAvatarMap?.[avatar] ?? avatar}
                  alt="avatar"
                  width={90}
                  height={90}
                  style={{
                    filter: "drop-shadow(0 0 12px rgba(89, 89, 89, 1))",
                  }}
                />
              </div>
            )}

            {/* Карта */}
            <Image
              src={`/maps/${selectedRegion}.svg`}
              alt={`${selectedRegion} map`}
              fill
              className="object-contain"
            />

            {/* Точки локаций */}
            {locationsData[selectedRegion as keyof LocationsData]
              .filter((loc) => interests.includes(loc.category))
              .map((loc) => {
                const isSelected = selectedLocations.some(
                  (l) => l.name === loc.name
                );
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
                      onMouseEnter={() => setHoveredLocation(loc.name)}
                      onMouseLeave={() => setHoveredLocation(null)}
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
                            : hoveredLocation === loc.name
                            ? "scale-175"
                            : "group-hover:scale-110")
                        }
                      />
                    </div>
                  </div>
                );
              })}

            {/* Карточка активной локации */}
            {activeLocation && (
              <div
                ref={cardRef}
                className="bg-white rounded-md shadow-lg p-3 transition-all duration-300"
                style={{
                  position: "absolute",
                  zIndex: 20,
                  width: "260px",
                  maxWidth: "90%",
                  maxHeight: "70vh",
                  left: `clamp(10px, ${activeLocation.left}, calc(100% - 260px - 10px))`,
                  top: `clamp(10px, ${activeLocation.top}, calc(100% - 70vh - 10px))`,
                }}
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
                        selectedLocations[selectedLocations.length - 1];

                      const prevLat = last
                        ? last.lat
                        : START_POINTS[startingPoint as StartingPoint].lat!;
                      const prevLng = last
                        ? last.lng
                        : START_POINTS[startingPoint as StartingPoint].lng!;

                      const dist = haversineDistance(
                        prevLat!,
                        prevLng!,
                        activeLocation.lat!,
                        activeLocation.lng!
                      );
                      const travelMins = Math.max(
                        1,
                        Math.round((dist / getSpeed(transport)) * 60)
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
                        activeLocation.visitTime!
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
                  className="bg-[#e74c3c] text-white py-2 px-4 rounded-md hover:bg-[#d84333] transition cursor-pointer"
                >
                  Select
                </button>
              </div>
            )}
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

          {/* Итоговое время и расстояние */}
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

          {/* Нижние кнопки */}
          <div className="mt-4">
            <button
              onClick={() => {
                setSelectedRegion(null);
                setIsExpanded(false);
                setExpandedRegion(null);
                setStep("map");
              }}
              className="w-full bg-[#d7ccc8] text-[#3e2723] font-semibold py-3 rounded-md hover:bg-[#c0b3af] transition mb-3 cursor-pointer"
            >
              Choose another region
            </button>

            <div className="flex justify-between gap-3">
              <button
                onClick={handleBackToActivities}
                className="flex-1 bg-[#d7ccc8] text-[#3e2723] font-bold py-3 rounded-md hover:bg-[#c0b3af] transition cursor-pointer"
              >
                BACK
              </button>
              <button
                onClick={() =>
                  handleFinishUtil({
                    selectedLocations,
                    startingPoint,
                    setFinalMapsUrl,
                    setStep,
                    setIsExpanded,
                    setExpandedRegion,
                  })
                }
                disabled={selectedLocations.length === 0}
                className={`flex-1 font-bold py-3 cursor-pointer rounded-md transition ${
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
  );
}
