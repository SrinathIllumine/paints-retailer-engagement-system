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

export interface LabelPlacement {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** True polygon centroid (shoelace formula) of an already-projected, closed ring. Falls back to the vertex average for degenerate (zero-area) rings. */
const ringCentroid = (points: [number, number][]): { cx: number; cy: number; area: number } => {
  let signedArea = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const cross = x1 * y2 - x2 * y1;
    signedArea += cross;
    cx += (x1 + x2) * cross;
    cy += (y1 + y2) * cross;
  }
  signedArea *= 0.5;
  if (Math.abs(signedArea) < 1e-9) {
    const n = Math.max(1, points.length - 1);
    let sx = 0;
    let sy = 0;
    for (let i = 0; i < n; i++) {
      sx += points[i][0];
      sy += points[i][1];
    }
    return { cx: sx / n, cy: sy / n, area: 0 };
  }
  return { cx: cx / (6 * signedArea), cy: cy / (6 * signedArea), area: Math.abs(signedArea) };
};

/**
 * Computes a good label anchor point (centroid of the largest outer ring) plus
 * the overall bounding-box size of the geometry, all in projected (SVG) space —
 * used to size/wrap a name label so it fits inside its own shape.
 */
export const geometryLabelPlacement = (geometry: GeoGeometry, project: ProjectFn): LabelPlacement => {
  const outerRings: Ring[] = geometry.type === "Polygon" ? [geometry.coordinates[0]] : geometry.coordinates.map((poly) => poly[0]);

  // Sized off the single largest ring's own bbox/area — not the union across all
  // rings — so a scattered geometry (e.g. a state with a far-off exclave/island)
  // doesn't get an oversized, mostly-empty label box.
  let best = { cx: 0, cy: 0, area: -1, minX: 0, minY: 0, maxX: 0, maxY: 0 };

  for (const ring of outerRings) {
    const projected = ring.map(([lon, lat]) => project(lon, lat));
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const [x, y] of projected) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    const c = ringCentroid(projected);
    const area = c.area > 0 ? c.area : (maxX - minX) * (maxY - minY);
    if (area > best.area) best = { ...c, area, minX, minY, maxX, maxY };
  }

  return {
    x: best.cx,
    y: best.cy,
    width: Math.max(0, best.maxX - best.minX),
    height: Math.max(0, best.maxY - best.minY),
  };
};

/** Greedy word-wrap: breaks `text` into lines that fit within `maxWidth` at `fontSize`, using an average-glyph-width heuristic (no canvas measurement needed). */
export const wrapLabel = (text: string, maxWidth: number, fontSize: number): string[] => {
  const charWidth = fontSize * 0.56;
  const maxChars = Math.max(3, Math.floor(maxWidth / charWidth));
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
};
