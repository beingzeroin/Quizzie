$.ajaxSetup({
    headers: { 'token': localStorage.token }
});

if (!localStorage.token)
    location.href = '/'
if (localStorage.usertype != "Admin")
    location.href = '/'

var date = new Date();
var currentDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
var currentTime = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2);
$('#date').val(currentDate);
$('#time').val(currentTime);

function senddata(data) {
    $.ajax({
        url: "/api/quiz/createQuiz",
        method: "POST",
        data: data,
        success: function(result) {
            location.href = "/ui/quiz/editQuiz/" + result.result._id;
        },
        error: function(err) {
            if (err.responseJSON.message == "Unauthorized access") {
                location.href = "/ui/dashboard"
            } else {

                console.log(err);
                // alert("Please Enter Valid Quiz Details!")
                location.href = "/ui/quiz/createQuiz" //change this url ....
            }
        }
    });
}



function showdata() {
    var date = $("#date").val();
    var time = $("#time").val();
    var quizType = $("#quizType").val();
    var quizName = $("#quizName").val();
    var quizDuration = $(".timer-input").val();
    var milliseconds = new Date(date + " " + time);
    var topicName=$("#quizTopic").val();
    var data = { 'quizName': quizName, 'scheduledFor': milliseconds.getTime(), 'quizDuration': quizDuration, 'quizType': quizType,'topicName':topicName }
    console.log(data);
    senddata(data);
}

const onInput = () => {
    const timer = document.querySelector(".timer-span");
    const timerText = document.querySelector(".timer-text");
    const input = document.querySelector("input.timer-input");
    //console.log(input.value);
    const inputRect = input.getBoundingClientRect();
    const timerRect = timer.getBoundingClientRect();
    const m = (0.9664 * (inputRect.right - inputRect.left)) / 60;
    input.style.paddingLeft = m * 5 + "px";
    timer.style.left =
        inputRect.left +
        input.value * m +
        (input.value == 5 ? 0.14 * m : 0) -
        document.querySelector(".timer").getBoundingClientRect().left +
        "px";
    timerText.textContent = input.value;
    //console.log(timerRect.x, inputRect.left + input.value * m, m);
};
onInput();