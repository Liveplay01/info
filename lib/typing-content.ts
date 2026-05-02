export type TypingMode = 'words' | 'sentences' | 'programming'
export type TypingLang = 'de' | 'en'

export const wordsDE: string[] = [
  'die', 'das', 'der', 'und', 'ist', 'ich', 'mit', 'hat', 'ein', 'sie',
  'sein', 'haben', 'werden', 'können', 'müssen', 'sagen', 'gehen', 'machen',
  'kommen', 'sehen', 'wissen', 'denken', 'geben', 'nehmen', 'zeigen',
  'Zeit', 'Jahr', 'Mann', 'Frau', 'Kind', 'Haus', 'Welt', 'Hand', 'Weg',
  'Tag', 'Wort', 'Mensch', 'Land', 'Seite', 'Arbeit', 'Stadt', 'Teil',
  'Schule', 'Buch', 'Leben', 'Nacht', 'groß', 'klein', 'gut', 'neu',
  'lang', 'kurz', 'noch', 'auch', 'schon', 'sehr', 'hier', 'dann',
  'mehr', 'immer', 'aber', 'oder', 'wenn', 'weil', 'dass', 'nach',
  'über', 'unter', 'wieder', 'durch', 'schreiben', 'lesen', 'lernen',
]

export const wordsEN: string[] = [
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her',
  'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how',
  'have', 'this', 'will', 'your', 'from', 'they', 'know', 'want', 'been',
  'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just',
  'work', 'life', 'back', 'give', 'most', 'long', 'down', 'high', 'look',
  'make', 'name', 'them', 'well', 'also', 'than', 'many', 'more',
  'about', 'other', 'into', 'think', 'should', 'could', 'write', 'after',
  'world', 'still', 'never', 'every', 'place', 'right', 'great', 'again',
]

export const sentencesDE: string[] = [
  'Die Sonne scheint hell und wärmt die Erde.',
  'Heute Morgen habe ich Kaffee getrunken und eine Zeitung gelesen.',
  'Das Wasser im See ist klar und kalt.',
  'Sie lernte jeden Tag neue Wörter in der Schule.',
  'Der Hund rennt schnell durch den Park.',
  'Im Winter schneit es oft und die Straßen werden glatt.',
  'Er schreibt einen langen Brief an seine Familie.',
  'Die Kinder spielen draußen im Garten.',
  'Mit Übung wird man besser in allem was man tut.',
  'Jedes Buch öffnet eine neue Welt voller Möglichkeiten.',
  'Der Zug fährt pünktlich um acht Uhr ab.',
  'Sie hat ihr ganzes Leben dem Lernen gewidmet.',
]

export const sentencesEN: string[] = [
  'The quick brown fox jumps over the lazy dog.',
  'She sells seashells by the seashore every morning.',
  'Learning to type fast takes practice and patience.',
  'The sun rises in the east and sets in the west.',
  'A good programmer writes clean and readable code.',
  'He read the book from cover to cover in one day.',
  'The mountains are beautiful in autumn when leaves change color.',
  'Every journey of a thousand miles begins with a single step.',
  'She opened the window and let the fresh air inside.',
  'The rain fell softly on the empty streets at night.',
  'Practice makes perfect when you dedicate time each day.',
  'The library was full of students preparing for exams.',
]

export const programmingTerms: string[] = [
  'function', 'return', 'const', 'let', 'var', 'class', 'extends',
  'import', 'export', 'default', 'async', 'await', 'typeof', 'instanceof',
  'array', 'object', 'string', 'boolean', 'number', 'null', 'undefined',
  'callback', 'promise', 'interface', 'generic', 'abstract', 'readonly',
  'useState', 'useEffect', 'useRef', 'useCallback', 'component',
  'algorithm', 'recursion', 'iteration', 'complexity', 'refactor',
  'commit', 'branch', 'merge', 'deploy', 'runtime', 'compile',
]

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateTargetText(mode: TypingMode, lang: TypingLang): string {
  if (mode === 'words') {
    const list = lang === 'de' ? wordsDE : wordsEN
    return shuffle(list).slice(0, 30).join(' ')
  }
  if (mode === 'sentences') {
    const list = lang === 'de' ? sentencesDE : sentencesEN
    const shuffled = shuffle(list)
    return shuffled.slice(0, 3).join(' ')
  }
  // programming — language-neutral
  return shuffle(programmingTerms).slice(0, 25).join(' ')
}
