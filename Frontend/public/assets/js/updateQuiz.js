$.ajaxSetup({
    headers: { 'token': localStorage.token }
});

if (!localStorage.token)
    location.href = '/'

if (!localStorage.token)
    location.href = '/'
if (localStorage.usertype != "Admin")
    location.href = '/'

function senddata(data) {
    let quizId = location.href.split('/').slice(-1)[0]
    $.ajax({
        url: "/api/quiz/updateDetails/" + quizId,
        method: "PATCH",
        data: data,
        success: function(result) {
            if (result.message == "Quiz updated")
                location.href = "/ui/quiz/editQuiz/" + quizId;
        },
        error: function(err) {
            if (err.responseJSON.message == "Unauthorized access") {
                location.href = "/"
            } else {
                console.log(err);
                alert("Please Enter Valid Quiz Details")
                location.href = "/ui/quiz/updateQuiz/" + quizId
            }
        }
    });
}
function showdata()
{
    var date=$("#date").val();
    var time=$("#time").val();
    var quizName=$("#quizName").val();
    var quizDuration=$("#range").val();
    var topicName=$("#quizTopic").val();
    var data={'quizName':quizName,'scheduledFor':new Date(date+" "+time).getTime(),'quizDuration':quizDuration,'topicName':topicName}
    console.log(data);
    senddata(data);

}
var quizId = location.href.split('/').slice(-1)[0]
$.ajax({
    url: "/api/quiz/" + quizId,
    method: "GET",
    success: function(result) {
        //console.log(result.result.quizName);
        quizdetails = result.result;
        $("#quizName").val(quizdetails.quizName)
        $("#date").val((new Date(Number(quizdetails.scheduledFor)).getFullYear() + '-' +('0' + (new Date(Number(quizdetails.scheduledFor)).getMonth()+1)).slice(-2)+ '-' +  ('0' + new Date(Number(quizdetails.scheduledFor)).getDate()).slice(-2) ))
        $("#time").val(('0' + (new Date(Number(quizdetails.scheduledFor)).getHours())).slice(-2)+ ':'+('0' + (new Date(Number(quizdetails.scheduledFor)).getMinutes())).slice(-2)+ ':'+('0' + (new Date(Number(quizdetails.scheduledFor)).getSeconds())).slice(-2))
        $("#range").val(quizdetails.quizDuration);
        $("#quizTopic").val(quizdetails.topicName);
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
            quizdetails.quizDuration * m +
            (quizdetails.quizDuration == 5 ? 0.14 * m : 0) -
            document.querySelector(".timer").getBoundingClientRect().left +
            "px";
        timerText.textContent = quizdetails.quizDuration;
    },
    error: function(err) {
        if (err.responseJSON.message == "Unauthorized access") {
            location.href = "/"
        } else {
            console.log(err);
            alert("Please check Your Quiz Id")
        }
    }
});


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