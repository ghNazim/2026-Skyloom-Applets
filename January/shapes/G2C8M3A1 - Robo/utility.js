

const audioCache = {};
const sounds = ["correct", "wrong", "click", "congrats","tick"];
sounds.forEach((name) => {
  const audio = new Audio(`sound/${name}.mp3`);
  audio.load(); // Preloads the audio
  audioCache[name] = audio;
});
function playSound(filename) {
  if (!audioCache[filename]) {
    const audio = new Audio(`sound/${filename}.mp3`);
    audioCache[filename] = audio;
  }
  const sound = audioCache[filename].cloneNode(); // Clone so it can overlap itself
  sound.play();
}


function handleComma(sentence) {
  if (current_language !== "id" || !sentence) {
    return sentence;
  }
  
  return sentence.replace(/,/g, "<cm>,</cm>");
}

const scrambled_svg = `<svg width="314" height="506" viewBox="0 0 314 506" fill="none" xmlns="http://www.w3.org/2000/svg">
<path class="triangle" d="M10.5547 18L69.4453 18L40 69.001L10.5547 18Z" fill="#0077D1" stroke="white"/>
<path class="triangle" d="M105.445 84H46.5547L76 32.999L105.445 84Z" fill="#0077D1" stroke="white"/>
<path class="triangle" d="M190.445 363H131.555L161 311.999L190.445 363Z" fill="#0077D1" stroke="white"/>
<path class="triangle" d="M251.545 207.677L250.128 148.804L301.823 177.014L251.545 207.677Z" fill="#0077D1" stroke="white"/>
<path class="triangle" d="M25.5448 357.677L24.1284 298.804L75.8228 327.014L25.5448 357.677Z" fill="#FA9D11" stroke="white"/>
<path class="triangle" d="M23.5448 159.677L22.1284 100.804L73.8228 129.014L23.5448 159.677Z" fill="#8ABE37" stroke="white"/>
<circle class="circle" cx="166" cy="252" r="24.5" fill="#EE4231" stroke="white"/>
<circle class="circle" cx="51" cy="406" r="24.5" fill="#EE4231" stroke="white"/>
<circle class="circle" cx="108" cy="127" r="24.5" fill="#EE4231" stroke="white"/>
<circle class="circle" cx="221" cy="125" r="24.5" fill="#EE4231" stroke="white"/>
<circle class="circle" cx="44" cy="262" r="24.5" fill="#8ABE37" stroke="white"/>
<circle class="circle" cx="100" cy="357" r="24.5" fill="#0077D1" stroke="white"/>
<circle class="circle" cx="164" cy="105" r="24.5" fill="#8ABE37" stroke="white"/>
<circle class="circle" cx="133" cy="52" r="24.5" fill="#FA9D11" stroke="white"/>
<path class="square" d="M77.5 441.5V490.5H28.5V441.5H77.5Z" fill="#0077D1" stroke="white"/>
<path class="square" d="M241.5 17.5V66.5H192.5V17.5H241.5Z" fill="#EE4231" stroke="white"/>
<path class="square" d="M301.5 47.5V96.5H252.5V47.5H301.5Z" fill="#8ABE37" stroke="white"/>
<path class="square" d="M233.5 278.5V327.5H184.5V278.5H233.5Z" fill="#FA9D11" stroke="white"/>
<rect class="rectangle" x="84.5" y="225.5" width="44" height="94" fill="#FA9D11" stroke="white"/>
<rect class="rectangle" x="255.5" y="393.5" width="44" height="94" fill="#FA9D11" stroke="white"/>
<rect class="rectangle" x="255.5" y="277.5" width="44" height="94" fill="#8ABE37" stroke="white"/>
<rect class="rectangle" x="119.5" y="446.5" width="94" height="44" fill="#FA9D11" stroke="white"/>
<rect class="rectangle" x="122.5" y="383.5" width="94" height="44" fill="#8ABE37" stroke="white"/>
<rect class="rectangle" x="205.5" y="221.5" width="94" height="44" fill="#FA9D11" stroke="white"/>
<rect class="rectangle" x="136.5" y="162.5" width="94" height="44" fill="#0077D1" stroke="white"/>
<rect class="rectangle" x="16.5" y="169.5" width="94" height="44" fill="#0077D1" stroke="white"/>
</svg>
`;

const house_svg = `<svg width="298" height="385" viewBox="0 0 298 385" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect class="square" x="112.402" y="17" width="72" height="72" stroke="white" stroke-width="2"/>
<rect class="rectangle" x="140.902" y="89.5" width="16" height="27" stroke="white"/>
<rect class="rectangle" x="183.902" y="35.5" width="21" height="35" stroke="white"/>
<rect class="rectangle" x="91.902" y="35.5" width="21" height="35" stroke="white"/>
<rect class="square" x="95.402" y="117" width="107" height="107" stroke="white" stroke-width="2"/>
<rect class="rectangle" x="168.902" y="252.5" width="30" height="86" stroke="white"/>
<path class="triangle" d="M183.469 226.75C183.662 226.417 184.142 226.417 184.335 226.75L198.625 251.5C198.817 251.833 198.576 252.25 198.191 252.25H169.613C169.228 252.25 168.987 251.833 169.179 251.5L183.469 226.75Z" stroke="white"/>
<circle class="circle" cx="183.902" cy="354.5" r="15" stroke="white"/>
<rect class="rectangle" x="205.183" y="146.566" width="30" height="86" transform="rotate(-30 205.183 146.566)" stroke="white"/>
<path class="triangle" d="M204.924 116.982C204.924 116.597 205.34 116.357 205.673 116.549L230.424 130.838C230.757 131.031 230.757 131.512 230.424 131.705L205.674 145.994C205.341 146.186 204.924 145.946 204.924 145.561L204.924 116.982Z" stroke="white"/>
<circle class="circle" cx="269.174" cy="227.4" r="15" transform="rotate(-30 269.174 227.4)" stroke="white"/>
<circle class="circle" cx="132.402" cy="46" r="10.5" stroke="white"/>
<circle class="circle" cx="165.402" cy="46" r="10.5" stroke="white"/>
<rect class="rectangle" x="66.183" y="131.566" width="30" height="86" transform="rotate(30 66.183 131.566)" stroke="white"/>
<path class="triangle" d="M91.6738 116.549C92.007 116.357 92.423 116.597 92.4231 116.982L92.4236 145.561C92.4236 145.946 92.0064 146.186 91.6731 145.994L66.9238 131.705C66.5905 131.512 66.59 131.031 66.9233 130.838L91.6738 116.549Z" stroke="white"/>
<circle class="circle" cx="28.1734" cy="227.4" r="15" transform="rotate(30 28.1734 227.4)" stroke="white"/>
<rect class="rectangle" x="96.902" y="252.5" width="30" height="86" stroke="white"/>
<path class="triangle" d="M111.469 226.75C111.662 226.417 112.142 226.417 112.335 226.75L126.625 251.5C126.817 251.833 126.576 252.25 126.191 252.25H97.6129C97.2281 252.25 96.987 251.833 97.1793 251.5L111.469 226.75Z" stroke="white"/>
<circle class="circle" cx="111.902" cy="354.5" r="15" stroke="white"/>
<rect class="rectangle" x="132.902" y="68.5" width="32" height="11" stroke="white"/>
</svg>
`;


const showGreyWhiteTally = (whiteCount) => {
  const n = Math.max(0, Math.min(10, parseInt(whiteCount, 10) || 0));
  const allLines = [
    '<line x1="5.5" y1="2" x2="5.5" y2="17"',
    '<line x1="12.5" y1="2" x2="12.5" y2="17"',
    '<line x1="19.5" y1="2" x2="19.5" y2="17"',
    '<line x1="26.5" y1="2" x2="26.5" y2="17"',
    '<line x1="28.2443" y1="2.43625" x2="3.2443" y2="16.4363"',
    '<line x1="37.5" y1="2" x2="37.5" y2="17"',
    '<line x1="44.5" y1="2" x2="44.5" y2="17"',
    '<line x1="51.5" y1="2" x2="51.5" y2="17"',
    '<line x1="58.5" y1="2" x2="58.5" y2="17"',
    '<line x1="60.2443" y1="2.43625" x2="35.2443" y2="16.4363"'
  ];
  const content = allLines.map((line, i) => {
    const stroke = i < n ? 'white' : '#555555';
    return `${line} stroke="${stroke}"/>`;
  }).join('\n');
  return `<svg viewBox="0 0 62 19" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">\n${content}\n</svg>`;
};

const showTally = (num) => {
  const n = Math.max(0, Math.min(10, parseInt(num, 10) || 0));
  if (n === 0) {
    return `<svg viewBox="0 0 30 19" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet"></svg>`;
  }
  // First group of 5: 4 vertical + 1 diagonal
  const group1 = [
    '<line x1="5.5" y1="2" x2="5.5" y2="17" stroke="white"/>',
    '<line x1="12.5" y1="2" x2="12.5" y2="17" stroke="white"/>',
    '<line x1="19.5" y1="2" x2="19.5" y2="17" stroke="white"/>',
    '<line x1="26.5" y1="2" x2="26.5" y2="17" stroke="white"/>',
    '<line x1="28.2443" y1="2.43625" x2="3.2443" y2="16.4363" stroke="white"/>'
  ];
  // Second group of 5 (for 6–10), same pattern shifted by 32 in x
  const group2 = [
    '<line x1="37.5" y1="2" x2="37.5" y2="17" stroke="white"/>',
    '<line x1="44.5" y1="2" x2="44.5" y2="17" stroke="white"/>',
    '<line x1="51.5" y1="2" x2="51.5" y2="17" stroke="white"/>',
    '<line x1="58.5" y1="2" x2="58.5" y2="17" stroke="white"/>',
    '<line x1="60.2443" y1="2.43625" x2="35.2443" y2="16.4363" stroke="white"/>'
  ];
  let content, viewBox;
  if (n <= 5) {
    content = group1.slice(0, n).join('\n');
    viewBox = "0 0 30 19";
  } else {
    content = group1.join('\n') + '\n' + group2.slice(0, n - 5).join('\n');
    viewBox = "0 0 62 19";
  }
  return `<svg viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">\n${content}\n</svg>`;
};
