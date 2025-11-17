import { Location } from "./types";

export function buildGoogleMapsUrl(
  selected: Location[],
  startingPoint?: string | Location
): string | null {
  if (!selected || selected.length === 0) return null;

  const formatValue = (item: string | Location) => {
    if (typeof item === "string") return encodeURIComponent(item);
    if (item.place_id) return item.place_id;
    if (typeof item.lat === "number" && typeof item.lng === "number")
      return `${item.lat},${item.lng}`;
    return encodeURIComponent(item.name || "");
  };

  const originProvided = startingPoint != null;
  const originItem: string | Location = originProvided
    ? startingPoint
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
