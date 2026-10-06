// Copied verbatim from esy.com, src/components/FooterWorld/FooterWorld.tsx (main at 4767ae31, 2026-10-06),
// so docs.esy.com ends the way esy.com does. Re-copy it rather than editing here.
// (One docs change: the scene is imported from ./mason, the copied modules.)
import { MasonScene } from './mason/mason-scene';
import './FooterWorld.css';

/* The world every page ends inside.
 *
 * Since 2026-10-06 it's Mason's reef: Esy's octopus quarries slabs and builds
 * an octagon gate, then a school swims through (picked on
 * /prototypes/brand-shapes/octo-mason/). It replaced the factory video: the
 * scene is drawn in SVG and moved by a small script, about 15 KB instead of a
 * 170 KB poster plus a 439 KB video, and it pauses while it's off screen.
 *
 * The scene runs full-bleed beneath the last section, and the site footer
 * floats over it as a rounded card (the CSS here reaches the footer, since the
 * footer is rendered by the layout, not by this component). With reduced
 * motion it shows the finished gate, still. */
export default function FooterWorld() {
  return (
    <div className="fw bs-fw" aria-hidden="true">
      <MasonScene />
    </div>
  );
}
