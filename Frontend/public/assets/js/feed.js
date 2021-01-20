$.ajaxSetup({
    headers: { 'token': localStorage.token }
});
if (!localStorage.token) location.href = '/';

function show() {
    var quizId = location.href.split('/').slice(-1)[0];
    $.ajax({
        type: "GET",
        url: "/api/feedback/" + quizId,
        success: function(resultData) {
                var r = resultData.result1;
                $.ajax({
                    type: "GET",
                    url: "/api/quiz/" + quizId,
                    success: function(res) {
                            var quizName = res.result.quizName;
                            document.getElementsByClassName("name")[0].innerHTML = `Quiz: ${quizName}`;
                        } //success
                }); //inner ajax

                var h = "";
                for (var i = 0; i < r.length; i++) 
                {   h += `<div class="container">
                          <button type="button" id="feed" class="btn">
                            Username : ${r[i].userName} </br>
                            Userid   : ${r[i].userId}   </br>
                            FeedBack : ${r[i].description}
                           </button>
                           </div>`;
                }
                document.getElementById("Feedback").innerHTML = h;
            } //sucess
    });
}
show();