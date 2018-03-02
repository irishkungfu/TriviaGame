var time = 3;
var showTimer;
var questionCounter = 0;
var correct = 0;
var incorrect = 0;
var noAnswer = 0;
var answerSubmitted = false;
var currentId;
var questionTimer;
var questionPool;
var queryURL =
  "https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple";

$(document).ready(function() {
  $("#start-button").click(start);
  $(".answer").click(userAnswer);

  function userAnswer() {
    // check to see if an answer has already been submitted
    $("#sub-console").removeClass("d-none");
    $("#sub-console").text("");
    var answer = $(this).html();
    if (answerSubmitted === false && answer !== null) {
      clearInterval(questionTimer);
      currentId = $(this).attr("id");
      JsonAnswer = decodeHtml(
        questionPool.results[questionCounter - 1].correct_answer
      );
      function decodeHtml(truth) {
        return $("<div>")
          .html(truth)
          .text();
      }

      console.log("correct answer-object: " + JsonAnswer);
      console.log("answer: " + answer);
      if (answer === JsonAnswer) {
        $(this).addClass("winner");
        $("#console").html("<h1>You Got it Right!</h1>");

        setTimeout(function() {
          correct++;
          newQuestion();
          answerSubmitted = false;
          $("#" + currentId).removeClass("winner");
        }, 3000); // correct length is 3000
      } else {
        incorrect++;
        $(this).addClass("loser");
        $("#console").html(
          "<h1>Sorry, maybe next time.</h1><br>The correct answer is " +
            '"' +
            questionPool.results[questionCounter - 1].correct_answer +
            '"'
        );
        setTimeout(function() {
          newQuestion();
          answerSubmitted = false;
          $("#" + currentId).removeClass("loser");
        }, 3000); // change to 3000 for final project
      }

      answerSubmitted = true;
    }
  }

  function start() {
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      questionPool = response;
    });
    $("#start-button").addClass("d-none");
    $("#sub-console").removeClass("d-none");
    $("#sub-console").text("");

    showTimer = setInterval(function() {
      timerDisplay();
    }, 1000); // change back to 1000 after completion
  }

  function timerDisplay() {
    $("#console").html("<div id='timer'>" + time + "</div>");
    $("timer").addClass("on");

    if (time === 0) {
      newQuestion();
      stop();
    } else {
      time--;
    }
  }

  function stop() {
    clearInterval(showTimer);
  }

  function newQuestion() {
    $("#sub-console").removeClass("d-none");

    if (questionCounter < questionPool.results.length) {
      var time2 = 10;
      questionTimer = setInterval(function() {
        // debugger;

        if (time2 === 0) {
          clearInterval(questionTimer);
          $("#sub-console").addClass("d-none");
          $("#sub-console").text("");
          $(".answer").unbind(event);

          $("#console").html(
            "<h1>You didn't submit an answer!</h1><br>The correct answer is " +
              '"' +
              questionPool.results[questionCounter - 1].correct_answer +
              '"'
          );
          setTimeout(function() {
            noAnswer++;
            newQuestion();
            $(".answer").bind("click", userAnswer);

            // answerSubmitted = true;
          }, 3000);
        } else {
          $("#sub-console").text(time2);
          time2--;
        }
      }, 1000);

      $("#console").html(questionPool.results[questionCounter].question);

      // hides start class and makes guess boxes visible
      $("#intro").addClass("d-none");
      $("#guess-button__wrapper").removeClass("d-none");

      // randomize order of the answers

      var questionArray = [
        questionPool.results[questionCounter].correct_answer,
        questionPool.results[questionCounter].incorrect_answers[0],
        questionPool.results[questionCounter].incorrect_answers[1],
        questionPool.results[questionCounter].incorrect_answers[2]
      ];

      questionArray = shuffle(questionArray);

      $("#answer1").html(questionArray[0]);
      $("#answer2").html(questionArray[1]);
      $("#answer3").html(questionArray[2]);
      $("#answer4").html(questionArray[3]);
      questionCounter++;
    } else {
      // restart app button display
      // display wins and losses
      $("#console").html(
        "You answered " +
          correct +
          " questions correctly, missed " +
          incorrect +
          " questions and you didn't answer " +
          noAnswer +
          " questions."
      );
      $("#start-button").removeClass("d-none");
      $("#start-button").text("Play Again");
      $("#start-button").unbind(event);
      $("#start-button").bind("click", reset);

      $("#intro").removeClass("d-none");
      $("#guess-button__wrapper").addClass("d-none");
      $("#sub-console").addClass("d-none");
    }
  }
  function reset() {
    time = 3;
    showTimer = null;
    questionCounter = 0;
    correct = 0;
    incorrect = 0;
    noAnswer = 0;
    answerSubmitted = false;
    currentId = null;
    questionTimer = null;
    start();
  }

  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
});
