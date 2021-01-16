let currentquestion = 0;
let questions;

let buttons = document.getElementById("display")
let heading = document.getElementById("heading")
let time = document.getElementById("timedisplay")
$.ajax({
    url: "/api/quiz/start",
    data: { quizId: '5fffdc9a879d383c645b8097' },
    method: "PATCH",
    success: function(result) {
        questions = result.data;
        let code = ``
        let timer = Number(result.scheduledFor) + Number(result.duration) * 60 * 1000;

        var x = setInterval(function() {
            var distance = timer - Date.now();
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            time.innerHTML = "<p>" +
                minutes + " minutes and " + seconds + " seconds</p>";

            if (distance < 0) {
                clearInterval(x);
                time.innerHTML = "EXPIRED";
            }
        }, 1000);
        code += `<p><b>${questions[currentquestion].description}</b></p>
        <div class="form-check">
          <label class="form-check-label" for="radio1">
            <input type="radio" class="form-check-input" id="radio1" name="ans" value="option1" >${questions[currentquestion].options[0].text}
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label" for="radio2">
            <input type="radio" class="form-check-input" id="radio2" name="ans" value="option2">${questions[currentquestion].options[1].text}
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label" for="radio3">
            <input type="radio" class="form-check-input" id="radio3" name="ans" value="option3">${questions[currentquestion].options[2].text}
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label" for="radio4">
            <input type="radio" class="form-check-input" id="radio4" name="ans" value="option4">${questions[currentquestion].options[3].text}
          </label>
        </div>
        <hr></hr>
        `
        if (currentquestion == (questions.length - 1)) {
            code += `<button type="button" class="btn btn-success">submit</button>
            `
            buttons.innerHTML = code

        } else {
            code += `<button type="button" class="btn btn-success" onClick=next()>next</button>
            `
            buttons.innerHTML = code
            heading.innerHTML = `<h2 style="color:blue"> QUESTION ${currentquestion+1} of ${questions.length}</h2>`

        }

    },
    error: function(error) {
        alert(JSON.stringify((error)))

    }
})



function next() {
    currentquestion += 1;
    let code = ``;
    code += `<p><b>${questions[currentquestion].description}</b></p>
    <div class="form-check">
      <label class="form-check-label" for="radio1">
        <input type="radio" class="form-check-input" id="radio1" name="ans" value="option1" >${questions[currentquestion].options[0].text}
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label" for="radio2">
        <input type="radio" class="form-check-input" id="radio2" name="ans" value="option2">${questions[currentquestion].options[1].text}
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label" for="radio3">
        <input type="radio" class="form-check-input" id="radio3" name="ans" value="option3">${questions[currentquestion].options[2].text}
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label" for="radio4">
        <input type="radio" class="form-check-input" id="radio4" name="ans" value="option4">${questions[currentquestion].options[3].text}
      </label>
    </div>
    <hr></hr>
    `

    code +=
        `<button type="button" class="btn btn-success" onClick=prev()>prev</button>
`
    if (currentquestion == (questions.length - 1)) {
        code += `<button type="button" class="btn btn-success">submit</button>
        `
    } else {
        code += `<button type="button" class="btn btn-success" onClick=next('1')>next</button>
        `

    }
    buttons.innerHTML = code
    heading.innerHTML = `<h2 style="color:blue"> QUESTION ${currentquestion+1} of ${questions.length}</h2>`

}

function prev() {
    currentquestion -= 1;
    let code = ` `;
    code += `<p><b>${questions[currentquestion].description}</b></p>
    <div class="form-check">
      <label class="form-check-label" for="radio1">
        <input type="radio" class="form-check-input" id="radio1" name="ans" value="option1" >${questions[currentquestion].options[0].text}
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label" for="radio2">
        <input type="radio" class="form-check-input" id="radio2" name="ans" value="option2">${questions[currentquestion].options[1].text}
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label" for="radio3">
        <input type="radio" class="form-check-input" id="radio3" name="ans" value="option3">${questions[currentquestion].options[2].text}
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label" for="radio4">
        <input type="radio" class="form-check-input" id="radio4" name="ans" value="option4">${questions[currentquestion].options[3].text}
      </label>
    </div>
    <hr></hr>
    `

    if (currentquestion != 0) {
        code +=
            `<button type="button" class="btn btn-success" onClick=prev('1')>prev</button>
`
    }
    if (currentquestion == (questions.length - 1)) {
        code += `<button type="button" class="btn btn-success">prev</button>
        `
    } else {
        code += `<button type="button" class="btn btn-success" onClick=next('1')>next</button>
        `
    }
    buttons.innerHTML = code
    heading.innerHTML = `<h2 style="color:blue"> QUESTION ${currentquestion+1} of ${questions.length}</h2>`


}