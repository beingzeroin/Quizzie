var date = new Date();
var currentDate = date.toISOString().slice(0,10);
var currentTime = date.getHours() + ':' + date.getMinutes()+":"+date.getSeconds();
$('#date').val(currentDate);
$('#time').val(currentTime);
function showdata()
{
    var date=$("#date").val();
    var time=$("#time").val();
    var quizType=$("#quizType").val();
    var quizName=$("#quizName").val();
    var quizDuration=$("#range").val();
    var data={'quizName':quizName,'scheduledFor':date+" "+time,'quizDuration':quizDuration,'quizType':quizType}
   $.ajax({
       url: "/api/user/createQuiz",
       method: "POST",
       data:data,
       success: function(result) {
           location.href="/ui/editQuiz/id"; //replace id with id of current admin take from local storage
       },
       error: function(err) {
         console.log(err);
         location.href="/ui/CreateQuiz"
       }
     });
}
