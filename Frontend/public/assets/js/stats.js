$.ajaxSetup({
    headers: { 'token': localStorage.token }
  });
  
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
    width: 360,
    height: 300,
    fontSize: 20,
    title: 'Marks Obtained',
    legend: { position: "top" },
    //colors:['yellow', 'red', 'blue', 'green', 'violet', 'pink'],
    useRandomColors: true,
    backgroundcolor:"#ff0ff",
  };

 var chart = new google.visualization.PieChart(document.getElementById('pie_chart'));
  chart.draw(data, options);
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
    width: 360,
    height: 304,
    fontSize: 20,
    'chartArea': {'left':'15%'}
  }

  var chart = new google.visualization.ColumnChart(document.getElementById('bar_chart'));
  chart.draw(data, options);
  //chart.draw(data);
}
function LineChart() {
 
  var data =new google.visualization.DataTable();
  data.addColumn('string', 'Name');
  data.addColumn('number', 'Time (in minutes)');
    for(let i=0;i<linedata.length;i++)
    {
        data.addRow([i.toString(),linedata[i]])
    }
 var options = {
  title: 'Time taken (in minutes)',
  curveType: 'function',
  pointSize: 5,
  hAxis:{titleTextStyle: {color: '#333'}},
    legend: { position: "none" },
    width: 360,
    height: 304,
    fontSize: 20,

};

  var chart = new google.visualization.LineChart(document.getElementById('line_chart'));
  chart.draw(data, options);
  //chart.draw(data);
}

var quizId=location.href.split('/').slice(-1)[0]  
  $.ajax({
    url: "/api/quiz/"+quizId,
    method: "GET",
    success: function(result) {
        console.log(result.result);
        quizdetails=result.result;
        piedata={}
        minmarks=Infinity
        maxmarks=-Infinity
        linedata=[]
        total =0
        for(let i=0;i<quizdetails["usersParticipated"].length;i++)
        {
            if(quizdetails.usersParticipated[i].marks in piedata)
                piedata[quizdetails.usersParticipated[i].marks]+=1;
            else
                piedata[quizdetails.usersParticipated[i].marks]=1;
            minmarks=Math.min(minmarks,quizdetails.usersParticipated[i].marks)
            maxmarks=Math.max(maxmarks,quizdetails.usersParticipated[i].marks)
            total+=quizdetails.usersParticipated[i].marks
            //console.log((quizdetails.usersParticipated[i].timeEnded-quizdetails.usersParticipated[i].timeStarted))
            linedata.push((quizdetails.usersParticipated[i].timeEnded-quizdetails.usersParticipated[i].timeStarted)/(1000*60));
        }
        average=total/(quizdetails["usersParticipated"].length);
        google.charts.setOnLoadCallback(pieChart);
        google.charts.setOnLoadCallback(barChart);
        google.charts.setOnLoadCallback(LineChart);
        console.log(piedata,maxmarks,minmarks,total,linedata); 
    },
    error: function(err) {
      console.log(err);
      alert("Please check Your Quiz Id")
    }
  });