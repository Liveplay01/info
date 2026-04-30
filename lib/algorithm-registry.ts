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
    shortDescription: 'Repeatedly swaps adjacent elements that are out of order, bubbling the largest unsorted element to its final position each pass.',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    stable: true,
    inPlace: true,
    explanation: `Bubble Sort is the simplest sorting algorithm. It works by repeatedly comparing adjacent pairs and swapping them if they are in the wrong order. After each full pass, the largest unsorted element "bubbles up" to its correct position at the end. An optimized version tracks whether any swap occurred; if a pass completes without a swap, the array is already sorted, giving O(n) best-case performance.

**When to use:** Almost never in production — it is O(n²) in most cases. Its primary value is educational: it is easy to visualize and reason about. The only practical niche is tiny arrays (< 10 elements) where the overhead of more complex algorithms exceeds their benefit.`,
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
    if (!swapped) break; // Already sorted
  }
  return arr;
}`,
  },
  {
    slug: 'selection-sort',
    name: 'Selection Sort',
    category: 'Comparison',
    shortDescription: 'Finds the minimum element from the unsorted portion and places it at the beginning, growing the sorted portion one element at a time.',
    complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    stable: false,
    inPlace: true,
    explanation: `Selection Sort divides the array into a sorted and unsorted region. On each pass, it scans the entire unsorted region to find the minimum element, then swaps it into the first position of the unsorted region. The sorted region grows by one element per pass.

**Key property:** Selection Sort makes at most O(n) swaps — useful when swap cost is high (e.g., large objects in memory). However, it is always O(n²) comparisons regardless of the input, unlike Bubble Sort which can exit early.

**When to use:** When the cost of writes/swaps is significantly higher than reads, and the array is small. It is also not stable by default (equal elements may be reordered), which is a disadvantage in many contexts.`,
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
    shortDescription: 'Builds the sorted array one element at a time by inserting each new element into its correct position among the already-sorted elements.',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    stable: true,
    inPlace: true,
    explanation: `Insertion Sort is analogous to sorting playing cards in your hand. You pick up one card at a time and slide it leftward into its correct position among the cards already sorted. The left portion is always sorted; you expand it by one element per step.

**Why it matters:** Insertion Sort is exceptionally fast on nearly-sorted data (O(n) comparisons), adaptive (performance improves with existing order), and has very low overhead. This makes it the algorithm of choice for small arrays — which is why TimSort (used in Python and Java) uses Insertion Sort for sub-arrays below a threshold (~32–64 elements).

**When to use:** Small arrays (< 20 elements), nearly-sorted input, or as the base case in hybrid algorithms.`,
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
    shortDescription: 'Divides the array in half recursively until single elements remain, then merges sorted halves back together — guaranteed O(n log n).',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    stable: true,
    inPlace: false,
    explanation: `Merge Sort is a classic divide-and-conquer algorithm. It recursively splits the array into halves until each sub-array has one element (which is trivially sorted), then merges adjacent sorted sub-arrays. The merge step is the key: it interleaves two sorted sequences into one sorted sequence in O(n) time.

**Guarantees:** Unlike QuickSort, Merge Sort's worst case is still O(n log n) — it does not degrade on adversarial input. It is also stable (equal elements preserve their original order).

**Tradeoff:** It requires O(n) auxiliary space for the temporary merge buffer, unlike in-place algorithms.

**When to use:** When you need guaranteed O(n log n), when stability matters, or when sorting linked lists (where it can be done in O(1) space). Used in Java's Arrays.sort for objects.`,
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
    shortDescription: 'Selects a pivot, partitions the array into elements less than and greater than the pivot, then recursively sorts each partition.',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    stable: false,
    inPlace: true,
    explanation: `QuickSort is the most widely used general-purpose sorting algorithm. It selects a "pivot" element, then rearranges the array so all elements smaller than the pivot come before it, and all larger elements come after. It recursively applies this partitioning to each side.

**Pivot selection matters:** Naive implementations using the first or last element as pivot degrade to O(n²) on already-sorted arrays. Production implementations use median-of-three or random pivot selection to avoid this.

**In-place:** Unlike Merge Sort, QuickSort partitions in-place with only O(log n) stack space for the recursive calls.

**When to use:** General-purpose sorting where average-case performance matters. It is the fastest in practice for most random data due to excellent cache behavior. Used in C's qsort, JavaScript's V8 engine for primitives.`,
    codeTS: `function quickSort(arr: number[], low = 0, high = arr.length - 1): number[] {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr: number[], low: number, high: number): number {
  // Median-of-three pivot selection
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
    shortDescription: 'Builds a max-heap from the array, then repeatedly extracts the maximum element to produce a sorted sequence in-place.',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
    stable: false,
    inPlace: true,
    explanation: `Heap Sort uses the binary heap data structure. It first transforms the array into a max-heap (where every parent is larger than its children) using Floyd's heapification in O(n) time. Then it repeatedly swaps the root (maximum element) with the last unsorted element, shrinks the heap boundary by one, and restores the heap property.

**Advantages:** Guaranteed O(n log n) worst-case with O(1) auxiliary space — the only comparison sort with both properties.

**Disadvantages:** Poor cache performance (sift-down accesses memory non-sequentially), and not stable.

**When to use:** When you need guaranteed O(n log n) and cannot use O(n) extra memory. Also used in introselect (the algorithm behind C++'s nth_element).`,
    codeTS: `function heapSort(arr: number[]): number[] {
  const n = arr.length;
  // Build max-heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  // Extract elements from heap one by one
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
    shortDescription: 'An improved insertion sort that first sorts elements far apart, then progressively reduces the gap until a final pass of standard insertion sort.',
    complexity: { best: 'O(n log n)', average: 'O(n log² n)', worst: 'O(n²)', space: 'O(1)' },
    stable: false,
    inPlace: true,
    explanation: `Shell Sort is a generalization of Insertion Sort. It introduces the concept of a "gap sequence": instead of comparing adjacent elements, it compares elements separated by a gap. The gap starts large (roughly n/2) and shrinks each pass (typically following Knuth's sequence: 1, 4, 13, 40, 121...), until the final pass is standard Insertion Sort (gap = 1).

**Why it works:** Insertion Sort moves elements only one position at a time. Shell Sort's large initial gaps let elements travel far in one pass, so the array is nearly sorted by the time the gap reaches 1.

**Gap sequences matter:** Knuth's sequence (used below) gives O(n^1.5) practical performance. Ciura's sequence (1, 4, 10, 23, 57, 132, 301, 701) is empirically optimal.

**When to use:** Embedded systems with limited memory and no need for worst-case guarantees.`,
    codeTS: `function shellSort(arr: number[]): number[] {
  const n = arr.length;
  // Knuth's gap sequence: 1, 4, 13, 40, 121, ...
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
    shortDescription: 'Counts occurrences of each distinct value, then reconstructs the sorted array — linear time but limited to integer keys in a bounded range.',
    complexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)', space: 'O(k)' },
    stable: true,
    inPlace: false,
    explanation: `Counting Sort breaks the O(n log n) comparison-sort barrier by not comparing elements. It counts how many times each integer value appears in the input, accumulates those counts to get positions, then places each element directly into its correct output position.

**k = range of input values.** If the input has n elements ranging from 0 to k, the algorithm runs in O(n + k) time and O(k) space. When k = O(n), this is linear.

**Stability:** By iterating the output reconstruction backwards, equal elements preserve their original relative order — essential when used as a subroutine inside Radix Sort.

**When to use:** Sorting integers in a known, bounded range. Classic use: sorting exam scores (0–100), ages (0–150), or as the inner loop of Radix Sort. Breaks down when k >> n.`,
    codeTS: `function countingSort(arr: number[]): number[] {
  if (arr.length === 0) return arr;
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  const output = new Array(arr.length);

  // Count occurrences
  for (const val of arr) count[val - min]++;

  // Cumulative count (positions)
  for (let i = 1; i < range; i++) count[i] += count[i - 1];

  // Build output (backwards for stability)
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
    shortDescription: 'Sorts integers digit by digit from least significant to most significant, using a stable sort (Counting Sort) at each digit position.',
    complexity: { best: 'O(nk)', average: 'O(nk)', worst: 'O(nk)', space: 'O(n + k)' },
    stable: true,
    inPlace: false,
    explanation: `Radix Sort processes numbers digit by digit rather than comparing full values. Starting from the least significant digit (LSD variant), it groups elements by that digit using a stable sort (Counting Sort), then repeats for each more significant digit. After processing all d digits, the array is fully sorted.

**Why LSD works:** Because Counting Sort is stable, equal digits at the current position preserve their relative order from the previous pass. Over all passes, this builds the correct full ordering.

**Complexity:** O(nk) where k is the number of digits (log₁₀(max)). For 32-bit integers processed in base 256 (4 passes), this is effectively O(4n) = O(n).

**When to use:** Large arrays of integers or fixed-length strings where the key length k is small relative to n. Used in suffix array construction and some database systems.`,
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
    shortDescription: 'A hybrid of Merge Sort and Insertion Sort that exploits natural runs in real-world data — the algorithm used in Python and Java.',
    complexity: { best: 'O(n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    stable: true,
    inPlace: false,
    explanation: `TimSort was designed by Tim Peters in 2002 for Python's list.sort() and is now also used in Java (Arrays.sort for objects), Android, and Swift. It is a carefully engineered hybrid optimized for real-world data.

**How it works:** (1) Scan the input for "runs" — naturally ascending or descending sequences. Extend short runs to a minimum size (minrun, typically 32–64) using Insertion Sort. (2) Maintain a stack of runs and merge adjacent runs using Merge Sort's merge step, following invariants that keep the stack balanced.

**Why it wins in practice:** Real-world data is rarely random — it often has partially sorted regions. TimSort exploits these "runs" to reduce comparisons dramatically, achieving O(n) on already-sorted input.

**Note:** The implementation below is an educational simplified version. The full production TimSort includes additional optimizations like galloping mode and precise minrun calculation.`,
    codeTS: `const MIN_MERGE = 32;

function timSort(arr: number[]): number[] {
  const n = arr.length;

  // Sort subarrays of size MIN_MERGE using insertion sort
  for (let i = 0; i < n; i += MIN_MERGE) {
    insertionSortRange(arr, i, Math.min(i + MIN_MERGE - 1, n - 1));
  }

  // Merge sorted subarrays bottom-up
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
