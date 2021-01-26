$.ajaxSetup({
    headers: { 'token': localStorage.token }
});
if (!localStorage.token) location.href = '/';
var filter=0;
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
                let feedbacks = [];
                //let ans=``;
                var visit=($("#selectop").val());
                console.log(visit);
                var flag=0,c=0;
                var h =``;
                if(visit=="none") flag=1;
                   for (var i = 0; i < r.length; i++) {
                    if(visit==r[i].rating || flag)
                    {   c++;
                        console.log(visit);
                        h = `<div class="container">
                                <tr>
                                    <td> ${r[i].userName}</td>
                                    <td>  ${r[i].userId}</td>
                                    <td id="fb">${r[i].description}</td>
                                    <td>${r[i].rating}</td>
                                </tr>
                             </div>`;
                    //ans+=h;
                    feedbacks.push(h);
                    }
                }
                
                let len = parseInt((feedbacks.length + 9) /10);
                console.log(len);
                if(filter!=0)
                { var pageData = $('#show_paginator').data();
                  console.log(pageData);

                  if ( ! pageData.twbsPagination.options.totalPages ==len){
                         $('#show_paginator').twbsPagination('destroy');
                         $('#show_paginator').twbsPagination('init');
                         $('#show_paginator').load('/ui/feedback/'+quizId);}
                  pageData = $('#show_paginator').data();
                  console.log(pageData);
                }
                $('#show_paginator').twbsPagination({
                    totalPages: len,
                    visiblePages: 5,
                    next: 'Next',
                    prev: 'Prev',
                    onPageClick: function(pageload, page) {
                        let index = (page - 1) * 10;
                        let ans = `<table> <tr class="fbh">
                                               <th class="fbh">UserName</th>
                                               <th class="fbh">UserId</th>
                                               <th class="fbh">Feedback</th> 
                                               <th class="fbh">Rating</th>
                                            </tr>`;
                        
                        
                        for (let i = index; i < index + 10 && i < feedbacks.length; i++) 
                            ans += feedbacks[i];
                        ans+=`</table>`;
                        //console.log(ans);
                        document.getElementById("Feedback").innerHTML = ans; 
                    }
                });
                
               //document.getElementById("Feedback").innerHTML = ans;
               document.getElementsByClassName("res")[0].innerHTML =`Responses(${c})`;
            } //sucess
    });
}
show();

function sort()
{filter++;
 console.log("Filter applied");
 show();
}