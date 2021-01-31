

var questionId,QuizDetails,results,deletequestionId,quizName,quizId,feedbacks,unSubmittedEnrolls;
quizid=location.href.split('/').slice(-1)[0]
$("#question").summernote({
    height: 150, // set editor height
    minHeight: null, // set minimum height of editor
    maxHeight: 150, // set maximum height of editor
    focus: true,
    toolbar: [
        // [groupName, [list of button]]
        ['style', ['style']],
        ['fontsize', ['fontsize']],
        ['style', ['bold', 'italic', 'clear']],
        ['insert', ['link', 'picture', 'table']],
        ['para', ['ul', 'ol']],
        ['adv', ['codeview']]
    ]
})

$("#questionName").summernote({
        height: 150, // set editor height
        minHeight: null, // set minimum height of editor
        maxHeight: 150, // set maximum height of editor
        focus: true,
        toolbar: [
            // [groupName, [list of button]]
            ['style', ['style']],
            ['fontsize', ['fontsize']],
            ['style', ['bold', 'italic', 'clear']],
            ['insert', ['link', 'picture', 'table']],
            ['para', ['ul', 'ol']],
            ['adv', ['codeview']]
        ]
    })
    // $('.note-editable').css('font-size', '18px');

$.ajaxSetup({
    headers: { 'token': localStorage.token }
});
if (!localStorage.token)
    location.href = '/'

function senddata(data) {
    $.ajax({
        url: "/api/question/add",
        method: "POST",
        data: data,
        success: function(result) {
            location.reload();
        },
        error: function(err) {
            console.log(err);
           // alert("Please Enter Valid Question") //change this url ....
        }
    });
}

function getdata() {
    const question = $("#question").val();
    const val1 = $("#val1").val()
    const val2 = $("#val2").val()
    const val3 = $("#val3").val()
    const val4 = $("#val4").val()
    if (question == '') {
        $("#question").addClass("is-invalid");
        $('#val1').removeClass('is-invalid')
        $('#val2').removeClass('is-invalid')
        $('#val3').removeClass('is-invalid')
        $('#val4').removeClass('is-invalid')

        $("#Question").html('This cannot be empty');
    } else if (val1 == '') {
        $("#Question").html('');
        $('#val1').removeClass('is-invalid')
        $('#val2').removeClass('is-invalid')
        $('#val3').removeClass('is-invalid')
        $('#val4').removeClass('is-invalid')

        $("#val1").addClass("is-invalid");
        $("#op1").html('This cannot be empty')
    } else if (val2 == '') {
        $("#Question").html('');
        $('#val1').removeClass('is-invalid')
        $('#val2').removeClass('is-invalid')
        $('#val3').removeClass('is-invalid')
        $('#val4').removeClass('is-invalid')
        $("#val2").addClass("is-invalid");
        $("#op2").html('This cannot be empty')
    } else if (val3 == '') {
        $("#Question").html('');
        $('#val1').removeClass('is-invalid')
        $('#val2').removeClass('is-invalid')
        $('#val3').removeClass('is-invalid')
        $('#val4').removeClass('is-invalid')

        $("#val3").addClass("is-invalid");
        $("#op3").html('This cannot be empty')
    } else if (val4 == '') {
        $("#Question").html('');
        $('#val1').removeClass('is-invalid')
        $('#val2').removeClass('is-invalid')
        $('#val3').removeClass('is-invalid')
        $('#val4').removeClass('is-invalid')

        $("#val4").addClass("is-invalid");
        $("#op4").html('This cannot be empty')
    } else {
        const selected = $("#selectedoption").val()
        var answer = '';
        if (selected === 'option1')
            answer = val1;
        else if (selected === 'option2')
            answer = val2
        else if (selected === 'option3')
            answer = val3
        else
            answer = val4
        quizId = location.href.split('/').slice(-1)[0]
        data = { "quizId": quizId, 'description': question, 'options': [{ "text": val1 }, { "text": val2 }, { "text": val3 }, { "text": val4 }], 'correctAnswer': answer }
            //console.log(data);
        data.options = JSON.stringify(data.options);
        senddata(data);
    }

}

function fetchdata() {
    quizId = location.href.split('/').slice(-1)[0]
    $.ajax({
        url: "/api/question/all/" + quizId,
        method: "GET",
        success: function(result) {
            // console.log(result.result);
            QuizDetails = result.result;
            code = `<div class="accordion" id="parent"  >`;
            for (let i = 0; i < result.result.length; i++) {
                code += `
                <div class="accordion-item" style="width:100%;" >
                <h2 class="accordion-header" id="heading${i+1}">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i+1}" aria-expanded="true" aria-controls="collapse${i+1}" style="font-size:20px;max-width:100%;color:black !important">
                <span class="mr-3"  data-toggle='modal' data-target="#delModal" onclick="assignquestionfordelete('${result.result[i]._id}')"> <i class="fas fa-trash"></i> </span><span class="mr-3" data-toggle='modal' data-target="#updatequestions"  onclick="editquestion('${i}')"> <i class="fas fa-pen"></i> </span>${result.result[i].description}  
                </button>
              </h2>
    <div id="collapse${(i+1)}" class="accordion-collapse collapse" aria-labelledby="heading${(i+1)}" data-bs-parent="#parent">
      <div class="accordion-body">`;
      for(let j=0;j<4;j++)
      {   

        if ((result.result[i].options)[j].text ==result.result[i].correctAnswer)
        code += `<p  style="color:green;">&#8857 &nbsp  ${(result.result[i].options)[j].text}</p>`;
        else
        code+=`<p style="color:black;"> &#8857 &nbsp   ${result.result[i].options[j].text} </p> 
      `
                }
                code +=
                    `</div>
    </div>
    </div>
 `
            }
            code += "</div>"
                // console.log(code);
            $("#submissions").html(code);
        },
        error: function(err) {
            console.log(err);
        }
    });
}
$(document).ready(function() {
    fetchdata();
    $("#file").on('change',function(){
       var file=document.getElementById("file").files[0];
       if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
           var data=evt.target.result;
           $.ajax({
            url: "/api/question/csv",
            method: "POST",
            data: {"data":data,"quizId":quizId},
            success: function(result) {
                location.reload();
                console.log("success");
            },
            error: function(err) {
                console.log(err);
               // alert("Please Enter Valid Question") //change this url ....
            }
        });
           
        }
        reader.onerror = function (evt) {
            alert("error reading file");
        }
    }
    });
});

function deletequiz() {
    quizId = location.href.split('/').slice(-1)[0]
    $.ajax({
        url: "/api/quiz/delete",
        method: "DELETE",
        data: { "quizId": quizId },
        success: function(result) {
            if (result.message != "some error")
                location.href = "/ui/dashboard";
            else
                location.reload();
        },
        error: function(err) {
            console.log(err);
            location.reload(); //change this url ....
        }
    });
}

function assignquestionfordelete(questionid)
{
  deletequestionId=questionid;
  console.log(deletequestionId);
}
function deletequestion()
{
  console.log(deletequestionId);
  $.ajax({
    url: "/api/question/"+deletequestionId,
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
    }});
}


function editquestion(index) {
    index = Number(index);
    console.log(index, QuizDetails[index]);
    questionId = QuizDetails[index]._id;
    option1 = QuizDetails[index].options[0].text
    option2 = QuizDetails[index].options[1].text
    option3 = QuizDetails[index].options[2].text
    option4 = QuizDetails[index].options[3].text
    correctAnswer = QuizDetails[index].correctAnswer
        // alert(QuizDetails[index].description);
    $('#questionName').summernote('code', QuizDetails[index].description);
    // $("#questionName").val(QuizDetails[index].description);
    $("#o1").val(option1);
    $("#o2").val(option2);
    $("#o3").val(option3);
    $("#o4").val(option4);
    if (correctAnswer == option1)
        $("#selected").val('option1');
    else if (correctAnswer == option2)
        $("#selected").val('option2');
    else if (correctAnswer == option3)
        $("#selected").val('option3');
    else
        $("#selected").val('option4');
}

function updatedata() {
    const question = $("#questionName").val();
    const val1 = $("#o1").val()
    const val2 = $("#o2").val()
    const val3 = $("#o3").val()
    const val4 = $("#o4").val()
    const selected = $("#selected").val()
    if (question == '<p><br></p>') {
        $("#questionName").addClass("is-invalid");
        $('#o1').removeClass('is-invalid')
        $('#o2').removeClass('is-invalid')
        $('#o3').removeClass('is-invalid')
        $("#o4").removeClass('is-invalid')
        $("#QuestionName").html('This cannot be empty');
    } else if (val1 == '') {
        $("#QuestionName").html('');
        $('#o1').removeClass('is-invalid')
        $('#o2').removeClass('is-invalid')
        $('#o3').removeClass('is-invalid')
        $("#o4").removeClass('is-invalid')
        $("#o1").addClass("is-invalid");
        $("#O1").html('This cannot be empty')
    } else if (val2 == '') {
        $("#QuestionName").html('');
        $('#o1').removeClass('is-invalid')
        $('#o2').removeClass('is-invalid')
        $('#o3').removeClass('is-invalid')
        $("#o4").removeClass('is-invalid')
        $("#o2").addClass("is-invalid");
        $("#O2").html('This cannot be empty')
    } else if (val3 == '') {
        $("#QuestionName").html('');
        $('#o1').removeClass('is-invalid')
        $('#o2').removeClass('is-invalid')
        $('#o3').removeClass('is-invalid')
        $("#o4").removeClass('is-invalid')
        $("#o3").addClass("is-invalid");
        $("#O3").html('This cannot be empty')
    } else if (val4 == '') {
        $("#QuestionName").html('');
        $('#o1').removeClass('is-invalid')
        $('#o2').removeClass('is-invalid')
        $('#o3').removeClass('is-invalid')
        $("#o4").removeClass('is-invalid')


        $("#o4").addClass("is-invalid");
        $("#O4").html('This cannot be empty')
    } else {
        var answer = '';
        if (selected === 'option1')
            answer = val1;
        else if (selected === 'option2')
            answer = val2
        else if (selected === 'option3')
            answer = val3
        else
            answer = val4
        data = { 'description': question, 'options': [{ "text": val1 }, { "text": val2 }, { "text": val3 }, { "text": val4 }], 'correctAnswer': answer }
        console.log(data);
        data.options = JSON.stringify(data.options);
        console.log(data);
        $.ajax({
            url: "/api/question/update/" + questionId,
            method: "PATCH",
            data: data,
            success: function(result) {
                location.reload();
            },
            error: function(err) {
                console.log("Error", err);
                location.reload(); //change this url ....
            }
        });
    }
}
function fitToColumn(arrayOfArray) {
  // get maximum character of each column
  return arrayOfArray[0].map((a, i) => ({ wch: Math.max(...arrayOfArray.map(a2 => a2[i].toString().length)) }));
}
quizId=location.href.split('/').slice(-1)[0]  
  $.ajax({
    url: "/api/quiz/"+quizId,
    method: "GET",
    success: function(result) {
        console.log(result.result);
        quizdetails = result.result;
        quizName=quizdetails.quizName
        $("#editbutton").attr("href", "/ui/quiz/updateQuiz/" + quizdetails._id);
        $("#quizName").html(quizdetails.quizName)
        $("#date").html(new Date(Number(quizdetails.scheduledFor)).toDateString())
        $("#time").html(new Date(Number(quizdetails.scheduledFor)).toLocaleTimeString())
        $("#duaration").html(quizdetails.quizDuration + "  minutes");
        $("#type").html(quizdetails.quizType);
        if (quizdetails.quizType.toLowerCase() == "private") {
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
        $("#topicName").html(
            `<div class="col">
        <h6 class="label" >TopicName: </h6>
        </div>
        <div class="col">
        <span class="quiz-detail-text">${quizdetails.topicName}</span>
        </div>
        `
        );
    },
    error: function(err) {
        console.log(err);
    }
});
quizId = location.href.split('/').slice(-1)[0]
$("#stats").attr("href", "/ui/quiz/stats/" + quizId);
$.ajax({
    type: "GET",
    url: "/api/feedback/" + quizId,
    success: function(resultData) {
            feedbacks = resultData.result1;
        },
    error: function(err) {
        if (err.responseJSON.message == "Unauthorized access") {
            location.href = "/"
        }
    }
});
$.ajax({
    url: "/api/admin/allStudentsQuizResult/" + quizId,
    method: "GET",
    success: function(quizdetails) {
        console.log(quizdetails);
        results = quizdetails.userResults;
        sort();
        fill();
        getunrolled();
    },
    error: function(err) {
        console.log(err);
        //alert("Please check Your Quiz Id")
    }
});

function sortByFunc(by, array) {
    if (by == "score") {
        return array.sort(function(a, b) {
            return b.marks - a.marks;
        });
    } else if (by == "name") {
        return array.sort(function(a, b) {
            if (a.userId.name < b.userId.name) {
                return -1;
            } else if (a.userId.name > b.userId.name) {
                return 1;
            } else {
                return 0;
            }
        });
    } else if (by == "recent") {
        return array.sort(function(a, b) {
            return b.timeEnded - a.timeEnded;
        });
    } else {
        return array;
    }
};

function sort() {
    console.log($("#selectop").val());
    results = sortByFunc($("#selectop").val(), results);
    console.log(results);
    if (results.length == 0)
        $("#results").html(`<h3 class="d-flex justify-content-center" >No responses Yet !</h3>`);
    else {
        code = ``;
        code += `<div class="card ml-2" style="width:85%;">
    <ul class="list-group list-group-flush">`
        for (var i = 0; i < results.length; i++) {
            code += `<li class="list-group-item"> 
      <a href="/ui/quiz/studentResponse/${quizId}/${results[i].userId._id}/${encodeURIComponent(quizName)}" style="text-decoration:none;color:black !important;">
      <span>${results[i].userId["name"]}</span>
      <p>Marks:${results[i].marks}</p>
      </a>
      </li>`
        }
        code += '</ul> </div>';
        //console.log(code);
        $("#results").html(code);
    }
}

function filter() {
    //console.log();
    let searchwith = $("#search").val();
    if (results.length != 0) {
        let newRes = results.filter(
            (response) =>
            response.userId.name
            .toLowerCase()
            .search(searchwith.trim().toLowerCase()) !== -1 ||
            String(response.marks) ===
            searchwith.trim().toLowerCase()
        );
        console.log(encodeURIComponent(quizName));
        code = ``;
        code += `<div class="card ml-2" style="width:85%;">
      <ul class="list-group list-group-flush">`
        for (let i = 0; i < newRes.length; i++) {
            code += `<li class="list-group-item"> 
        <a href="/ui/quiz/studentResponse/${newRes[i]._id}/${newRes[i].userId._id}/${encodeURIComponent(quizName)}" style="text-decoration:none;color:black !important;">
        <span>${newRes[i].userId.name}</span>
        <p>Marks:${newRes[i].marks}</p>
        </a>
        </li>`
        }
        code += '</ul> </div>';
        //console.log(code);
        $("#results").html(code);

    }

}
function getunrolled()
{
    var ws_data1=[["S.No","Name"]];
    $.ajax({
        url: "/api/quiz/unSubmittedEnrolls/" + quizId,
        method: "GET",
        success: function(data) {
            var wb = XLSX.utils.book_new();
            wb.Props = {
            Title: "Sheet",
            Subject: "Quiz Results",
            CreatedDate: new Date()
            };
            wb.SheetNames.push("Sheet1");
            unSubmittedEnrolls=data.result;
            console.log(unSubmittedEnrolls);
            for(var i=0;i<unSubmittedEnrolls.length;i++)
            {
             ws_data1.push([i+1,unSubmittedEnrolls[i].name])
            }
            var ws1 = XLSX.utils.aoa_to_sheet(ws_data1);
            console.log(ws1);
            ws1['!cols']=fitToColumn(ws_data1)
            wb.Sheets["Sheet1"] = ws1;
            var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
            function s2ab(s) {
  
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
            }
    $("#unsubmitted").click(function(){
      saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'Unsubmitted_List.xlsx');
    });
            
        },
        error: function(err) {
            console.log(err);
            //alert("Please check Your Quiz Id")
        }
       
    }); 
    return ws_data1;
}
  function fill()
  {
    //console.log(feedbacks);
    var fmap={}
    for(var i=0;i<feedbacks.length;i++)
        fmap[feedbacks[i].userId]=[feedbacks[i].rating,feedbacks[i].description];
    //console.log(fmap);
    var wb = XLSX.utils.book_new();
    wb.Props = {
            Title: "Sheet",
            Subject: "Quiz Results",
            CreatedDate: new Date()
    };
    wb.SheetNames.push("Sheet1");
    
    var ws_data = [['S.No' , 'Name','Marks','Submissions Status','Rating',"Description"]];
    // var ws_data1=[["S.No","Name"]]
    for(let i=0;i<results.length;i++)
    {
        if(fmap[results[i].userId._id]!=undefined)
        {
            if(results[i].submissionStatus!=undefined)
            ws_data.push([i+1,results[i].userId["name"],results[i].marks,results[i].submissionStatus,fmap[results[i].userId._id][0],fmap[results[i].userId._id][1]]);
            else
            ws_data.push([i+1,results[i].userId["name"],results[i].marks," ",fmap[results[i].userId._id][0],fmap[results[i].userId._id][1]]);
        }
      else
      {
        if(results[i].submissionStatus!=undefined)
            ws_data.push([i+1,results[i].userId["name"],results[i].marks,results[i].submissionStatus," "," "]);
            else
            ws_data.push([i+1,results[i].userId["name"],results[i].marks," "," "," "]);
      }
    }
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    ws['!cols']=fitToColumn(ws_data)
    wb.Sheets["Sheet1"] = ws;
    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    function s2ab(s) {
  
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
            
    }
    $("#download").click(function(){
       // console.log(s2ab(wbout));
      saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'Results.xlsx');
});
  }

  function feedback() {
    var quizId = location.href.split('/').slice(-1)[0];
    window.location.href = "/ui/feedback/" + quizId;
}