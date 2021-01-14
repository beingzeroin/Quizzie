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
    option  : 4 }
 ]

 var h="";

 for(var i=0;i<a.length;i++)
 { h+=`<div class="dropdown">
          <button class="dropbtn">
          <div class="bar">
             <p class="para">a`;
   if(a[i].correct == a[i].chosen)
        h+=`<p class='right'>&#10004</p>`;
   else h+=`<p class='wrong'>&#10006</p>`;
   h+=` </p> 
   </div>
   <i class="fa fa-chevron-down fa-2x" aria hidden="true" style="color:black"></i>
     <div class="dropdown-content">`;
       for(var j=0;j<a[i].option;j++)
       {
        if(j+1==a[i].correct)
         h+=`<p class='odot fa-2x' style=" color:green">&#8857</p>`;
        else if(a[i].chosen==j+1)
         h+=`<p class='odot fa-2x' style="color:red">&#8857</p>`;
        else h+=`<p class='odot fa-2x' style="color:grey">&#8857</p>`;
       }
    h+=`</div>
   </button>
   </div>`;
}
document.getElementById("questions").innerHTML=h;

}
show();