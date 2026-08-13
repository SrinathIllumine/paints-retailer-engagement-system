// Minimal, dependency-free equirectangular projection for rendering GeoJSON
// polygons as SVG paths. No external mapping library required.

export type Ring = [number, number][];
export type GeoGeometry =
  | { type: "Polygon"; coordinates: Ring[] }
  | { type: "MultiPolygon"; coordinates: Ring[][] };

export interface GeoBounds {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
}

export type ProjectFn = (lon: number, lat: number) => [number, number];

/**
 * Builds a lon/lat -> SVG x/y projector that fits `bounds` into a
 * `width` x `height` viewBox (with `padding`), preserving aspect ratio
 * and centering the result.
 */
export const makeProjector = (
  bounds: GeoBounds,
  width: number,
  height: number,
  padding = 8,
): ProjectFn => {
  const lonSpan = bounds.maxLon - bounds.minLon;
  const latSpan = bounds.maxLat - bounds.minLat;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const scale = Math.min(innerW / lonSpan, innerH / latSpan);
  const usedW = lonSpan * scale;
  const usedH = latSpan * scale;
  const offsetX = padding + (innerW - usedW) / 2;
  const offsetY = padding + (innerH - usedH) / 2;

  return (lon, lat) => [
    offsetX + (lon - bounds.minLon) * scale,
    offsetY + (bounds.maxLat - lat) * scale, // flip Y: SVG y grows downward, latitude grows upward
  ];
};

const ringToPath = (ring: Ring, project: ProjectFn): string =>
  ring
    .map(([lon, lat], i) => {
      const [x, y] = project(lon, lat);
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ") + " Z";

/** Converts a Polygon/MultiPolygon geometry into an SVG path `d` string. Use fillRule="evenodd" when rendering so interior rings (holes) punch out correctly regardless of winding order. */
export const geometryToPath = (geometry: GeoGeometry, project: ProjectFn): string => {
  if (geometry.type === "Polygon") {
    return geometry.coordinates.map((ring) => ringToPath(ring, project)).join(" ");
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates
      .map((polygon) => polygon.map((ring) => ringToPath(ring, project)).join(" "))
      .join(" ");
  }
  return "";
};
