/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import {
  Step,
  RegionName,
  Location,
  Transport,
  TransportState,
  StartingPoint,
} from "../types";
import { recalculateSchedule } from "../timeDistance";

type Props = {
  selectedRegion: RegionName | null;
  activities: { key: string; label: string; icon: string }[];
  interests: string[];
  setInterests: React.Dispatch<React.SetStateAction<string[]>>;

  avatar: string | null;
  modifiedAvatarMap: Record<string, string>;

  startingPoint: StartingPoint;
  startTime: string;
  transport: Transport;
  setTransport: React.Dispatch<React.SetStateAction<TransportState>>;

  selectedLocations: Location[];
  setSelectedLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  // recalculateSchedule?: (locations: Location[]) => Location[];

  formatTravelTime: (mins: number) => string;

  handleBackToMap: () => void;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
};

export default function ActivitiesStep({
  selectedRegion,
  activities,
  interests,
  setInterests,
  avatar,
  modifiedAvatarMap,
  startingPoint,
  startTime,
  transport,
  selectedLocations,
  setSelectedLocations,
  // recalculateSchedule,
  formatTravelTime,
  handleBackToMap,
  setStep,
}: Props) {
  return (
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
                      if (!isSelected) e.currentTarget.style.boxShadow = "none";
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

                  <span className="mt-2 text-sm text-[#3e2723] font-medium text-center">
                    {activity.label}
                  </span>
                </div>
              );
            })}

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

          {/* Кнопки */}
          <div className="mt-4">
            <div className="flex justify-between gap-3">
              <button
                onClick={handleBackToMap}
                className="flex-1 bg-[#d7ccc8] text-[#3e2723] font-bold py-3 rounded-md hover:bg-[#c0b3af] transition cursor-pointer"
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
                className={`flex-1 font-bold py-3 rounded-md cursor-pointer transition ${
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
  );
}
