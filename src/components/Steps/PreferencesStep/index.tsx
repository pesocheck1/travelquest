"use client";

import Image from "next/image";
import { Step } from "../types";

type Transport = "car" | "public";

type Props = {
  startingPoint: string | null;
  setStartingPoint: (v: string) => void;

  transport: Transport | "";
  setTransport: (v: Transport | "") => void;

  startTime: string;
  setStartTime: (v: string) => void;

  handleBackToAvatar: () => void;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
};

export default function PreferencesStep({
  startingPoint,
  setStartingPoint,
  transport,
  setTransport,
  startTime,
  setStartTime,
  handleBackToAvatar,
  setStep,
}: Props) {
  return (
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
                  <p className="text-sm font-semibold text-black w-[100px] text-right">
                    {point.name}
                  </p>

                  <div
                    className={`relative w-8 h-8 transition-all duration-300 ${
                      isSelected
                        ? "scale-125 translate-y-[-4px]"
                        : "group-hover:scale-110 group-hover:translate-y-[-3px]"
                    }`}
                  >
                    <Image
                      src="/point.svg"
                      alt={`${point.name} marker`}
                      fill
                      className="object-contain"
                    />

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
              <span className="font-semibold mr-1">Starting point:</span>
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
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleBackToAvatar}
              className="flex-1 bg-[#d7ccc8] text-[#3e2723] font-bold py-3 rounded-md hover:bg-[#c0b3af] transition cursor-pointer"
            >
              BACK
            </button>

            <button
              onClick={() => setStep("map")}
              disabled={!startingPoint || !transport || !startTime}
              className={`flex-1 font-bold py-3 rounded-md transition ${
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
  );
}
