if(pageName=='History')
{   var a =  [{ test: "Test1",
                    score : 1},
                  { test: "Test1",
                    score : 2},
                  { test: "Test3",
                    score : 3},
                  { test: "Test4",
                    score : 4}];

    $.ajax({
            type: "POST",
            url: "/api/user/quizzesGiven",
            success: function(resultData) 
            {
               alert(resultData);
            }
        });       
        var h="";
        for( var i=0; i<a.length;i++)
        { h+=`<a href="result"><div class="test" ><div class="bar"><b class="para">` + a[i].test +
          `</b><p class="para">Score : ` + a[i].score +
          `</p></div><a href="/ui/result"><i class="fa fa-chevron-right fa-2x" aria-hidden="true" style="color:black;margin-top:.6em"></i></a></div></a>`;
        }
        document.getElementById("test").innerHTML=h;
}