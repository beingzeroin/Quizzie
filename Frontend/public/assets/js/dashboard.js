function openPage(pageName,elmnt) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.borderColor = "red";
    document.getElementById(pageName).style.display = "block";
  }
  document.getElementById("defaultOpen").click();

  fetch("/api/user/5f37bfefcdd70f3e64bede36").then(function(data)
  {
    let result=data.results;
    console.log(result,data);
  });
  //   document.getElementById("Profile").innerHTML=`<h2>$(data.username)</h2> <h3>$(data.email)</h3>`;
  // }
  // getdata();
  
