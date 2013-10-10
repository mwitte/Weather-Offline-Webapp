

	/*
	$.ajax({
		url: document.location.protocol + '//api.openweathermap.org/data/2.5/weather?callback=myjsonpfunction&q=' + encodeURIComponent(url),
		dataType: 'json',
		async:'true',
		type:"GET",
		success: function(data) {
			console.log("success");
		}
	});
*/
/*
	var url = document.location.protocol + '//api.openweathermap.org/data/2.5/weather?callback=?&q=' + encodeURIComponent("Rosenheim,de");

	$.getJSON(url, function(response){

		console.log(response);
	});

function myjsonpfunction(data){

	console.log(data.responseData.results);
}
	*/