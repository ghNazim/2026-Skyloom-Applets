/* =============================================================================
   G09MAC3BM16A3 — corrected `simplificationArray` blocks
   -----------------------------------------------------------------------------
   Drop-in replacements for the `simplificationArray` value inside each
   question's `step4` object in data.js. Both languages included.

   ALIGNMENT RULE (do not break this):
   Index i of simplificationArray  <->  specs[i] in getStepFourGuideSpecs().
     Q1 (minusTimesNegative)      4 entries : copy, combineNegatives,
                                             removeBrackets, final
     Q2 (reflectNegativeDiagonal) 7 entries : copy, combineNegatives,
                                             multipliedWithBrackets,
                                             removeBrackets, multiplyByMinus1,
                                             simplifyMultiply, final
     Q3 (verticalLineK)          11 entries : copy, replaceK, simplifyK,
                                             distribute, removeProductParens,
                                             substitute8, removeInnerParens,
                                             cleanSigns, rearrangeFinal,
                                             combineConstants, final

   Index 0 is the "copy the equation down" frame. The guide box currently
   renders only for index >= 1, so note[0] is written but not displayed.
   It is kept populated so the arrays stay index-aligned, and so the
   substitution step is already correct if you later choose to show it
   (see the note at the bottom of this file).

   `expr` is not read by any component — only `note` is rendered. The values
   below have been corrected anyway so they match frame-for-frame what the
   animation actually puts on screen.
   ========================================================================== */


/* ===========================================================================
   ENGLISH
   ======================================================================== */

/* --- en > questions[0]  "x-axis-3x-minus-2y"  (3x - 2y = 1, across x-axis) */
simplificationArray: [
  {
    expr: "3(x') &minus; 2(&minus;y') = 1",
    note: "Substitute <i>x</i> = <i>x</i>&prime; and <i>y</i> = &minus;<i>y</i>&prime; into the equation of the given line.",
  },
  {
    expr: "3(x') + 2(y') = 1",
    note: "A negative multiplied by a negative gives a positive: &minus;2 &times; (&minus;<i>y</i>&prime;) = +2<i>y</i>&prime;.",
  },
  {
    expr: "3x' + 2y' = 1",
    note: "Nothing is left to multiply out, so the brackets can be removed.",
  },
  {
    expr: "3x + 2y = 1",
    note: "This holds for every point on the reflected line, so write <i>x</i>&prime; as <i>x</i> and <i>y</i>&prime; as <i>y</i>.",
  },
],

/* --- en > questions[1]  "line-y-equals-negative-x"  (5x + y - 6 = 0, across y = -x) */
simplificationArray: [
  {
    expr: "5(&minus;y') + (&minus;x') &minus; 6 = 0",
    note: "Substitute <i>x</i> = &minus;<i>y</i>&prime; and <i>y</i> = &minus;<i>x</i>&prime; into the equation of the given line.",
  },
  {
    expr: "&minus;5(y') &minus; (x') &minus; 6 = 0",
    note: "Move each negative sign to the front of its term: 5 &times; (&minus;<i>y</i>&prime;) becomes &minus;5(<i>y</i>&prime;), and +(&minus;<i>x</i>&prime;) becomes &minus;(<i>x</i>&prime;).",
  },
  {
    expr: "&minus;5(y') &minus; (x') &minus; 6 = 0",
    note: "Both variable terms are now negative. The brackets are only marking what each negative sign applies to.",
  },
  {
    expr: "&minus;5y' &minus; x' &minus; 6 = 0",
    note: "Nothing is left to multiply out, so the brackets can be removed.",
  },
  {
    expr: "&minus;1 &times; (&minus;5y' &minus; x' &minus; 6) = &minus;1 &times; 0",
    note: "Every term on the left is negative. Multiply both sides by &minus;1 to make them positive.",
  },
  {
    expr: "5y' + x' + 6 = 0",
    note: "Each term changes sign, and &minus;1 &times; 0 is still 0.",
  },
  {
    expr: "x + 5y + 6 = 0",
    note: "Write the <i>x</i>&prime; term first to match the answer options, then write <i>x</i>&prime; as <i>x</i> and <i>y</i>&prime; as <i>y</i>.",
  },
],

/* --- en > questions[2]  "line-x-equals-negative-2"  (-2x - y + 1 = 0, across x = -2) */
simplificationArray: [
  {
    expr: "&minus;2(2k &minus; x') &minus; (y') + 1 = 0",
    note: "Substitute <i>x</i> = 2<i>k</i> &minus; <i>x</i>&prime; and <i>y</i> = <i>y</i>&prime; into the equation of the given line.",
  },
  {
    expr: "&minus;2(2 &times; (&minus;2) &minus; x') &minus; (y') + 1 = 0",
    note: "Here <i>k</i> is the <i>x</i>&minus;value of the line of reflection, <i>x</i> = &minus;2, so replace <i>k</i> with &minus;2.",
  },
  {
    expr: "&minus;2(&minus;4 &minus; x') &minus; (y') + 1 = 0",
    note: "Work out 2 &times; (&minus;2) = &minus;4.",
  },
  {
    expr: "(&minus;2) &times; (&minus;4) &minus; (&minus;2)x' &minus; (y') + 1 = 0",
    note: "Multiply the &minus;2 by each term inside the bracket.",
  },
  {
    expr: "&minus;2 &times; (&minus;4) &minus; (&minus;2)x' &minus; (y') + 1 = 0",
    note: "The outer bracket only marked off the &minus;2 being multiplied, so it is no longer needed.",
  },
  {
    expr: "8 &minus; (&minus;2)x' &minus; (y') + 1 = 0",
    note: "A negative multiplied by a negative gives a positive: &minus;2 &times; (&minus;4) = 8.",
  },
  {
    expr: "8 + 2x' &minus; y' + 1 = 0",
    note: "Subtracting a negative adds: &minus;(&minus;2)<i>x</i>&prime; becomes +2<i>x</i>&prime;, and &minus;(<i>y</i>&prime;) becomes &minus;<i>y</i>&prime;.",
  },
  {
    expr: "8 + 2x' &minus; y' + 1 = 0",
    note: "Every term now carries a single sign in front of it.",
  },
  {
    expr: "2x' &minus; y' + 8 + 1 = 0",
    note: "Move the variable terms to the front so the equation matches the form of the answer options.",
  },
  {
    expr: "2x' &minus; y' + 9 = 0",
    note: "Add the constants: 8 + 1 = 9.",
  },
  {
    expr: "2x &minus; y + 9 = 0",
    note: "Write <i>x</i>&prime; as <i>x</i> and <i>y</i>&prime; as <i>y</i>.",
  },
],


/* ===========================================================================
   INDONESIAN
   ======================================================================== */

/* --- id > questions[0]  "x-axis-3x-minus-2y" */
simplificationArray: [
  {
    expr: "3(x') &minus; 2(&minus;y') = 1",
    note: "Substitusikan <i>x</i> = <i>x</i>&prime; dan <i>y</i> = &minus;<i>y</i>&prime; ke persamaan garis yang diberikan.",
  },
  {
    expr: "3(x') + 2(y') = 1",
    note: "Negatif dikali negatif menghasilkan positif: &minus;2 &times; (&minus;<i>y</i>&prime;) = +2<i>y</i>&prime;.",
  },
  {
    expr: "3x' + 2y' = 1",
    note: "Tidak ada lagi yang perlu dikalikan, jadi tanda kurungnya dapat dihilangkan.",
  },
  {
    expr: "3x + 2y = 1",
    note: "Persamaan ini berlaku untuk setiap titik pada garis bayangan, jadi tulis <i>x</i>&prime; sebagai <i>x</i> dan <i>y</i>&prime; sebagai <i>y</i>.",
  },
],

/* --- id > questions[1]  "line-y-equals-negative-x" */
simplificationArray: [
  {
    expr: "5(&minus;y') + (&minus;x') &minus; 6 = 0",
    note: "Substitusikan <i>x</i> = &minus;<i>y</i>&prime; dan <i>y</i> = &minus;<i>x</i>&prime; ke persamaan garis yang diberikan.",
  },
  {
    expr: "&minus;5(y') &minus; (x') &minus; 6 = 0",
    note: "Pindahkan setiap tanda negatif ke depan sukunya: 5 &times; (&minus;<i>y</i>&prime;) menjadi &minus;5(<i>y</i>&prime;), dan +(&minus;<i>x</i>&prime;) menjadi &minus;(<i>x</i>&prime;).",
  },
  {
    expr: "&minus;5(y') &minus; (x') &minus; 6 = 0",
    note: "Kedua suku variabel kini bernilai negatif. Tanda kurung hanya menandai bagian yang dikenai tanda negatif.",
  },
  {
    expr: "&minus;5y' &minus; x' &minus; 6 = 0",
    note: "Tidak ada lagi yang perlu dikalikan, jadi tanda kurungnya dapat dihilangkan.",
  },
  {
    expr: "&minus;1 &times; (&minus;5y' &minus; x' &minus; 6) = &minus;1 &times; 0",
    note: "Semua suku di ruas kiri bernilai negatif. Kalikan kedua ruas dengan &minus;1 agar menjadi positif.",
  },
  {
    expr: "5y' + x' + 6 = 0",
    note: "Setiap suku berubah tanda, dan &minus;1 &times; 0 tetap 0.",
  },
  {
    expr: "x + 5y + 6 = 0",
    note: "Tulis suku <i>x</i>&prime; di depan agar sesuai dengan pilihan jawaban, lalu tulis <i>x</i>&prime; sebagai <i>x</i> dan <i>y</i>&prime; sebagai <i>y</i>.",
  },
],

/* --- id > questions[2]  "line-x-equals-negative-2" */
simplificationArray: [
  {
    expr: "&minus;2(2k &minus; x') &minus; (y') + 1 = 0",
    note: "Substitusikan <i>x</i> = 2<i>k</i> &minus; <i>x</i>&prime; dan <i>y</i> = <i>y</i>&prime; ke persamaan garis yang diberikan.",
  },
  {
    expr: "&minus;2(2 &times; (&minus;2) &minus; x') &minus; (y') + 1 = 0",
    note: "Di sini <i>k</i> adalah nilai <i>x</i> dari garis refleksi, yaitu <i>x</i> = &minus;2, jadi ganti <i>k</i> dengan &minus;2.",
  },
  {
    expr: "&minus;2(&minus;4 &minus; x') &minus; (y') + 1 = 0",
    note: "Hitung 2 &times; (&minus;2) = &minus;4.",
  },
  {
    expr: "(&minus;2) &times; (&minus;4) &minus; (&minus;2)x' &minus; (y') + 1 = 0",
    note: "Kalikan &minus;2 dengan setiap suku di dalam tanda kurung.",
  },
  {
    expr: "&minus;2 &times; (&minus;4) &minus; (&minus;2)x' &minus; (y') + 1 = 0",
    note: "Tanda kurung luar hanya menandai &minus;2 yang dikalikan, jadi sudah tidak diperlukan lagi.",
  },
  {
    expr: "8 &minus; (&minus;2)x' &minus; (y') + 1 = 0",
    note: "Negatif dikali negatif menghasilkan positif: &minus;2 &times; (&minus;4) = 8.",
  },
  {
    expr: "8 + 2x' &minus; y' + 1 = 0",
    note: "Mengurangi bilangan negatif sama dengan menambah: &minus;(&minus;2)<i>x</i>&prime; menjadi +2<i>x</i>&prime;, dan &minus;(<i>y</i>&prime;) menjadi &minus;<i>y</i>&prime;.",
  },
  {
    expr: "8 + 2x' &minus; y' + 1 = 0",
    note: "Kini setiap suku ditulis dengan satu tanda di depannya.",
  },
  {
    expr: "2x' &minus; y' + 8 + 1 = 0",
    note: "Pindahkan suku-suku variabel ke depan agar bentuk persamaannya sesuai dengan pilihan jawaban.",
  },
  {
    expr: "2x' &minus; y' + 9 = 0",
    note: "Jumlahkan konstantanya: 8 + 1 = 9.",
  },
  {
    expr: "2x &minus; y + 9 = 0",
    note: "Tulis <i>x</i>&prime; sebagai <i>x</i> dan <i>y</i>&prime; sebagai <i>y</i>.",
  },
],


/* =============================================================================
   OPTIONAL — show the substitution step (index 0) as "Step 1"
   -----------------------------------------------------------------------------
   Two edits in components/MainCanvas/MainCanvas.js. The arrays above already
   work correctly with or without this change.

   1) In the guide-display effect (~line 940):
        const shouldShow = step === 4 && stepFourGuideIndex >= 1;
      becomes
        const shouldShow = step === 4 && stepFourGuideIndex >= 0;

      and, a few lines below:
        String(stepFourGuideIndex),
      becomes
        String(stepFourGuideIndex + 1),

   2) In renderStepFourGuideBox() (~line 2540):
        if (step !== 4 || stepFourGuideIndex < 1) return null;
      becomes
        if (step !== 4 || stepFourGuideIndex < 0) return null;

      and the "<" button's disabled test:
        disabled: stepFourGuideIndex <= 1,
      becomes
        disabled: stepFourGuideIndex <= 0,

   Q1 then runs Step 1..4, Q2 Step 1..7, Q3 Step 1..11.
   ========================================================================== */
