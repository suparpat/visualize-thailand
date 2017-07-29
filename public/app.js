var dataByYear = {};
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

    $('#yearSelect').change(function(event) {
    	// console.log(L)
    	// L.layerGroups().clearLayers()
    	updateMap(dataByYear[parseInt($('#yearSelect').val()) + 543])
	});
});

function updateMap(yearData){
	var temp = []

	temp = yearData.filter((r) => {
		return r[1] == "ปริมาณออกซิเจนละลายน้ำมก./ล."
	})

	temp.forEach((r) => {
		var value = r[8]
		var lat = r[4]
		var long = r[5]
		var color = calcColor(value);
		L.circle([lat, long], {
		    color: color,
		    fillColor: color,
		    fillOpacity: 0.5,
		    radius: 20000
		}).addTo(mymap).bindPopup("I am a circle.");


	})

}

function calcColor(val){
	console.log(val)
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
