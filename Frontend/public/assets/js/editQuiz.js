var questionId;
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
      location.href="/ui/quiz/editQuiz/"  //change this url ....
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
            console.log(result.result);
            code=`<div class="accordion" id="parent" >`;
            for(let i=0;i<result.result.length;i++)
            {
                code+=`
                <div class="accordion-item" style="width:100%;" >
                <h2 class="accordion-header" id="heading${i+1}">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i+1}" aria-expanded="true" aria-controls="collapse${i+1}">
                      <button type="button"  onclick="deletequestion('${result.result[i]._id}')"> <i class="fas fa-trash"></i> </button>
                      <button type="button" data-toggle='modal' data-target='#updatequestions'  onclick="editquestion('${(result.result[i]._id)}','${(result.result[i].correctAnswer)}','${result.result[i].description}','${(result.result[i].options[0].text)}','${(result.result[i].options[1].text)}','${(result.result[i].options[2].text)}','${(result.result[i].options[3].text)}')"> <i class="fas fa-pen"></i> </button>
                      ${result.result[i].description}  
                </button>
              </h2>
    <div id="collapse${(i+1)}" class="accordion-collapse collapse" aria-labelledby="heading${(i+1)}" data-bs-parent="#parent">
      <div class="accordion-body">`;
      for(let j=0;j<4;j++)
      {
          
        code+=`<div class="radio radio-dark"> 
        <input  type="radio"   checked=""  ><label class="mr-2">${result.result[i].options[j].text} </label> 
        </div>`
      }  
    code+=    
 `</div>
    </div>
    </div>
 `}
            code+= "</div>"
            console.log(code);
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
    let quizId=location.href.split('/').slice(-1)[0]  
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


function editquestion(id,correctAnswer,description,option1,option2,option3,option4)
{
  questionId=id;
  console.log(correctAnswer,description,option1,option2,option3,option4);
  $("#questionName").val(description);
  $("#o1").val(option1);
  $("#o2").val(option2);
  $("#o3").val(option3);
  $("#o4").val(option4);
  var answer='';
  if(correctAnswer==option1)
  $("#selectedop").val('option1');
  else if(correctAnswer==option2)
  $("#selectedop").val('option2');
  else if(correctAnswer==option3)
  $("#selectedop").val('option3');
  else
  $("#selectedop").val('option4');
}

function updatedata()
{
  const question=$("#questionName").val();
    const val1=$("#o1").val()
    const val2=$("#o2").val()
    const val3=$("#o3").val()
    const val4=$("#o4").val()
    const selected=$("#selectedop").val()
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