$.ajaxSetup({
  headers: { 'token': localStorage.token }
});
if (!localStorage.token) location.href = '/';

function show()
{  var a = [{ correct : 1,
    chosen  : 2,
    option  : 3},
  { correct : 2,
    chosen  : 2,
    option : 4},
  { correct : 3,
    chosen  : 4,
    option  : 4 },
  { correct : 4,
    chosen  : 4,
    option  : 4 }]
 var quizId=location.href.split('/').slice(-1)[0];
 $.ajax({
  type: "GET",
  url: "/api/user/studentQuizResult/"+quizId,
  success: function(resultData) 
  { var r=resultData.result.responses; 
    $.ajax({
      type: "GET",
      url: "/api/quiz/"+quizId,
      success: function(res) 
      { var quizName=res.result.quizName;
        document.getElementsByClassName("name")[0].innerHTML=`Quiz: ${quizName}`; }//success
    });//inner ajax
    document.getElementsByClassName("score")[0].innerHTML=`Score: ${(resultData.result).marks } out of ${r.length}`;
    var h="";
    for(var i=0;i<r.length;i++)
    { 
    h+=`<div class="container">
            <button type="button" id="question" class="btn" onclick="drop(${i})">
                <p class="para">${r[i].description}</p>`;
              if(r[i].selected==r[i].correctAnswer)
    h+=         `<p class='right'>&#10003;</p>`;
              else if(r[i].selected==null)
    h+=         `<p class='warn'>&#9888</p>`;
              else 
    h+=         `<p class='wrong'>&#9932</p>`;
    h+=         `<p class='arrow'>&#9660</p>`;
    h+=      `</button>`; 
    h+=  `<div class="sol">`;
              for(var j=0;j<(r[i].options).length;j++)
              { h+= `<div style="float:down">`;
                if(j+1==r[i].correctAnswer)
                h+=`<p class='odot fa-2x' style="color:green;float:down">&#8857 ${(r[i].options)[j].text}</p>`;
                else if(r[i].selected==j+1)
                 h+=`<p class='odot fa-2x' style="color:red;float:down">&#8857 ${(r[i].options)[j].text}</p>`;
                else h+=`<p class='odot fa-2x' style="color:grey;float:down">&#8857 ${(r[i].options)[j].text}</p>`;
                h+=`</div>`;
              }
    h+=   `</div></div>`;
    }
    document.getElementById("questions").innerHTML=h;
  }//sucess

}); 

}

show();
function drop(i)
{ 
var x = document.getElementsByClassName("sol")[i];
var y=  document.getElementsByClassName("question")[i];
var z=  document.getElementsByClassName("arrow")[i];

if (x.style.display == "none")
   { x.style.display = "block";
     z.innerHTML = `&#9650`;}
 else {x.style.display = "none";
       z.innerHTML = `&#9660`;}
}