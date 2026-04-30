export interface InterviewQuestion {
  id: string
  algorithm: string
  type: 'explain' | 'complexity' | 'compare' | 'tradeoff'
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: 'bs-1',
    algorithm: 'bubble-sort',
    type: 'explain',
    question: 'Was beschreibt die Funktionsweise von Bubble Sort am besten?',
    options: [
      'Es sucht immer das Minimum und setzt es an die richtige Position.',
      'Es vergleicht benachbarte Elemente und tauscht sie, wenn sie falsch geordnet sind.',
      'Es teilt das Array rekursiv und fügt sortierte Hälften zusammen.',
      'Es wählt ein Pivot-Element und partitioniert das Array darum.',
    ],
    correctIndex: 1,
    explanation:
      'Bubble Sort vergleicht benachbarte Elemente und tauscht sie, wenn sie falsch geordnet sind. Das größte Element „blubbert" dabei pro Durchgang an das Ende des Arrays.',
  },
  {
    id: 'bs-2',
    algorithm: 'bubble-sort',
    type: 'complexity',
    question: 'Welche Zeitkomplexität hat Bubble Sort im besten Fall (optimierte Version)?',
    options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
    correctIndex: 2,
    explanation:
      'Bei einem bereits sortierten Array erkennt die optimierte Version, dass kein Tausch stattgefunden hat, und bricht nach dem ersten Durchgang ab — das ergibt O(n).',
  },
  {
    id: 'ss-1',
    algorithm: 'selection-sort',
    type: 'explain',
    question: 'Wie viele Tauschoperationen führt Selection Sort maximal durch?',
    options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
    correctIndex: 2,
    explanation:
      'Selection Sort führt maximal O(n) Tauschoperationen durch, da pro Durchgang genau ein Tausch stattfindet. Das macht ihn nützlich, wenn Schreiboperationen teuer sind.',
  },
  {
    id: 'ss-2',
    algorithm: 'selection-sort',
    type: 'tradeoff',
    question: 'Ist Selection Sort ein stabiler Sortieralgorithmus?',
    options: [
      'Ja, gleiche Elemente behalten immer ihre relative Reihenfolge.',
      'Nein, gleiche Elemente können ihre relative Reihenfolge verlieren.',
      'Nur bei geraden Array-Längen ist er stabil.',
      'Das hängt von der Implementierung ab.',
    ],
    correctIndex: 1,
    explanation:
      'Selection Sort ist nicht stabil. Beim Tauschen kann ein Element über ein gleich großes Element springen und so die ursprüngliche Reihenfolge gleicher Elemente verändern.',
  },
  {
    id: 'is-1',
    algorithm: 'insertion-sort',
    type: 'explain',
    question: 'Wie funktioniert Insertion Sort?',
    options: [
      'Es teilt das Array in zwei Hälften und sortiert diese rekursiv.',
      'Es nimmt ein Element und fügt es an der richtigen Stelle im bereits sortierten Teil ein.',
      'Es sucht das Minimum und setzt es an den Anfang.',
      'Es vergleicht immer zwei benachbarte Elemente und tauscht sie.',
    ],
    correctIndex: 1,
    explanation:
      'Insertion Sort nimmt nacheinander jedes Element und fügt es an der richtigen Position in den bereits sortierten Bereich links davon ein — wie Kartensortieren in der Hand.',
  },
  {
    id: 'is-2',
    algorithm: 'insertion-sort',
    type: 'tradeoff',
    question: 'In welchem Szenario ist Insertion Sort besonders effizient?',
    options: [
      'Bei sehr großen Arrays mit zufälliger Reihenfolge.',
      'Bei fast sortierten Arrays oder sehr kleinen Arrays.',
      'Bei Arrays, die umgekehrt sortiert sind.',
      'Bei Arrays mit vielen doppelten Elementen.',
    ],
    correctIndex: 1,
    explanation:
      'Insertion Sort ist bei fast sortierten Arrays sehr effizient (nahe O(n)), da wenig Verschiebungen nötig sind. Auch für sehr kleine Arrays ist er schneller als komplexere Algorithmen — deshalb nutzt Tim Sort ihn intern.',
  },
  {
    id: 'ms-1',
    algorithm: 'merge-sort',
    type: 'complexity',
    question: 'Welche Zeitkomplexität hat Merge Sort in allen Fällen?',
    options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'],
    correctIndex: 1,
    explanation:
      'Merge Sort hat in allen Fällen — bester, durchschnittlicher und schlechtester Fall — eine Zeitkomplexität von O(n log n), da das Array immer in zwei Hälften geteilt und anschließend zusammengeführt wird.',
  },
  {
    id: 'ms-2',
    algorithm: 'merge-sort',
    type: 'tradeoff',
    question: 'Was ist der Hauptnachteil von Merge Sort gegenüber Quick Sort?',
    options: [
      'Merge Sort ist im Durchschnitt langsamer als Quick Sort.',
      'Merge Sort ist nicht stabil.',
      'Merge Sort benötigt O(n) zusätzlichen Speicher.',
      'Merge Sort funktioniert nicht bei Strings.',
    ],
    correctIndex: 2,
    explanation:
      'Merge Sort benötigt O(n) zusätzlichen Speicherplatz für die temporären Arrays beim Zusammenführen. Quick Sort hingegen arbeitet in-place mit O(log n) Stack-Speicher.',
  },
  {
    id: 'qs-1',
    algorithm: 'quick-sort',
    type: 'explain',
    question: 'Was ist ein Pivot-Element in Quick Sort?',
    options: [
      'Das kleinste Element im Array.',
      'Das mittlere Element nach der Sortierung.',
      'Ein Element, um das das Array in kleinere und größere Elemente aufgeteilt wird.',
      'Das erste Element, das getauscht wird.',
    ],
    correctIndex: 2,
    explanation:
      'Das Pivot-Element ist ein gewähltes Element, um das das Array partitioniert wird: Alle kleineren Elemente kommen links, alle größeren rechts. Danach wird Quick Sort rekursiv auf beide Teile angewendet.',
  },
  {
    id: 'qs-2',
    algorithm: 'quick-sort',
    type: 'complexity',
    question: 'Warum ist O(n²) der Worst Case von Quick Sort?',
    options: [
      'Weil der Merge-Schritt O(n²) benötigt.',
      'Weil das Pivot immer das kleinste oder größte Element ist, was unbalancierte Partitionen erzeugt.',
      'Weil Quick Sort nicht in-place arbeitet.',
      'Weil bei gleichen Elementen viele unnötige Tausche stattfinden.',
    ],
    correctIndex: 1,
    explanation:
      'Wenn das Pivot immer das Minimum oder Maximum ist (z. B. bei bereits sortierten Arrays ohne gute Pivot-Wahl), entstehen Partitionen der Größe 0 und n−1 — das führt zu O(n²) Vergleichen.',
  },
  {
    id: 'hs-1',
    algorithm: 'heap-sort',
    type: 'explain',
    question: 'Was ist ein Max-Heap?',
    options: [
      'Ein Array, das bereits vollständig sortiert ist.',
      'Eine Datenstruktur, bei der jeder Knoten größer oder gleich seinen Kindern ist.',
      'Ein binärer Suchbaum mit sortierten Blättern.',
      'Ein Array, bei dem das größte Element am Ende steht.',
    ],
    correctIndex: 1,
    explanation:
      'Ein Max-Heap ist eine vollständige Binärbaumstruktur, bei der jeder Knoten größer oder gleich seinen Kindern ist. Das größte Element steht immer an der Wurzel — Heap Sort nutzt das, um es schrittweise ans Ende zu verschieben.',
  },
  {
    id: 'hs-2',
    algorithm: 'heap-sort',
    type: 'tradeoff',
    question: 'Ist Heap Sort stabil?',
    options: [
      'Ja, er bewahrt immer die Reihenfolge gleicher Elemente.',
      'Nein, gleiche Elemente können ihre Reihenfolge durch Heap-Operationen verlieren.',
      'Nur bei aufsteigender Sortierung ist er stabil.',
      'Das hängt von der Heap-Implementierung ab.',
    ],
    correctIndex: 1,
    explanation:
      'Heap Sort ist nicht stabil. Die Heap-Operationen (insbesondere das „Heapify") können die relative Reihenfolge gleicher Elemente verändern.',
  },
  {
    id: 'shell-1',
    algorithm: 'shell-sort',
    type: 'explain',
    question: 'Was unterscheidet Shell Sort grundlegend von Insertion Sort?',
    options: [
      'Shell Sort ist immer schneller als Insertion Sort.',
      'Shell Sort beginnt mit dem Sortieren weit entfernter Elemente und verkleinert die Schrittweite schrittweise.',
      'Shell Sort teilt das Array rekursiv wie Merge Sort.',
      'Shell Sort nutzt einen Heap für die Sortierung.',
    ],
    correctIndex: 1,
    explanation:
      'Shell Sort ist eine Erweiterung von Insertion Sort: Er startet mit großen Abständen (Gaps) zwischen verglichenen Elementen, die schrittweise auf 1 verkleinert werden. So können Elemente mit weniger Operationen über große Distanzen wandern.',
  },
  {
    id: 'cs-1',
    algorithm: 'counting-sort',
    type: 'explain',
    question: 'Warum kann Counting Sort schneller als O(n log n) sein?',
    options: [
      'Weil er Elemente parallelisiert verarbeitet.',
      'Weil er keine Vergleiche zwischen Elementen macht, sondern ihre Häufigkeit zählt.',
      'Weil er immer in-place arbeitet.',
      'Weil er einen besseren Pivot-Auswahlalgorithmus nutzt.',
    ],
    correctIndex: 1,
    explanation:
      'Counting Sort ist ein nicht-vergleichsbasierter Algorithmus. Statt Elemente zu vergleichen, zählt er die Häufigkeit jedes Werts und erreicht so O(n + k), wobei k die Größe des Wertebereichs ist.',
  },
  {
    id: 'cs-2',
    algorithm: 'counting-sort',
    type: 'tradeoff',
    question: 'Für welche Art von Daten ist Counting Sort ungeeignet?',
    options: [
      'Arrays mit wenigen Elementen.',
      'Arrays mit ganzen Zahlen in einem kleinen Wertebereich.',
      'Arrays mit sehr großem Wertebereich oder Fließkommazahlen.',
      'Bereits sortierte Arrays.',
    ],
    correctIndex: 2,
    explanation:
      'Counting Sort wird ineffizient bei sehr großem Wertebereich k, da das Zählarray die Größe k hat. Fließkommazahlen sind damit gar nicht direkt handhabbar.',
  },
  {
    id: 'rs-1',
    algorithm: 'radix-sort',
    type: 'explain',
    question: 'In welcher Reihenfolge verarbeitet Radix Sort (LSD) die Stellen einer Zahl?',
    options: [
      'Von der höchstwertigen zur niedrigstwertigen Stelle.',
      'Von der niedrigstwertigen zur höchstwertigen Stelle.',
      'Zufällige Reihenfolge, da die Reihenfolge egal ist.',
      'Nur gerade Stellen zuerst, dann ungerade.',
    ],
    correctIndex: 1,
    explanation:
      'Die gängige LSD-Variante (Least Significant Digit) verarbeitet Stellen von der Einerstelle aufwärts. Pro Stelle wird ein stabiles Sortierverfahren angewendet, damit die Gesamtsortierung korrekt ist.',
  },
  {
    id: 'ts-1',
    algorithm: 'tim-sort',
    type: 'explain',
    question: 'Welche zwei Algorithmen kombiniert Tim Sort?',
    options: [
      'Bubble Sort und Merge Sort.',
      'Selection Sort und Quick Sort.',
      'Insertion Sort und Merge Sort.',
      'Heap Sort und Counting Sort.',
    ],
    correctIndex: 2,
    explanation:
      'Tim Sort kombiniert Insertion Sort (für kleine Teilbereiche, sogenannte „Runs") mit Merge Sort (zum Zusammenführen der Runs). Das macht ihn besonders effizient auf realen Daten mit natürlicher Teilordnung.',
  },
  {
    id: 'cmp-1',
    algorithm: 'all',
    type: 'compare',
    question: 'Welcher Algorithmus garantiert O(n log n) im Worst Case UND ist stabil?',
    options: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Shell Sort'],
    correctIndex: 2,
    explanation:
      'Merge Sort garantiert O(n log n) in allen Fällen und ist stabil. Quick Sort hat O(n²) im Worst Case, Heap Sort ist nicht stabil, Shell Sort hat keine garantierte O(n log n)-Grenze.',
  },
  {
    id: 'cmp-2',
    algorithm: 'all',
    type: 'compare',
    question: 'Welcher vergleichsbasierte Algorithmus benötigt die wenigsten Schreiboperationen?',
    options: ['Bubble Sort', 'Insertion Sort', 'Selection Sort', 'Merge Sort'],
    correctIndex: 2,
    explanation:
      'Selection Sort führt maximal O(n) Tauschoperationen durch — eine pro Durchgang. Das macht ihn nützlich, wenn Schreiboperationen teuer sind (z. B. Flash-Speicher).',
  },
  {
    id: 'cmp-3',
    algorithm: 'all',
    type: 'compare',
    question: 'Wann würdest du Insertion Sort statt Quick Sort wählen?',
    options: [
      'Bei Arrays mit mehr als 1000 Elementen.',
      'Bei sehr kleinen Arrays (< 10–20 Elemente) oder fast sortierten Daten.',
      'Wenn Stabilität nicht wichtig ist.',
      'Nur bei Integer-Arrays.',
    ],
    correctIndex: 1,
    explanation:
      'Insertion Sort übertrifft Quick Sort bei sehr kleinen Arrays, da der konstante Overhead von Quick Sort (Rekursion, Pivot-Wahl) überwiegt. Deshalb schaltet Tim Sort intern bei kleinen Runs auf Insertion Sort um.',
  },
  {
    id: 'cmp-4',
    algorithm: 'all',
    type: 'tradeoff',
    question: 'Was bedeutet „in-place" Sortierung?',
    options: [
      'Der Algorithmus verändert das ursprüngliche Array nicht.',
      'Der Algorithmus benötigt nur O(1) oder O(log n) zusätzlichen Speicher.',
      'Der Algorithmus kann nur auf sortierten Arrays arbeiten.',
      'Der Algorithmus sortiert ohne jegliche Vergleiche.',
    ],
    correctIndex: 1,
    explanation:
      'Ein in-place Algorithmus benötigt nur eine konstante oder logarithmische Menge an zusätzlichem Speicher neben dem Input-Array. Merge Sort hingegen braucht O(n) extra Speicher und gilt als nicht in-place.',
  },
  {
    id: 'cmp-5',
    algorithm: 'all',
    type: 'tradeoff',
    question: 'Was bedeutet Stabilität bei Sortieralgorithmen?',
    options: [
      'Der Algorithmus liefert immer dasselbe Ergebnis bei gleicher Eingabe.',
      'Gleiche Elemente behalten nach der Sortierung ihre ursprüngliche relative Reihenfolge.',
      'Der Algorithmus stürzt nie ab, egal welche Eingabe er bekommt.',
      'Der Algorithmus hat immer O(n log n) Zeitkomplexität.',
    ],
    correctIndex: 1,
    explanation:
      'Stabilität bedeutet, dass zwei Elemente mit gleichem Sortierschlüssel nach der Sortierung in derselben relativen Reihenfolge stehen wie vorher. Das ist wichtig, wenn man nach mehreren Kriterien hintereinander sortiert.',
  },
  {
    id: 'cmp-6',
    algorithm: 'all',
    type: 'compare',
    question: 'Welcher Algorithmus wird intern von Python und Java für ihre Standard-Sortierfunktionen verwendet?',
    options: ['Quick Sort', 'Merge Sort', 'Tim Sort', 'Heap Sort'],
    correctIndex: 2,
    explanation:
      'Tim Sort wird von Python (seit 2.3) und Java (für Objekt-Arrays seit Java 7) als Standard-Sortierverfahren genutzt. Er kombiniert die Stärken von Insertion Sort und Merge Sort und ist besonders gut auf realen Daten.',
  },
  {
    id: 'cmp-7',
    algorithm: 'all',
    type: 'complexity',
    question: 'Welcher Algorithmus hat immer O(n²) — unabhängig von der Eingabe?',
    options: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Quick Sort'],
    correctIndex: 1,
    explanation:
      'Selection Sort hat immer O(n²) Vergleiche, weil er in jedem Durchgang den gesamten unsortierten Bereich durchsucht — egal, ob das Array bereits sortiert ist oder nicht.',
  },
  {
    id: 'cmp-8',
    algorithm: 'all',
    type: 'compare',
    question: 'Welche zwei Algorithmen sind nicht-vergleichsbasiert und können O(n) erreichen?',
    options: [
      'Bubble Sort und Selection Sort',
      'Merge Sort und Quick Sort',
      'Counting Sort und Radix Sort',
      'Heap Sort und Shell Sort',
    ],
    correctIndex: 2,
    explanation:
      'Counting Sort und Radix Sort sind nicht-vergleichsbasiert und können unter bestimmten Bedingungen O(n + k) bzw. O(nk) erreichen — schneller als die theoretische Untergrenze O(n log n) für vergleichsbasierte Verfahren.',
  },
]
