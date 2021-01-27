var questionId, QuizDetails, results, deletequestionId;
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


if (!localStorage.token)
    location.href = '/'
if (localStorage.usertype != "Admin")
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
            if (err.responseJSON.message == "Unauthorized access") {
                location.href = "/ui/dashboard"
            } else {
                console.log(err);
                alert("Please Enter Valid Question") //change this url ....
            }
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
            code = `<div class="accordion" id="parent" >`;
            for (let i = 0; i < result.result.length; i++) {
                code += `
                <div class="accordion-item" style="width:100%;" >
                <h2 class="accordion-header" id="heading${i+1}">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i+1}" aria-expanded="true" aria-controls="collapse${i+1}" style="font-size:20px;max-width:100%;">
                <span class="mr-3"  data-toggle='modal' data-target="#delModal" onclick="assignquestionfordelete('${result.result[i]._id}')"> <i class="fas fa-trash"></i> </span><span class="mr-3" data-toggle='modal' data-target="#updatequestions"  onclick="editquestion('${i}')"> <i class="fas fa-pen"></i> </span>${result.result[i].description}  
                </button>
              </h2>
    <div id="collapse${(i+1)}" class="accordion-collapse collapse" aria-labelledby="heading${(i+1)}" data-bs-parent="#parent">
      <div class="accordion-body">`;
                for (let j = 0; j < 4; j++) {

                    if ((result.result[i].options)[j].text == result.result[i].correctAnswer)
                        code += `<p  style="color:green;">&#8857 &nbsp  ${(result.result[i].options)[j].text}</p>`;
                    else
                        code += `<p style="color:black;"> &#8857 &nbsp   ${result.result[i].options[j].text} </p> 
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
            if (err.responseJSON.message == "Unauthorized access") {
                location.href = "/ui/dashboard"
            }
            console.log(err);
        }
    });
}
$(document).ready(function() {
    fetchdata();
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
            if (err.responseJSON.message == "Unauthorized access") {
                location.href = "/ui/dashboard"
            } else {
                console.log(err);
                location.reload(); //change this url ....
            }
        }
    });
}

function assignquestionfordelete(questionid) {
    deletequestionId = questionid;
    console.log(deletequestionId);
}

function deletequestion() {
    console.log(deletequestionId);
    $.ajax({
        url: "/api/question/" + deletequestionId,
        method: "DELETE",
        success: function(result) {
            if (result.message == "Deleted") {
                location.reload();
            } else {
                location.reload();
            }
        },
        error: function(err) {
            if (err.responseJSON.message == "Unauthorized access") {
                location.href = "/ui/dashboard"
            }
        }
    });
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
                if (err.responseJSON.message == "Unauthorized access") {
                    location.href = "/ui/dashboard"
                } else {
                    console.log("Error", err);
                    location.reload(); //change this url ....
                }
            }
        });
    }
}

function fitToColumn(arrayOfArray) {
    // get maximum character of each column
    return arrayOfArray[0].map((a, i) => ({ wch: Math.max(...arrayOfArray.map(a2 => a2[i].toString().length)) }));
}
quizId = location.href.split('/').slice(-1)[0]
$.ajax({
    url: "/api/quiz/" + quizId,
    method: "GET",
    success: function(result) {
        console.log(result.result);
        quizdetails = result.result;
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
    },
    error: function(err) {
        if (err.responseJSON.message == "Unauthorized access") {
            location.href = "/ui/dashboard"
        }
        console.log(err);
    }
});
quizId = location.href.split('/').slice(-1)[0]
$("#stats").attr("href", "/ui/quiz/stats/" + quizId);
$.ajax({
    url: "/api/admin/allStudentsQuizResult/" + quizId,
    method: "GET",
    success: function(quizdetails) {
        console.log(quizdetails);
        results = quizdetails.userResults;
        sort();
        fill();
    },
    error: function(err) {
        if (err.responseJSON.message == "Unauthorized access") {
            location.href = "/ui/dashboard"
        } else {
            console.log(err);
            alert("Please check Your Quiz Id")
        }
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
        for (let i = 0; i < results.length; i++) {
            code += `<li class="list-group-item"> 
      <a href="/ui/result/${results[i]._id}" style="text-decoration:none;color:black !important;">
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
        code = ``;
        code += `<div class="card ml-2" style="width:85%;">
      <ul class="list-group list-group-flush">`
        for (let i = 0; i < newRes.length; i++) {
            code += `<li class="list-group-item"> 
        <a href="/ui/result/${newRes[i]._id}" style="text-decoration:none;color:black !important;">
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

function fill() {
    var wb = XLSX.utils.book_new();
    wb.Props = {
        Title: "SheetJS",
        Subject: "Quiz Results",
        CreatedDate: new Date()
    };
    wb.SheetNames.push("Results Sheet");
    var ws_data = [
        ['S.No', 'Name', 'Marks']
    ];
    var wb = XLSX.utils.book_new();
    wb.Props = {
        Title: "SheetJS",
        Subject: "Quiz Results",
        CreatedDate: new Date()
    };
    wb.SheetNames.push("Results Sheet");
    var ws_data = [
        ['S.No', 'Name', 'Marks']
    ];
    for (let i = 0; i < results.length; i++) {
        ws_data.push([i + 1, results[i].userId["name"], results[i].marks]);
    }
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    ws['!cols'] = fitToColumn(ws_data)
    wb.Sheets["Results Sheet"] = ws;
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    function s2ab(s) {

        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;

    }
    $("#download").click(function() {
        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'test.xlsx');
    });
}

function feedback() {
    var quizId = location.href.split('/').slice(-1)[0];
    window.location.href = "/ui/feedback/" + quizId;
}