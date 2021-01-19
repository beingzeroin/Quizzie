var questionId,QuizDetails;

$.ajaxSetup({
  headers: { 'token': localStorage.token }
});

if (!localStorage.token)
    location.href = '/'

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
      alert("Please Enter Valid Question")//change this url ....
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
    if(selected==='option1')
        answer=val1;
    else if(selected==='option2')
        answer=val2
    else if(selected==='option3')
        answer=val3
    else
        answer=val4
    quizId=location.href.split('/').slice(-1)[0]
    data={"quizId":quizId,'description':question,'options':[{"text":val1},{"text":val2},{"text":val3},{"text":val4}],'correctAnswer':answer}
    //console.log(data);
    data.options=JSON.stringify(data.options);
    senddata(data);

}
function fetchdata()
{   quizId=location.href.split('/').slice(-1)[0]
    $.ajax({
        url: "/api/question/all/"+quizId,
        method: "GET",
        success: function(result) {
           // console.log(result.result);
            QuizDetails=result.result;
            code=`<div class="accordion" id="parent" >`;
            for(let i=0;i<result.result.length;i++)
            {
                code+=`
                <div class="accordion-item" style="width:100%;" >
                <h2 class="accordion-header" id="heading${i+1}">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i+1}" aria-expanded="true" aria-controls="collapse${i+1}">
                      <button type="button"  onclick="deletequestion('${result.result[i]._id}')"> <i class="fas fa-trash"></i> </button>
                      <button type="button" data-toggle='modal' data-target="#updatequestions"  onclick="editquestion('${i}')"> <i class="fas fa-pen"></i> </button>
                      ${result.result[i].description}  
                </button>
              </h2>
    <div id="collapse${(i+1)}" class="accordion-collapse collapse" aria-labelledby="heading${(i+1)}" data-bs-parent="#parent">
      <div class="accordion-body">`;
      for(let j=0;j<4;j++)
      {   
        code+=`<p style="color:black;float:down"> &#8857 &nbsp   ${result.result[i].options[j].text} </p> 
      `
      }  
    code+=    
 `</div>
    </div>
    </div>
 `}
            code+= "</div>"
           // console.log(code);
          $("#submissions").html(code);
        },
        error: function(err) {
            console.log(err);
        }
    });
}
$( document ).ready(function() {
  fetchdata();
});

function deletequiz()
{
     quizId=location.href.split('/').slice(-1)[0]  
    $.ajax({
        url: "/api/quiz/delete",
        method: "DELETE",
        data:{"quizId":quizId},
        success: function(result) {
            if(result.message!="some error")
                location.href="/ui/dashboard";
            else
                location.reload();
        },
        error: function(err) {
          console.log(err);
          location.reload(); //change this url ....
        }
      });
}

function deletequestion(id)
{
  console.log(id);
  $.ajax({
    url: "/api/question/"+id,
    method: "DELETE",
    success: function(result) {
        if(result.message=="Deleted")
        {
          location.reload();
        }
        else
        {
          location.reload();
        }
    },
    error: function(err) {
      console.log(err);
      location.href="/ui/editQuiz/"  //change this url ....
    }
  });
}


function editquestion(index)
{
  index=Number(index);
  console.log(index,QuizDetails[index]);
  questionId=QuizDetails[index]._id;
  option1=QuizDetails[index].options[0].text
  option2=QuizDetails[index].options[1].text
  option3=QuizDetails[index].options[2].text
  option4=QuizDetails[index].options[3].text
  correctAnswer=QuizDetails[index].correctAnswer
  console.log(correctAnswer,option1,option2,option3,option4);
  $("#questionName").val(QuizDetails[index].description);
  $("#o1").val(option1);
  $("#o2").val(option2);
  $("#o3").val(option3);
  $("#o4").val(option4);
  if(correctAnswer==option1)
  $("#selected").val('option1');
  else if(correctAnswer==option2)
  $("#selected").val('option2');
  else if(correctAnswer==option3)
  $("#selected").val('option3');
  else
  $("#selected").val('option4');
}

function updatedata()
{
  const question=$("#questionName").val();
    const val1=$("#o1").val()
    const val2=$("#o2").val()
    const val3=$("#o3").val()
    const val4=$("#o4").val()
    const selected=$("#selected").val()
    var answer='';
    if(selected==='option1')
        answer=val1;
    else if(selected==='option2')
        answer=val2
    else if(selected==='option3')
        answer=val3
    else
        answer=val4
    data={'description':question,'options':[{"text":val1},{"text":val2},{"text":val3},{"text":val4}],'correctAnswer':answer}
    console.log(data);
    data.options=JSON.stringify(data.options);
    console.log(data);
    $.ajax({
      url: "/api/question/update/"+questionId,
      method: "PATCH",
      data:data,
      success: function(result) {
          location.reload();
      },
      error: function(err) {
        console.log("Error",err);
        location.reload(); //change this url ....
      }
    });
}

quizId=location.href.split('/').slice(-1)[0]  
  $.ajax({
    url: "/api/quiz/"+quizId,
    method: "GET",
    success: function(result) {
        //console.log(result.result);
        quizdetails=result.result;
        $("#editbutton").attr("href", "/ui/quiz/updateQuiz/"+quizdetails._id);
        $("#quizName").html(quizdetails.quizName)
        $("#date").html(new Date(Number(quizdetails.scheduledFor)).toDateString())
        $("#time").html(new Date(Number(quizdetails.scheduledFor)).toLocaleTimeString())
        $("#duaration").html(quizdetails.quizDuration+"  minutes");
        $("#type").html(quizdetails.quizType);
        if(quizdetails.quizType.toLowerCase()=="private")
        {
          $("#quizcode").html(
            `<div class="col">
            <h6 class="label" >Quiz Code: </h6>
            </div>
            <div class="col">
            <span class="quiz-detail-text">${quizdetails.quizCode}</span>
            </div>
            `
          );
        }
    },
    error: function(err) {
      console.log(err);
    }
  });
  quizId=location.href.split('/').slice(-1)[0]  
  $("#stats").attr("href", "/ui/quiz/stats/"+quizId); 
  $.ajax({
    url: "/api/admin/allStudentsQuizResult/"+quizId,
    method: "GET",
    success: function(quizdetails) {
        console.log(quizdetails);
        results=quizdetails.userResults;
        sort();
    },
    error: function(err) {
      console.log(err);
      alert("Please check Your Quiz Id")
    }
  });

  function sortByFunc(by, array){
		if (by == "score") {
			return array.sort(function (a, b) {
				return b.marks - a.marks;
			});
		} else if (by == "name") {
			return array.sort(function (a, b) {
        if(a.userId.name  <b.userId.name){
          return -1;
      }else if(a.userId.name >b.userId.name){
          return 1;
      }else{
          return 0;   
      }
			});
		} else if (by == "recent") {
			return array.sort(function (a, b) {
				return b.timeEnded - a.timeEnded;
			});
		} else {
			return array;
		}
	};
  function sort()
  {
    console.log( $("#selectop").val());
    let displayarray=sortByFunc( $("#selectop").val(),results);
    console.log(displayarray);
    code=``;
    code+=`<div class="card ml-2" style="width:85%;">
    <ul class="list-group list-group-flush">`
    for(let i=0;i<displayarray.length;i++)
    {
      code+=`<li class="list-group-item"> 
      <a href="/ui/results/${displayarray[i]._id}" style="text-decoration:none;color:black !important;">
      <span>${displayarray[i].userId.name}</span>
      <p>Marks:${displayarray[i].marks}</p>
      </a>
      </li>`
    }
    code+='</ul> </div>';
    //console.log(code);
    $("#results").html(code);

  }

