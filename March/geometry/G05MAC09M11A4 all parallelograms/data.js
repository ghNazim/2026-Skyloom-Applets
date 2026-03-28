const APP_DATA = {
  en: {
    questionText: "Exploring Shapes from a Parallelogram",
    buttons: [
      "We start with a <b>parallelogram</b>.",
      "When all its sides are equal,<br>it becomes a <b>rhombus</b>.",
      "When its angles become 90°,<br>it becomes a <b>square</b>.",
      "When one pair of opposite sides is<br>longer, it becomes a <b>rectangle</b>.",
    ],
    headings: ["Parallelogram", "Rhombus", "Square", "Rectangle"],
    formulas: [
      "Area = base × height",
      "Area = ½ × d₁ × d₂",
      "Area = Side length × Side length",
      "Area = base × height",
    ],
  },
  id: {
    questionText: "Menjelajahi Bentuk dari Jajar Genjang",
    buttons: [
      "Kita mulai dengan <b>jajar genjang</b>.",
      "Jika semua sisinya sama,<br>maka menjadi <b>belah ketupat</b>.",
      "Jika sudut-sudutnya menjadi 90°,<br>maka menjadi <b>persegi</b>.",
      "Jika satu pasang sisi berhadapan<br>lebih panjang, maka menjadi <b>persegi panjang</b>.",
    ],
    headings: ["Jajar Genjang", "Belah Ketupat", "Persegi", "Persegi Panjang"],
    formulas: [
      "Luas = alas × tinggi",
      "Luas = ½ × d₁ × d₂",
      "Luas = panjang sisi × panjang sisi",
      "Luas = alas × tinggi",
    ],
  },
};

const DATA = (typeof current_language !== "undefined" && APP_DATA[current_language])
  ? APP_DATA[current_language]
  : APP_DATA.en;
