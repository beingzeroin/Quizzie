$.ajaxSetup({
    headers: { 'token': localStorage.token }
  });
  var doc = new jsPDF();
  var btnSave = document.getElementById('save-pdf');
   btnSave.addEventListener('click', function () {
    doc.save('chart.pdf');
  }, false);
  if (!localStorage.token)
      location.href = '/'
var piedata,minmarks,maxmarks,total,average,linedata;
google.charts.load('current', {'packages':['corechart']});

function pieChart() {
 
  var data =new google.visualization.DataTable();
  data.addColumn('string', 'Marks');
  data.addColumn('number', 'No. of Students');
//   data.addColumn({ role:'style'});
   for(let key in piedata)
   {    
       data.addRow([key.toString(),piedata[key]]);
   }
  var options = {
    width:$(window).width()*0.8,
    height:$(window).height()*0.8,
    fontSize: 20,
    title: 'Marks Obtained',
    legend: { position: "top" },
    //colors:['yellow', 'red', 'blue', 'green', 'violet', 'pink'],
    useRandomColors: true,
    backgroundcolor:"#ff0ff",
  };

 var chart1 = new google.visualization.PieChart(document.getElementById('pie_chart'));
  chart1.draw(data, options);
  doc.addImage(chart1.getImageURI(), -40, 0);
  //chart.draw(data);
}

function barChart() {
 
  var data = google.visualization.arrayToDataTable([
    ['Maximum', 'Marks', { role: 'style' } ],
    ['Maximum',maxmarks, 'green'],
    ['Average',average , 'yellow' ],
    ['Minimum',minmarks, 'red' ]
 ]);

  var options = {
    title: 'Highest / Average/ Lowest',
    legend: { position: "none" },
    width: $(window).width()/2,
    height: $(window).height()/2,
    fontSize: 20,
    // 'chartArea': {'left':'15%'}
  }

  var chart2 = new google.visualization.ColumnChart(document.getElementById('bar_chart'));
  chart2.draw(data, options);
  doc.addImage(chart2.getImageURI(), 0, 130);
  //chart.draw(data);
}
function LineChart() {
 
  var data =new google.visualization.DataTable();
  data.addColumn('string', 'Name');
  data.addColumn('number', 'Time (in minutes)');
    for(let i=0;i<linedata.length;i++)
    {
        data.addRow([linedata[i][0],linedata[i][1]])
    }
 var options = {
  title: 'Time taken (in minutes)',
  curveType: 'function',
  pointSize: 2,
  hAxis:{titleTextStyle: {color: '#333'}},
    legend: { position: "none" },
    width: $(window).width()/2,
    height: $(window).height()/2,
    fontSize: 20,

};

  var chart = new google.visualization.LineChart(document.getElementById('line_chart'));
  chart.draw(data, options);
  doc.addImage(chart.getImageURI(), 0, 210);
  //chart.draw(data);
}

var quizId=location.href.split('/').slice(-1)[0]  
  $.ajax({
    url: "/api/admin/allStudentsQuizResult/"+quizId,
    method: "GET",
    success: function(quizdetails) {
        console.log(quizdetails);
        quizdetails=quizdetails.userResults;
        if(quizdetails.length==0)
        alert("No Responses for Your Quiz");
        else{
        piedata={}
        minmarks=Infinity
        maxmarks=-Infinity
        linedata=[[]]
        total =0
        for(let i=0;i<quizdetails.length;i++)
        {
            if(quizdetails[i].marks in piedata)
                piedata[quizdetails[i].marks]+=1;
            else
                piedata[quizdetails[i].marks]=1;
            minmarks=Math.min(minmarks,quizdetails[i].marks)
            maxmarks=Math.max(maxmarks,quizdetails[i].marks)
            total+=quizdetails[i].marks
            console.log((quizdetails[i].timeEnded),quizdetails[i].timeStarted)
            linedata.push([quizdetails[i].userId["name"],(quizdetails[i].timeEnded-quizdetails[i].timeStarted)/(1000*60)]);
        }
        average=total/(quizdetails.length);
        google.charts.setOnLoadCallback(pieChart);
        google.charts.setOnLoadCallback(barChart);
        google.charts.setOnLoadCallback(LineChart);
        console.log(piedata,maxmarks,minmarks,total,linedata); 
      }
    },
    error: function(err) {
      console.log(err);
      alert("Please check Your Quiz Id")
    }
  });
  // $(window).resize(function() {
  //   google.charts.setOnLoadCallback(pieChart);
  //   google.charts.setOnLoadCallback(barChart);
  //   google.charts.setOnLoadCallback(LineChart);
  // });