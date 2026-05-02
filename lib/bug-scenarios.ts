export type ActionId = string

export type UIView =
  | 'desktop'
  | 'taskbar-tray'
  | 'speaker-menu'
  | 'wifi-menu'
  | 'settings'
  | 'settings-system'
  | 'settings-sound'
  | 'settings-netzwerk'
  | 'settings-geraete'
  | 'settings-geraete-drucker'
  | 'settings-geraete-maus'
  | 'settings-anzeige'
  | 'task-manager'
  | 'rightclick-desktop'

export interface UIItem {
  id: ActionId
  label: string
  icon: string
  navigatesTo?: UIView
}

export interface ViewDefinition {
  id: UIView
  title: string
  backTo: UIView | null
  items: UIItem[]
}

export interface BugScenario {
  id: string
  title: string
  description: string
  bugEmoji: string
  timeLimitSeconds: number
  solutionPaths: ActionId[][]
  hintText: string
  baseXP: number
}

export const UI_VIEWS: Record<UIView, ViewDefinition> = {
  'desktop': {
    id: 'desktop',
    title: 'Desktop',
    backTo: null,
    items: [
      { id: 'open-settings',      label: 'Einstellungen öffnen',  icon: '⚙️', navigatesTo: 'settings' },
      { id: 'open-taskbar-tray',  label: 'Taskleiste / Tray',     icon: '🔔', navigatesTo: 'taskbar-tray' },
      { id: 'open-task-manager',  label: 'Task-Manager öffnen',   icon: '📊', navigatesTo: 'task-manager' },
      { id: 'rightclick-desktop', label: 'Rechtsklick auf Desktop', icon: '🖱️', navigatesTo: 'rightclick-desktop' },
    ],
  },
  'taskbar-tray': {
    id: 'taskbar-tray',
    title: 'Taskleiste & Tray',
    backTo: 'desktop',
    items: [
      { id: 'click-speaker-icon', label: 'Lautsprecher-Icon',   icon: '🔊', navigatesTo: 'speaker-menu' },
      { id: 'click-wifi-icon',    label: 'WLAN-Icon',           icon: '📶', navigatesTo: 'wifi-menu' },
    ],
  },
  'speaker-menu': {
    id: 'speaker-menu',
    title: 'Lautsprecher',
    backTo: 'taskbar-tray',
    items: [
      { id: 'check-volume',        label: 'Lautstärke prüfen & erhöhen', icon: '🔉' },
      { id: 'change-output',       label: 'Ausgabegerät wechseln',       icon: '🔀' },
    ],
  },
  'wifi-menu': {
    id: 'wifi-menu',
    title: 'WLAN',
    backTo: 'taskbar-tray',
    items: [
      { id: 'select-network',      label: 'Netzwerk auswählen & verbinden', icon: '📡' },
      { id: 'airplane-mode-check', label: 'Flugmodus prüfen',              icon: '✈️' },
    ],
  },
  'settings': {
    id: 'settings',
    title: 'Einstellungen',
    backTo: 'desktop',
    items: [
      { id: 'nav-system',    label: 'System',  icon: '💻', navigatesTo: 'settings-system' },
      { id: 'nav-geraete',   label: 'Geräte',  icon: '🖱️', navigatesTo: 'settings-geraete' },
      { id: 'nav-netzwerk',  label: 'Netzwerk & Internet', icon: '🌐', navigatesTo: 'settings-netzwerk' },
    ],
  },
  'settings-system': {
    id: 'settings-system',
    title: 'System',
    backTo: 'settings',
    items: [
      { id: 'nav-sound',    label: 'Sound',   icon: '🔊', navigatesTo: 'settings-sound' },
      { id: 'nav-anzeige',  label: 'Anzeige', icon: '🖥️', navigatesTo: 'settings-anzeige' },
    ],
  },
  'settings-sound': {
    id: 'settings-sound',
    title: 'Sound-Einstellungen',
    backTo: 'settings-system',
    items: [
      { id: 'set-output-device',    label: 'Ausgabegerät festlegen',   icon: '🔈' },
      { id: 'test-sound',           label: 'Sound testen',             icon: '▶️' },
    ],
  },
  'settings-netzwerk': {
    id: 'settings-netzwerk',
    title: 'Netzwerk & Internet',
    backTo: 'settings',
    items: [
      { id: 'run-troubleshooter',   label: 'Problembehandlung starten', icon: '🔧' },
      { id: 'check-adapter',        label: 'Netzwerkadapter prüfen',    icon: '🔌' },
    ],
  },
  'settings-geraete': {
    id: 'settings-geraete',
    title: 'Geräte',
    backTo: 'settings',
    items: [
      { id: 'nav-drucker',  label: 'Drucker & Scanner', icon: '🖨️', navigatesTo: 'settings-geraete-drucker' },
      { id: 'nav-maus',     label: 'Maus',              icon: '🖱️', navigatesTo: 'settings-geraete-maus' },
    ],
  },
  'settings-geraete-drucker': {
    id: 'settings-geraete-drucker',
    title: 'Drucker & Scanner',
    backTo: 'settings-geraete',
    items: [
      { id: 'toggle-offline',       label: 'Drucker online schalten',   icon: '✅' },
      { id: 'set-default-printer',  label: 'Als Standard festlegen',    icon: '⭐' },
    ],
  },
  'settings-geraete-maus': {
    id: 'settings-geraete-maus',
    title: 'Maus-Einstellungen',
    backTo: 'settings-geraete',
    items: [
      { id: 'adjust-speed',         label: 'Zeigergeschwindigkeit erhöhen', icon: '⚡' },
      { id: 'swap-buttons',         label: 'Maustasten tauschen',           icon: '🔄' },
    ],
  },
  'settings-anzeige': {
    id: 'settings-anzeige',
    title: 'Anzeige-Einstellungen',
    backTo: 'settings-system',
    items: [
      { id: 'select-rotation',      label: 'Bildschirmausrichtung: Querformat', icon: '🔄' },
      { id: 'adjust-resolution',    label: 'Auflösung anpassen',               icon: '📐' },
    ],
  },
  'task-manager': {
    id: 'task-manager',
    title: 'Task-Manager',
    backTo: 'desktop',
    items: [
      { id: 'end-process',          label: 'Hängenden Prozess beenden', icon: '🛑' },
      { id: 'check-startup',        label: 'Autostart-Programme prüfen', icon: '🚀' },
    ],
  },
  'rightclick-desktop': {
    id: 'rightclick-desktop',
    title: 'Desktop-Kontextmenü',
    backTo: 'desktop',
    items: [
      { id: 'open-display-settings', label: 'Anzeigeeinstellungen öffnen', icon: '🖥️', navigatesTo: 'settings-anzeige' },
      { id: 'new-folder-desktop',     label: 'Neuen Ordner erstellen',      icon: '📁' },
    ],
  },
}

export function checkSolution(actionHistory: ActionId[], solutionPaths: ActionId[][]): boolean {
  return solutionPaths.some(path => {
    let pathIdx = 0
    for (const action of actionHistory) {
      if (action === path[pathIdx]) pathIdx++
      if (pathIdx === path.length) return true
    }
    return false
  })
}

export const BUG_SCENARIOS: BugScenario[] = [
  {
    id: 'no-sound',
    title: 'Kein Ton',
    description: 'Du startest ein Video, aber es kommt kein Sound. Deine Lautsprecher sind eingesteckt und du hörst sonst immer etwas. Finde heraus, wo das Problem liegt!',
    bugEmoji: '🔇',
    timeLimitSeconds: 180,
    solutionPaths: [
      ['click-speaker-icon', 'check-volume'],
      ['click-speaker-icon', 'change-output'],
      ['nav-system', 'nav-sound', 'set-output-device'],
    ],
    hintText: 'Schau dir die Lautsprecher-Einstellungen in der Taskleiste oder in den System-Einstellungen an.',
    baseXP: 80,
  },
  {
    id: 'no-internet',
    title: 'Kein Internet',
    description: 'Du möchtest eine Webseite aufrufen, aber der Browser zeigt "Keine Verbindung". Gestern hat alles noch funktioniert. Was ist passiert?',
    bugEmoji: '🌐',
    timeLimitSeconds: 180,
    solutionPaths: [
      ['click-wifi-icon', 'select-network'],
      ['nav-netzwerk', 'run-troubleshooter'],
      ['click-wifi-icon', 'airplane-mode-check'],
    ],
    hintText: 'Prüfe ob du mit einem WLAN-Netzwerk verbunden bist oder starte die Netzwerk-Problembehandlung.',
    baseXP: 80,
  },
  {
    id: 'program-frozen',
    title: 'Programm antwortet nicht',
    description: 'Ein Programm hängt sich auf und reagiert nicht mehr auf Klicks. Du kannst das Fenster nicht schließen. Wie beendest du es trotzdem?',
    bugEmoji: '🖥️',
    timeLimitSeconds: 180,
    solutionPaths: [
      ['open-task-manager', 'end-process'],
    ],
    hintText: 'Der Task-Manager hilft dir, hängende Programme zu beenden.',
    baseXP: 70,
  },
  {
    id: 'printer-offline',
    title: 'Drucker antwortet nicht',
    description: 'Du schickst ein Dokument zum Drucken, aber der Drucker tut nichts. Er ist eingeschaltet und korrekt angeschlossen. Der Status zeigt "Offline".',
    bugEmoji: '🖨️',
    timeLimitSeconds: 180,
    solutionPaths: [
      ['nav-geraete', 'nav-drucker', 'toggle-offline'],
      ['nav-geraete', 'nav-drucker', 'set-default-printer'],
    ],
    hintText: 'Schau in den Drucker-Einstellungen nach dem Online/Offline-Status.',
    baseXP: 80,
  },
  {
    id: 'mouse-slow',
    title: 'Maus reagiert langsam',
    description: 'Dein Mauszeiger bewegt sich extrem langsam über den Bildschirm. Du musst die Maus mehrfach hin und her ziehen, um ans Ziel zu kommen.',
    bugEmoji: '🖱️',
    timeLimitSeconds: 180,
    solutionPaths: [
      ['nav-geraete', 'nav-maus', 'adjust-speed'],
    ],
    hintText: 'Die Zeigergeschwindigkeit findest du in den Geräte-Einstellungen unter Maus.',
    baseXP: 60,
  },
  {
    id: 'screen-rotated',
    title: 'Bildschirm dreht sich',
    description: 'Plötzlich ist dein Bildschirm um 90° gekippt! Alles steht seitlich. Du kannst nicht normal arbeiten. Wie drehst du die Anzeige zurück?',
    bugEmoji: '📺',
    timeLimitSeconds: 180,
    solutionPaths: [
      ['open-display-settings', 'select-rotation'],
      ['nav-system', 'nav-anzeige', 'select-rotation'],
    ],
    hintText: 'Die Bildschirmausrichtung findest du in den Anzeigeeinstellungen.',
    baseXP: 70,
  },
]
