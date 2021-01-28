var questionId, QuizDetails, results, deletequestionId;

$.ajaxSetup({
    headers: { 'token': localStorage.token }
});
if (!localStorage.token)
    location.href = '/'


if (!localStorage.token)
    location.href = '/'
if (localStorage.usertype != "Owner")
    location.href = '/'

function fetchdata() {
    quizId = location.href.split('/').slice(-1)[0]
    $.ajax({
        url: "/api/question/all/" + quizId,
        method: "GET",
        success: function(result) {
            // console.log(result.result);
            QuizDetails = result.result;
            code = `<div class="accordion" id="parent" >`;
            for (let i = 0; i < result.result.length; i++) {
                code += `
                <div class="accordion-item" style="width:100%;" >
                <h2 class="accordion-header" id="heading${i+1}">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i+1}" aria-expanded="true" aria-controls="collapse${i+1}" style="font-size:20px;max-width:100%;">
                <span class="mr-3" data-toggle='modal' data-target="#updatequestions"  "> ${result.result[i].description}  
                </button>
              </h2>
    <div id="collapse${(i+1)}" class="accordion-collapse collapse" aria-labelledby="heading${(i+1)}" data-bs-parent="#parent">
      <div class="accordion-body">`;
                for (let j = 0; j < 4; j++) {

                    if ((result.result[i].options)[j].text == result.result[i].correctAnswer)
                        code += `<p  style="color:green;">&#8857 &nbsp  ${(result.result[i].options)[j].text}</p>`;
                    else
                        code += `<p style="color:black;"> &#8857 &nbsp   ${result.result[i].options[j].text} </p> 
      `
                }
                code +=
                    `</div>
    </div>
    </div>
 `
            }
            code += "</div>"
                // console.log(code);
            $("#submissions").html(code);
        },
        error: function(err) {
            if (err.responseJSON.message == "Unauthorized access") {
                location.href = "/"
            }
            console.log(err);
        }
    });
}
$(document).ready(function() {
    fetchdata();
});

function deletequiz() {
    let quizId = location.href.split('/').slice(-1)[0]
        // alert(quizId)
    $.ajax({
        url: "/api/owner/quiz/" + quizId,
        method: "DELETE",
        success: function(result) {
            location.href = '/ui/dashboard/owner'
        },
        error: function(err) {
            if (err.responseJSON.message == "Unauthorized access") {
                location.href = "/"
            } else {
                console.log(err);
                location.reload(); //change this url ....
            }
        }
    });
}


function fitToColumn(arrayOfArray) {
    // get maximum character of each column
    return arrayOfArray[0].map((a, i) => ({ wch: Math.max(...arrayOfArray.map(a2 => a2[i].toString().length)) }));
}
quizId = location.href.split('/').slice(-1)[0]
$.ajax({
    url: "/api/quiz/" + quizId,
    method: "GET",
    success: function(result) {
        console.log(result.result);
        quizdetails = result.result;
        $("#quizName").html(quizdetails.quizName)
        $("#date").html(new Date(Number(quizdetails.scheduledFor)).toDateString())
        $("#time").html(new Date(Number(quizdetails.scheduledFor)).toLocaleTimeString())
        $("#duaration").html(quizdetails.quizDuration + "  minutes");
        $("#type").html(quizdetails.quizType);
        if (quizdetails.quizType.toLowerCase() == "private") {
            $("#quizcode").html(
                `<div class="col">
            <h6 class="label" >Quiz Code: </h6>
            </div>
            <div class="col">
            <span class="quiz-detail-text">${quizdetails.quizCode}</span>
            </div>
            `
            );
        }
    },
    error: function(err) {
        if (err.responseJSON.message == "Unauthorized access") {
            location.href = "/"
        }
        console.log(err);
    }
});