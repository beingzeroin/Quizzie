function openPage(pageName, elmnt, id) {
    var i, tabcontent, tablinks;
    if (id == 1) {
        document.getElementById("2").style.borderBottomColor = "white";
        document.getElementById("0").style.borderBottomColor = "white";
    } else if (id == 2) {
        document.getElementById("1").style.borderBottomColor = "white";
        document.getElementById("0").style.borderBottomColor = "white";
    } else {
        document.getElementById("1").style.borderBottomColor = "white";
        document.getElementById("2").style.borderBottomColor = "white";
    }
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tabs");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.backgroundColor = "";
    } 

    if(pageName=='History')
    {   var a =  [{ test: "Test1",
                    score : 1},
                  { test: "Test1",
                    score : 2},
                  { test: "Test3",
                    score : 3},
                  { test: "Test4",
                    score : 4}];
        var h="";
        for( var i=0; i<a.length;i++)
        { h+=`<a href="results"><div class="test" ><div class="bar"><b class="para">` + a[i].test +
          `</b><p class="para">Score : ` + a[i].score +
          `</p></div><a href="/ui/result"><i class="fa fa-chevron-right fa-2x" aria-hidden="true" style="color:black;margin-top:.6em"></i></a></div></a>`;
        }
        document.getElementById("test").innerHTML=h;
        tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.borderBottom = "3px solid rgb(6, 184, 255)";
}

let element = document.getElementById("0");
if (typeof(element) != 'undefined' && element != null) {
    element.click();
}