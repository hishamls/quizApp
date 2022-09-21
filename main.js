// selectors
let countSpan = document.querySelector(".quizInfo .count span");
let quSpanContainer = document.querySelector(".bullets");
let quizAreaDiv = document.querySelector(".quizArea");
let answersAreaDiv = document.querySelector(".answersArea");
let submitBtn = document.querySelector(".submit-button");
let progressDiv = document.querySelector(".progressArea");
let resultAreaDiv = document.querySelector(".results");
let countDownDiv = document.querySelector(".countDown");

let currentIndex = 0;
let totalRAnswers = 0;
let countDownInterval;

getQuestions();

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let questionsCount = questionsObject.length;
      creatingBullests(questionsCount);
      addQuestionData(questionsObject[currentIndex], questionsCount);
      countDown(10, questionsCount);
      // CLICK SUBMIT BUTTON //
      submitBtn.onclick = function () {
        let theRightAnswer = questionsObject[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(theRightAnswer, questionsCount);
        quizAreaDiv.innerHTML = "";
        answersAreaDiv.innerHTML = "";
        addQuestionData(questionsObject[currentIndex], questionsCount);
        handelBullets();
        clearInterval(countDownInterval);
        countDown(10, questionsCount);
        showResults(questionsCount);
      };
    }
  };
  myRequest.open("GET", "quiz.json", true);
  myRequest.send();
}

function creatingBullests(quNum) {
  countSpan.innerHTML = quNum;
  for (let i = 0; i < quNum; i++) {
    let bulletSpan = document.createElement("span");
    quSpanContainer.appendChild(bulletSpan);
    if (i === 0) {
      bulletSpan.className = "on";
    }
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    //Create Question//
    let questionH2 = document.createElement("h2");
    let quTxt = document.createTextNode(obj.title);
    questionH2.appendChild(quTxt);
    quizAreaDiv.appendChild(questionH2);
    //Create Answers//
    for (let i = 1; i <= 4; i++) {
      let oneAnswerDiv = document.createElement("div");
      oneAnswerDiv.className = "oneAnswerDiv";
      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      if (i === 1) {
        radioInput.checked = true;
      }

      let lable = document.createElement("label");
      lable.htmlFor = `answer_${i}`;
      let labelText = document.createTextNode(obj[`answer_${i}`]);
      lable.appendChild(labelText);

      oneAnswerDiv.appendChild(radioInput);
      oneAnswerDiv.appendChild(lable);

      answersAreaDiv.appendChild(oneAnswerDiv);
    }
  }
}

function checkAnswer(rAnswer, qCount) {
  let answers = document.getElementsByName("question");
  let choosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }
  // console.log(`the choosen answer is ${choosenAnswer}`);
  // console.log(`the write answer is ${rAnswer}`);
  if (choosenAnswer === rAnswer) {
    totalRAnswers++;
    console.log(`Good Answer`);
  }
}

function handelBullets() {
  let bulletSpans = document.querySelectorAll(".bullets span");
  let bulletsArray = Array.from(bulletSpans);
  bulletsArray.forEach((span, inedx) => {
    if (currentIndex === inedx) {
      span.className = "on";
    }
  });
}

function showResults(qCount) {
  let theResult;
  if (currentIndex === qCount) {
    quizAreaDiv.remove();
    answersAreaDiv.remove();
    submitBtn.remove();
    progressDiv.remove();
    if (totalRAnswers === qCount) {
      theResult = `<span class = "perfect">Perfect! </span> <span> Your score is ${totalRAnswers} from ${qCount}</span>`;
    } else if (totalRAnswers >= qCount / 2 && totalRAnswers < qCount) {
      theResult = `<span class = "good">Pass! </span> <span> Your score is ${totalRAnswers} from ${qCount}</span>`;
    } else {
      theResult = `<span class = "bad">Fail! </span> <span> Your score is ${totalRAnswers} from ${qCount}</span>`;
    }
    resultAreaDiv.innerHTML = theResult;
    resultAreaDiv.style.backgroundColor = "#ddd";
    resultAreaDiv.style.height = "70";
    resultAreaDiv.style.padding = "20px";
    resultAreaDiv.style.margin = "20px";
  }
}

function countDown(duration, qCount) {
  if (currentIndex < qCount) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countDownDiv.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        console.log("Time is out!");
        submitBtn.click();
      }
    }, 1000);
  }
}
