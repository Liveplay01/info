export type ShortcutCategory =
  | 'Bearbeiten'
  | 'Datei'
  | 'System'
  | 'Fenster'
  | 'Browser'
  | 'Screenshot'
  | 'Navigation'

export interface WindowsShortcut {
  id: string
  keys: string[]
  name: string
  shortDesc: string
  fullDescription: string
  category: ShortcutCategory
  tips: string[]
  frequency: number
}

export const categoryConfig: Record<
  ShortcutCategory,
  { color: string; bg: string; border: string }
> = {
  Bearbeiten: {
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'border-blue-200 dark:border-blue-800',
  },
  Datei: {
    color: 'text-orange-700 dark:text-orange-300',
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    border: 'border-orange-200 dark:border-orange-800',
  },
  System: {
    color: 'text-red-700 dark:text-red-300',
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-200 dark:border-red-800',
  },
  Fenster: {
    color: 'text-violet-700 dark:text-violet-300',
    bg: 'bg-violet-100 dark:bg-violet-900/30',
    border: 'border-violet-200 dark:border-violet-800',
  },
  Browser: {
    color: 'text-sky-700 dark:text-sky-300',
    bg: 'bg-sky-100 dark:bg-sky-900/30',
    border: 'border-sky-200 dark:border-sky-800',
  },
  Screenshot: {
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  Navigation: {
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    border: 'border-amber-200 dark:border-amber-800',
  },
}

export const CATEGORIES = Object.keys(categoryConfig) as ShortcutCategory[]

const raw: WindowsShortcut[] = [
  // ── Frequency 10 ──────────────────────────────────────────────────────────
  {
    id: 'ctrl-c',
    keys: ['Ctrl', 'C'],
    name: 'Kopieren',
    shortDesc: 'Markierten Inhalt in die Zwischenablage kopieren',
    fullDescription:
      'Kopiert markierten Text, Dateien oder andere Objekte in die Windows-Zwischenablage, ohne sie am ursprünglichen Ort zu entfernen. Der Inhalt kann danach mit Ctrl+V beliebig oft eingefügt werden.',
    category: 'Bearbeiten',
    tips: [
      'Funktioniert in nahezu allen Windows-Anwendungen — von Word bis zum Explorer',
      'Die Zwischenablage hält standardmäßig nur den zuletzt kopierten Eintrag',
      'Mit Win+V öffnest du den Zwischenablageverlauf für mehrere gespeicherte Elemente',
    ],
    frequency: 10,
  },
  {
    id: 'ctrl-v',
    keys: ['Ctrl', 'V'],
    name: 'Einfügen',
    shortDesc: 'Inhalt aus der Zwischenablage einfügen',
    fullDescription:
      'Fügt den zuletzt kopierten oder ausgeschnittenen Inhalt an der aktuellen Cursor-Position ein. Der Inhalt bleibt in der Zwischenablage und kann mehrfach eingefügt werden.',
    category: 'Bearbeiten',
    tips: [
      'Ctrl+Shift+V fügt in vielen Apps Text ohne Formatierung ein',
      'In Office-Programmen gibt es "Inhalte einfügen" (Alt+Ctrl+V) für erweiterte Optionen',
      'Der Inhalt bleibt bis zum nächsten Kopiervorgang in der Zwischenablage',
    ],
    frequency: 10,
  },
  {
    id: 'ctrl-z',
    keys: ['Ctrl', 'Z'],
    name: 'Rückgängig',
    shortDesc: 'Letzte Aktion rückgängig machen',
    fullDescription:
      'Macht die zuletzt durchgeführte Aktion rückgängig. Kann mehrfach hintereinander verwendet werden, um mehrere Schritte zurückzugehen. Die Anzahl der rückgängig machbaren Schritte hängt von der Anwendung ab.',
    category: 'Bearbeiten',
    tips: [
      'Die meisten Anwendungen speichern eine Verlauf von 10–100 Schritten',
      'Ctrl+Y macht das Rückgängigmachen wieder rückgängig (Redo)',
      'In manchen Anwendungen ist nach dem Speichern die History begrenzt',
    ],
    frequency: 10,
  },
  {
    id: 'ctrl-s',
    keys: ['Ctrl', 'S'],
    name: 'Speichern',
    shortDesc: 'Aktuelle Datei oder Dokument speichern',
    fullDescription:
      'Speichert das aktuelle Dokument oder die aktuelle Datei. Bei neuen Dateien öffnet sich oft ein "Speichern unter"-Dialog. In Webbrowsern kann damit auch die aktuelle Seite gespeichert werden.',
    category: 'Datei',
    tips: [
      'Regelmäßiges Speichern verhindert Datenverlust bei Abstürzen',
      'Ctrl+Shift+S öffnet in vielen Apps den "Speichern unter"-Dialog für eine Kopie',
      'Viele moderne Apps speichern automatisch — ein manuelles Speichern schadet aber nie',
    ],
    frequency: 10,
  },
  // ── Frequency 9 ───────────────────────────────────────────────────────────
  {
    id: 'ctrl-x',
    keys: ['Ctrl', 'X'],
    name: 'Ausschneiden',
    shortDesc: 'Markierten Inhalt verschieben (ausschneiden)',
    fullDescription:
      'Entfernt den markierten Inhalt aus seiner aktuellen Position und legt ihn in der Zwischenablage ab. Mit Ctrl+V kann er dann an anderer Stelle wieder eingefügt werden.',
    category: 'Bearbeiten',
    tips: [
      'Nützlich zum schnellen Verschieben von Text oder Dateien',
      'Bei Dateien im Explorer: die Datei wird erst wirklich entfernt, wenn sie eingefügt wird',
      'Ohne anschließendes Einfügen bleibt die Datei an ihrem ursprünglichen Ort',
    ],
    frequency: 9,
  },
  {
    id: 'ctrl-a',
    keys: ['Ctrl', 'A'],
    name: 'Alles auswählen',
    shortDesc: 'Gesamten Inhalt im Kontext markieren',
    fullDescription:
      'Markiert den gesamten Inhalt im aktuellen Kontext — z.B. den ganzen Text in einem Textfeld, alle Dateien in einem Ordner oder alle Elemente in einer Liste.',
    category: 'Bearbeiten',
    tips: [
      'Im Explorer werden damit alle Dateien im aktuellen Ordner markiert',
      'Im Browser wird der gesamte Seiteninhalt markiert',
      'Kombiniert mit Ctrl+C lässt sich so schnell alles kopieren',
    ],
    frequency: 9,
  },
  {
    id: 'ctrl-f',
    keys: ['Ctrl', 'F'],
    name: 'Suchen',
    shortDesc: 'Suchleiste in der aktuellen Anwendung öffnen',
    fullDescription:
      'Öffnet die Suchfunktion in der aktuellen Anwendung. In Browsern und Texteditoren wird eine Suchleiste eingeblendet, mit der du nach bestimmten Textstellen suchen kannst.',
    category: 'Bearbeiten',
    tips: [
      'Im Browser: Enter springt zum nächsten Treffer, Shift+Enter zum vorherigen',
      'Viele Anwendungen unterstützen auch reguläre Ausdrücke (RegEx) in der Suche',
      'Ctrl+H öffnet in vielen Apps "Suchen & Ersetzen" für Massenänderungen',
    ],
    frequency: 9,
  },
  {
    id: 'win-l',
    keys: ['Win', 'L'],
    name: 'Computer sperren',
    shortDesc: 'Bildschirm sofort sperren',
    fullDescription:
      'Sperrt den Computer sofort und zeigt den Anmeldebildschirm an. Alle laufenden Programme bleiben dabei geöffnet — nach der erneuten Anmeldung kannst du genau dort weitermachen.',
    category: 'System',
    tips: [
      'Immer verwenden, wenn du deinen Platz verlässt — besonders in Büros',
      'Viel schneller als Abmelden, da alle Programme offen bleiben',
      'Funktioniert mit Windows Hello (Gesichtserkennung, Fingerabdruck) oder PIN',
    ],
    frequency: 9,
  },
  {
    id: 'ctrl-alt-del',
    keys: ['Ctrl', 'Alt', 'Entf'],
    name: 'Sicherheitsoptionen',
    shortDesc: 'Sicherheitsmenü mit Task-Manager und Abmeldung öffnen',
    fullDescription:
      'Öffnet das Windows-Sicherheitsmenü mit Optionen zum Sperren, Abmelden, Benutzer wechseln, Kennwort ändern und dem Öffnen des Task-Managers. Funktioniert auch wenn das System hängt.',
    category: 'System',
    tips: [
      'Beim eingefrorenen System oft der erste Schritt zur Problemlösung',
      'Ctrl+Shift+Esc öffnet den Task-Manager direkt ohne dieses Menü',
      'Diese Kombination kann nicht von normalen Programmen abgefangen werden',
    ],
    frequency: 9,
  },
  {
    id: 'alt-f4',
    keys: ['Alt', 'F4'],
    name: 'Fenster / App schließen',
    shortDesc: 'Das aktive Fenster oder Programm beenden',
    fullDescription:
      'Schließt das aktuell aktive Fenster oder beendet das aktive Programm. Bei ungespeicherten Änderungen erscheint ein Bestätigungsdialog. Am leeren Desktop öffnet es den Herunterfahren-Dialog.',
    category: 'Fenster',
    tips: [
      'Am leeren Desktop: öffnet den Windows-Herunterfahren-Dialog',
      'Schneller als die Maus zur X-Schaltfläche zu bewegen',
      'Ctrl+W schließt nur den aktuellen Tab, nicht die ganze Anwendung',
    ],
    frequency: 9,
  },
  {
    id: 'alt-tab',
    keys: ['Alt', 'Tab'],
    name: 'Fenster wechseln',
    shortDesc: 'Zwischen geöffneten Fenstern wechseln',
    fullDescription:
      'Zeigt eine Übersicht aller geöffneten Fenster und wechselt beim Loslassen zum ausgewählten. Alt gehalten und Tab wiederholt drücken, um durch die Fenster zu blättern.',
    category: 'Fenster',
    tips: [
      'Alt gehalten + Tab mehrfach drücken, um durch alle Fenster zu blättern',
      'Alt+Shift+Tab wechselt in umgekehrter Reihenfolge',
      'Win+Tab öffnet die moderne Aufgabenansicht mit Thumbnails',
    ],
    frequency: 9,
  },
  {
    id: 'win',
    keys: ['Win'],
    name: 'Startmenü öffnen',
    shortDesc: 'Windows-Startmenü ein- oder ausblenden',
    fullDescription:
      'Öffnet oder schließt das Windows-Startmenü. Von hier aus lassen sich Apps suchen, starten, auf Einstellungen zugreifen und wichtige Systembefehle ausführen.',
    category: 'System',
    tips: [
      'Einfach tippen startet direkt eine Suche im Startmenü — kein Klick nötig',
      'Win+Q öffnet alternativ die Windows-Suche direkt',
      'Win+S öffnet die Suche in neueren Windows-Versionen',
    ],
    frequency: 9,
  },
  // ── Frequency 8 ───────────────────────────────────────────────────────────
  {
    id: 'ctrl-y',
    keys: ['Ctrl', 'Y'],
    name: 'Wiederholen',
    shortDesc: 'Rückgängig gemachte Aktion erneut ausführen',
    fullDescription:
      'Macht eine rückgängig gemachte Aktion wieder rückgängig (Redo). Kann mehrfach verwendet werden. In manchen Editoren wird stattdessen Ctrl+Shift+Z verwendet.',
    category: 'Bearbeiten',
    tips: [
      'Funktioniert nur nach einer Ctrl+Z-Aktion',
      'In VS Code und manchen Texteditoren ist der Shortcut Ctrl+Shift+Z',
      'Neue Eingaben nach Ctrl+Z löschen die Redo-History',
    ],
    frequency: 8,
  },
  {
    id: 'ctrl-w',
    keys: ['Ctrl', 'W'],
    name: 'Tab / Fenster schließen',
    shortDesc: 'Aktuellen Tab oder Dokumentenfenster schließen',
    fullDescription:
      'Schließt den aktuellen Tab in Browsern und vielen anderen Anwendungen. In manchen Programmen schließt es das aktuelle Dokument, ohne die Anwendung zu beenden.',
    category: 'Datei',
    tips: [
      'Mit Ctrl+Shift+T kannst du versehentlich geschlossene Tabs wiederherstellen',
      'Schneller als das X auf dem Tab zu klicken',
      'Alt+F4 schließt die gesamte Anwendung',
    ],
    frequency: 8,
  },
  {
    id: 'ctrl-n',
    keys: ['Ctrl', 'N'],
    name: 'Neu erstellen',
    shortDesc: 'Neues Dokument oder Fenster öffnen',
    fullDescription:
      'Erstellt in der aktuellen Anwendung ein neues, leeres Dokument oder öffnet ein neues Fenster. Im Browser wird ein neues Fenster geöffnet, in Texteditoren ein neues Dokument.',
    category: 'Datei',
    tips: [
      'Im Browser: Ctrl+N öffnet neues Fenster, Ctrl+T öffnet neuen Tab',
      'Ctrl+Shift+N öffnet ein neues Inkognito-Fenster im Browser',
      'Im Explorer: Ctrl+Shift+N erstellt einen neuen Ordner',
    ],
    frequency: 8,
  },
  {
    id: 'ctrl-o',
    keys: ['Ctrl', 'O'],
    name: 'Datei öffnen',
    shortDesc: 'Öffnen-Dialog für Dateien anzeigen',
    fullDescription:
      'Öffnet einen Dialog zum Durchsuchen und Öffnen von Dateien. Die verfügbaren Dateitypen hängen von der aktuellen Anwendung ab.',
    category: 'Datei',
    tips: [
      'Im Browser: öffnet eine lokale Datei oder den Datei-Browser',
      'Der Dialog unterstützt oft die direkte Pfadeingabe in der Adressleiste oben',
      'Mit Ctrl+Shift+O öffnen Browser den Lesezeichen-Manager',
    ],
    frequency: 8,
  },
  {
    id: 'win-d',
    keys: ['Win', 'D'],
    name: 'Desktop anzeigen',
    shortDesc: 'Alle Fenster minimieren und Desktop zeigen',
    fullDescription:
      'Minimiert alle geöffneten Fenster und zeigt den Desktop. Erneutes Drücken stellt alle minimierten Fenster wieder her. Nützlich für schnellen Zugriff auf Desktop-Symbole.',
    category: 'System',
    tips: [
      'Nochmals drücken: alle Fenster werden wiederhergestellt',
      'Win+M minimiert alles, aber ohne Toggle-Funktion',
      'Win+Home minimiert alle Fenster außer dem aktuell aktiven',
    ],
    frequency: 8,
  },
  {
    id: 'win-e',
    keys: ['Win', 'E'],
    name: 'Explorer öffnen',
    shortDesc: 'Windows Explorer / Datei-Manager öffnen',
    fullDescription:
      'Öffnet den Windows-Datei-Explorer direkt. Standard-Ziel ist "Schnellzugriff" oder "Dieser PC", je nach Windows-Einstellung.',
    category: 'System',
    tips: [
      'Einer der schnellsten Wege um auf Dateien zuzugreifen',
      'Im Explorer: Alt+D springt in die Adressleiste',
      'Ctrl+N im Explorer öffnet ein weiteres Explorer-Fenster',
    ],
    frequency: 8,
  },
  {
    id: 'win-r',
    keys: ['Win', 'R'],
    name: 'Ausführen',
    shortDesc: '"Ausführen"-Dialog für direkte Befehle öffnen',
    fullDescription:
      'Öffnet den "Ausführen"-Dialog, in dem du Programme, Ordner oder Webseiten direkt durch Eingabe eines Befehls starten kannst.',
    category: 'System',
    tips: [
      'Nützliche Befehle: "notepad" (Editor), "calc" (Rechner), "cmd" (Eingabeaufforderung)',
      '"control" öffnet die Systemsteuerung, "regedit" den Registrierungseditor',
      '"ms-settings:" öffnet die Windows 10/11 Einstellungen direkt',
    ],
    frequency: 8,
  },
  {
    id: 'ctrl-shift-esc',
    keys: ['Ctrl', 'Shift', 'Esc'],
    name: 'Task-Manager',
    shortDesc: 'Task-Manager direkt öffnen',
    fullDescription:
      'Öffnet den Windows Task-Manager direkt, ohne den Umweg über Ctrl+Alt+Entf. Im Task-Manager siehst du laufende Prozesse, CPU/RAM-Auslastung und kannst eingefrorene Programme beenden.',
    category: 'System',
    tips: [
      'Schneller als Ctrl+Alt+Entf und dann Task-Manager klicken',
      'Rechtsklick auf einen Prozess → "Aufgabe beenden" zum Beenden',
      'Der Tab "Leistung" zeigt Echtzeit-Graphen für CPU, RAM, Festplatte und Netzwerk',
    ],
    frequency: 8,
  },
  {
    id: 'ctrl-t',
    keys: ['Ctrl', 'T'],
    name: 'Neuer Tab',
    shortDesc: 'Neuen Tab im Browser oder der App öffnen',
    fullDescription:
      'Öffnet einen neuen leeren Tab im Browser. In manchen anderen Anwendungen (z.B. VS Code, Windows Terminal) öffnet es ebenfalls einen neuen Tab.',
    category: 'Browser',
    tips: [
      'Ctrl+Shift+T stellt den zuletzt geschlossenen Tab wieder her',
      'Ctrl+1 bis Ctrl+8 wechselt direkt zum Tab nach Position',
      'Ctrl+9 springt immer zum letzten Tab',
    ],
    frequency: 8,
  },
  {
    id: 'ctrl-shift-t',
    keys: ['Ctrl', 'Shift', 'T'],
    name: 'Tab wiederherstellen',
    shortDesc: 'Letzten geschlossenen Browser-Tab wiederherstellen',
    fullDescription:
      'Stellt den zuletzt geschlossenen Browser-Tab wieder her — inklusive des Tab-Verlaufs. Kann mehrfach verwendet werden, um mehrere kürzlich geschlossene Tabs zu öffnen.',
    category: 'Browser',
    tips: [
      'Mehrfach drücken stellt mehrere Tabs der Reihe nach wieder her',
      'Funktioniert auch nach einem Browser-Neustart (Tabs aus vorheriger Sitzung)',
      'Im neuen Tab-Dialog gibt es meist auch eine "Letzte Tabs" Übersicht',
    ],
    frequency: 8,
  },
  {
    id: 'ctrl-l',
    keys: ['Ctrl', 'L'],
    name: 'Adressleiste fokussieren',
    shortDesc: 'Browser-Adressleiste markieren und fokussieren',
    fullDescription:
      'Springt direkt zur Adressleiste des Browsers und markiert die aktuelle URL, sodass du sofort eine neue Adresse eingeben oder suchen kannst.',
    category: 'Browser',
    tips: [
      'Sofort nach dem Drücken kann eine URL oder Suche eingegeben werden',
      'Alt+D und F6 haben die gleiche Funktion in den meisten Browsern',
      'Escape beendet die Bearbeitung und springt zurück zur Seite',
    ],
    frequency: 8,
  },
  {
    id: 'delete',
    keys: ['Entf'],
    name: 'Löschen / Papierkorb',
    shortDesc: 'Ausgewählte Datei in den Papierkorb verschieben',
    fullDescription:
      'Verschiebt ausgewählte Dateien oder Ordner im Explorer in den Windows-Papierkorb. In Texteditoren löscht es das Zeichen nach dem Cursor.',
    category: 'Datei',
    tips: [
      'Dateien können aus dem Papierkorb wiederhergestellt werden — kein endgültiger Verlust',
      'Shift+Entf löscht dauerhaft ohne Papierkorb — mit Vorsicht verwenden',
      'Ctrl+Z macht das Löschen in vielen Kontexten rückgängig',
    ],
    frequency: 8,
  },
  {
    id: 'ctrl-tab',
    keys: ['Ctrl', 'Tab'],
    name: 'Nächster Tab',
    shortDesc: 'Zum nächsten Tab wechseln',
    fullDescription:
      'Wechselt zum nächsten Tab in Browsern und vielen anderen Tab-basierten Anwendungen wie VS Code oder Windows Terminal.',
    category: 'Browser',
    tips: [
      'Ctrl+Shift+Tab wechselt zum vorherigen Tab',
      'Ctrl+1 bis Ctrl+9 springt direkt zu einem Tab nach Position',
      'Funktioniert auch in VS Code, Windows Terminal und anderen Tab-Apps',
    ],
    frequency: 8,
  },
  {
    id: 'win-shift-s',
    keys: ['Win', 'Shift', 'S'],
    name: 'Snipping Tool',
    shortDesc: 'Bildschirmbereich auswählen und Screenshot erstellen',
    fullDescription:
      'Öffnet das Windows Snipping Tool im Auswahlmodus. Du kannst einen Bildschirmbereich, ein Fenster oder den gesamten Bildschirm aufnehmen. Der Screenshot wird automatisch in die Zwischenablage kopiert.',
    category: 'Screenshot',
    tips: [
      'Nach der Aufnahme die Benachrichtigung klicken, um zu bearbeiten oder zu speichern',
      'Unterstützt: rechteckige Auswahl, Freihand, Fenster und Vollbild',
      'Der Screenshot ist sofort in der Zwischenablage — direkt mit Ctrl+V einfügen',
    ],
    frequency: 8,
  },
  // ── Frequency 7 ───────────────────────────────────────────────────────────
  {
    id: 'ctrl-p',
    keys: ['Ctrl', 'P'],
    name: 'Drucken',
    shortDesc: 'Druckdialog öffnen',
    fullDescription:
      'Öffnet den Druckdialog für das aktuelle Dokument oder die aktuelle Seite. Drucker, Seitenbereich, Kopienanzahl und weitere Einstellungen können konfiguriert werden.',
    category: 'Datei',
    tips: [
      'Im Browser: "Als PDF speichern" als Drucker wählen, um eine PDF zu erstellen',
      'Ctrl+Shift+P öffnet in manchen Apps eine Druckvorschau',
      'Einige Editoren haben Druckoptionen wie Syntaxhervorhebung',
    ],
    frequency: 7,
  },
  {
    id: 'ctrl-b',
    keys: ['Ctrl', 'B'],
    name: 'Fett',
    shortDesc: 'Markierten Text fett formatieren',
    fullDescription:
      'Schaltet die Fettformatierung für den markierten Text ein oder aus. Funktioniert in Textverarbeitungen, E-Mail-Clients und anderen Rich-Text-Editoren.',
    category: 'Bearbeiten',
    tips: [
      'Ctrl+I für Kursiv, Ctrl+U für Unterstrichen — die drei häufigsten Formatierungen',
      'Nochmaliges Drücken hebt die Formatierung wieder auf',
      'In HTML-Editoren wird meist das <strong>-Tag erzeugt',
    ],
    frequency: 7,
  },
  {
    id: 'ctrl-i',
    keys: ['Ctrl', 'I'],
    name: 'Kursiv',
    shortDesc: 'Markierten Text kursiv formatieren',
    fullDescription:
      'Schaltet die Kursivschrift für den markierten Text ein oder aus. Kursivtext wird typischerweise für Betonungen, Buchtitel oder fremdsprachige Begriffe verwendet.',
    category: 'Bearbeiten',
    tips: [
      'Nochmaliges Drücken hebt die Kursivschrift wieder auf',
      'Oft kombiniert mit Ctrl+B für fett-kursive Formatierung',
      'In VS Code öffnet Ctrl+I den IntelliSense-Vorschlag',
    ],
    frequency: 7,
  },
  {
    id: 'ctrl-u',
    keys: ['Ctrl', 'U'],
    name: 'Unterstrichen',
    shortDesc: 'Markierten Text unterstrichen formatieren',
    fullDescription:
      'Schaltet die Unterstreichung für den markierten Text ein oder aus. In Browsern öffnet Ctrl+U den Quellcode der aktuellen Seite.',
    category: 'Bearbeiten',
    tips: [
      'In Web-Apps ist unterstrichen oft mit Links verwechselbar — mit Bedacht einsetzen',
      'Nochmaliges Drücken hebt die Unterstreichung auf',
      'Im Browser: Ctrl+U zeigt den HTML-Quellcode der Seite',
    ],
    frequency: 7,
  },
  {
    id: 'f2',
    keys: ['F2'],
    name: 'Umbenennen',
    shortDesc: 'Ausgewählte Datei oder Ordner umbenennen',
    fullDescription:
      'Aktiviert den Bearbeitungsmodus für den Namen der ausgewählten Datei oder des ausgewählten Ordners im Explorer. Schneller als Rechtsklick → "Umbenennen".',
    category: 'Datei',
    tips: [
      'Tab wechselt zur nächsten Datei für schnelle Serienumbenennungen',
      'Escape bricht das Umbenennen ohne Änderungen ab',
      'Mehrere Dateien markieren + F2 ändert den Namen aller gleichzeitig (mit Nummerierung)',
    ],
    frequency: 7,
  },
  {
    id: 'win-tab',
    keys: ['Win', 'Tab'],
    name: 'Aufgabenansicht',
    shortDesc: 'Moderne Aufgabenansicht mit allen offenen Fenstern öffnen',
    fullDescription:
      'Öffnet die Windows-Aufgabenansicht mit einer Übersicht aller geöffneten Fenster und virtuellen Desktops. Von hier aus können neue virtuelle Desktops erstellt und verwaltet werden.',
    category: 'Fenster',
    tips: [
      '"Neuer Desktop" für virtuelle Desktops — ideal zum Trennen von Projekten',
      'Win+Ctrl+← / → wechselt direkt zwischen virtuellen Desktops',
      'Alt+Tab ist schneller für einfaches Fensterwechseln',
    ],
    frequency: 7,
  },
  {
    id: 'win-up',
    keys: ['Win', '↑'],
    name: 'Fenster maximieren',
    shortDesc: 'Aktives Fenster auf Vollbildgröße maximieren',
    fullDescription:
      'Maximiert das aktuell aktive Fenster auf die volle Bildschirmgröße. Wenn das Fenster bereits maximiert ist, wird es auf halbe Höhe verkleinert.',
    category: 'Fenster',
    tips: [
      'Win+↓ minimiert das Fenster wieder',
      'Doppelklick auf die Titelleiste macht dasselbe',
      'Win+Shift+↑ streckt das Fenster auf volle Höhe ohne die Breite zu ändern',
    ],
    frequency: 7,
  },
  {
    id: 'win-down',
    keys: ['Win', '↓'],
    name: 'Fenster minimieren',
    shortDesc: 'Aktives Fenster minimieren oder verkleinern',
    fullDescription:
      'Wenn das Fenster maximiert ist, wird es auf die vorherige Größe zurückgesetzt. Nochmals drücken minimiert es in die Taskleiste.',
    category: 'Fenster',
    tips: [
      'Zweimaliges Drücken: erst Fenster-Größe, dann in Taskleiste minimiert',
      'Win+↑ maximiert wieder',
      'Win+M minimiert alle Fenster auf einmal',
    ],
    frequency: 7,
  },
  {
    id: 'win-left',
    keys: ['Win', '←'],
    name: 'Fenster links andocken',
    shortDesc: 'Aktives Fenster an die linke Bildschirmhälfte andocken',
    fullDescription:
      'Dockt das aktive Fenster an die linke Bildschirmhälfte an (Snap-Funktion). Windows schlägt anschließend vor, ein anderes Fenster für die rechte Hälfte zu wählen.',
    category: 'Fenster',
    tips: [
      'Win+→ dockt das Fenster an die rechte Seite',
      'Mehrfach drücken: wechselt durch linke Hälfte → Ecken → rechte Hälfte',
      'Ideal für Zwei-Fenster-Layouts zum parallelen Arbeiten',
    ],
    frequency: 7,
  },
  {
    id: 'win-right',
    keys: ['Win', '→'],
    name: 'Fenster rechts andocken',
    shortDesc: 'Aktives Fenster an die rechte Bildschirmhälfte andocken',
    fullDescription:
      'Dockt das aktive Fenster an die rechte Bildschirmhälfte an (Snap-Funktion). Windows schlägt anschließend vor, ein anderes geöffnetes Fenster für die linke Seite zu wählen.',
    category: 'Fenster',
    tips: [
      'Win+← dockt an die linke Seite',
      'In Windows 11 gibt es zusätzlich Snap-Layouts für 3- und 4-Fenster-Anordnungen',
      'Ideal für Multitasking mit zwei Programmen gleichzeitig',
    ],
    frequency: 7,
  },
  {
    id: 'ctrl-d',
    keys: ['Ctrl', 'D'],
    name: 'Lesezeichen hinzufügen',
    shortDesc: 'Aktuelle Seite als Browser-Lesezeichen speichern',
    fullDescription:
      'Fügt die aktuelle Seite zu den Browser-Lesezeichen hinzu. Ein kleiner Dialog erscheint, in dem Name und Ordner angepasst werden können.',
    category: 'Browser',
    tips: [
      'Ctrl+Shift+B blendet die Lesezeichen-Leiste ein/aus',
      'Ctrl+Shift+O öffnet den Lesezeichen-Manager für die Verwaltung',
      'In VS Code: Ctrl+D markiert das nächste Vorkommen des ausgewählten Textes',
    ],
    frequency: 7,
  },
  {
    id: 'ctrl-h',
    keys: ['Ctrl', 'H'],
    name: 'Suchen & Ersetzen / Verlauf',
    shortDesc: 'Suchen-Ersetzen-Dialog öffnen oder Browser-Verlauf anzeigen',
    fullDescription:
      'In Texteditoren und Office-Programmen öffnet Ctrl+H den "Suchen und Ersetzen"-Dialog. In Browsern (Chrome, Edge) öffnet es den Browser-Verlauf.',
    category: 'Bearbeiten',
    tips: [
      'Im Suchen-Ersetzen-Dialog: "Alle ersetzen" für schnelle Massenänderungen',
      'Im Browser zeigt es den kompletten Verlauf mit Suchfunktion',
      'Viele Editoren unterstützen RegEx im Ersetzungs-Dialog',
    ],
    frequency: 7,
  },
  {
    id: 'win-i',
    keys: ['Win', 'I'],
    name: 'Einstellungen öffnen',
    shortDesc: 'Windows Einstellungen-App öffnen',
    fullDescription:
      'Öffnet die Windows-Einstellungen direkt. Hier können WLAN, Bluetooth, Anzeige, Ton, Updates und Konten konfiguriert werden.',
    category: 'System',
    tips: [
      'Viel übersichtlicher als die alte Systemsteuerung',
      'Die Suche in den Einstellungen findet schnell die gewünschte Option',
      'Win+X → "Einstellungen" ist eine Alternative',
    ],
    frequency: 7,
  },
  {
    id: 'win-x',
    keys: ['Win', 'X'],
    name: 'Schnellzugriff-Menü',
    shortDesc: 'Power-User-Menü mit Systemtools öffnen',
    fullDescription:
      'Öffnet das Windows-Schnellzugriff-Menü ("Power-User-Menü") mit direkten Links zu Geräte-Manager, Netzwerkverbindungen, Task-Manager, PowerShell und mehr.',
    category: 'System',
    tips: [
      'Ideal für Administratoren und Power-User',
      'Rechtsklick auf das Startmenü-Symbol öffnet das gleiche Menü',
      'Buchstaben im Menü als Shortcuts: "A" für PowerShell, "M" für Geräte-Manager',
    ],
    frequency: 7,
  },
  {
    id: 'f5',
    keys: ['F5'],
    name: 'Aktualisieren',
    shortDesc: 'Aktuelle Seite oder Ansicht neu laden',
    fullDescription:
      'Lädt die aktuelle Webseite oder Explorer-Ansicht neu. Im Browser werden dabei gecachte Daten meist beibehalten. Ctrl+F5 erzwingt ein vollständiges Neuladen ohne Cache.',
    category: 'System',
    tips: [
      'Ctrl+F5 oder Ctrl+Shift+R: Seite neu laden und Cache leeren (Hard Reload)',
      'Im Explorer: aktualisiert den Ordnerinhalt (nützlich bei externen Laufwerken)',
      'In PowerPoint: startet die Präsentation vom Anfang',
    ],
    frequency: 7,
  },
  {
    id: 'ctrl-shift-n',
    keys: ['Ctrl', 'Shift', 'N'],
    name: 'Neuer Ordner / Inkognito',
    shortDesc: 'Neuen Ordner erstellen oder Inkognito-Fenster öffnen',
    fullDescription:
      'Im Explorer: erstellt sofort einen neuen Ordner im aktuellen Verzeichnis. Im Browser: öffnet ein neues Inkognito-/Privatfenster ohne Verlauf und Cookies.',
    category: 'Datei',
    tips: [
      'Im Browser: öffnet neues Inkognito-Fenster (Chrome, Edge)',
      'Im Explorer: der neue Ordner ist sofort für die Umbenennung markiert',
      'Inkognito-Fenster sind nützlich zum Testen ohne gespeicherte Login-Daten',
    ],
    frequency: 7,
  },
  {
    id: 'f11',
    keys: ['F11'],
    name: 'Vollbildmodus',
    shortDesc: 'Browser oder App in den Vollbildmodus wechseln',
    fullDescription:
      'Wechselt den aktuellen Browser oder manche andere Anwendungen in den Vollbildmodus. Dabei werden Adressleiste, Taskleiste und andere UI-Elemente ausgeblendet.',
    category: 'Fenster',
    tips: [
      'Nochmals F11 drücken verlässt den Vollbildmodus',
      'Ideal beim Präsentieren von Webseiten oder Schauen von Videos',
      'In manchen Spielen gibt es eine separate Vollbild-Option in den Einstellungen',
    ],
    frequency: 7,
  },
  {
    id: 'ctrl-home',
    keys: ['Ctrl', 'Home'],
    name: 'Zum Anfang springen',
    shortDesc: 'Cursor oder Ansicht zum Anfang des Dokuments',
    fullDescription:
      'Springt an den Anfang des Dokuments, der Seite oder des Textfelds. Im Browser scrollt es ganz nach oben, in Texteditoren springt der Cursor zur ersten Zeile.',
    category: 'Navigation',
    tips: [
      'Ctrl+End springt zum Ende des Dokuments',
      'Shift+Ctrl+Home markiert alles vom Cursor bis zum Anfang',
      'Home (ohne Ctrl) springt zum Zeilenanfang',
    ],
    frequency: 7,
  },
  {
    id: 'ctrl-end',
    keys: ['Ctrl', 'End'],
    name: 'Zum Ende springen',
    shortDesc: 'Cursor oder Ansicht zum Ende des Dokuments',
    fullDescription:
      'Springt ans Ende des Dokuments, der Seite oder des Textfelds. Im Browser scrollt es ganz nach unten, in Texteditoren springt der Cursor zur letzten Zeile.',
    category: 'Navigation',
    tips: [
      'Ctrl+Home springt wieder zum Anfang',
      'Shift+Ctrl+End markiert alles vom Cursor bis zum Ende',
      'End (ohne Ctrl) springt zum Zeilenende',
    ],
    frequency: 7,
  },
  {
    id: 'ctrl-arrow-left',
    keys: ['Ctrl', '←'],
    name: 'Wortweise rückwärts',
    shortDesc: 'Cursor um ein ganzes Wort nach links bewegen',
    fullDescription:
      'Bewegt den Cursor jeweils um ein ganzes Wort nach links. Viel effizienter als einzelne Tastenanschläge beim Navigieren in längeren Texten.',
    category: 'Navigation',
    tips: [
      'Ctrl+→ bewegt den Cursor ein Wort nach rechts',
      'Ctrl+Shift+← markiert das Wort links vom Cursor',
      'Sehr nützlich für schnelles Editieren ohne Maus',
    ],
    frequency: 7,
  },
  {
    id: 'ctrl-arrow-right',
    keys: ['Ctrl', '→'],
    name: 'Wortweise vorwärts',
    shortDesc: 'Cursor um ein ganzes Wort nach rechts bewegen',
    fullDescription:
      'Bewegt den Cursor jeweils um ein ganzes Wort nach rechts. Ermöglicht schnelles Navigieren durch Text ohne Mauseinsatz.',
    category: 'Navigation',
    tips: [
      'Ctrl+← bewegt den Cursor ein Wort nach links',
      'Ctrl+Shift+→ markiert das nächste Wort',
      'Doppelklick auf ein Wort markiert es ebenfalls',
    ],
    frequency: 7,
  },
  {
    id: 'print-screen',
    keys: ['Druck'],
    name: 'Vollbild-Screenshot',
    shortDesc: 'Screenshot des gesamten Bildschirms erstellen',
    fullDescription:
      'Erstellt einen Screenshot des gesamten Bildschirms und legt ihn in die Zwischenablage. Auf manchen Tastaturen steht "PrtSc" oder "Print". Mit Ctrl+V einfügbar.',
    category: 'Screenshot',
    tips: [
      'Kein Datei-Dialog — der Screenshot ist direkt in der Zwischenablage',
      'Win+Shift+S bietet mehr Optionen (Ausschnitt, Fenster, etc.)',
      'Win+Druck speichert automatisch als Datei in Bilder/Screenshots',
    ],
    frequency: 7,
  },
  // ── Frequency 6 ───────────────────────────────────────────────────────────
  {
    id: 'ctrl-shift-tab',
    keys: ['Ctrl', 'Shift', 'Tab'],
    name: 'Vorheriger Tab',
    shortDesc: 'Zum vorherigen Tab wechseln',
    fullDescription:
      'Wechselt in Browsern und anderen Tab-Anwendungen zum vorherigen (linken) Tab. Die Umkehrfunktion von Ctrl+Tab.',
    category: 'Browser',
    tips: [
      'Ctrl+Tab wechselt zum nächsten Tab',
      'Ctrl+1 bis Ctrl+9 springt direkt zu einem bestimmten Tab',
      'Ctrl+Shift+T stellt geschlossene Tabs wieder her',
    ],
    frequency: 6,
  },
  {
    id: 'ctrl-plus',
    keys: ['Ctrl', '+'],
    name: 'Heranzoomen',
    shortDesc: 'Seiteninhalt vergrößern (Zoom in)',
    fullDescription:
      'Vergrößert den Seiteninhalt im Browser oder anderen Anwendungen. Jeder Tastendruck erhöht den Zoom-Level um typischerweise 10 Prozentpunkte.',
    category: 'Browser',
    tips: [
      'Ctrl+- zum Herauszoomen, Ctrl+0 zum Zurücksetzen auf 100%',
      'Alternativ: Ctrl + Mausrad drehen',
      'In VS Code verändert es die globale Schriftgröße',
    ],
    frequency: 6,
  },
  {
    id: 'ctrl-minus',
    keys: ['Ctrl', '-'],
    name: 'Herauszoomen',
    shortDesc: 'Seiteninhalt verkleinern (Zoom out)',
    fullDescription:
      'Verkleinert den Seiteninhalt im Browser oder anderen Anwendungen. Nützlich um mehr Inhalt auf einmal zu sehen.',
    category: 'Browser',
    tips: [
      'Ctrl++ zum Heranzoomen, Ctrl+0 zum Zurücksetzen',
      'Alternativ: Ctrl + Mausrad nach unten drehen',
      'Jeder Tastendruck verringert den Zoom um etwa 10%',
    ],
    frequency: 6,
  },
  {
    id: 'ctrl-0',
    keys: ['Ctrl', '0'],
    name: 'Zoom zurücksetzen',
    shortDesc: 'Browser-Zoom auf 100% zurücksetzen',
    fullDescription:
      'Setzt den Zoom im Browser auf den Standard-Zoom von 100% zurück. Nützlich wenn man sich mit Ctrl++ oder Ctrl+- "verzoomt" hat.',
    category: 'Browser',
    tips: [
      'Ctrl++ und Ctrl+- zum Anpassen des Zooms',
      'Der Standard-Zoom kann in den Browser-Einstellungen dauerhaft geändert werden',
      'In VS Code setzt Ctrl+0 den Fokus auf den Editor zurück',
    ],
    frequency: 6,
  },
  {
    id: 'win-v',
    keys: ['Win', 'V'],
    name: 'Zwischenablageverlauf',
    shortDesc: 'Verlauf der Zwischenablage öffnen',
    fullDescription:
      'Öffnet den Windows-Zwischenablageverlauf mit den zuletzt kopierten Elementen. Beim ersten Aufruf muss der Verlauf in den Einstellungen aktiviert werden.',
    category: 'System',
    tips: [
      'Aktivierung: Einstellungen → System → Zwischenablage → Verlauf aktivieren',
      'Zeigt die letzten ~25 kopierten Texte, Bilder und mehr',
      'Elemente können angeheftet werden (Stern-Symbol) um sie dauerhaft zu behalten',
    ],
    frequency: 6,
  },
  {
    id: 'ctrl-j',
    keys: ['Ctrl', 'J'],
    name: 'Downloads anzeigen',
    shortDesc: 'Browser-Download-Liste öffnen',
    fullDescription:
      'Öffnet in den meisten Browsern (Chrome, Edge, Firefox) die Download-Liste mit aktiven und abgeschlossenen Downloads.',
    category: 'Browser',
    tips: [
      'In Firefox öffnet es direkt die Download-Bibliothek',
      'Downloads können von hier direkt im Ordner geöffnet werden',
      'Abgeschlossene Downloads aus der Liste entfernen hält die Übersicht sauber',
    ],
    frequency: 6,
  },
  {
    id: 'win-m',
    keys: ['Win', 'M'],
    name: 'Alle Fenster minimieren',
    shortDesc: 'Alle offenen Fenster auf einmal minimieren',
    fullDescription:
      'Minimiert alle geöffneten Fenster und legt sie in die Taskleiste. Im Gegensatz zu Win+D gibt es keinen Toggle — Win+Shift+M stellt sie wieder her.',
    category: 'Fenster',
    tips: [
      'Win+Shift+M stellt alle minimierten Fenster wieder her',
      'Win+D ist ein Toggle (ein- und ausblenden) und meist praktischer',
      'Win+Home minimiert alles außer dem aktuell aktiven Fenster',
    ],
    frequency: 6,
  },
  {
    id: 'ctrl-shift-left',
    keys: ['Ctrl', 'Shift', '←'],
    name: 'Wort links markieren',
    shortDesc: 'Nächstes Wort links zum Markierungsbereich hinzufügen',
    fullDescription:
      'Erweitert die Textmarkierung um ein ganzes Wort nach links. Kann mehrfach gedrückt werden, um mehrere Wörter zu markieren.',
    category: 'Navigation',
    tips: [
      'Ctrl+Shift+→ markiert nach rechts',
      'Shift+Home markiert bis zum Zeilenanfang',
      'Kombiniert mit Ctrl+C: schnelles Kopieren ganzer Wörter ohne Maus',
    ],
    frequency: 6,
  },
  {
    id: 'ctrl-shift-right',
    keys: ['Ctrl', 'Shift', '→'],
    name: 'Wort rechts markieren',
    shortDesc: 'Nächstes Wort rechts zum Markierungsbereich hinzufügen',
    fullDescription:
      'Erweitert die Textmarkierung um ein ganzes Wort nach rechts. Sehr nützlich für schnelles Markieren von Textstellen ohne Maus.',
    category: 'Navigation',
    tips: [
      'Ctrl+Shift+← markiert nach links',
      'Shift+End markiert bis zum Zeilenende',
      'Mit Ctrl+Backspace kann man außerdem ein ganzes Wort auf einmal löschen',
    ],
    frequency: 6,
  },
  {
    id: 'shift-delete',
    keys: ['Shift', 'Entf'],
    name: 'Dauerhaft löschen',
    shortDesc: 'Datei endgültig löschen, ohne den Papierkorb',
    fullDescription:
      'Löscht die ausgewählte Datei oder den Ordner dauerhaft, ohne sie in den Papierkorb zu verschieben. Eine Sicherheitsabfrage erscheint vor der Ausführung.',
    category: 'Datei',
    tips: [
      'Vorsicht: diese Aktion kann nicht mit Ctrl+Z rückgängig gemacht werden',
      'Für sensible Daten empfehlen sich dedizierte Lösch-Tools mit sicherer Überschreibung',
      'Die Sicherheitsabfrage kann in den Papierkorb-Einstellungen deaktiviert werden',
    ],
    frequency: 6,
  },
  {
    id: 'alt-print-screen',
    keys: ['Alt', 'Druck'],
    name: 'Fenster-Screenshot',
    shortDesc: 'Screenshot nur des aktiven Fensters erstellen',
    fullDescription:
      'Erstellt einen Screenshot nur des aktuell aktiven Fensters (nicht des gesamten Bildschirms) und legt ihn in die Zwischenablage.',
    category: 'Screenshot',
    tips: [
      'Nützlich wenn man nur ein bestimmtes Programm-Fenster dokumentieren möchte',
      'Win+Shift+S bietet mehr Kontrolle über den aufgenommenen Bereich',
      'Screenshot direkt mit Ctrl+V in ein Programm oder Dokument einfügen',
    ],
    frequency: 6,
  },
  {
    id: 'win-p',
    keys: ['Win', 'P'],
    name: 'Anzeige-Modus',
    shortDesc: 'Optionen für externe Monitore und Projektion',
    fullDescription:
      'Öffnet das Seitenleisten-Menü mit Anzeige-Optionen: Nur PC-Bildschirm, Duplizieren, Erweitern und Nur zweiter Bildschirm. Ideal beim Anschließen eines Beamers oder zweiten Monitors.',
    category: 'System',
    tips: [
      'Beim Anschließen eines Beamers: Win+P → "Duplizieren"',
      '"Erweitern" gibt zwei unabhängige Desktops für mehr Arbeitsfläche',
      'Win+P hilft auch wenn ein Bildschirm nach Anschluss schwarz bleibt',
    ],
    frequency: 6,
  },
]

export const shortcuts: WindowsShortcut[] = raw.sort((a, b) => b.frequency - a.frequency)
