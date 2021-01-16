var date = new Date();
var currentDate = date.toISOString().slice(0,10);
var currentTime = date.getHours() + ':' + date.getMinutes()+":"+date.getSeconds();
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
