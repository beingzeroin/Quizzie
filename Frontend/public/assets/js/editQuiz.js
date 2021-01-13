
function senddata(data)
{
  $.ajax({
    url: "/api/question/add",
    method: "POST",
    data:data,
    success: function(result) {
        location.reload();
    },
    error: function(err) {
      console.log(err);
      location.href="/editQuiz"  //change this url ....
    }
  });
}
function getdata()
{
    const question=$("#question").val();
    const val1=$("#val1").val()
    const val2=$("#val2").val()
    const val3=$("#val3").val()
    const val4=$("#val4").val()
    const selected=$("#selectedoption").val()
    var answer='';
    if(selected[-1]==='1')
        answer=val1;
    else if(selected[-1]==='2')
        answer=val2
    else if(selected[-1]==='3')
        answer=val3
    else
        answer=val4
    quizId=location.href.split('/').slice(-1)[0]
    data={"quizId":quizId,'description':question,'options':[{"text":val1},{"text":val2},{"text":val3},{"text":val4}],'correctAnswer':answer}
    console.log(data);
    data.options=JSON.stringify(data.options);
    senddata(data);

}
function fetchdata()
{   quizId=location.href.split('/').slice(-1)[0]
    $.ajax({
        url: "/api/question/all/"+quizId,
        method: "GET",
        success: function(result) {
            console.log(result);
            //document.getElementById("").querySelectorAll(".details")[0].innerHTML = `
           // `;

        },
        error: function(err) {
            console.log(err);
        }
    });
}