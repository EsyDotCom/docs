// Copied verbatim from esy.com, src/components/BrandShapes/Stage.tsx (main at 4767ae31, 2026-10-06),
// so docs.esy.com ends the way esy.com does. Re-copy it rather than editing here.
import type { CSSProperties, ReactNode } from 'react';
import { H, W, pieceStyle, points, TONES, type Piece } from './pieces';

// Two ways to draw a figure. Stage renders each piece as a clip-pathed box, so
// pieces can move, morph and pivot with plain CSS. SvgStage renders polygons,
// for takes that need strokes (the Blueprint's line-drawing).

/** A figure as positioned boxes, keyed by slot so a new figure morphs the same elements. */
export function Stage({
  pieces,
  className = '',
  label,
  style,
  children,
}: {
  pieces: Piece[];
  className?: string;
  label: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div className={`bs-stage ${className}`} role="img" aria-label={label} style={style}>
      {pieces.map((p, i) => (
        <span key={i} className={`bs-p${p.part ? ` bs-${p.part}` : ''}`} data-id={p.id} style={pieceStyle(p, i)} />
      ))}
      {children}
    </div>
  );
}

/** Polygon points for an SVG <polygon>. */
export const polygonPoints = (p: Piece) => points(p).map(([x, y]) => `${+x.toFixed(2)},${+y.toFixed(2)}`).join(' ');

/** Centre-rotation transform for a polygon, matching the div renderer. */
// Rounded so the server and the browser print the same markup (trig can differ in the last digit).
const r3 = (n: number) => +n.toFixed(3);
export const polygonTransform = (p: Piece) => (p.r ? `rotate(${r3(p.r)} ${r3(p.x + p.w / 2)} ${r3(p.y + p.h / 2)})` : undefined);

/** A figure as SVG polygons in the 480 × 360 stage space. */
export function SvgStage({
  pieces,
  className = '',
  label,
  children,
  polygonProps,
}: {
  pieces: Piece[];
  className?: string;
  label: string;
  children?: ReactNode;
  polygonProps?: (p: Piece, i: number) => Record<string, unknown>;
}) {
  return (
    <svg className={`bs-svg ${className}`} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      {pieces.map((p, i) =>
        p.tone === 'none' ? null : (
          <polygon
            key={i}
            points={polygonPoints(p)}
            transform={polygonTransform(p)}
            fill={TONES[p.tone]}
            {...polygonProps?.(p, i)}
          />
        ),
      )}
      {children}
    </svg>
  );
}

/** Bare polygons for a set of pieces, for use inside a larger SVG. */
export function Polys({
  pieces,
  className,
  fill,
  style,
}: {
  pieces: Piece[];
  className?: string;
  fill?: string;
  style?: CSSProperties;
}) {
  return (
    <>
      {pieces.map((p, i) => (
        <polygon
          key={i}
          className={className}
          points={polygonPoints(p)}
          transform={polygonTransform(p)}
          fill={fill ?? TONES[p.tone]}
          style={style}
        />
      ))}
    </>
  );
}
