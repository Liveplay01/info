export interface AlgorithmMeta {
  slug: string
  name: string
  category: 'Comparison' | 'Non-Comparison' | 'Hybrid'
  shortDescription: string
  complexity: {
    best: string
    average: string
    worst: string
    space: string
  }
  stable: boolean
  inPlace: boolean
  explanation: string
  codeTS: string
}

export const algorithms: AlgorithmMeta[] = [
  {
    slug: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'Comparison',
    shortDescription: 'Vergleicht benachbarte Elemente wiederholt und tauscht sie bei falscher Reihenfolge — das größte unsortierte Element „blubbert" dabei pro Durchgang an seine endgültige Position.',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    stable: true,
    inPlace: true,
    explanation: `Bubble Sort ist der einfachste Sortieralgorithmus. Er funktioniert, indem er benachbarte Paare wiederholt vergleicht und sie bei falscher Reihenfolge tauscht. Nach jedem vollständigen Durchgang „blubbert" das größte unsortierte Element an seine korrekte Position am Ende. Eine optimierte Version prüft, ob ein Tausch stattgefunden hat — bleibt ein Durchgang tauschfrei, ist das Array bereits sortiert, was eine O(n)-Laufzeit im besten Fall ergibt.

**Wann verwenden:** In der Praxis fast nie — bei den meisten Eingaben ist die Laufzeit O(n²). Sein Hauptwert liegt im Lernbereich: Er ist leicht zu verstehen und zu visualisieren. Die einzige praktische Nische sind winzige Arrays (< 10 Elemente), wo der Overhead komplexerer Algorithmen ihren Vorteil überwiegt.`,
    codeTS: `function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // Bereits sortiert
  }
  return arr;
}`,
  },
  {
    slug: 'selection-sort',
    name: 'Selection Sort',
    category: 'Comparison',
    shortDescription: 'Findet das Minimum im unsortierten Bereich und platziert es am Anfang — der sortierte Bereich wächst so pro Durchgang um ein Element.',
    complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    stable: false,
    inPlace: true,
    explanation: `Selection Sort teilt das Array in einen sortierten und einen unsortierten Bereich. In jedem Durchgang durchsucht er den gesamten unsortierten Bereich nach dem Minimum und tauscht es an die erste Position des unsortierten Bereichs. Der sortierte Bereich wächst um ein Element pro Durchgang.

**Besondere Eigenschaft:** Selection Sort führt höchstens O(n) Tauschoperationen durch — nützlich, wenn das Verschieben von Elementen teuer ist (z. B. große Objekte im Speicher). Allerdings sind immer O(n²) Vergleiche nötig, unabhängig von der Eingabe.

**Wann verwenden:** Wenn die Kosten für Schreiboperationen deutlich höher sind als für Leseoperationen, und das Array klein ist. Da der Algorithmus nicht stabil ist (gleiche Elemente können ihre Reihenfolge verlieren), ist er in vielen Kontexten ungeeignet.`,
    codeTS: `function selectionSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,
  },
  {
    slug: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'Comparison',
    shortDescription: 'Baut das sortierte Array Element für Element auf, indem jedes neue Element an der richtigen Position unter den bereits sortierten Elementen eingefügt wird.',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    stable: true,
    inPlace: true,
    explanation: `Insertion Sort ist vergleichbar mit dem Sortieren von Spielkarten in der Hand. Eine Karte nach der anderen wird aufgenommen und nach links an die richtige Position zwischen den bereits sortierten Karten geschoben. Die linke Seite ist stets sortiert; sie wächst pro Schritt um ein Element.

**Warum er wichtig ist:** Insertion Sort ist bei nahezu sortierten Daten extrem schnell (O(n) Vergleiche), adaptiv (die Leistung verbessert sich mit vorhandener Ordnung) und hat sehr geringen Overhead. Deshalb wird er für kleine Arrays bevorzugt — TimSort (verwendet in Python und Java) nutzt ihn für Teilarrays unterhalb einer Schwelle (~32–64 Elemente).

**Wann verwenden:** Kleine Arrays (< 20 Elemente), nahezu sortierte Eingaben oder als Basisfall in hybriden Algorithmen.`,
    codeTS: `function insertionSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
  },
  {
    slug: 'merge-sort',
    name: 'Merge Sort',
    category: 'Comparison',
    shortDescription: 'Teilt das Array rekursiv in Hälften, bis einzelne Elemente übrig sind, und fügt sortierte Hälften wieder zusammen — garantiert O(n log n).',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    stable: true,
    inPlace: false,
    explanation: `Merge Sort ist ein klassischer Teile-und-Herrsche-Algorithmus. Er teilt das Array rekursiv in Hälften, bis jedes Teilarray nur noch ein Element enthält (was trivialerweise sortiert ist), und fügt dann benachbarte sortierte Teilarrays zusammen. Der Zusammenführungsschritt ist der Schlüssel: Er verschmilzt zwei sortierte Sequenzen in O(n) Zeit zu einer sortierten Sequenz.

**Garantien:** Im Gegensatz zu QuickSort ist der schlechteste Fall von Merge Sort immer O(n log n) — er degradiert bei keiner Eingabe. Er ist außerdem stabil (gleiche Elemente behalten ihre ursprüngliche Reihenfolge).

**Nachteil:** Er benötigt O(n) zusätzlichen Speicher für den temporären Merge-Puffer.

**Wann verwenden:** Wenn garantiertes O(n log n), Stabilität oder das Sortieren von verketteten Listen gefragt ist. Wird in Javas Arrays.sort für Objekte eingesetzt.`,
    codeTS: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
  },
  {
    slug: 'quick-sort',
    name: 'Quick Sort',
    category: 'Comparison',
    shortDescription: 'Wählt einen Pivot, partitioniert das Array in Elemente kleiner und größer als der Pivot und sortiert jede Partition rekursiv.',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    stable: false,
    inPlace: true,
    explanation: `QuickSort ist der meistgenutzte Allzweck-Sortieralgorithmus. Er wählt ein „Pivot"-Element und ordnet das Array so um, dass alle kleineren Elemente vor dem Pivot stehen und alle größeren danach. Anschließend wird dieses Partitionierungsverfahren rekursiv auf jede Seite angewendet.

**Pivot-Auswahl ist entscheidend:** Naive Implementierungen, die das erste oder letzte Element als Pivot nehmen, degradieren bei bereits sortierten Arrays auf O(n²). Produktive Implementierungen verwenden Median-of-Three oder zufällige Pivot-Auswahl.

**In-Place:** Im Gegensatz zu Merge Sort partitioniert QuickSort direkt im Array mit nur O(log n) Stack-Speicher für die rekursiven Aufrufe.

**Wann verwenden:** Allgemeines Sortieren, bei dem die durchschnittliche Laufzeit entscheidend ist. In der Praxis der schnellste Algorithmus für zufällige Daten durch ausgezeichnetes Cache-Verhalten. Wird in C's qsort und V8's JavaScript-Engine verwendet.`,
    codeTS: `function quickSort(arr: number[], low = 0, high = arr.length - 1): number[] {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr: number[], low: number, high: number): number {
  // Median-of-Three Pivot-Auswahl
  const mid = Math.floor((low + high) / 2);
  if (arr[mid] < arr[low]) [arr[low], arr[mid]] = [arr[mid], arr[low]];
  if (arr[high] < arr[low]) [arr[low], arr[high]] = [arr[high], arr[low]];
  if (arr[mid] < arr[high]) [arr[mid], arr[high]] = [arr[high], arr[mid]];
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
  },
  {
    slug: 'heap-sort',
    name: 'Heap Sort',
    category: 'Comparison',
    shortDescription: 'Baut einen Max-Heap auf und extrahiert wiederholt das Maximum — erzeugt so eine sortierte Sequenz direkt im Array.',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
    stable: false,
    inPlace: true,
    explanation: `Heap Sort nutzt die binäre Heap-Datenstruktur. Zuerst wird das Array mithilfe von Floyds Heapify-Verfahren in O(n) in einen Max-Heap umgewandelt (jedes Elternelement ist größer als seine Kinder). Dann wird wiederholt die Wurzel (das Maximum) mit dem letzten unsortierten Element getauscht, die Heap-Grenze um eins verkleinert und die Heap-Eigenschaft wiederhergestellt.

**Vorteile:** Garantiertes O(n log n) im schlechtesten Fall bei O(1) Hilfsspeicher — der einzige Vergleichssortierer mit beiden Eigenschaften gleichzeitig.

**Nachteile:** Schlechtes Cache-Verhalten (Sift-Down greift nicht-sequentiell auf den Speicher zu), und nicht stabil.

**Wann verwenden:** Wenn garantiertes O(n log n) ohne zusätzlichen Speicher benötigt wird. Wird auch in Introselect verwendet (der Algorithmus hinter C++'s nth_element).`,
    codeTS: `function heapSort(arr: number[]): number[] {
  const n = arr.length;
  // Max-Heap aufbauen
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  // Elemente aus dem Heap extrahieren
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr: number[], n: number, i: number): void {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
  },
  {
    slug: 'shell-sort',
    name: 'Shell Sort',
    category: 'Comparison',
    shortDescription: 'Eine verbesserte Variante des Insertion Sort, die zuerst weit auseinanderliegende Elemente sortiert und den Abstand schrittweise reduziert bis zum finalen Insertion-Sort-Durchgang.',
    complexity: { best: 'O(n log n)', average: 'O(n log² n)', worst: 'O(n²)', space: 'O(1)' },
    stable: false,
    inPlace: true,
    explanation: `Shell Sort ist eine Verallgemeinerung des Insertion Sort. Er führt das Konzept einer „Lückenfolge" ein: Statt benachbarte Elemente zu vergleichen, vergleicht er Elemente mit einem definierten Abstand (Gap). Der Gap beginnt groß (ca. n/2) und schrumpft pro Durchgang (typischerweise nach Knuths Folge: 1, 4, 13, 40, 121 ...), bis der letzte Durchgang ein normaler Insertion Sort (Gap = 1) ist.

**Warum es funktioniert:** Insertion Sort verschiebt Elemente nur eine Position auf einmal. Shell Sorts große Anfangslücken lassen Elemente weite Strecken in einem Schritt zurücklegen — so ist das Array beim letzten Durchgang bereits nahezu sortiert.

**Lückenfolge ist entscheidend:** Knuths Folge (unten verwendet) ergibt O(n^1.5) in der Praxis. Ciuras Folge (1, 4, 10, 23, 57, 132, 301, 701) ist empirisch optimal.

**Wann verwenden:** Eingebettete Systeme mit begrenztem Speicher und ohne Bedarf an Worst-Case-Garantien.`,
    codeTS: `function shellSort(arr: number[]): number[] {
  const n = arr.length;
  // Knuths Lückenfolge: 1, 4, 13, 40, 121, ...
  let gap = 1;
  while (gap < n / 3) gap = gap * 3 + 1;

  while (gap >= 1) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
    gap = Math.floor(gap / 3);
  }
  return arr;
}`,
  },
  {
    slug: 'counting-sort',
    name: 'Counting Sort',
    category: 'Non-Comparison',
    shortDescription: 'Zählt das Vorkommen jedes Wertes und rekonstruiert daraus das sortierte Array — lineare Laufzeit, aber auf Integer-Schlüssel in einem begrenzten Bereich beschränkt.',
    complexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)', space: 'O(k)' },
    stable: true,
    inPlace: false,
    explanation: `Counting Sort durchbricht die O(n log n)-Schranke vergleichsbasierter Sortierung, indem er Elemente gar nicht vergleicht. Er zählt, wie oft jeder ganzzahlige Wert in der Eingabe vorkommt, akkumuliert diese Zählungen zu Positionen und platziert jedes Element direkt an seine korrekte Ausgabeposition.

**k = Wertebereich der Eingabe.** Bei n Elementen im Bereich 0 bis k läuft der Algorithmus in O(n + k) Zeit und O(k) Speicher. Wenn k = O(n) ist, ergibt sich eine lineare Laufzeit.

**Stabilität:** Durch rückwärts iterierte Ausgabebefüllung behalten gleiche Elemente ihre ursprüngliche Reihenfolge — wichtig, wenn er als Unterroutine in Radix Sort eingesetzt wird.

**Wann verwenden:** Sortieren von Ganzzahlen in einem bekannten, begrenzten Bereich. Klassische Anwendung: Noten (0–100), Alterswerte (0–150) oder als innere Schleife von Radix Sort. Ungeeignet, wenn k >> n ist.`,
    codeTS: `function countingSort(arr: number[]): number[] {
  if (arr.length === 0) return arr;
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  const output = new Array(arr.length);

  // Vorkommen zählen
  for (const val of arr) count[val - min]++;

  // Kumulative Zählungen (Positionen)
  for (let i = 1; i < range; i++) count[i] += count[i - 1];

  // Ausgabe rückwärts aufbauen (für Stabilität)
  for (let i = arr.length - 1; i >= 0; i--) {
    output[--count[arr[i] - min]] = arr[i];
  }
  return output;
}`,
  },
  {
    slug: 'radix-sort',
    name: 'Radix Sort',
    category: 'Non-Comparison',
    shortDescription: 'Sortiert Ganzzahlen stelle für stelle von der niedrigsten zur höchsten Stelle — nutzt an jeder Stelle einen stabilen Algorithmus (Counting Sort).',
    complexity: { best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)', space: 'O(n + k)' },
    stable: true,
    inPlace: false,
    explanation: `Radix Sort verarbeitet Zahlen stelle für stelle statt vollständige Werte zu vergleichen. Beginnend bei der niedrigstwertigen Stelle (LSD-Variante) gruppiert er Elemente nach dieser Stelle mit einem stabilen Sortierverfahren (Counting Sort) und wiederholt dies für jede höhere Stelle. Nach der Verarbeitung aller d Stellen ist das Array vollständig sortiert.

**Warum LSD funktioniert:** Da Counting Sort stabil ist, bewahren gleiche Ziffern an der aktuellen Stelle ihre relative Reihenfolge aus dem vorherigen Durchgang. Über alle Durchgänge hinweg entsteht so die korrekte Gesamtordnung.

**Komplexität:** O(nk), wobei k die Anzahl der Stellen ist (log₁₀(max)). Für 32-Bit-Ganzzahlen in Basis 256 (4 Durchgänge) ist dies effektiv O(4n) = O(n).

**Wann verwenden:** Große Arrays von Ganzzahlen oder gleichlangen Zeichenketten, wenn die Schlüssellänge k klein relativ zu n ist. Wird beim Aufbau von Suffix-Arrays und in manchen Datenbanksystemen eingesetzt.`,
    codeTS: `function radixSort(arr: number[]): number[] {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp);
  }
  return arr;
}

function countingSortByDigit(arr: number[], exp: number): void {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);

  for (let i = 0; i < n; i++) count[Math.floor(arr[i] / exp) % 10]++;
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[--count[digit]] = arr[i];
  }
  for (let i = 0; i < n; i++) arr[i] = output[i];
}`,
  },
  {
    slug: 'tim-sort',
    name: 'Tim Sort',
    category: 'Hybrid',
    shortDescription: 'Ein Hybrid aus Merge Sort und Insertion Sort, der natürliche Runs in realen Daten ausnutzt — der Algorithmus, der in Python und Java zum Einsatz kommt.',
    complexity: { best: 'O(n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    stable: true,
    inPlace: false,
    explanation: `TimSort wurde 2002 von Tim Peters für Pythons list.sort() entwickelt und wird heute auch in Java (Arrays.sort für Objekte), Android und Swift verwendet. Es handelt sich um einen sorgfältig optimierten Hybridalgorithmus für reale Daten.

**Funktionsweise:** (1) Die Eingabe wird nach „Runs" durchsucht — natürlich aufsteigende oder absteigende Sequenzen. Absteigende Runs werden umgekehrt. Zu kurze Runs werden bis zu einer Mindestgröße (minrun, typischerweise 32–64) per Insertion Sort verlängert. (2) Ein Stack von Runs wird verwaltet; benachbarte Runs werden per Merge-Sort-Schritt zusammengeführt, wobei Invarianten den Stack ausbalanciert halten.

**Warum er in der Praxis überlegen ist:** Reale Daten sind selten zufällig — sie enthalten häufig teilweise sortierte Bereiche. TimSort nutzt diese Runs, um Vergleiche drastisch zu reduzieren, und erreicht bei bereits sortierten Eingaben O(n).

**Hinweis:** Die unten gezeigte Implementierung ist eine vereinfachte Lehrversion. Der vollständige Produktions-TimSort enthält weitere Optimierungen wie Galloping-Modus und präzise Minrun-Berechnung.`,
    codeTS: `const MIN_MERGE = 32;

function timSort(arr: number[]): number[] {
  const n = arr.length;

  // Teilarrays der Größe MIN_MERGE per Insertion Sort sortieren
  for (let i = 0; i < n; i += MIN_MERGE) {
    insertionSortRange(arr, i, Math.min(i + MIN_MERGE - 1, n - 1));
  }

  // Sortierte Teilarrays schrittweise zusammenführen
  for (let size = MIN_MERGE; size < n; size *= 2) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = Math.min(left + size - 1, n - 1);
      const right = Math.min(left + 2 * size - 1, n - 1);
      if (mid < right) mergeRanges(arr, left, mid, right);
    }
  }
  return arr;
}

function insertionSortRange(arr: number[], left: number, right: number): void {
  for (let i = left + 1; i <= right; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= left && arr[j] > key) { arr[j + 1] = arr[j]; j--; }
    arr[j + 1] = key;
  }
}

function mergeRanges(arr: number[], l: number, m: number, r: number): void {
  const left = arr.slice(l, m + 1);
  const right = arr.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;
  while (i < left.length && j < right.length)
    arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
  while (i < left.length) arr[k++] = left[i++];
  while (j < right.length) arr[k++] = right[j++];
}`,
  },
]
