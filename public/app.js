var mymap = L.map('mapid').setView([13.5000, 100.9925], 5);


L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mymap);






$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "data/[Thai] Coastal Water Quality 1998-2015 คุณภาพน้ำทะเลบริเวณชายฝั่งทะเล.csv",
        dataType: "text",
        success: function(data) {
			var data = Papa.parse(data);
			console.log(data)

        }
     });
});
