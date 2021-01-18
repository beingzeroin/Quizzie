$.ajaxSetup({
  headers: { 'token': localStorage.token }
});

if (!localStorage.token)
    location.href = '/'

var date = new Date();
var currentDate = date.getFullYear()+'-'+('0'+(date.getMonth()+1)).slice(-2)+'-'+('0' +date.getDate()).slice(-2);
var currentTime = date.getHours() + ':' + ('0'+date.getMinutes()).slice(-2)+":"+('0'+date.getSeconds()).slice(-2);
$('#date').val(currentDate);
$('#time').val(currentTime);

function senddata(data)
{
  $.ajax({
    url: "/api/quiz/createQuiz",
    method: "POST",
    data:data,
    success: function(result) {
        location.href="/ui/quiz/editQuiz/"+result.result._id;
    },
    error: function(err) {
      console.log(err);
      alert("Please Enter Valid Quiz Details!")
      location.href="/ui/quiz/createQuiz"  //change this url ....
    }
  });
}



function showdata()
{
    var date=$("#date").val();
    var time=$("#time").val();
    var quizType=$("#quizType").val();
    var quizName=$("#quizName").val();
    var quizDuration=$("#range").val();
    var milliseconds=new Date(date+" "+time);
    var data={'quizName':quizName,'scheduledFor':milliseconds.getTime(),'quizDuration':quizDuration,'quizType':quizType}
    console.log(data);
    senddata(data);
}
