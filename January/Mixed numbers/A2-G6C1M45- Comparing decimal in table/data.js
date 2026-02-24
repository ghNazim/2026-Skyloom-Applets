
// Decimal separator for different languages
const decimal = {
  en: ".",
  id: ",",
};

// Helper: build place-value columns for a pair of decimals
// Returns { places: [{name, heading, d1, d2}], operator }
function buildQuestionData(n1, n2) {
  const s1 = n1.toString();
  const s2 = n2.toString();
  const [int1, dec1 = ""] = s1.split(".");
  const [int2, dec2 = ""] = s2.split(".");
  const maxInt = Math.max(int1.length, int2.length);
  const maxDec = Math.max(dec1.length, dec2.length);

  // Pad
  const pi1 = int1.padStart(maxInt, "0");
  const pi2 = int2.padStart(maxInt, "0");
  const pd1 = dec1.padEnd(maxDec, "0");
  const pd2 = dec2.padEnd(maxDec, "0");

  const placeNames = [];
  if (maxInt >= 2) placeNames.push("tens");
  if (maxInt >= 1) placeNames.push("ones");
  // decimal column (not a comparison place)
  if (maxDec >= 1) placeNames.push("tenths");
  if (maxDec >= 2) placeNames.push("hundredths");

  const allDigits1 = pi1 + pd1;
  const allDigits2 = pi2 + pd2;

  const places = placeNames.map((name, i) => ({
    name,
    d1: parseInt(allDigits1[i]),
    d2: parseInt(allDigits2[i]),
  }));

  // Overall operator
  let operator = "=";
  if (n1 > n2) operator = ">";
  else if (n1 < n2) operator = "<";

  // Display strings for left column (no padding)
  const display1 = s1;
  const display2 = s2;

  // Padded strings for table (pad integer part with leading zeros)
  const table1 = pi1 + "." + pd1;
  const table2 = pi2 + "." + pd2;

  return { n1, n2, display1, display2, table1, table2, places, operator, maxInt, maxDec };
}

// Master data structure - Comparing Decimal Numbers
const DATA = {
  en: {
    questions: [
      buildQuestionData(7.83, 5.69),
      buildQuestionData(4.37, 4.83),
      buildQuestionData(8.25, 8.21),
      buildQuestionData(5.19, 5.19),
      buildQuestionData(23.19, 4.62),
    ],

    // Place value headings
    placeHeadings: {
      tens: "Tens",
      ones: "Ones",
      tenths: "Tenths",
      hundredths: "Hundredths",
    },

    // Start screen (Step 0)
    start: {
      heading: "Comparing Decimal Numbers",
      text: "Let's learn how to compare <y>decimal numbers</y> using\nplace value.",
      buttonText: "Start",
    },

    // Final screen (Step 4)
    final: {
      heading: "Comparing Decimal Numbers",
      text: "<left>Awesome!<br>To compare decimal numbers:<br>● Compare digits from <y>Left to Right</y>.<br>● The <y>first place</y> where the <y>digits differ</y> determines which <y>decimal is greater</y>.</left>",
      buttonText: "Start Over",
    },

    // Step 1 - Show numbers
    step1: {
      question: "Let's compare the given decimal numbers.",
      nav: "Tap » to begin.",
    },

    // Step 2 - Align decimals
    step2: {
      question: "Let's align the decimal points.",
      nav: "Tap the highlighted decimal number.",
      questionFinal: "Compare digits from left to right, one place at a time.",
      navFinal: "Tap » to compare the digits from left to right.",
    },

    // Step 3 - Compare digits
    step3: {
      questionFirstPlace: "Let's compare the first place.",
      questionEqualMove: "If the digits in a place are equal, compare the digits in the next place.",
      questionAllEqual: "If the digits in all places are equal, the numbers are equal.",
      nav: "Tap the correct symbol.",
      navDone: "Tap » to try next pair of decimal numbers.",
      navComplete: "Tap » to complete the activity.",
      feedbackGreater: "The decimal with the greater {{place}} digit is greater.",
      feedbackEqual: "The decimals are equal!",
      feedbackAwesome: "Awesome!",
      feedbackTryAgain: "Try again.",
    },

    // Arrow label for table
    tableArrowLabel: "Compare digits from left to right",
  },

  id: {
    questions: [
      buildQuestionData(7.83, 5.69),
      buildQuestionData(4.37, 4.83),
      buildQuestionData(8.25, 8.21),
      buildQuestionData(5.19, 5.19),
      buildQuestionData(23.19, 4.62),
    ],

    placeHeadings: {
      tens: "Puluhan",
      ones: "Satuan",
      tenths: "Persepuluhan",
      hundredths: "Perseratusan",
    },

    start: {
      heading: "Membandingkan Bilangan Desimal",
      text: "Mari belajar membandingkan <y>bilangan desimal</y>\nmenggunakan nilai tempat.",
      buttonText: "Mulai",
    },

    final: {
      heading: "Membandingkan Bilangan Desimal",
      text: "<left>Luar biasa!<br>Untuk membandingkan bilangan desimal:<br>● Bandingkan angka dari <y>Kiri ke Kanan</y>.<br>● <y>Tempat pertama</y> di mana <y>angka berbeda</y> menentukan <y>desimal mana yang lebih besar</y>.</left>",
      buttonText: "Ulangi",
    },

    step1: {
      question: "Mari kita bandingkan bilangan desimal yang diberikan.",
      nav: "Ketuk » untuk memulai.",
    },

    step2: {
      question: "Mari kita sejajarkan titik desimalnya.",
      nav: "Ketuk bilangan desimal yang disorot.",
      questionFinal: "Bandingkan angka dari kiri ke kanan, satu tempat pada satu waktu.",
      navFinal: "Ketuk » untuk membandingkan angka dari kiri ke kanan.",
    },

    step3: {
      questionFirstPlace: "Mari kita bandingkan tempat pertama.",
      questionEqualMove: "Jika angka di suatu tempat sama, bandingkan angka di tempat berikutnya.",
      questionAllEqual: "Jika angka di semua tempat sama, bilangan-bilangan tersebut sama.",
      nav: "Ketuk simbol yang benar.",
      navDone: "Ketuk » untuk mencoba pasangan bilangan desimal berikutnya.",
      navComplete: "Ketuk » untuk menyelesaikan aktivitas.",
      feedbackGreater: "Desimal dengan angka {{place}} yang lebih besar adalah yang lebih besar.",
      feedbackEqual: "Desimalnya sama!",
      feedbackAwesome: "Luar biasa!",
      feedbackTryAgain: "Coba lagi.",
    },

    tableArrowLabel: "Bandingkan angka dari kiri ke kanan",
  },
};

// Current language data accessors
const APP_DATA = DATA[current_language];
