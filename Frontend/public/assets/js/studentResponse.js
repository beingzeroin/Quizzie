$.ajaxSetup({
    headers: { 'token': localStorage.token }
});
if (!localStorage.token) location.href = '/';
var data;
function show() {
    var quizName = decodeURIComponent(location.href.split('/').slice(-1)[0]);
    var userId = location.href.split('/').slice(-2)[0];
    var quizId = location.href.split('/').slice(-3)[0];
    document.getElementsByClassName("name")[0].innerHTML = `Quiz: ${quizName}`;
    $.ajax({
        type: "GET",
        url: "/api/admin/allStudentsQuizResult/" + quizId,
        success: function(resultData) {
                data=resultData.userResults
                for(let i=0;i<data.length;i++)
                {
                    if(data[i].userId._id==userId)
                    {
                        fill(i);
                        break;
                    }
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
function fill(i)
{
        document.getElementsByClassName("score")[0].innerHTML = `Score: ${(data[i]).marks } out of ${data[i].responses.length}`;
                var h = "";
                var r=data[i].responses;
                for (var i = 0; i < r.length; i++) {
                    h += `<div class="container">
                          <button type="button" id="question" class="btn" onclick="drop(${i})">`;
                    if (r[i].selected == r[i].correctAnswer)
                        h += `<p class='right'>&#10003;</p>`;
                    else if (r[i].selected == null)
                        h += `<p class='warn'>&#9888</p>`;
                    else
                        h += `<p class='wrong'>&#9932</p>`;
                    h +=  `  ${r[i].description}`;
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
}