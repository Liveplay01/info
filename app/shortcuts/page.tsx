import type { Metadata } from 'next'
import { ShortcutsClient } from './shortcuts-client'

export const metadata: Metadata = {
  title: '⟨info/⟩ – Windows Shortcuts',
  description:
    'Alle wichtigen Windows-Tastaturkürzel auf einen Blick — nach Häufigkeit sortiert, mit Suchleiste, Kategorie-Filter und detaillierten Erklärungen.',
}

export default function ShortcutsPage() {
  return <ShortcutsClient />
}
