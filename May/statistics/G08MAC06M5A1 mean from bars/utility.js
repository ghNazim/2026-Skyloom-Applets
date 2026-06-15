const audioCache = {};
const sounds = ["correct", "wrong", "click"];
sounds.forEach((name) => {
  const audio = new Audio("sound/" + name + ".mp3");
  audio.load();
  audioCache[name] = audio;
});

function playSound(filename) {
  if (!audioCache[filename]) {
    const audio = new Audio("sound/" + filename + ".mp3");
    audioCache[filename] = audio;
  }
  const sound = audioCache[filename].cloneNode();
  sound.play();
}

function getStepFinalContent(step) {
  var stepData = APP_DATA.steps[step];
  if (!stepData) {
    return { questionText: "", navText: "" };
  }

  if (step === 1) {
    return {
      questionText: stepData.questionText,
      navText: stepData.navText,
    };
  }
  if (step === 2) {
    return {
      questionText: stepData.questionAfterCorrect,
      navText: stepData.navAfterCorrect,
    };
  }
  if (step === 3) {
    return {
      questionText: stepData.questionAllFilled,
      navText: stepData.navAllFilled,
    };
  }
  if (step === 4) {
    return {
      questionText: stepData.questionFinal,
      navText: stepData.navFinal,
    };
  }
  if (step === 5) {
    return {
      questionText: stepData.questionText,
      navText: stepData.navText,
    };
  }
  if (step === 6) {
    return {
      questionText: stepData.questionText,
      navText: stepData.navComplete,
    };
  }

  return { questionText: "", navText: "" };
}
