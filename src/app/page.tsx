"use client";

import { useState, useEffect } from "react";
import locationsDataJson from "../../data/locations.json";
import {
  Step,
  Location,
  RegionName,
  Transport,
  StartingPoint,
  TransportState,
  LocationsData,
  ExpandedRegion,
  categoryIcons,
  getTravelTimeMinutes,
  activities,
} from "@/components/Steps/types";
import { formatTravelTime } from "@/components/Steps/timeDistance";
import { buildGoogleMapsUrl } from "@/components/Steps/googleMaps";
import Header from "@/components/Header";
import StartStep from "@/components/Steps/StartStep";
import AvatarStep from "@/components/Steps/AvatarStep";
import PreferencesStep from "@/components/Steps/PreferencesStep";
import MapStep from "@/components/Steps/MapStep";
import ActivitiesStep from "@/components/Steps/ActivitiesStep";
import LocationsStep from "@/components/Steps/LocationsStep";
import LastStep from "@/components/Steps/LastStep";

const modifiedAvatarMap: Record<string, string> = {
  "/avatar1.svg": "/avatar11.svg",
  "/avatar2.svg": "/avatar22.svg",
  "/avatar3.svg": "/avatar33.svg",
};

const locationsData: LocationsData = locationsDataJson as LocationsData;

export default function HomePage() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarMapPos, setAvatarMapPos] = useState<{
    left: string | number;
    top: string | number;
  } | null>(null);

  const [expandedRegion, setExpandedRegion] = useState<ExpandedRegion | null>(
    null
  );
  const handleBackToAvatar = () => {
    setStep("avatar");
    setStartingPoint("");
    setTransport("");
    setStartTime("");
  };

  const handleBackToPreferences = () => {
    setStep("preferences");
    setSelectedRegion(null);
    setIsExpanded(false);
    setExpandedRegion(null);
    setSelectedLocations([]);
    setActiveLocation(null);
  };

  const handleBackToMap = () => {
    setStep("map");
    setInterests([]);
  };

  const handleBackToActivities = () => {
    setStep("activities");
  };

  const [startingPoint, setStartingPoint] = useState("");
  const [transport, setTransport] = useState<TransportState>("");

  const [startTime, setStartTime] = useState<string>("");

  const [interests, setInterests] = useState<string[]>([]);
  const [step, setStep] = useState<Step>("start");

  const [finalMapsUrl] = useState<string | null>(null);

  const [selectedRegion, setSelectedRegion] = useState<RegionName | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);

  const [expandedIndex, setExpandedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // useEffect(() => {
  //   if (step !== "map") {
  //     setIsExpanded(false);
  //     setExpandedRegion(null);
  //   }
  // }, [step]);
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
      <Header />

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
          {step === "start" && <StartStep onStart={() => setStep("avatar")} />}

          {/* STEP 2: AVATAR */}
          {step === "avatar" && (
            <AvatarStep
              name={name}
              setName={setName}
              avatar={avatar}
              setAvatar={setAvatar}
              step={step}
              setStep={setStep}
            />
          )}

          {/* STEP 3: STARTING POINT SELECTION */}
          {step === "preferences" && (
            <PreferencesStep
              startingPoint={startingPoint}
              setStartingPoint={setStartingPoint}
              transport={transport}
              setTransport={setTransport}
              startTime={startTime}
              setStartTime={setStartTime}
              handleBackToAvatar={handleBackToAvatar}
              setStep={setStep}
            />
          )}

          {/* STEP 4: MAP */}
          <MapStep
            step={step}
            avatar={avatar}
            avatarMapPos={avatarMapPos}
            startingPoint={startingPoint as StartingPoint}
            transport={transport as Transport}
            startTime={startTime}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            expandedRegion={expandedRegion}
            setExpandedRegion={setExpandedRegion}
            expandedIndex={expandedIndex}
            setExpandedIndex={setExpandedIndex}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            selectedLocations={selectedLocations}
            setSelectedLocations={setSelectedLocations}
            formatTravelTime={formatTravelTime}
            getTravelTimeMinutes={getTravelTimeMinutes}
            handleBackToPreferences={handleBackToPreferences}
            setStep={setStep}
          />

          {/* STEP 5: ACTIVITIES */}

          {step === "activities" && (
            <ActivitiesStep
              setTransport={setTransport}
              selectedRegion={selectedRegion}
              activities={activities}
              interests={interests}
              setInterests={setInterests}
              avatar={avatar}
              modifiedAvatarMap={modifiedAvatarMap}
              startingPoint={startingPoint as StartingPoint}
              startTime={startTime}
              transport={transport as Transport}
              selectedLocations={selectedLocations}
              setSelectedLocations={setSelectedLocations}
              formatTravelTime={formatTravelTime}
              handleBackToMap={handleBackToMap}
              setStep={setStep}
            />
          )}

          {/* STEP 6: LOCATIONS */}
          {step === "locations" && selectedRegion && (
            <LocationsStep
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              selectedLocations={selectedLocations}
              setSelectedLocations={setSelectedLocations}
              interests={interests}
              setInterests={setInterests}
              startingPoint={startingPoint as StartingPoint}
              setStartingPoint={setStartingPoint}
              transport={transport as Transport}
              setTransport={setTransport}
              startTime={startTime}
              setStartTime={setStartTime}
              setStep={setStep}
              locationsData={locationsData}
              expandedRegion={expandedRegion}
              setExpandedRegion={setExpandedRegion}
              setIsExpanded={setIsExpanded}
              handleBackToActivities={handleBackToActivities}
              categoryIcons={categoryIcons}
              setAvatarMapPos={setAvatarMapPos}
            />
          )}

          {/* STEP 7: FINAL */}
          {step === "done" && (
            <LastStep
              selectedLocations={selectedLocations}
              startingPoint={startingPoint}
              finalMapsUrl={finalMapsUrl}
              buildGoogleMapsUrl={buildGoogleMapsUrl}
              startTime={startTime}
              transport={transport}
              setName={setName}
              setAvatar={setAvatar}
              setTransport={setTransport}
              setStartingPoint={setStartingPoint}
              setInterests={setInterests}
              setSelectedRegion={setSelectedRegion}
              setStartTime={setStartTime}
              setSelectedLocations={setSelectedLocations}
              setActiveLocation={setActiveLocation}
              setStep={setStep}
            />
          )}
        </div>
      </main>
    </div>
  );
}
