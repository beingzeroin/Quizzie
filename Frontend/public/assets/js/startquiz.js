$.ajaxSetup({
    headers: { 'token': localStorage.token }
});
let currentquestion = 0;
let questions;
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
    window.location.href = "/ui/dashboard"
}


var x = setInterval(function() {
    var distance = timer - Date.now();
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    time.innerHTML = '<h2 className="rem-time-display">' +
        minutes + " minutes and " + seconds + " seconds</h2>";

    if (distance <= 0) {
        clearInterval(x);
        time.innerHTML = "Time up";
        submitans();
    }
}, 1);
code += `<p class="question">${questions[currentquestion].description}</p>
        <div class="form-check">
          <label class="form-check-label" for="radio1">
            <input type="radio" class="form-check-input mb-5" id="radio1" name="ans" value="${questions[currentquestion].options[0].text}" >${questions[currentquestion].options[0].text}
          </label>
        </div>

        <div class="form-check">
          <label class="form-check-label" for="radio2">
            <input type="radio" class="form-check-input mb-5" id="radio2" name="ans" value="${questions[currentquestion].options[1].text}">${questions[currentquestion].options[1].text}
          </label>
        </div>

        <div class="form-check">
          <label class="form-check-label" for="radio3">
            <input type="radio" class="form-check-input mb-5" id="radio3" name="ans" value="${questions[currentquestion].options[2].text}">${questions[currentquestion].options[2].text}
          </label>
        </div>
        <div class="form-check">
          <label class="form-check-label" for="radio4">
            <input type="radio" class="form-check-input mb-5" id="radio4" name="ans" value="${questions[currentquestion].options[3].text}">${questions[currentquestion].options[3].text}
          </label>
        </div>
        <div class='mt-4 mb-4'style="background-color:black;height:4px;"></div>

        <div class="row">
    <div class="col">
    </div>
    <div class="col">
    <div class="row">
   
    <div class="col">
    `
if (currentquestion == (questions.length - 1)) {
    code += `<button type="button" class="btn btn-danger button" onClick=submitpopup()>submit</button>
    </div>
    <div class="col">
    </div>
    </div></div></div>  `
    buttons.innerHTML = code

} else {
    code += `<button type="button" class="btn btn-danger button" onClick=next()>next</button>
    </div>
    <div class="col">
    </div>
    </div></div></div>  `
    buttons.innerHTML = code

}
heading.innerHTML = `<h2 style="color:#2980b9" class="mt-5"> QUESTION ${currentquestion+1} OF ${questions.length}</h2>`





function next() {
    currentquestion += 1;
    code = ``;
    code += `<p class="question">${questions[currentquestion].description}</p>
    <div class="form-check">
      <label class="form-check-label" for="radio1">
        <input type="radio" class="form-check-input mb-5" id="radio1" name="ans" value="${questions[currentquestion].options[0].text}" >${questions[currentquestion].options[0].text}
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label" for="radio2">
        <input type="radio" class="form-check-input mb-5" id="radio2" name="ans" value="${questions[currentquestion].options[1].text}">${questions[currentquestion].options[1].text}
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label" for="radio3">
        <input type="radio" class="form-check-input mb-5" id="radio3" name="ans" value="${questions[currentquestion].options[2].text}">${questions[currentquestion].options[2].text}
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label" for="radio4">
        <input type="radio" class="form-check-input mb-5" id="radio4" name="ans" value="${questions[currentquestion].options[3].text}">${questions[currentquestion].options[3].text}
      </label>
    </div>
    <div class='mt-4 mb-4'style="background-color:black;height:4px;"></div>
    <div class="row">
       <div class="col">
        <div class="row">
          <div class="col">
       
   
    `
    code +=
        `<button type="button" class="btn btn-primary button" onClick=prev()>previous</button>
        </div>  <div class="col"></div> </div>  </div> `
    if (currentquestion == (questions.length - 1)) {
        code += `    <div class="col">
        <div class="row">
        <div class="col">
        <button type="button" class="btn btn-danger button" onClick=submitpopup()>submit</button>
        </div><div class="col"></div> </div>  </div></div>`

    } else {
        code += `  <div class="col">
        <div class="row">
        <div class="col"><button type="button" class="btn btn-danger button" onClick=next('1')>next</button>
        </div><div class="col"></div> </div>  </div></div>`

    }
    buttons.innerHTML = code

    heading.innerHTML = `<h2 style="color:#2980b9"class="mt-5"> QUESTION ${currentquestion+1} OF ${questions.length}</h2>`
    $('input[type=radio]').change(function() {
        ansdata[currentquestion].selectedOption = this.value;


    });
    $('input[name="' + 'ans' + '"][value="' + ansdata[currentquestion].selectedOption + '"]').prop('checked', true);

}

function prev() {
    currentquestion -= 1;
    code = ` `;
    code += `<p class="question">${questions[currentquestion].description}</p>
    <div class="form-check">
      <label class="form-check-label" for="radio1">
        <input type="radio" class="form-check-input mb-5" id="radio1" name="ans" value="${questions[currentquestion].options[0].text}" >${questions[currentquestion].options[0].text}
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label" for="radio2">
        <input type="radio" class="form-check-input mb-5" id="radio2" name="ans" value="${questions[currentquestion].options[1].text}">${questions[currentquestion].options[1].text}
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label" for="radio3">
        <input type="radio" class="form-check-input mb-5" id="radio3" name="ans" value="${questions[currentquestion].options[2].text}">${questions[currentquestion].options[2].text}
      </label>
    </div>
    <div class="form-check">
      <label class="form-check-label" for="radio4">
        <input type="radio" class="form-check-input mb-5" id="radio4" name="ans" value="${questions[currentquestion].options[3].text}">${questions[currentquestion].options[3].text}
      </label>
    </div>
    <div class='mt-4 mb-4'style="background-color:black;height:4px;"></div>

    `

    if (currentquestion != 0) {
        code +=
            `<div class="row">
            <div class="col">
             <div class="row">
               <div class="col"><button type="button" class="btn btn-primary button" onClick=prev()>previous</button>
               </div>  <div class="col"></div> </div>  </div>`

    } else {
        code += `<div class="row">
        <div class="col">
         <div class="row">
           <div class="col"> </div>  <div class="col"></div> </div>  </div>`
    }
    if (currentquestion == (questions.length - 1)) {
        code += `<div class="col">
        <div class="row">
        <div class="col"><button type="button" class="btn btn-danger button" onClick=submitpopup()>submit</button>
        </div><div class="col"></div> </div>  </div></div>`
    } else {
        code += `<div class="col">
        <div class="row">
        <div class="col"><button type="button" class="btn btn-danger button" onClick=next('1')>next</button>
        </div><div class="col"></div> </div>  </div></div>`
    }
    buttons.innerHTML = code
    heading.innerHTML = `<h2 style="color:#2980b9"class="mt-5"> QUESTION ${currentquestion+1} OF ${questions.length}</h2>`

    $('input[type=radio]').change(function() {
        ansdata[currentquestion].selectedOption = this.value;


    });
    $('input[name="' + 'ans' + '"][value="' + ansdata[currentquestion].selectedOption + '"]').prop('checked', true);

}
$('input[type=radio]').change(function() {
    ansdata[currentquestion].selectedOption = this.value;
});
$('input[name="' + 'ans' + '"][value="' + ansdata[currentquestion].selectedOption + '"]').prop('checked', true);

function submitans() {
    $.ajax({
        url: "/api/quiz/checkSubmission/" + questions[0].quizId,
        method: "GET",
        success: function(result) {
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
                    window.location.href = "/ui/result/" + questions[0].quizId
                }
            })

        },
        error: function(err) {
            alert(err.responseJSON.message)
            window.location.href = "/ui/result/" + questions[0].quizId
        }
    })

}

function submitpopup() {
    let modal = document.getElementById("submitpopup");
    let code = `<p style="text-align:center">Are you sure you want to submit the test?</p>`
    code += `<div class="text-center"><button type="button" class="btn btn-warning" onClick="submitans()">Yes</button>
        <button type="button"  class="btn btn-info closepopup">No</button></div>
        `
    document.getElementById("displaysubmitpopup").innerHTML = code
    modal.style.display = "block";
    $(".closepopup").click(() => {
        modal.style.display = "none";

    })
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}