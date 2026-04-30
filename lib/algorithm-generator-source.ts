export const algorithmGeneratorSource: Record<string, string> = {
  'bubble-sort': `function* algorithmSteps(input) {
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  const makeStates = (j, state, sortedFrom) =>
    arr.map((_, idx) => {
      if (idx >= sortedFrom) return 'sorted';
      if (idx === j || idx === j + 1) return state;
      return 'default';
    });
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      yield { bars: [...arr], states: makeStates(j, 'comparing', n - i), description: 'Vergleiche Index ' + j + ' (' + arr[j] + ') und ' + (j+1) + ' (' + arr[j+1] + ')', comparisons, swaps };
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true; swaps++;
        yield { bars: [...arr], states: makeStates(j, 'swapping', n - i), description: 'Getauscht: ' + arr[j+1] + ' und ' + arr[j], comparisons, swaps };
      }
    }
    if (!swapped) break;
  }
  yield { bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array ist sortiert!', comparisons, swaps };
}`,

  'selection-sort': `function* algorithmSteps(input) {
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  const makeStates = (i, j, minIdx) =>
    arr.map((_, idx) => {
      if (idx < i) return 'sorted';
      if (idx === j) return 'comparing';
      if (idx === minIdx) return 'pivot';
      return 'default';
    });
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      comparisons++;
      yield { bars: [...arr], states: makeStates(i, j, minIdx), description: 'Suche Minimum: aktuell Index ' + minIdx + ' (' + arr[minIdx] + '), vergleiche mit Index ' + j + ' (' + arr[j] + ')', comparisons, swaps };
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]; swaps++;
      const states = arr.map((_, idx) => { if (idx < i) return 'sorted'; if (idx === i || idx === minIdx) return 'swapping'; return 'default'; });
      yield { bars: [...arr], states, description: 'Minimum ' + arr[i] + ' an Position ' + i + ' gesetzt', comparisons, swaps };
    }
  }
  yield { bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array ist sortiert!', comparisons, swaps };
}`,

  'insertion-sort': `function* algorithmSteps(input) {
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    yield { bars: [...arr], states: arr.map((_, idx) => (idx === i ? 'comparing' : idx < i ? 'sorted' : 'default')), description: 'Füge Element ' + key + ' von Index ' + i + ' ein', comparisons, swaps };
    while (j >= 0 && arr[j] > key) {
      comparisons++; arr[j + 1] = arr[j]; swaps++;
      yield { bars: [...arr], states: arr.map((_, idx) => { if (idx === j || idx === j + 1) return 'swapping'; if (idx < i) return 'sorted'; return 'default'; }), description: 'Verschiebe ' + arr[j] + ' nach rechts', comparisons, swaps };
      j--;
    }
    arr[j + 1] = key;
    yield { bars: [...arr], states: arr.map((_, idx) => (idx <= i ? 'sorted' : 'default')), description: key + ' an Position ' + (j+1) + ' eingesetzt', comparisons, swaps };
  }
  yield { bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array ist sortiert!', comparisons, swaps };
}`,

  'merge-sort': `function* algorithmSteps(input) {
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  const steps = [];
  function merge(arr, left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      const states = arr.map((_, idx) => { if (idx === left + i || idx === mid + 1 + j) return 'comparing'; if (idx >= left && idx <= right) return 'swapping'; return 'default'; });
      steps.push({ bars: [...arr], states, description: 'Zusammenführen: vergleiche ' + leftArr[i] + ' und ' + rightArr[j], comparisons, swaps });
      if (leftArr[i] <= rightArr[j]) { arr[k++] = leftArr[i++]; } else { arr[k++] = rightArr[j++]; swaps++; }
    }
    while (i < leftArr.length) { arr[k++] = leftArr[i++]; swaps++; }
    while (j < rightArr.length) { arr[k++] = rightArr[j++]; swaps++; }
    const states = arr.map((_, idx) => (idx >= left && idx <= right ? 'sorted' : 'default'));
    steps.push({ bars: [...arr], states, description: 'Bereich [' + left + '..' + right + '] zusammengeführt', comparisons, swaps });
  }
  function mergeSort(arr, left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSort(arr, left, mid); mergeSort(arr, mid + 1, right); merge(arr, left, mid, right);
  }
  mergeSort(arr, 0, n - 1);
  steps.push({ bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array ist sortiert!', comparisons, swaps });
  for (const step of steps) yield step;
}`,

  'quick-sort': `function* algorithmSteps(input) {
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  const steps = [];
  const sorted = new Set();
  function makeStates(pivotIdx, comparing, swapping) {
    return arr.map((_, idx) => { if (sorted.has(idx)) return 'sorted'; if (idx === pivotIdx) return 'pivot'; if (swapping.includes(idx)) return 'swapping'; if (comparing.includes(idx)) return 'comparing'; return 'default'; });
  }
  function partition(low, high) {
    const pivotIdx = high, pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      comparisons++;
      steps.push({ bars: [...arr], states: makeStates(pivotIdx, [j], []), description: 'Vergleiche ' + arr[j] + ' mit Pivot ' + pivot, comparisons, swaps });
      if (arr[j] <= pivot) {
        i++;
        if (i !== j) { [arr[i], arr[j]] = [arr[j], arr[i]]; swaps++; steps.push({ bars: [...arr], states: makeStates(pivotIdx, [], [i, j]), description: 'Getauscht: ' + arr[j] + ' und ' + arr[i], comparisons, swaps }); }
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; swaps++;
    sorted.add(i + 1);
    steps.push({ bars: [...arr], states: makeStates(-1, [], [i + 1, high]), description: 'Pivot ' + pivot + ' an seiner endgültigen Position ' + (i+1), comparisons, swaps });
    return i + 1;
  }
  function quickSort(low, high) {
    if (low < high) { const pi = partition(low, high); quickSort(low, pi - 1); quickSort(pi + 1, high); }
    else if (low === high) sorted.add(low);
  }
  quickSort(0, n - 1);
  steps.push({ bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array ist sortiert!', comparisons, swaps });
  for (const step of steps) yield step;
}`,

  'heap-sort': `function* algorithmSteps(input) {
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  const steps = [];
  let sortedFrom = n;
  function makeStates(highlights, state) {
    return arr.map((_, idx) => { if (idx >= sortedFrom) return 'sorted'; if (highlights.includes(idx)) return state; return 'default'; });
  }
  function heapify(size, i) {
    let largest = i;
    const left = 2 * i + 1, right = 2 * i + 2;
    if (left < size) { comparisons++; steps.push({ bars: [...arr], states: makeStates([i, left], 'comparing'), description: 'Vergleiche ' + arr[i] + ' mit linkem Kind ' + arr[left], comparisons, swaps }); if (arr[left] > arr[largest]) largest = left; }
    if (right < size) { comparisons++; steps.push({ bars: [...arr], states: makeStates([largest, right], 'comparing'), description: 'Vergleiche ' + arr[largest] + ' mit rechtem Kind ' + arr[right], comparisons, swaps }); if (arr[right] > arr[largest]) largest = right; }
    if (largest !== i) { [arr[i], arr[largest]] = [arr[largest], arr[i]]; swaps++; steps.push({ bars: [...arr], states: makeStates([i, largest], 'swapping'), description: arr[largest] + ' nach oben getauscht an Position ' + i, comparisons, swaps }); heapify(size, largest); }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  steps.push({ bars: [...arr], states: arr.map((_, idx) => (idx < n ? 'pivot' : 'sorted')), description: 'Max-Heap aufgebaut', comparisons, swaps });
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]]; swaps++; sortedFrom = i;
    steps.push({ bars: [...arr], states: makeStates([0, i], 'swapping'), description: 'Maximum ' + arr[i] + ' an Position ' + i + ' verschoben', comparisons, swaps });
    heapify(i, 0);
  }
  steps.push({ bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array ist sortiert!', comparisons, swaps });
  for (const step of steps) yield step;
}`,

  'shell-sort': `function* algorithmSteps(input) {
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  let gap = 1;
  while (gap < n / 3) gap = gap * 3 + 1;
  while (gap >= 1) {
    yield { bars: [...arr], states: arr.map(() => 'default'), description: 'Neuer Durchgang mit Lücke = ' + gap, comparisons, swaps };
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;
      yield { bars: [...arr], states: arr.map((_, idx) => (idx === i ? 'comparing' : 'default')), description: 'Füge ' + temp + ' an Index ' + i + ' ein (Lücke=' + gap + ')', comparisons, swaps };
      while (j >= gap && arr[j - gap] > temp) {
        comparisons++; arr[j] = arr[j - gap]; swaps++;
        yield { bars: [...arr], states: arr.map((_, idx) => (idx === j || idx === j - gap ? 'swapping' : 'default')), description: 'Verschiebe ' + arr[j - gap] + ' um Lücke ' + gap + ' nach rechts', comparisons, swaps };
        j -= gap;
      }
      arr[j] = temp;
    }
    gap = Math.floor(gap / 3);
  }
  yield { bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array ist sortiert!', comparisons, swaps };
}`,

  'counting-sort': `function* algorithmSteps(input) {
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  const max = Math.max(...arr), min = Math.min(...arr), range = max - min + 1;
  const count = new Array(range).fill(0);
  const output = new Array(n);
  for (let i = 0; i < n; i++) {
    count[arr[i] - min]++;
    yield { bars: [...arr], states: arr.map((_, idx) => (idx === i ? 'comparing' : 'default')), description: 'Zähle Wert ' + arr[i] + ': count[' + arr[i] + '] = ' + count[arr[i] - min], comparisons: ++comparisons, swaps };
  }
  for (let i = 1; i < range; i++) count[i] += count[i - 1];
  yield { bars: [...arr], states: arr.map(() => 'pivot'), description: 'Kumulative Zählungen berechnet — platziere Elemente', comparisons, swaps };
  for (let i = n - 1; i >= 0; i--) {
    const pos = --count[arr[i] - min];
    output[pos] = arr[i]; swaps++;
    yield { bars: output.map((v) => v ?? 0), states: output.map((v, idx) => { if (v === undefined) return 'default'; if (idx === pos) return 'swapping'; return 'sorted'; }), description: arr[i] + ' an Ausgabeposition ' + pos + ' gesetzt', comparisons, swaps };
  }
  for (let i = 0; i < n; i++) arr[i] = output[i];
  yield { bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array ist sortiert!', comparisons, swaps };
}`,

  'radix-sort': `function* algorithmSteps(input) {
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  const steps = [];
  function countingSortByDigit(exp) {
    const output = new Array(n);
    const count = new Array(10).fill(0);
    for (let i = 0; i < n; i++) count[Math.floor(arr[i] / exp) % 10]++;
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    steps.push({ bars: [...arr], states: arr.map(() => 'pivot'), description: 'Verarbeite Stelle (exp=' + exp + ')', comparisons, swaps });
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      const pos = --count[digit];
      output[pos] = arr[i]; swaps++;
      steps.push({ bars: output.map((v) => v ?? 0), states: output.map((v, idx) => { if (v === undefined) return 'default'; if (idx === pos) return 'swapping'; return 'sorted'; }), description: arr[i] + ' (Ziffer=' + digit + ') an Position ' + pos + ' gesetzt', comparisons, swaps });
    }
    for (let i = 0; i < n; i++) arr[i] = output[i];
    steps.push({ bars: [...arr], states: arr.map(() => 'comparing'), description: 'Durchgang abgeschlossen (exp=' + exp + ')', comparisons, swaps });
  }
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) countingSortByDigit(exp);
  steps.push({ bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array ist sortiert!', comparisons, swaps });
  for (const step of steps) yield step;
}`,

  'tim-sort': `function* algorithmSteps(input) {
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0, swaps = 0;
  const steps = [];
  const MIN_MERGE = 16;
  function makeStates(activeRange, highlights, state) {
    return arr.map((_, idx) => { if (highlights.includes(idx)) return state; if (idx >= activeRange[0] && idx <= activeRange[1]) return 'comparing'; return 'default'; });
  }
  function insertionSortRange(left, right) {
    for (let i = left + 1; i <= right; i++) {
      const key = arr[i]; let j = i - 1;
      steps.push({ bars: [...arr], states: makeStates([left, right], [i], 'comparing'), description: 'Insertion Sort: füge ' + key + ' in Run [' + left + '..' + right + '] ein', comparisons, swaps });
      while (j >= left && arr[j] > key) { arr[j + 1] = arr[j]; swaps++; comparisons++; steps.push({ bars: [...arr], states: makeStates([left, right], [j, j + 1], 'swapping'), description: 'Verschiebe ' + arr[j] + ' nach rechts', comparisons, swaps }); j--; }
      arr[j + 1] = key;
    }
  }
  function mergeRanges(l, m, r) {
    const leftArr = arr.slice(l, m + 1), rightArr = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    steps.push({ bars: [...arr], states: arr.map((_, idx) => (idx >= l && idx <= r ? 'pivot' : 'default')), description: 'Führe Runs [' + l + '..' + m + '] und [' + (m+1) + '..' + r + '] zusammen', comparisons, swaps });
    while (i < leftArr.length && j < rightArr.length) { comparisons++; if (leftArr[i] <= rightArr[j]) { arr[k++] = leftArr[i++]; } else { arr[k++] = rightArr[j++]; swaps++; } }
    while (i < leftArr.length) { arr[k++] = leftArr[i++]; swaps++; }
    while (j < rightArr.length) { arr[k++] = rightArr[j++]; swaps++; }
    steps.push({ bars: [...arr], states: arr.map((_, idx) => (idx >= l && idx <= r ? 'sorted' : 'default')), description: 'Run [' + l + '..' + r + '] zusammengeführt', comparisons, swaps });
  }
  for (let i = 0; i < n; i += MIN_MERGE) {
    const right = Math.min(i + MIN_MERGE - 1, n - 1);
    steps.push({ bars: [...arr], states: arr.map((_, idx) => (idx >= i && idx <= right ? 'pivot' : 'default')), description: 'Sortiere Run [' + i + '..' + right + '] mit Insertion Sort', comparisons, swaps });
    insertionSortRange(i, right);
  }
  for (let size = MIN_MERGE; size < n; size *= 2) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = Math.min(left + size - 1, n - 1), right = Math.min(left + 2 * size - 1, n - 1);
      if (mid < right) mergeRanges(left, mid, right);
    }
  }
  steps.push({ bars: [...arr], states: arr.map(() => 'sorted'), description: 'Array ist sortiert!', comparisons, swaps });
  for (const step of steps) yield step;
}`,
}

export const algorithmNames: Record<string, string> = {
  'bubble-sort': 'Bubble Sort',
  'selection-sort': 'Selection Sort',
  'insertion-sort': 'Insertion Sort',
  'merge-sort': 'Merge Sort',
  'quick-sort': 'Quick Sort',
  'heap-sort': 'Heap Sort',
  'shell-sort': 'Shell Sort',
  'counting-sort': 'Counting Sort',
  'radix-sort': 'Radix Sort',
  'tim-sort': 'Tim Sort',
}
