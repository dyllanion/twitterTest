var ctx = [];
var chartsUp = [];

function getChartData(locat) {
    $.ajax({
		url: "http://127.0.0.1:8080/api/trend/" + locat,
		success: function (result) {
			var locat = result[0].locations[0].name;
			var data = [];
			var labels = [];
			for (var i = 0; i < 2; i++) {
				data[i] = [];
			}
			var count = 0;
			Object.keys(result[0].trends).forEach( function (trendObj) {
				if (result[0].trends[trendObj].tweet_volume != null) {
					if (count < 10) {
						labels[count] = result[0].trends[trendObj].name;
						data[0][count] = result[0].trends[trendObj].tweet_volume;
						data[1][count] = result[0].trends[trendObj].url;
						count++;
					}
				}
			});
			renderChart(data, labels, locat);
		}
	});
}

function renderChart(data, labels, titles) {
	var itemCount = $("#display > canvas").length;
	if (chartsUp.length == 0) {
		for (var i = 1; i <= 1; i++) {
			$("#bar-chart" + i.toString()).removeClass("hidden");
			ctx.push(document.getElementById("bar-chart" + i.toString()).getContext('2d'));
		
			var myChart = new Chart(ctx[i-1], {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [
					{
						label: title,
						data: data[i-1],
						link: data[i],
						borderColor: 'rgba(75, 192, 192, 1)',
						backgroundColor: 'rgba(75, 192, 192, 0.2)',
					}
				]
				},
				options: {
					responsive: false,
					maintainAspectRation: false,
					'onClick' : function(event, array) {
						if (array[0]) {
							window.open(data[1][array[0]._index],'_blank');
						}
					},
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true
							}
						}]
					}
				}
			});
			chartsUp.push(myChart);
			if (typeof data[i-1][0] == 'undefined') {
				$("#bar-chart" + i.toString()).addClass("hidden");
			}
		}
	} else {
		for (var i = 0; i < chartsUp.length; i++) {
			chartsUp[i].destroy();
		}
		chartsUp = [];
		renderChart(data, labels, title);
	}
}

$("#renderBtn").click(
    function () {
		var query = document.getElementById("userIn").value;
		getChartData(query);
    }
);