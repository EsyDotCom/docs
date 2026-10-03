import { redirect } from 'next/navigation';

// /prototypes/home on its own: the index's section for it.
export default function DocsHomePrototypes() {
  redirect('/prototypes#home');
}
