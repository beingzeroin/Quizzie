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
   $.ajax({
    type: "POST",
    url: "/api/feedback/submit",
    data: {
        quizId      : "6006953c6f602e22b05f037c",
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