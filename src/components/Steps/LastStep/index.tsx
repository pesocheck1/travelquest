"use client";

import Image from "next/image";
import React from "react";
import { Location, RegionName, Step, TransportState } from "../types";
import { createPdf } from "../createPdf";
import { buildGoogleMapsUrl } from "../../Steps/googleMaps";

type BuildGoogleMapsFn = (
  locations: Location[],
  startingPoint?: string | Location
) => string | null;

type LastStepProps = {
  selectedLocations: Location[];
  startingPoint: string;
  finalMapsUrl: string | null;

  buildGoogleMapsUrl: BuildGoogleMapsFn;

  setName: React.Dispatch<React.SetStateAction<string>>;
  setAvatar: React.Dispatch<React.SetStateAction<string | null>>;
  setTransport: React.Dispatch<React.SetStateAction<TransportState>>;
  setStartingPoint: React.Dispatch<React.SetStateAction<string>>;
  setInterests: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedRegion: React.Dispatch<React.SetStateAction<RegionName | null>>;
  setStartTime: React.Dispatch<React.SetStateAction<string>>;
  setSelectedLocations: React.Dispatch<React.SetStateAction<Location[]>>;
  setActiveLocation: React.Dispatch<React.SetStateAction<Location | null>>;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
  startTime: string; // <--- добавлено
  transport: TransportState;
};

export default function LastStep({
  selectedLocations,
  startingPoint,
  finalMapsUrl,
  setName,
  setAvatar,
  setTransport,
  setStartingPoint,
  setInterests,
  setSelectedRegion,
  setStartTime,
  setSelectedLocations,
  setActiveLocation,
  setStep,
  startTime,
  transport,
}: LastStepProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center p-6">
      <h1 className="text-4xl font-bold text-[#3e2723] mb-2">
        Congratulations!
      </h1>

      <p className="text-xl text-[#3e2723] mb-4">Your route is ready 🎉</p>

      <Image
        src="/endinglogo.svg"
        alt="Okinawa illustration"
        width={150}
        height={150}
        className="mb-8"
      />

      <div className="flex gap-3">
        {/* Export PDF */}
        <button
          onClick={() =>
            createPdf(selectedLocations, startingPoint, startTime, transport)
          }
          className="bg-[#3e2723] text-white font-bold py-3 px-6 rounded-md hover:opacity-90 transition cursor-pointer"
        >
          Export route to PDF
        </button>

        {/* Open Google Maps */}
        <button
          onClick={() => {
            if (!selectedLocations || selectedLocations.length === 0) {
              alert("No locations selected");
              return;
            }

            const url =
              finalMapsUrl ??
              buildGoogleMapsUrl(selectedLocations, startingPoint);

            if (!url) {
              alert("Failed to build Google Maps URL");
              return;
            }

            window.open(url, "_blank");
          }}
          className="bg-[#e74c3c] text-white font-bold py-3 px-6 rounded-md hover:bg-[#d84333] transition cursor-pointer"
        >
          Open route in Google Maps
        </button>
      </div>

      {/* Reset button */}
      <button
        onClick={() => {
          setName("");
          setAvatar(null);
          setTransport("");
          setStartingPoint("");
          setInterests([]);
          setSelectedRegion(null);
          setStartTime("");
          setSelectedLocations([]);
          setActiveLocation(null);
          setStep("start");
        }}
        className="mt-6 font-bold text-[#3e2723]/80 underline cursor-pointer"
      >
        Back to start
      </button>
    </div>
  );
}
