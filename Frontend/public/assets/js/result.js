$.ajaxSetup({
    headers: { 'token': localStorage.token }
});
if (!localStorage.token) location.href = '/';

if (!localStorage.token)
    location.href = '/'
if (localStorage.usertype != "User")
    location.href = '/'

function show() {
    var a = [{
            correct: 1,
            chosen: 2,
            option: 3
        },
        {
            correct: 2,
            chosen: 2,
            option: 4
        },
        {
            correct: 3,
            chosen: 4,
            option: 4
        },
        {
            correct: 4,
            chosen: 4,
            option: 4
        }
    ]
    var quizId = location.href.split('/').slice(-1)[0];
    var flag=0;
    $.ajax({
        type: "GET",
        url: "/api/user/studentQuizResult/" + quizId,
        success: function(resultData) {
                var r = resultData.result.responses;
                //console.log(resultData.result);
                $.ajax({
                    type: "GET",
                    url: "/api/quiz/" + quizId,
                    headers: { 'token': localStorage.token },
                    success: function(res) {
                             //console.log(JSON.stringify(res))
                             var sec = Math.round(new Date());
                             var endtime = Number(res.result.scheduledFor) + Number((res.result.quizDuration) *60000)
                             var check=sec-endtime;
                             console.log(check);
                             if(check<0) {console.log("No"); display();}
                             //console.log(res.result.scheduledFor,res.result.quizDuration)
                            var quizName = res.result.quizName;
                            document.getElementsByClassName("name")[0].innerHTML = `
                            <div class = "row">
                                <h4> <label style="color:#2980B9">QuizName </label> : ${quizName} </h4>
                            </div>`;
                        } //success
                        ,
                    error: function(err) {
                        if (err.responseJSON.message == "Unauthorized access") {
                            location.href = "/ui/dashboard"
                        }
                    }
                }); //inner ajax
                document.getElementsByClassName("score")[0].innerHTML = `
                <div class = "row">
                     <h4> <label style="color:#2980B9">Score</label> : ${(resultData.result).marks } out of ${r.length}</h4>
                </div>`;
                console.log(flag);
               
                var h = "";
                for (var i = 0; i < r.length; i++) {
                    h += `<div class="container">
                          <button type="button" id="question" class="btn" onclick="drop(${i})">`;
                    if (r[i].selected == r[i].correctAnswer)
                        h += `<p class='right'>&#10003;</p>`;
                    else if (r[i].selected == null)
                        h += `<p class='warn'>&#9888</p>`;
                    else
                        h += `<p class='wrong'>&#9932</p>`;
                    h += `  ${r[i].description}`;
                    h += `<p class='arrow'>&#9660</p>`;
                    h += `</button>`;
                    h += `<div class="sol">`;
                    for (var j = 0; j < (r[i].options).length; j++) {
                        h += `<div style="float:down">`;
                        if ((r[i].options)[j].text == r[i].correctAnswer)
                            h += `<p class='odot fa-2x' style="color:green;float:down">&#8857 ${(r[i].options)[j].text}</p>`;
                        else if (r[i].selected == (r[i].options)[j].text)
                            h += `<p class='odot fa-2x' style="color:red;float:down">&#8857 ${(r[i].options)[j].text}</p>`;
                        else h += `<p class='odot fa-2x' style="color:grey;float:down">&#8857 ${(r[i].options)[j].text}</p>`;
                        h += `</div>`;
                    }
                    h += `</div></div>`;
                }
                document.getElementById("questions").innerHTML = h;
              
               
            } //sucess
            ,
        error: function(err) {
            if (err.responseJSON.message == "Unauthorized access") {
                location.href = "/ui/dashboard"
            }
        }

    });

}

show();

function drop(i) {
    var x = document.getElementsByClassName("sol")[i];
    var y = document.getElementsByClassName("question")[i];
    var z = document.getElementsByClassName("arrow")[i];

    if (x.style.display == "none") {
        x.style.display = "block";
        z.innerHTML = `&#9650`;
    } else {
        x.style.display = "none";
        z.innerHTML = `&#9660`;
    }
}

function display()
{   document.getElementById("questions").style.display="none";
    document.getElementById("error").innerHTML =`<h2 style="display:table;margin:auto">The Quiz Is Still Alive...!!!<h2>`;
}