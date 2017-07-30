var dataByYear = {};

var circleLayerGroup;
var animationPlaying = false;
var mymap = L.map('mapid').setView([13.5000, 100.9925], 5);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mymap);

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "data/joined_filter2.csv",
        dataType: "text",
        success: function(data) {
			data = Papa.parse(data);

			//Filter by year
			data.data.forEach((r) => {
				if(dataByYear[r[2]]){
					dataByYear[r[2]].push(r)					
				}else{
					dataByYear[r[2]] = []
					dataByYear[r[2]].push(r)
				}
			})

			console.log(dataByYear)
			var newYear = parseInt($('#yearSelect').val()) + 543
			updateMap(dataByYear[newYear])
			
        }
     });

    $('#yearSelect').on('change', function(event) {
		mymap.removeLayer(circleLayerGroup)
    	updateMap(dataByYear[parseInt($('#yearSelect').val()) + 543])
	});

    var interval;
	$('#playButton').on('click', function(event){
		if(!animationPlaying){
			animationPlaying = true
			$('#playButton').text("stop")
			var years = document.getElementById('yearSelect').options.length
			var count = 0;
			interval = setInterval(function(){
				$("#yearSelect").val($("#yearSelect option:eq(" + count + ")").val()).trigger('change')
				count++;
				if(count == years){
					clearInterval(interval)
					$('#playButton').text("play")
					animationPlaying = false;
				}
			}, 1000)

		}else{
			clearInterval(interval)
			$('#playButton').text("play")
			animationPlaying = false
		}

	})
});

function updateMap(yearData){
	var temp = []

	temp = yearData.filter((r) => {
		return r[1] == "ปริมาณออกซิเจนละลายน้ำมก./ล."
	})
	var circles = []
	temp.forEach((r) => {
		var value = r[8]
		var lat = r[4]
		var long = r[5]
		var color = calcColor(value);

		var circle = L.circle([lat, long], {
		    color: color,
		    fillColor: color,
		    fillOpacity: 0.5,
		    radius: 20000
		})
		.bindPopup(
		"<strong>" + r[0] + "</strong><br>"+
		"average: " + value + "<br>"+
		"min: " + r[6] + "<br>"+
		"max: " + r[7]);

		circles.push(circle)

	})

	circleLayerGroup = L.layerGroup(circles)
	mymap.addLayer(circleLayerGroup)
}

function calcColor(val){
	// val = parseInt(val.split("-")[0])
	if(0 <= val && val <= 3){
		return 'red'
	}else if(3 < val && val <= 7){
		return 'yellow'
	}else if(7 < val && val <= 20){
		return 'green'
	}else{
		return 'white'
	}
}
