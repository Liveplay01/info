export interface ArrayTypeMeta {
  slug: string
  javaType: string
  name: string
  category: 'Primitiv' | 'Referenz' | 'Mehrdimensional'
  defaultValue: string
  minValue?: string
  maxValue?: string
  bits?: number
  shortDescription: string
  visualExample: (string | number | boolean | null)[]
  declaration: string
  initialization: string
  operations: string
  explanation: string
}

export const arrayTypes: ArrayTypeMeta[] = [
  {
    slug: 'int',
    javaType: 'int[]',
    name: 'Integer-Array',
    category: 'Primitiv',
    defaultValue: '0',
    minValue: '-2.147.483.648',
    maxValue: '2.147.483.647',
    bits: 32,
    shortDescription: 'Speichert ganze 32-Bit-Zahlen ohne Dezimalstellen. Der am häufigsten verwendete numerische Arraytyp in Java.',
    visualExample: [42, 7, -3, 100, 0],
    declaration: `// Deklaration (Standardwerte: 0)
int[] zahlen = new int[5];

// Deklaration mit direkter Größenangabe
int[] primes = new int[10];`,
    initialization: `// Initialisierung mit Literalen
int[] zahlen = {42, 7, -3, 100, 0};

// Initialisierung mit new-Operator
int[] zahlen = new int[]{42, 7, -3, 100, 0};

// Mehrstufige Initialisierung
int[] zahlen = new int[5];
zahlen[0] = 42;
zahlen[1] = 7;`,
    operations: `int[] arr = {42, 7, -3, 100, 0};

// Zugriff auf Element (Index beginnt bei 0)
int ersteZahl = arr[0];        // 42
int letzteZahl = arr[arr.length - 1]; // 0

// Element ändern
arr[2] = 99;                   // arr = {42, 7, 99, 100, 0}

// Länge des Arrays
int laenge = arr.length;       // 5

// Mit for-Schleife iterieren
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}

// Mit for-each iterieren (lesend)
for (int zahl : arr) {
    System.out.println(zahl);
}

// Array sortieren (Arrays.sort)
import java.util.Arrays;
Arrays.sort(arr);              // {-3, 0, 7, 42, 100}

// Array ausgeben
System.out.println(Arrays.toString(arr)); // [-3, 0, 7, 42, 100]`,
    explanation: `**int[]** ist der grundlegendste und am häufigsten verwendete Array-Typ in Java. Er speichert ganze Zahlen (Integer) mit 32 Bit Speicher pro Element. Der Wertebereich reicht von -2.147.483.648 bis 2.147.483.647, was für die meisten praktischen Anwendungen vollkommen ausreicht.

**Standardwert:** Jedes Element eines neu erstellten int-Arrays wird automatisch mit 0 initialisiert. Du musst also nicht jedes Feld manuell auf 0 setzen — Java erledigt das für dich.

**Speicherlayout:** Ein int[]-Array speichert seine Werte direkt hintereinander im Speicher (zusammenhängend). Das macht den Zugriff mit arr[i] extrem schnell — O(1) — da Java die Speicheradresse direkt berechnen kann: Basisadresse + i × 4 Bytes.

**Typische Anwendungsfälle:** Zähler, Messwerte, Indexlisten, Ergebnisse von Berechnungen, Histogramme, und überall dort, wo keine Dezimalstellen benötigt werden. Für sehr große ganze Zahlen (über ~2 Milliarden) nimm stattdessen **long[]**.`,
  },
  {
    slug: 'double',
    javaType: 'double[]',
    name: 'Double-Array',
    category: 'Primitiv',
    defaultValue: '0.0',
    minValue: '±4.9 × 10⁻³²⁴',
    maxValue: '±1.8 × 10³⁰⁸',
    bits: 64,
    shortDescription: 'Speichert 64-Bit Gleitkommazahlen (IEEE 754). Standard für wissenschaftliche Berechnungen und Messungen mit Dezimalstellen.',
    visualExample: [3.14, 2.71, -0.5, 9.81, 0.0],
    declaration: `// Deklaration (Standardwerte: 0.0)
double[] messwerte = new double[5];

// Wissenschaftliche Notation möglich
double[] sehr_gross = new double[3];`,
    initialization: `// Initialisierung mit Literalen
double[] messwerte = {3.14, 2.71, -0.5, 9.81, 0.0};

// double-Literal: explizites 'd' (optional)
double[] werte = {1.0d, 2.5d, 3.14d};

// Wissenschaftliche Notation
double[] exp = {1.5e10, 2.3e-4, 6.02e23};`,
    operations: `double[] arr = {3.14, 2.71, -0.5, 9.81, 0.0};

// Zugriff
double pi = arr[0];            // 3.14

// Berechnung
double summe = 0;
for (double wert : arr) {
    summe += wert;             // 15.06
}

// Achtung: Gleitkomma-Vergleich!
// Niemals: arr[0] == 3.14  (unzuverlässig!)
// Stattdessen:
double epsilon = 1e-9;
if (Math.abs(arr[0] - 3.14) < epsilon) { ... }

// Mathematische Operationen
double wurzel = Math.sqrt(arr[3]); // √9.81 ≈ 3.132
double gerundet = Math.round(arr[0] * 100.0) / 100.0;

import java.util.Arrays;
Arrays.sort(arr);
System.out.println(Arrays.toString(arr));`,
    explanation: `**double[]** ist der Standard-Gleitkomma-Array in Java. Jedes Element belegt 64 Bit (8 Byte) und folgt dem IEEE 754-Standard für doppelte Genauigkeit. Mit 15–16 signifikanten Dezimalstellen ist er für nahezu alle wissenschaftlichen und ingenieursmäßigen Berechnungen geeignet.

**Standardwert:** Alle Elemente werden mit 0.0 initialisiert.

**Wichtige Besonderheit – Gleitkomma-Vergleiche:** Du solltest double-Werte niemals mit == vergleichen, da Gleitkommaoperationen kleine Rundungsfehler erzeugen können. Verwende stattdessen einen Toleranzwert (epsilon): Math.abs(a - b) < 1e-9.

**float[] vs double[]:** Java hat auch float[] mit 32 Bit (7 Dezimalstellen). Verwende double[] standardmäßig — es ist genauer, und moderne Hardware ist nicht langsamer damit. float[] nur bei sehr großen Datensätzen sinnvoll, wo der halbe Speicherverbrauch relevant ist.

**Typische Anwendungsfälle:** Physik-Simulationen, Finanzdaten, GPS-Koordinaten, Sensorwerte, statistische Auswertungen, Spiele-Physik.`,
  },
  {
    slug: 'boolean',
    javaType: 'boolean[]',
    name: 'Boolean-Array',
    category: 'Primitiv',
    defaultValue: 'false',
    bits: 1,
    shortDescription: 'Speichert Wahrheitswerte (true/false). Ideal für Flaggen, Zustandsfelder und das Sieb des Eratosthenes.',
    visualExample: [true, false, true, true, false],
    declaration: `// Deklaration (Standardwerte: false)
boolean[] flags = new boolean[5];

// Alle Felder sind zunächst false
boolean[] besucht = new boolean[100];`,
    initialization: `// Initialisierung mit Literalen
boolean[] flags = {true, false, true, true, false};

// Initialisierung basierend auf Bedingung
int[] zahlen = {1, 2, 3, 4, 5};
boolean[] gerade = new boolean[zahlen.length];
for (int i = 0; i < zahlen.length; i++) {
    gerade[i] = (zahlen[i] % 2 == 0); // false, true, false, true, false
}`,
    operations: `boolean[] flags = {true, false, true, true, false};

// Zugriff
boolean erster = flags[0];     // true

// Bedingter Einsatz
if (flags[2]) {
    System.out.println("Index 2 ist aktiv");
}

// Zählen der true-Werte
int anzahlTrue = 0;
for (boolean f : flags) {
    if (f) anzahlTrue++;       // 3
}

// Sieb des Eratosthenes (Primzahlen bis 30)
int n = 30;
boolean[] istPrim = new boolean[n + 1];
Arrays.fill(istPrim, true);
istPrim[0] = istPrim[1] = false;
for (int i = 2; i * i <= n; i++) {
    if (istPrim[i]) {
        for (int j = i * i; j <= n; j += i) {
            istPrim[j] = false;
        }
    }
}`,
    explanation: `**boolean[]** speichert Wahrheitswerte — entweder true oder false. Obwohl ein boolean-Wert theoretisch nur 1 Bit benötigt, verwendet die JVM intern meist 1 Byte pro Element (aus Ausrichtungsgründen). Arrays.fill() ist nützlich, um alle Felder auf einen Wert zu setzen.

**Standardwert:** Alle Elemente werden mit false initialisiert. Das ist besonders praktisch für Algorithmen wie das Sieb des Eratosthenes oder Besuchsmarkierungen in Graphen.

**Klassische Anwendung — Sieb des Eratosthenes:** Mit einem boolean[]-Array kannst du effizient alle Primzahlen bis zu einer Grenze n finden. Der Algorithmus markiert alle Vielfachen jeder Primzahl als false — ein Paradebeispiel für die Stärke von boolean-Arrays.

**Alternativen:** Für sehr große boolean-Arrays (Millionen von Einträgen) ist java.util.BitSet speichereffizienter — es speichert 8 Werte pro Byte statt 1.

**Typische Anwendungsfälle:** Besuchsmarkierungen in Graphen/BFS/DFS, Feature-Flags, Siebe-Algorithmen, Zustands-Bitfelder, Filter-Masken.`,
  },
  {
    slug: 'char',
    javaType: 'char[]',
    name: 'Char-Array',
    category: 'Primitiv',
    defaultValue: "'\\u0000'",
    minValue: "'\\u0000' (0)",
    maxValue: "'\\uFFFF' (65535)",
    bits: 16,
    shortDescription: "Speichert einzelne Unicode-Zeichen (UTF-16). char[] ist die interne Darstellung von Java-Strings und ermöglicht zeichenweise String-Manipulation.",
    visualExample: ["'H'", "'e'", "'l'", "'l'", "'o'"],
    declaration: `// Deklaration (Standardwert: '\\u0000' = Null-Zeichen)
char[] buchstaben = new char[5];

// Jedes char ist ein einzelnes Unicode-Zeichen
char[] alphabet = new char[26];`,
    initialization: `// Initialisierung mit Zeichenliteralen
char[] gruss = {'H', 'e', 'l', 'l', 'o'};

// Aus einem String konvertieren
char[] vonString = "Hallo".toCharArray();

// Alphabet aufbauen
char[] alphabet = new char[26];
for (int i = 0; i < 26; i++) {
    alphabet[i] = (char) ('a' + i); // 'a', 'b', ..., 'z'
}`,
    operations: `char[] arr = {'H', 'e', 'l', 'l', 'o'};

// Zugriff
char erster = arr[0];           // 'H'

// Als Zahl behandeln (Unicode-Wert)
int code = arr[0];              // 72 (ASCII/Unicode von 'H')

// char-Array zu String
String s = new String(arr);     // "Hello"
String s2 = String.valueOf(arr); // "Hello"

// Zeichenprüfung
for (char c : arr) {
    if (Character.isUpperCase(c)) System.out.print(c); // H
    if (Character.isLetter(c))    System.out.print(c); // Hello
    if (Character.isDigit(c))     System.out.print(c); // (nichts)
}

// Groß-/Kleinschreibung ändern
for (int i = 0; i < arr.length; i++) {
    arr[i] = Character.toLowerCase(arr[i]); // {'h','e','l','l','o'}
}

// String-Manipulation ohne neue Objekte
char[] reversed = new char[arr.length];
for (int i = 0; i < arr.length; i++) {
    reversed[i] = arr[arr.length - 1 - i];
}`,
    explanation: `**char[]** speichert einzelne Unicode-Zeichen im UTF-16-Format. Jedes Element belegt 16 Bit (2 Byte) und kann Werte von ' ' (0) bis '￿' (65535) darstellen — das deckt alle grundlegenden Unicode-Zeichen ab (Basic Multilingual Plane).

**Verbindung zu String:** In Java sind Strings intern als char[]-Arrays implementiert (in älteren JVM-Versionen direkt, in neueren optimiert). Die Methode toCharArray() wandelt einen String in ein char[]-Array um, und new String(charArray) wandelt es zurück.

**Warum char[] statt String?** Wenn du einen String zeichenweise bearbeiten, umkehren oder durchsuchen möchtest, ist ein char[]-Array oft effizienter, da Strings in Java unveränderlich (immutable) sind. Jede String-Manipulation erzeugt ein neues Objekt — mit char[] arbeitest du direkt.

**Sicherheitshinweis:** Passwörter sollten als char[] statt als String gespeichert werden, da char[]-Arrays explizit mit Arrays.fill(pwd, '\\0') gelöscht werden können. Strings bleiben im Speicher, bis der Garbage Collector sie einsammelt.`,
  },
  {
    slug: 'long',
    javaType: 'long[]',
    name: 'Long-Array',
    category: 'Primitiv',
    defaultValue: '0L',
    minValue: '-9.223.372.036.854.775.808',
    maxValue: '9.223.372.036.854.775.807',
    bits: 64,
    shortDescription: 'Speichert ganze 64-Bit-Zahlen für sehr große Werte, die int[] sprengen würden — Zeitstempel, IDs, astronomische Werte.',
    visualExample: [1000000000, -500, 9223372036, 0, 42],
    declaration: `// Deklaration (Standardwerte: 0L)
long[] grosseZahlen = new long[5];

// Typische Anwendung: Unix-Zeitstempel
long[] zeitstempel = new long[100];`,
    initialization: `// Initialisierung – 'L' Suffix für long-Literale!
long[] zahlen = {1_000_000_000L, -500L, 9_223_372_036L, 0L, 42L};

// Ohne L-Suffix: int-Literal (nur bis ~2 Mrd. ohne Fehler)
long[] klein = {42L, 100L, -1L};

// Aktuelle Zeit in Millisekunden
long[] zeiten = new long[5];
zeiten[0] = System.currentTimeMillis();`,
    operations: `long[] arr = {1_000_000_000L, -500L, 9_223_372_036L, 0L, 42L};

// Zugriff
long erster = arr[0];           // 1000000000

// Arithmetik mit großen Zahlen
long produkt = arr[0] * 1_000L; // 1.000.000.000.000 (1 Billion)

// Zeitdifferenz messen
long start = System.currentTimeMillis();
// ... Code ...
long ende = System.currentTimeMillis();
long dauer = ende - start;      // Millisekunden

// Vergleich mit Long-Konstanten
if (arr[2] > Integer.MAX_VALUE) { // 9.223.372.036 > 2.147.483.647
    System.out.println("Zu groß für int!");
}

import java.util.Arrays;
Arrays.sort(arr);
System.out.println(Arrays.toString(arr));`,
    explanation: `**long[]** ist wie int[], aber mit 64-Bit-Breite statt 32 Bit. Das verdoppelt den Speicherbedarf (8 Byte pro Element), aber der Wertebereich ist enorm: fast ±9,2 × 10¹⁸. Eine long-Variable allein könnte alle Millisekunden seit der Entstehung des Universums speichern — mit Platz für mehr.

**Wann long[] statt int[]?** Immer wenn Werte über ~2 Milliarden oder unter ~-2 Milliarden liegen können. Klassische Fälle: Unix-Zeitstempel (Millisekunden), Datei-IDs in Datenbanken, Bevölkerungsstatistiken, kryptographische Werte, astronomische Distanzen.

**Literal-Syntax:** Long-Literale brauchen das L-Suffix: 9_223_372_036L. Ohne L behandelt Java die Zahl als int — was bei Werten über 2.147.483.647 zu einem Kompilierfehler führt.

**Lesbarkeit:** Java erlaubt Unterstriche in numerischen Literalen (1_000_000), was große Zahlen viel leichter lesbar macht.`,
  },
  {
    slug: 'byte',
    javaType: 'byte[]',
    name: 'Byte-Array',
    category: 'Primitiv',
    defaultValue: '0',
    minValue: '-128',
    maxValue: '127',
    bits: 8,
    shortDescription: 'Speichert 8-Bit-Ganzzahlen. Der wichtigste Array-Typ für Datei-I/O, Netzwerkkommunikation und Binärdaten.',
    visualExample: [72, 101, 108, 108, 111],
    declaration: `// Deklaration (Standardwerte: 0)
byte[] daten = new byte[1024]; // 1 KB Puffer

// Häufig für I/O-Puffer
byte[] puffer = new byte[4096]; // 4 KB`,
    initialization: `// Initialisierung mit Literalen (Bereich: -128 bis 127)
byte[] bytes = {72, 101, 108, 108, 111}; // "Hello" in ASCII

// Cast nötig bei Werten > 127 oder negativen Werten als int-Literal
byte[] signed = {(byte) 200, (byte) -50, 0, 127, -128};

// Aus String (UTF-8 Bytes)
byte[] utf8 = "Hallo".getBytes(java.nio.charset.StandardCharsets.UTF_8);

// Datei einlesen
byte[] dateiInhalt = java.nio.file.Files.readAllBytes(java.nio.file.Path.of("datei.txt"));`,
    operations: `byte[] arr = {72, 101, 108, 108, 111};

// Zugriff
byte b = arr[0];               // 72 (ASCII 'H')

// Als char darstellen
char c = (char) arr[0];        // 'H'

// Zu String (mit Charset)
String text = new String(arr, java.nio.charset.StandardCharsets.UTF_8); // "Hello"

// Bitweise Operationen
byte flags = arr[0];
boolean bit6 = (flags & 0x40) != 0; // Bit 6 gesetzt?
byte gesetzt = (byte) (flags | 0x01); // Bit 0 setzen
byte geloescht = (byte) (flags & ~0x01); // Bit 0 löschen

// Hex-Darstellung
for (byte x : arr) {
    System.out.printf("%02X ", x); // 48 65 6C 6C 6F
}

// Datei schreiben
java.nio.file.Files.write(java.nio.file.Path.of("out.bin"), arr);`,
    explanation: `**byte[]** ist der wichtigste Array-Typ für alles, was mit Rohdaten, Dateien und Netzwerken zu tun hat. Jedes Element speichert 8 Bit (1 Byte) mit Vorzeichen: -128 bis 127. Intern sind Bytes vorzeichenbehaftet in Java — für vorzeichenlose Bytes (0–255) benutzt man den Trick: int vorzeichenlos = b & 0xFF.

**Warum byte[] für I/O?** Alle Java-Streams (InputStream, OutputStream) arbeiten mit byte[]-Arrays. Wenn du eine Datei liest, erhältst du die Rohbytes. Wenn du Netzwerkdaten empfängst, kommen sie als Bytes. Das macht byte[] zum universellen Transport-Format.

**ASCII und UTF-8:** Die Zahlen 72, 101, 108, 108, 111 sind die ASCII-Codes für 'H', 'e', 'l', 'l', 'o'. ASCII ist eine Teilmenge von UTF-8, daher kann man diese Bytes direkt als Text interpretieren.

**Bitweise Operationen:** byte[] ist ideal für Protokoll-Parsing, Kompression, Verschlüsselung und Bildverarbeitung (Pixel-Werte). Bitweise AND (&), OR (|), XOR (^) und NOT (~) arbeiten direkt auf den Bytes.`,
  },
  {
    slug: 'short',
    javaType: 'short[]',
    name: 'Short-Array',
    category: 'Primitiv',
    defaultValue: '0',
    minValue: '-32.768',
    maxValue: '32.767',
    bits: 16,
    shortDescription: 'Speichert 16-Bit-Ganzzahlen. Spart Speicher gegenüber int[] wenn Werte in den Bereich -32.768 bis 32.767 passen.',
    visualExample: [100, -200, 32767, 0, -32768],
    declaration: `// Deklaration (Standardwerte: 0)
short[] werte = new short[5];

// Typisch für Audio-Samples (16-bit PCM)
short[] audioSamples = new short[44100]; // 1 Sekunde bei 44.1 kHz`,
    initialization: `// Initialisierung – Cast erforderlich!
short[] werte = {100, -200, 32767, 0, -32768};

// Java behandelt Ganzzahl-Literale als int → Cast bei Zuweisung
short a = (short) 1000;  // expliziter Cast
short[] arr = {(short) 1000, (short) -500}; // meist unnötig bei Initialisierung

// Audio-typische Initialisierung
short[] pcm = new short[1024];
for (int i = 0; i < pcm.length; i++) {
    // Sinuswelle generieren
    pcm[i] = (short) (32767 * Math.sin(2 * Math.PI * i / 100));
}`,
    operations: `short[] arr = {100, -200, 32767, 0, -32768};

// Zugriff
short s = arr[2];              // 32767

// Achtung: Arithmetik wird zu int promoted!
short a = 30000, b = 30000;
// short c = a + b;            // FEHLER! Ergebnis ist int
short c = (short) (a + b);     // Cast nötig → Überlauf: -5536

// Überlauf prüfen
int summe = (int) a + (int) b; // sicher: 60000

// Sortieren und ausgeben
import java.util.Arrays;
Arrays.sort(arr);
System.out.println(Arrays.toString(arr)); // [-32768, -200, 0, 100, 32767]

// In int umrechnen (vorzeichenlos: 0-65535)
int vorzeichenlos = arr[0] & 0xFFFF; // -32768 → 32768`,
    explanation: `**short[]** ist ein 16-Bit-Ganzzahl-Array mit Vorzeichen (-32.768 bis 32.767). Er spart im Vergleich zu int[] die Hälfte des Speichers pro Element (2 statt 4 Byte). In der Praxis wird er verwendet, wenn der Wertebereich passt und Speicher ein kritischer Faktor ist.

**Automatische Promotion:** Java "promoted" short zu int bei Arithmetic-Operationen. Das bedeutet: short + short ergibt int, nicht short. Du musst explizit zurückcasten: (short)(a + b). Das kann zu unerwarteten Überläufen führen — Vorsicht!

**Praxisbeispiel Audio:** 16-Bit PCM-Audio (der Standard für WAV-Dateien und CD-Qualität) speichert Samples als short-Werte von -32.768 bis 32.767. Java Sound API arbeitet direkt mit short[]-Arrays für Audio-Verarbeitung.

**Wann short[] wählen?** Nur wenn du große Mengen Daten hast und der Wertebereich passt. Für kleine Arrays lohnt der Speicher-Vorteil nicht. int[] ist in allen anderen Fällen die bessere Wahl, weil Java intern sowieso mit int rechnet.`,
  },
  {
    slug: 'float',
    javaType: 'float[]',
    name: 'Float-Array',
    category: 'Primitiv',
    defaultValue: '0.0f',
    minValue: '±1.4 × 10⁻⁴⁵',
    maxValue: '±3.4 × 10³⁸',
    bits: 32,
    shortDescription: 'Speichert 32-Bit Gleitkommazahlen. Halb so groß wie double[], aber mit geringerer Präzision — ideal für Grafik und große Datensätze.',
    visualExample: [1.5, 3.14, -0.25, 100.0, 0.001],
    declaration: `// Deklaration (Standardwerte: 0.0f)
float[] koordinaten = new float[3];

// Grafik-typisch: Vertex-Koordinaten
float[] vertices = new float[9]; // 3 Dreiecks-Eckpunkte (x,y,z)`,
    initialization: `// Initialisierung – 'f' Suffix PFLICHT!
float[] werte = {1.5f, 3.14f, -0.25f, 100.0f, 0.001f};

// Ohne f → double-Literal → Kompilierfehler!
// float x = 3.14;             // FEHLER: possible lossy conversion
float y = 3.14f;               // korrekt
float z = (float) 3.14;        // auch möglich (Cast)

// 3D-Vertex-Daten für OpenGL
float[] vertex = {0.0f, 1.0f, 0.0f,   // oben
                  -1.0f, -1.0f, 0.0f,  // unten-links
                  1.0f, -1.0f, 0.0f};  // unten-rechts`,
    operations: `float[] arr = {1.5f, 3.14f, -0.25f, 100.0f, 0.001f};

// Zugriff
float pi = arr[1];             // 3.14f

// Achtung: noch weniger präzise als double!
float a = 0.1f + 0.2f;        // 0.3f? → tatsächlich: 0.30000001f

// Vergleich immer mit Epsilon
float epsilon = 1e-6f;
if (Math.abs(a - 0.3f) < epsilon) { ... }

// float ↔ double Konvertierung
double d = arr[0];             // float → double (automatisch)
float f = (float) d;           // double → float (expliziter Cast)

// Nützlich für Grafik-Berechnungen
float laenge = (float) Math.sqrt(arr[0] * arr[0] + arr[1] * arr[1]);

import java.util.Arrays;
Arrays.sort(arr);
System.out.println(Arrays.toString(arr));`,
    explanation: `**float[]** speichert 32-Bit-Gleitkommazahlen (IEEE 754 Single Precision) mit 7 signifikanten Dezimalstellen. Im Vergleich zu double[] belegt jedes Element nur 4 statt 8 Byte — halb so viel Speicher und Bandbreite.

**Präzision ist der Haken:** float hat nur ~7 Dezimalstellen Genauigkeit. 0.1f + 0.2f ergibt 0.30000001f, nicht 0.3f. Für finanzielle oder wissenschaftliche Berechnungen ist das inakzeptabel — nimm dort double[].

**Wann float[] sinnvoll?** Hauptsächlich in der 3D-Grafik (OpenGL, Vulkan, WebGL), Spieleentwicklung und Machine Learning. Grafik-GPUs verarbeiten float[] nativ und sind damit sehr schnell. In neuronalen Netzen werden Millionen von Gewichten als float[] gespeichert, was den Speicher- und Bandbreitenvorteil entscheidend macht.

**Java Besonderheit:** Alle Rechen-Operationen mit float werden intern zu double promoted. Erst das Ergebnis wird wieder auf float gerundet. Deshalb ist float-Arithmetik in Java nicht zwangsläufig schneller als double — der Vorteil liegt im Speicher.`,
  },
  {
    slug: 'string',
    javaType: 'String[]',
    name: 'String-Array',
    category: 'Referenz',
    defaultValue: 'null',
    shortDescription: 'Speichert Referenzen auf String-Objekte. Die häufigste Art, Texte in Arrays zu verwalten — von Wortlisten bis zu Kommandozeilenargumenten.',
    visualExample: ['"Hallo"', '"Welt"', '"Java"', 'null', '"!"'],
    declaration: `// Deklaration (Standardwerte: null)
String[] woerter = new String[5];

// main-Methode: args ist ein String[]!
public static void main(String[] args) { ... }`,
    initialization: `// Initialisierung mit String-Literalen
String[] woerter = {"Hallo", "Welt", "Java", null, "!"};

// Einzeln befüllen
String[] namen = new String[3];
namen[0] = "Alice";
namen[1] = "Bob";
namen[2] = "Charlie";

// Aus String splitten
String satz = "Hallo Welt Java";
String[] teile = satz.split(" ");  // {"Hallo", "Welt", "Java"}`,
    operations: `String[] arr = {"Banana", "Apple", "Cherry", null, "Date"};

// Zugriff
String erstes = arr[0];         // "Banana"

// null-Prüfung PFLICHT vor String-Methoden!
for (String s : arr) {
    if (s != null) {
        System.out.println(s.toUpperCase());
    }
}

// String-Array sortieren (lexikographisch)
import java.util.Arrays;
String[] ohneNull = {"Banana", "Apple", "Cherry", "Date"};
Arrays.sort(ohneNull);          // ["Apple", "Banana", "Cherry", "Date"]

// Suchen
int idx = Arrays.binarySearch(ohneNull, "Cherry"); // 1

// Zu Liste konvertieren
import java.util.List;
List<String> liste = Arrays.asList(ohneNull);

// Zu einem String verbinden
String verbunden = String.join(", ", ohneNull); // "Apple, Banana, Cherry, Date"

// Mit Streams filtern
import java.util.stream.Stream;
String[] gefiltered = Stream.of(arr)
    .filter(s -> s != null && s.startsWith("C"))
    .toArray(String[]::new);    // ["Cherry"]`,
    explanation: `**String[]** ist kein primitiver Array-Typ — er speichert Referenzen auf String-Objekte im Heap-Speicher. Das hat wichtige Konsequenzen: Jedes Element zeigt auf ein String-Objekt (oder ist null), und das Array selbst enthält nur die Pointer, nicht die eigentlichen Zeichenketten.

**Standardwert null:** Nicht initialisierte Felder enthalten null, keine leeren Strings. Der Versuch, eine Methode auf null aufzurufen (null.length()), führt zu einer NullPointerException. Prüfe daher immer auf null, bevor du String-Methoden aufrufst.

**String-Vergleich:** Verwende niemals == zum Vergleich von String-Inhalten. == vergleicht Referenzen (Adressen), nicht Inhalte. Nutze stattdessen equals(): "Hallo".equals(arr[0]). Oder equalsIgnoreCase() für case-insensitiven Vergleich.

**main(String[] args):** Der bekannteste String[]-Parameter in Java ist args in der main-Methode. Er enthält alle Kommandozeilenargumente, die beim Programmstart übergeben wurden. Wenn du dein Programm mit java MyApp Hallo Welt startest, ist args[0] = "Hallo" und args[1] = "Welt".`,
  },
  {
    slug: 'object',
    javaType: 'Object[]',
    name: 'Object-Array',
    category: 'Referenz',
    defaultValue: 'null',
    shortDescription: 'Speichert Referenzen auf beliebige Java-Objekte. Die flexibelste Array-Form — kann jede Klasse speichern, erfordert aber Typ-Casts.',
    visualExample: ['"Text"', '42', 'true', 'null', '3.14'],
    declaration: `// Deklaration (Standardwerte: null)
Object[] mixed = new Object[5];

// Kann jeden Referenztyp aufnehmen
Object[] alles = new Object[10];`,
    initialization: `// Gemischte Typen möglich (Auto-boxing für Primitive)
Object[] mixed = {"Text", 42, true, null, 3.14};
// Java boxed automatisch: int → Integer, boolean → Boolean, double → Double

// Eigene Objekte
Object[] personen = {new Person("Alice", 30), new Person("Bob", 25)};

// Arrays von Arrays (Jagged Arrays)
Object[] verschachtelt = {new int[]{1,2,3}, new String[]{"a","b"}};`,
    operations: `Object[] arr = {"Text", 42, true, null, 3.14};

// Zugriff – gibt Object zurück, Cast nötig!
Object o = arr[0];             // Object-Referenz
String s = (String) arr[0];    // Cast zu String → "Text"

// instanceof prüfen vor Cast (ClassCastException vermeiden)
for (Object obj : arr) {
    if (obj instanceof String str) {    // Pattern Matching (Java 16+)
        System.out.println("String: " + str.toUpperCase());
    } else if (obj instanceof Integer i) {
        System.out.println("Int: " + (i * 2));
    } else if (obj instanceof Boolean b) {
        System.out.println("Bool: " + !b);
    } else if (obj == null) {
        System.out.println("null");
    }
}

// Sortieren nur möglich wenn alle Elemente Comparable implementieren
// Arrays.sort(arr); // RuntimeException bei gemischten Typen!

// Besser: ArrayList<Object> oder generische Typen verwenden
import java.util.ArrayList;
ArrayList<Object> liste = new ArrayList<>();
liste.add("Text");
liste.add(42);`,
    explanation: `**Object[]** ist der allgemeinste Array-Typ in Java — da alle Klassen implizit von Object erben, kann ein Object[]-Array Referenzen auf jede beliebige Klasse speichern. Sogar primitive Werte können gespeichert werden, da Java sie automatisch "boxt" (int → Integer, boolean → Boolean, etc.).

**Typ-Sicherheit fehlt:** Das ist der große Nachteil. Wenn du ein Element aus einem Object[]-Array holst, erhältst du nur Object. Du musst explizit casten (String s = (String) arr[0]) — und wenn der Typ falsch ist, gibt es eine ClassCastException zur Laufzeit. Generics (ArrayList<String>) sind typsicher und bevorzugt.

**instanceof und Pattern Matching:** Vor Java 16 musstest du instanceof prüfen, dann extra casten. Seit Java 16 gibt es Pattern Matching: if (obj instanceof String str) — prüft und castet in einem Schritt.

**Wann Object[] verwenden?** Meist dann, wenn du mit sehr altem Java-Code oder Reflection arbeitest, oder wenn du wirklich heterogene Daten speichern musst. In modernem Java bevorzuge Generics: List<String>, Map<String, Integer>, usw.`,
  },
  {
    slug: 'two-dimensional',
    javaType: 'int[][]',
    name: '2D-Array',
    category: 'Mehrdimensional',
    defaultValue: '0',
    shortDescription: 'Ein Array von Arrays — stellt Tabellen, Matrizen und Gitter dar. Jede Zeile ist ein eigenständiges int[]-Array.',
    visualExample: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    declaration: `// Deklaration: [Zeilen][Spalten]
int[][] matrix = new int[3][3];  // 3×3 Matrix, alle 0

// Rechteckig: alle Zeilen gleich lang
int[][] tabelle = new int[4][5]; // 4 Zeilen, 5 Spalten

// Zackig (jagged): unterschiedliche Zeilenlängen
int[][] dreieck = new int[3][];
dreieck[0] = new int[1];   // [0]
dreieck[1] = new int[2];   // [0, 0]
dreieck[2] = new int[3];   // [0, 0, 0]`,
    initialization: `// Initialisierung einer 3×3 Matrix
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Schachbrettmuster
int[][] schach = new int[8][8];
for (int z = 0; z < 8; z++) {
    for (int s = 0; s < 8; s++) {
        schach[z][s] = (z + s) % 2; // 0 oder 1 abwechselnd
    }
}

// Einheitsmatrix (Identitätsmatrix)
int n = 4;
int[][] einheit = new int[n][n];
for (int i = 0; i < n; i++) {
    einheit[i][i] = 1; // Diagonale = 1, Rest = 0
}`,
    operations: `int[][] matrix = {{1,2,3},{4,5,6},{7,8,9}};

// Zugriff: [Zeile][Spalte]
int mitte = matrix[1][1];      // 5

// Dimensionen
int zeilen = matrix.length;     // 3
int spalten = matrix[0].length; // 3

// Iteration mit verschachtelten Schleifen
for (int z = 0; z < matrix.length; z++) {
    for (int s = 0; s < matrix[z].length; s++) {
        System.out.printf("%3d", matrix[z][s]);
    }
    System.out.println();
}
//   1  2  3
//   4  5  6
//   7  8  9

// For-each Variante
for (int[] zeile : matrix) {
    for (int wert : zeile) {
        System.out.print(wert + " ");
    }
}

// Matrix transponieren
int[][] transponiert = new int[3][3];
for (int z = 0; z < 3; z++) {
    for (int s = 0; s < 3; s++) {
        transponiert[s][z] = matrix[z][s];
    }
}

// Matrix-Multiplikation (A × B)
int n = 3;
int[][] a = {{1,2},{3,4}}, b = {{5,6},{7,8}};
int[][] c = new int[2][2];
for (int i = 0; i < 2; i++)
    for (int j = 0; j < 2; j++)
        for (int k = 0; k < 2; k++)
            c[i][j] += a[i][k] * b[k][j];

// Ausgabe
import java.util.Arrays;
System.out.println(Arrays.deepToString(matrix)); // [[1,2,3],[4,5,6],[7,8,9]]`,
    explanation: `**int[][]** ist technisch gesehen ein "Array von Arrays" — kein echter zweidimensionaler Speicherblock wie in C. Jede Zeile ist ein eigenständiges int[]-Objekt. Das erlaubt "jagged arrays" (zackige Arrays), bei denen Zeilen unterschiedliche Längen haben können.

**Speicherlayout:** Da jede Zeile ein separates Objekt ist, liegen die Zeilen nicht zwingend hintereinander im Speicher. Das kann bei großen Matrizen Cache-Misses verursachen. Für hochperformante Berechnungen nutzt man oft ein 1D-Array mit manueller Indexberechnung: arr[z * spalten + s].

**Zeilen-Vorrang (Row-Major):** Java-2D-Arrays sind zeilenweise gespeichert. Das bedeutet: matrix[z][s] ist effizient, wenn du in der inneren Schleife über s (Spalten) iterierst — das nutzt den CPU-Cache optimal.

**Typische Anwendungsfälle:** Schachbretter, Spielfelder, Bilder (Pixel-Gitter), Matrizen in der linearen Algebra, Tabellendaten, Labyrinthe, Dynamic-Programming-Tabellen (z.B. Longest Common Subsequence).

**Tipp — Arrays.deepToString():** Arrays.toString() zeigt nur die Zeilenadressen. Für die vollständige Ausgabe eines 2D-Arrays immer Arrays.deepToString(matrix) verwenden.`,
  },
]
