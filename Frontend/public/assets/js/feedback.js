$.ajaxSetup({
    headers: { 'token': localStorage.token }
});
if (!localStorage.token) location.href = '/';
var c=0;
$('#rating-form').on('change','[name="rating"]',function(){
    c=$('[name="rating"]:checked').val();
    console.log(c);
    });

function submit() 
{  var feed=document.getElementById("feedback").value;
   var quizId = location.href.split('/').slice(-1)[0]; 
   $.ajax({
    type: "POST",
    url: "/api/feedback/submit",
    data: {
        quizId      : quizId,
        userId      : localStorage.userid,
        userName    : localStorage.username,
        description : feed,
        rating      : c
    },
    success: function(resultData) { 
             if(resultData.message=="created")
             {alert(JSON.stringify(resultData.message));
              document.getElementById("status").innerHTML=`Your FeedBack is Succesfully Received`;}
             }//sucess
  })
}