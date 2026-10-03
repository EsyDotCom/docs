import Link from 'next/link';
import type { Prototype } from './registry';
import './prototypes.css';

/** Floating switcher: jump between a prototype's variants, or back to all of them. Same as esy.com's. */
export default function PrototypeBar({ prototype, current }: { prototype: Prototype; current?: string }) {
  const base = `/prototypes/${prototype.slug}`;
  return (
    <nav className="proto-bar" aria-label={`${prototype.name}: versions`}>
      <Link href={`/prototypes#${prototype.slug}`}>← All versions</Link>
      <span>Try:</span>
      {prototype.variants.map((v) => (
        <Link key={v.slug} href={`${base}/${v.slug}`} aria-current={current === v.slug ? 'page' : undefined}>
          {v.key} · {v.name}
          {v.live ? ' (live)' : ''}
        </Link>
      ))}
    </nav>
  );
}
