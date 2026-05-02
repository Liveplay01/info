export interface WorkflowStep {
  shortcutId: string
  contextPrompt: string
}

export interface Workflow {
  id: string
  title: string
  steps: WorkflowStep[]
  difficulty: 1 | 2 | 3
}

export const WORKFLOWS: Workflow[] = [
  // ── Easy (2 steps) ──────────────────────────────────────────────────────────
  {
    id: 'copy-paste',
    title: 'Kopieren & Einfügen',
    steps: [
      { shortcutId: 'ctrl-c', contextPrompt: 'Kopiere den markierten Text' },
      { shortcutId: 'ctrl-v', contextPrompt: 'Füge ihn an der neuen Stelle ein' },
    ],
    difficulty: 1,
  },
  {
    id: 'select-delete',
    title: 'Alles markieren & löschen',
    steps: [
      { shortcutId: 'ctrl-a', contextPrompt: 'Markiere den gesamten Inhalt' },
      { shortcutId: 'delete', contextPrompt: 'Lösche die Markierung' },
    ],
    difficulty: 1,
  },
  {
    id: 'save-close',
    title: 'Speichern & schließen',
    steps: [
      { shortcutId: 'ctrl-s', contextPrompt: 'Speichere das Dokument' },
      { shortcutId: 'ctrl-w', contextPrompt: 'Schließe den Tab/das Fenster' },
    ],
    difficulty: 1,
  },
  {
    id: 'undo-redo',
    title: 'Rückgängig & Wiederholen',
    steps: [
      { shortcutId: 'ctrl-z', contextPrompt: 'Mache die letzte Änderung rückgängig' },
      { shortcutId: 'ctrl-y', contextPrompt: 'Stelle die Änderung wieder her' },
    ],
    difficulty: 1,
  },
  {
    id: 'cut-paste',
    title: 'Ausschneiden & Einfügen',
    steps: [
      { shortcutId: 'ctrl-x', contextPrompt: 'Schneide den markierten Text aus' },
      { shortcutId: 'ctrl-v', contextPrompt: 'Füge ihn an der Zielstelle ein' },
    ],
    difficulty: 1,
  },
  {
    id: 'new-tab',
    title: 'Neues Fenster & Tab',
    steps: [
      { shortcutId: 'ctrl-n', contextPrompt: 'Öffne ein neues Fenster' },
      { shortcutId: 'ctrl-t', contextPrompt: 'Öffne einen neuen Tab' },
    ],
    difficulty: 1,
  },
  // ── Medium (3 steps) ─────────────────────────────────────────────────────────
  {
    id: 'duplicate-rename',
    title: 'Datei duplizieren & umbenennen',
    steps: [
      { shortcutId: 'ctrl-c', contextPrompt: 'Kopiere die ausgewählte Datei' },
      { shortcutId: 'ctrl-v', contextPrompt: 'Füge eine Kopie ein' },
      { shortcutId: 'f2',     contextPrompt: 'Benenne die Kopie um' },
    ],
    difficulty: 2,
  },
  {
    id: 'find-replace',
    title: 'Suchen & Ersetzen',
    steps: [
      { shortcutId: 'ctrl-f', contextPrompt: 'Öffne die Suche' },
      { shortcutId: 'ctrl-h', contextPrompt: 'Wechsle zum Ersetzen-Dialog' },
      { shortcutId: 'ctrl-s', contextPrompt: 'Speichere die Änderungen' },
    ],
    difficulty: 2,
  },
  {
    id: 'screenshot-paste',
    title: 'Screenshot & einfügen',
    steps: [
      { shortcutId: 'win-shift-s', contextPrompt: 'Erstelle einen Screenshot-Ausschnitt' },
      { shortcutId: 'ctrl-v',      contextPrompt: 'Füge den Screenshot ein' },
      { shortcutId: 'ctrl-s',      contextPrompt: 'Speichere das Dokument' },
    ],
    difficulty: 2,
  },
  {
    id: 'new-folder',
    title: 'Neuen Ordner erstellen & umbenennen',
    steps: [
      { shortcutId: 'ctrl-shift-n', contextPrompt: 'Erstelle einen neuen Ordner' },
      { shortcutId: 'f2',           contextPrompt: 'Benenne den Ordner' },
      { shortcutId: 'ctrl-s',       contextPrompt: 'Bestätige mit Speichern' },
    ],
    difficulty: 2,
  },
  {
    id: 'switch-close',
    title: 'Fenster wechseln & schließen',
    steps: [
      { shortcutId: 'alt-tab',  contextPrompt: 'Wechsle zum nächsten Fenster' },
      { shortcutId: 'alt-tab',  contextPrompt: 'Wähle das gewünschte Fenster' },
      { shortcutId: 'alt-f4',   contextPrompt: 'Schließe das aktive Fenster' },
    ],
    difficulty: 2,
  },
  // ── Hard (4-5 steps) ─────────────────────────────────────────────────────────
  {
    id: 'select-copy-new-paste',
    title: 'Text in neues Fenster übertragen',
    steps: [
      { shortcutId: 'ctrl-a',  contextPrompt: 'Markiere den gesamten Text' },
      { shortcutId: 'ctrl-c',  contextPrompt: 'Kopiere den markierten Text' },
      { shortcutId: 'ctrl-n',  contextPrompt: 'Öffne ein neues Dokument' },
      { shortcutId: 'ctrl-v',  contextPrompt: 'Füge den Text ein' },
      { shortcutId: 'ctrl-s',  contextPrompt: 'Speichere das neue Dokument' },
    ],
    difficulty: 3,
  },
  {
    id: 'desktop-new-folder',
    title: 'Desktop aufräumen',
    steps: [
      { shortcutId: 'win-d',        contextPrompt: 'Zeige den Desktop' },
      { shortcutId: 'ctrl-shift-n', contextPrompt: 'Erstelle einen neuen Ordner' },
      { shortcutId: 'f2',           contextPrompt: 'Benenne den Ordner' },
      { shortcutId: 'ctrl-z',       contextPrompt: 'Mache die letzte Aktion rückgängig' },
    ],
    difficulty: 3,
  },
  {
    id: 'tab-management',
    title: 'Browser Tab-Verwaltung',
    steps: [
      { shortcutId: 'ctrl-t',         contextPrompt: 'Öffne einen neuen Tab' },
      { shortcutId: 'ctrl-l',         contextPrompt: 'Fokussiere die Adressleiste' },
      { shortcutId: 'ctrl-tab',       contextPrompt: 'Wechsle zum nächsten Tab' },
      { shortcutId: 'ctrl-w',         contextPrompt: 'Schließe den aktuellen Tab' },
    ],
    difficulty: 3,
  },
  {
    id: 'window-snap',
    title: 'Fenster nebeneinander anordnen',
    steps: [
      { shortcutId: 'win-left',  contextPrompt: 'Snappe das erste Fenster links' },
      { shortcutId: 'alt-tab',   contextPrompt: 'Wechsle zum zweiten Fenster' },
      { shortcutId: 'win-right', contextPrompt: 'Snappe das zweite Fenster rechts' },
      { shortcutId: 'ctrl-s',    contextPrompt: 'Speichere deine Arbeit' },
    ],
    difficulty: 3,
  },
]
