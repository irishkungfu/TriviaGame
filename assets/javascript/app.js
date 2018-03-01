var time = 3;
var showTimer;
var questionCounter = 0;
var correct = 0;
var incorrect = 0;
var noAnswer = 0;
var answerSubmitted = false;
var currentId;
var questionTimer;

var questionPool = {
  response_code: 0,
  results: [
    {
      category: "Entertainment: Video Games",
      type: "multiple",
      difficulty: "easy",
      question: "Which game did NOT get financed via Crowdfunding?",
      correct_answer: "Enter the Gungeon",
      incorrect_answers: ["Town of Salem", "Undertale", "Tower Unite"]
    },
    {
      category: "Entertainment: Film",
      type: "multiple",
      difficulty: "medium",
      question:
        "Who played Batman in the 1997 film &quot;Batman and Robin&quot;?",
      correct_answer: "George Clooney",
      incorrect_answers: ["Michael Keaton", "Val Kilmer", "Christian Bale"]
    },
    {
      category: "Entertainment: Japanese Anime & Manga",
      type: "multiple",
      difficulty: "easy",
      question: "What is the name of the corgi in Cowboy Bebop?",
      correct_answer: "Einstein",
      incorrect_answers: ["Edward", "Rocket", "Joel"]
    },
    {
      category: "Entertainment: Film",
      type: "multiple",
      difficulty: "medium",
      question:
        "Which iconic character is featured in movies such as &quot;The Enforcer&quot;, &quot;Sudden Impact&quot;, and &quot;The Dead Pool&quot;?",
      correct_answer: "Dirty Harry",
      incorrect_answers: ["Indiana Jones", "James Bond", "Harry Potter"]
    },
    {
      category: "Entertainment: Cartoon & Animations",
      type: "multiple",
      difficulty: "easy",
      question: "Which of the following is not a Flintstones character?",
      correct_answer: "Lord Rockingham IX",
      incorrect_answers: ["Rockhead Slate", "The Great Gazoo", "Barney Rubble"]
    },
    {
      category: "Sports",
      type: "multiple",
      difficulty: "easy",
      question: "Which team has won the most Stanley Cups in the NHL?",
      correct_answer: "Montreal Canadians",
      incorrect_answers: [
        "Chicago Blackhawks",
        "Toronto Maple Leafs",
        "Detroit Red Wings"
      ]
    },
    {
      category: "Geography",
      type: "multiple",
      difficulty: "medium",
      question: "What was the most populous city in the Americas in 2015?",
      correct_answer: "Sao Paulo",
      incorrect_answers: ["New York", "Mexico City", "Los Angeles"]
    },
    {
      category: "Entertainment: Music",
      type: "multiple",
      difficulty: "medium",
      question:
        "Which artist or group did John Lennon consider &quot;son(s) of the Beatles&quot;?",
      correct_answer: "Jeff Lynnes Electric Light Orchestra",
      incorrect_answers: ["The Rolling Stones", "Pink Floyd", "The Who"]
    },
    {
      category: "Entertainment: Video Games",
      type: "multiple",
      difficulty: "easy",
      question:
        "Which character in the &quot;Animal Crossing&quot; series uses the phrase &quot;zip zoom&quot; when talking to the player?",
      correct_answer: "Scoot",
      incorrect_answers: ["Drake", "Bill", "Mallary"]
    },
    {
      category: "Entertainment: Television",
      type: "multiple",
      difficulty: "hard",
      question:
        "In season one of the US Kitchen Nightmares, Gordan Ramsay tried to save 10 different restaurants. How many ended up closing afterwards?",
      correct_answer: "9",
      incorrect_answers: ["6", "3", "0"]
    }
  ]
};
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
      if (answer === questionPool.results[questionCounter - 1].correct_answer) {
        $(this).addClass("winner");
        $("#console").html("<h1>You Got it Right!</h1>");

        setTimeout(function() {
          correct++;
          newQuestion();
          answerSubmitted = false;
          $("#" + currentId).removeClass("winner");
        }, 3000);
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
        }, 3000);
      }

      answerSubmitted = true;
    }
  }

  function start() {
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
