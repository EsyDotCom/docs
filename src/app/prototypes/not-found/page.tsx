import { redirect } from 'next/navigation';

// /prototypes/not-found on its own: the index's section for it.
export default function NotFoundPrototypes() {
  redirect('/prototypes#not-found');
}
