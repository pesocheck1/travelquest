import { Location, StartingPoint, Step, ExpandedRegion } from "./types";
import { START_POINTS } from "./types";
import { buildGoogleMapsUrl } from "./googleMaps";

export function handleFinish({
  selectedLocations,
  startingPoint,
  setFinalMapsUrl,
  setStep,
  setIsExpanded,
  setExpandedRegion,
}: {
  selectedLocations: Location[];
  startingPoint: StartingPoint;
  setFinalMapsUrl: (url: string | null) => void;
  setStep: (v: Step) => void;
  setIsExpanded: (v: boolean) => void;
  setExpandedRegion: (r: ExpandedRegion | null) => void;
}) {
  if (!selectedLocations || selectedLocations.length === 0) {
    alert("Please select at least one location!");
    return;
  }

  setIsExpanded(false);
  setExpandedRegion(null);

  const origin: Location = {
    name: START_POINTS[startingPoint].name,
    lat: START_POINTS[startingPoint].lat,
    lng: START_POINTS[startingPoint].lng,
    desc: "",
    image: "",
    category: "Start",
    left: "50%",
    top: "50%",
    visitTime: 0,
    closestStartingPoint: startingPoint,
  };

  const url = buildGoogleMapsUrl(selectedLocations, origin);

  setFinalMapsUrl(url);
  setStep("done");

  console.log("DEBUG maps url (on finish):", url);
}
