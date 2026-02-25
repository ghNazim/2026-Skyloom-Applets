

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
<g clip-path="url(#clip0_1_117)">
<path class="triangle" d="M100.353 129.5H12.6475L56.5 23.3086L100.353 129.5Z" fill="#FF7ED1" stroke="white"/>
<path class="triangle" d="M312.353 186.5H224.647L268.5 80.3086L312.353 186.5Z" fill="#CC0000" stroke="white"/>
<path class="triangle" d="M242.353 387.5H154.647L198.5 281.309L242.353 387.5Z" fill="#00FF00" stroke="white"/>
<path class="triangle" d="M79.6475 21.5L167.353 21.5L123.5 127.691L79.6475 21.5Z" fill="#FF9900" stroke="white"/>
<path class="triangle" d="M84.9215 135.873L128.774 211.828L14.8833 226.946L84.9215 135.873Z" fill="#FF9900" stroke="white"/>
<circle class="circle" cx="173" cy="248" r="24.5" fill="#FFFF00" stroke="white"/>
<circle class="circle" cx="51" cy="406" r="24.5" fill="#CC0000" stroke="white"/>
<circle class="circle" cx="115" cy="407" r="24.5" fill="#FFFF00" stroke="white"/>
<circle class="circle" cx="274" cy="369" r="24.5" fill="#FFFF00" stroke="white"/>
<circle class="circle" cx="44" cy="262" r="24.5" fill="#00FF00" stroke="white"/>
<circle class="circle" cx="192" cy="47" r="24.5" fill="#FFFF00" stroke="white"/>
<path class="square" d="M71.5 441.5V490.5H22.5V441.5H71.5Z" fill="#00FFFF" stroke="white"/>
<path class="square" d="M137.5 441.5V490.5H88.5V441.5H137.5Z" fill="#00FFFF" stroke="white"/>
<path class="square" d="M135.5 232.5V281.5H86.5V232.5H135.5Z" fill="#00FFFF" stroke="white"/>
<path class="square" d="M241.5 82.5V131.5H192.5V82.5H241.5Z" fill="#00FFFF" stroke="white"/>
<path class="square" d="M174.5 142.5V191.5H125.5V142.5H174.5Z" fill="#00FFFF" stroke="white"/>
<path class="square" d="M298.5 22.5V71.5H249.5V22.5H298.5Z" fill="#00FFFF" stroke="white"/>
<rect class="rectangle" x="242.5" y="203.5" width="61" height="128" fill="#CC0000" stroke="white"/>
<rect class="rectangle" x="167.5" y="432.5" width="128" height="61" fill="#00FF00" stroke="white"/>
<rect class="rectangle" x="19.5" y="301.5" width="128" height="61" fill="#FF7ED1" stroke="white"/>
</g>
<defs>
<clipPath id="clip0_1_117">
<rect width="314" height="506" fill="white"/>
</clipPath>
</defs>
</svg>
`

const house_svg = `<svg width="332" height="313" viewBox="0 0 332 313" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect class="rectangle" x="29.5" y="144.5" width="273" height="152" fill="#D9D9D9" fill-opacity="0.01" stroke="white"/>
<rect class="rectangle" x="58.5" y="183.5" width="49" height="113" fill="#D9D9D9" fill-opacity="0.01" stroke="white"/>
<path class="square" d="M226.5 190.5V229.5H187.5V190.5H226.5Z" fill="#D9D9D9" fill-opacity="0.01" stroke="white"/>
<path class="square" d="M226.5 233.5V272.5H187.5V233.5H226.5Z" fill="#D9D9D9" fill-opacity="0.01" stroke="white"/>
<path class="square" d="M269.5 190.5V229.5H230.5V190.5H269.5Z" fill="#D9D9D9" fill-opacity="0.01" stroke="white"/>
<path class="square" d="M269.5 233.5V272.5H230.5V233.5H269.5Z" fill="#D9D9D9" fill-opacity="0.01" stroke="white"/>
<path class="triangle" d="M118.353 143.5H30.6475L74.5 37.3086L118.353 143.5Z" fill="#D9D9D9" fill-opacity="0.01" stroke="white"/>
<path class="triangle" d="M76.6475 36.5L164.353 36.5L120.5 142.691L76.6475 36.5Z" fill="#D9D9D9" fill-opacity="0.01" stroke="white"/>
<path class="triangle" d="M168.647 36.5L256.353 36.5L212.5 142.691L168.647 36.5Z" fill="#D9D9D9" fill-opacity="0.01" stroke="white"/>
<path class="triangle" d="M210.353 143.5H122.647L166.5 37.3086L210.353 143.5Z" fill="#D9D9D9" fill-opacity="0.01" stroke="white"/>
<path class="triangle" d="M302.353 143.5H214.647L258.5 37.3086L302.353 143.5Z" fill="#D9D9D9" fill-opacity="0.01" stroke="white"/>
<circle class="circle" cx="74.5" cy="108.5" r="16" fill="#D9D9D9" fill-opacity="0.01" stroke="white"/>
<circle class="circle" cx="166.5" cy="108.5" r="16" fill="#D9D9D9" fill-opacity="0.01" stroke="white"/>
<circle class="circle" cx="258.5" cy="108.5" r="16" fill="#D9D9D9" fill-opacity="0.01" stroke="white"/>
</svg>
`