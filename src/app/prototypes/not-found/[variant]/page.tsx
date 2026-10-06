import { notFound } from 'next/navigation';

import NotFoundPage, { type NotFoundTake } from '@/components/NotFound/NotFoundPage';
import PrototypeBar from '@/components/prototypes/PrototypeBar';
import { findPrototype } from '@/components/prototypes/registry';

// Three 404 pages for docs.esy.com, each told by Mason in the footer's reef:
// A · Drifted, B · Missing piece, C · Ink.
const TAKES: Record<string, NotFoundTake> = { drifted: 'drifted', piece: 'piece', ink: 'ink' };

const prototype = findPrototype('not-found')!;

export function generateStaticParams() {
  return prototype.variants.map((v) => ({ variant: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  const v = prototype.variants.find((x) => x.slug === variant);
  return { title: { absolute: v ? `404 ${v.key} · ${v.name} — Esy docs prototypes` : 'Esy prototypes' } };
}

export default async function NotFoundVariantPage({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  const take = TAKES[variant];
  if (!take) notFound();
  return (
    <>
      <NotFoundPage take={take} />
      <PrototypeBar prototype={prototype} current={variant} />
    </>
  );
}
