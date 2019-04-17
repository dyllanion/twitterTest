var ctx = [];
var chartsUp = [];

function getChartData(query) {
    $.ajax({
		// CHANGE ME TO HEROKUAPP SITE IF PUSHING TO HEROKU!!!
        url: "https://live-test-tweet.herokuapp.com/api/search/" + query,
        success: function (result) {
			console.log(result);
			var count = result.length;
			var itemCount = $("#display > canvas").length;
            var data = [];
			var titles = [];
			for (var i = 0; i < itemCount; i++) {
				data[i] = [];
			}
			
			var trends = /trends_/;
			var search = /search_/;
			
			var labels = [];
			for (var i = 0; i < count; i++ ) {
				if (query == "search_nasa") {
					data[0].push(result[i].retweet_count);
					titles.push('retweets')
					data[1].push(result[i].favorite_count);
					titles.push('favorites')
					data[2].push(result[i].user.followers_count);
					titles.push('followers')
					labels.push(result[i].user.name);
				} else if (search.test(query)) {
					data[0].push(result[i].status.retweet_count);
					titles.push('retweets')
					data[1].push(result[i].status.favorite_count);
					titles.push('favorites')
					data[2].push(result[i].followers_count);
					titles.push('followers')
					labels.push(result[i].name);
				} else if (trends.test(query)) {
					data[0].push(result[i].tweet_volume);
					titles.push('tweet volume');
					labels.push(result[i].name);
				} else {
				}
			}
			renderChart(data, labels, titles);
        },
        error: function (err) {
            $("#loadingMessage").html("Error");
        }
    });
}

function renderChart(data, labels, titles) {
	var itemCount = $("#display > canvas").length;
	if (chartsUp.length == 0) {
		for (var i = 1; i <= itemCount; i++) {
			$("#bar-chart" + i.toString()).removeClass("hidden");
			ctx.push(document.getElementById("bar-chart" + i.toString()).getContext('2d'));
		
			var myChart = new Chart(ctx[i-1], {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [
					{
						label: titles[i-1],
						data: data[i-1],
						borderColor: 'rgba(75, 192, 192, 1)',
						backgroundColor: 'rgba(75, 192, 192, 0.2)',
					}
				]
				},
				options: {
					responsive: false,
					maintainAspectRation: false
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
		renderChart(data, labels, titles);
	}

}

$("#renderBtn").click(
    function () {
		var query = document.getElementById("userIn").value;
		var rel = document.getElementById("relevancy");
		var tFrame = rel.options[rel.selectedIndex].value;
		var query = box.value;
        getChartData(query);

    }
);