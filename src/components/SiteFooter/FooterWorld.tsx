// Copied verbatim from esy.com, src/components/FooterWorld/FooterWorld.tsx (main at a26c26d1, 2026-10-03),
// so docs.esy.com ends the way esy.com does. Re-copy it rather than editing here.
import SceneMedia from './SceneMedia';
import './FooterWorld.css';

/* The world every page ends inside.
 *
 * The factory scene runs full-bleed beneath the last section, and the site
 * footer floats over it as a rounded card (the CSS here reaches the footer,
 * since the footer is rendered by the layout, not by this component). One
 * implementation, so the homepage and any other page that opts in end the
 * same way.
 *
 * Phones get the still and never download the clip (SceneMedia's viewport
 * floor), and reduced motion gets the still at every width. */
export default function FooterWorld() {
  return (
    <div className="fw" aria-hidden="true">
      <SceneMedia
        name="world"
        alt=""
        width={2400}
        height={1631}
        minWidth={768}
      />
    </div>
  );
}
