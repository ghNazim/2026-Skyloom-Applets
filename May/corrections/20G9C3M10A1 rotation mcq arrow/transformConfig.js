const MCQ_RESULT_DELAY = 500;

const INITIAL_STEP = 0;
const INITIAL_QUESTION_INDEX = 0;

function getQuestionCount() {
  return APP_DATA.questions.length;
}

function getQuestion(index) {
  return APP_DATA.questions[index] || null;
}

function getQuestionHeading(question) {
  if (!question) return "";
  return APP_DATA.headings[question.findType] || "";
}

function isMultiAnswerQuestion(question) {
  return question && question.multiAnswer === true;
}

function getInitialAppState() {
  return {
    currentStep: INITIAL_STEP,
    currentQuestionIndex: INITIAL_QUESTION_INDEX,
    mcqSelectedIndices: [],
    mcqSelectedIndex: null,
    mcqResultState: null,
    mcqShowFeedback: false,
    mcqFeedbackText: "",
    mcqFeedbackType: null,
    mcqAnsweredCorrectly: false,
  };
}
