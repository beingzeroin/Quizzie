$.ajaxSetup({
  headers: { 'token': localStorage.token }
});

if (!localStorage.token)
    location.href = '/'

function senddata(data)
{
  let quizId=location.href.split('/').slice(-1)[0]  
  $.ajax({
    url: "/api/quiz/updateDetails/"+quizId,
    method: "PATCH",
    data:data,
    success: function(result) {
        if(result.message=="Quiz updated")
        location.href="/ui/quiz/editQuiz/"+quizId;
    },
    error: function(err) {
      console.log(err);
      alert("Please Enter Valid Quiz Details")
      location.href="/ui/quiz/updateQuiz/"+ quizId 
    }
  });
}
function showdata()
{
    var date=$("#date").val();
    var time=$("#time").val();
    var quizName=$("#quizName").val();
    var quizDuration=$("#range").val();
    var data={'quizName':quizName,'scheduledFor':new Date(date+" "+time).getTime(),'quizDuration':quizDuration}
    console.log(data);
    senddata(data);
    
}
var quizId=location.href.split('/').slice(-1)[0]  
  $.ajax({
    url: "/api/quiz/"+quizId,
    method: "GET",
    success: function(result) {
        //console.log(result.result.quizName);
        quizdetails=result.result;
        $("#quizName").val(quizdetails.quizName)
        $("#date").val((new Date(Number(quizdetails.scheduledFor)).getFullYear() + '-' +('0' + (new Date(Number(quizdetails.scheduledFor)).getMonth()+1)).slice(-2)+ '-' +  ('0' + new Date(Number(quizdetails.scheduledFor)).getDate()).slice(-2) ))
        $("#time").val((new Date(Number(quizdetails.scheduledFor)).getHours()+ ':'+('0' + (new Date(Number(quizdetails.scheduledFor)).getMinutes())).slice(-2)+ ':'+new Date(Number(quizdetails.scheduledFor)).getSeconds()))
        $("#range").val(quizdetails.quizDuration);
    },
    error: function(err) {
      console.log(err);
      alert("Please check Your Quiz Id")
    }
  });


