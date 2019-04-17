var chartsUp = [];
var ctx = [];

$(document).ready ( function() {
	$.ajax({
		url: "https://live-test-tweet.herokuapp.com/api/trend/onLoad",
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
});

function renderChart(data, labels, title) {
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
					responsive: true,
					maintainAspectRation: false,
					'onClick' : function(event, array) {
						console.log(array[0]);
						if (array[0]) {
							var qry = labels[array[0]._index].replace("#", "%23");
							qry = qry.replace(" ", "+");
							$.ajax({
								url: "http://127.0.0.1:8080/api/search/" + qry,
								success: function (result) {
									for (var i = 0; i < 4; i++) {
										var noodle = document.getElementById('tweet' + (i + 1));
										while (noodle.hasChildNodes()) {
											noodle.removeChild(noodle.lastChild);
										}
										twttr.widgets.createTweet(
											result.statuses[i].id_str,
											document.getElementById('tweet' + (i + 1)),
											{
												theme: 'light',
											}
										);
									}
								}
							});
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

function graphClickEvent(event, array) {
	if (array[0]) {
		console.log(array[0]._index);
	}
}

$("#renderBtn").click(
    function () {
		for (var i = 0; i < chartsUp.length; i++) {
			chartsUp[i].destroy();
		}
		chartsUp = [];
    }
);