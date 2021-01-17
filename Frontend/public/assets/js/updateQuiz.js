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
      location.href="/ui/quiz/updateQuiz/"+ quizId //change this url ....
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
    var data={'quizName':quizName,'scheduledFor':new Date(date+" "+time).getTime(),'quizDuration':quizDuration,'quizType':quizType}
    console.log(data);
    senddata(data);
    
}
