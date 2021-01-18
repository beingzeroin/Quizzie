$.ajaxSetup({
    headers: { 'token': localStorage.token }
});
let currentquestion = 0;
let questions;
alert(result)
result = JSON.parse(result)
let buttons = document.getElementById("display")
let heading = document.getElementById("heading")
let time = document.getElementById("timedisplay")

questions = result.data;
let code = ``
let ansdata = []
for (let i = 0; i < questions.length; i++) {

    let ansObj = {
        quesId: questions[i].questionId,
        selectedOption: null,
    };

    ansdata.push(ansObj)
}
let timer = Number(result.scheduledFor) + Number(result.duration) * 60 * 1000;
if (timer - Date.now() < 0) {
    alert("quiz time elapsed");
}


var x = setInterval(function() {
    var distance = timer - Date.now();
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    time.innerHTML = "<p >" +
        minutes + " minutes and " + seconds + " seconds</p>";

    if (distance <= 0) {
        clearInterval(x);
        time.innerHTML = "EXPIRED";
        submitans();
    }
}, 1);
code += `<h4 class='mb-4'><b>${questions[currentquestion].description}</b></h4>
        <div class="form-check">
          <label class="form-check-label" for="radio1">
            <input type="radio" class="form-check-input" id="radio1" name="ans" value="${questions[currentquestion].options[0].text}" >${questions[currentquestion].options[0].text}
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label" for="radio2">
            <input type="radio" class="form-check-input" id="radio2" name="ans" value="${questions[currentquestion].options[1].text}">${questions[currentquestion].options[1].text}
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label" for="radio3">
            <input type="radio" class="form-check-input" id="radio3" name="ans" value="${questions[currentquestion].options[2].text}">${questions[currentquestion].options[2].text}
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label" for="radio4">
            <input type="radio" class="form-check-input" id="radio4" name="ans" value="${questions[currentquestion].options[3].text}">${questions[currentquestion].options[3].text}
          </label>
        </div>
        <hr></hr>
        <div class="row">
    <div class="col">
    </div>
    <div class="col">
  
    `
if (currentquestion == (questions.length - 1)) {
    code += `<button type="button" class="btn btn-danger" onClick=submitans()>submit</button>
    </div>
    </div> `
    buttons.innerHTML = code

} else {
    code += `<button type="button" class="btn btn-danger" onClick=next()>next</button>
            `
    buttons.innerHTML = code
    heading.innerHTML = `<h2 style="color:#2980b9" class="mt-5"> QUESTION ${currentquestion+1} OF ${questions.length}</h2>`

}



function next() {
    currentquestion += 1;
    code = ``;
    code += `<h4 class='mb-4'><b>${questions[currentquestion].description}</b></h4>
    <div class="form-check">
      <label class="form-check-label" for="radio1">
        <input type="radio" class="form-check-input" id="radio1" name="ans" value="${questions[currentquestion].options[0].text}" >${questions[currentquestion].options[0].text}
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label" for="radio2">
        <input type="radio" class="form-check-input" id="radio2" name="ans" value="${questions[currentquestion].options[1].text}">${questions[currentquestion].options[1].text}
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label" for="radio3">
        <input type="radio" class="form-check-input" id="radio3" name="ans" value="${questions[currentquestion].options[2].text}">${questions[currentquestion].options[2].text}
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label" for="radio4">
        <input type="radio" class="form-check-input" id="radio4" name="ans" value="${questions[currentquestion].options[3].text}">${questions[currentquestion].options[3].text}
      </label>
    </div>
    <hr></hr>
    <div class="row">
    <div class="col">
   
    `
    code +=
        `<button type="button" class="btn btn-primary" onClick=prev()>prev</button>
        </div>`
    if (currentquestion == (questions.length - 1)) {
        code += `    <div class="col">
        <button type="button" class="btn btn-danger" onClick=submitans()>submit</button>
        </div></div>`

    } else {
        code += ` <div class="col"><button type="button" class="btn btn-danger" onClick=next('1')>next</button>
        </div></div>`

    }
    buttons.innerHTML = code

    heading.innerHTML = `<h2 style="color:#2980b9"class="mt-5"> QUESTION ${currentquestion+1} OF ${questions.length}</h2>`
    $('input[type=radio]').change(function() {
        ansdata[currentquestion].selectedOption = this.value;
        alert(JSON.stringify(ansdata))


    });
    $('input[name="' + 'ans' + '"][value="' + ansdata[currentquestion].selectedOption + '"]').prop('checked', true);

}

function prev() {
    currentquestion -= 1;
    code = ` `;
    code += `<h4 class='mb-4'><b>${questions[currentquestion].description}</b></h4>
    <div class="form-check">
      <label class="form-check-label" for="radio1">
        <input type="radio" class="form-check-input" id="radio1" name="ans" value="${questions[currentquestion].options[0].text}" >${questions[currentquestion].options[0].text}
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label" for="radio2">
        <input type="radio" class="form-check-input" id="radio2" name="ans" value="${questions[currentquestion].options[1].text}">${questions[currentquestion].options[1].text}
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label" for="radio3">
        <input type="radio" class="form-check-input" id="radio3" name="ans" value="${questions[currentquestion].options[2].text}">${questions[currentquestion].options[2].text}
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label" for="radio4">
        <input type="radio" class="form-check-input" id="radio4" name="ans" value="${questions[currentquestion].options[3].text}">${questions[currentquestion].options[3].text}
      </label>
    </div>
    <hr></hr>
    `

    if (currentquestion != 0) {
        code +=
            `<div class="row">
            <div class="col"><button type="button" class="btn btn-primary" onClick=prev('1')>prev</button>
            </div>`

    } else {
        code += `<div class="row"><div class="col"></div>`
    }
    if (currentquestion == (questions.length - 1)) {
        code += `<div class="col"><button type="button" class="btn btn-danger" onClick=submitans()>submit</button>
        </div></div>`
    } else {
        code += `<div class="col"><button type="button" class="btn btn-danger" onClick=next('1')>next</button>
        </div></div>`
    }
    buttons.innerHTML = code
    heading.innerHTML = `<h2 style="color:#2980b9"class="mt-5"> QUESTION ${currentquestion+1} OF ${questions.length}</h2>`

    $('input[type=radio]').change(function() {
        ansdata[currentquestion].selectedOption = this.value;
        alert(JSON.stringify(ansdata))


    });
    $('input[name="' + 'ans' + '"][value="' + ansdata[currentquestion].selectedOption + '"]').prop('checked', true);

}
$('input[type=radio]').change(function() {
    ansdata[currentquestion].selectedOption = this.value;
    alert(JSON.stringify(ansdata))
});
$('input[name="' + 'ans' + '"][value="' + ansdata[currentquestion].selectedOption + '"]').prop('checked', true);

function submitans() {
    $.ajax({
        url: "/api/quiz/check",
        method: "POST",
        data: {
            quizId: questions[0].quizId,
            questions: JSON.stringify(ansdata),
            timeStarted: result.scheduledFor,
            timeEnded: Date.now(),
        },
        success: function(result) {
            alert(JSON.stringify(result))
        }
    })
}