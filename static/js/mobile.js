$(document).ready(function(){
	Location.getLocation();
});

var IconMapping = new Array();
IconMapping["thunder"] = "Z";
IconMapping["drizzle"] = "Q";
IconMapping["rain"] = "R";
IconMapping["snow"] = "W";
IconMapping["atmosphere"] = "M";
IconMapping["sun"] = "B";
IconMapping["semi-cloud"] = "H";
IconMapping["cloud"] = "Y";
IconMapping["extreme"] = "F";





var Weather = {
	value: null,

	currentLocation: function(apiData){
		if(!apiData){
			Weather.Api.currentByCoordinates(Location.latitude, Location.longitude);
		}else{
			U.log('Location based api data: ' + apiData.main.temp + ' °C  ' + apiData.name + ', ' + apiData.sys.country);
			Weather.value = apiData;


			var dataSet = Weather.DataSetFactory.fromCurrent(apiData);
			Weather.Dom.showCurrent(dataSet);
		}
	},

	Dom: {
		showCurrent: function(dataSet){
			// fill frontend
			$('.currentLocation h1').html(dataSet.city + ', ' + dataSet.country);
			$('.currentLocation .temperature').html(Math.round(dataSet.temperature));
			$('.currentLocation .conditions').attr('data-icon', IconMapping[dataSet.conditions]);
			$('.currentLocation').fadeIn('slow');
		}
	},

	/**
	 * Builds dataSets by api data
	 */
	DataSetFactory: {
		fromCurrent: function(data){
			var dataSet = {
				city: data.name,
				country: data.sys.country,
				timestamp: data.dt,
				temperature: data.main.temp
			}
			if(data.weather && data.weather[0]){
				switch(data.weather[0].id.toString().charAt(0)){
					case '2':
						dataSet.conditions = 'thunder';
						break;
					case '3':
						dataSet.conditions = 'drizzle';
						break;
					case '5':
						dataSet.conditions = 'rain';
						break;
					case '6':
						dataSet.conditions = 'snow';
						break;
					case '7':
						dataSet.conditions = 'atmosphere';
						break;
					case '8':
						var detail = data.weather[0].id.toString().charAt(0);
						if(detail == '0'){
							dataSet.conditions = 'sun';
						}else if(detail == '1' || detail == '2'){
							dataSet.conditions = 'semi-cloud';
						}else{
							dataSet.conditions = 'cloud';
						}

						break;
					case '9':
						dataSet.conditions = 'extreme';
						break;
				}
			}
			return dataSet;
		}
	},


	/**
	 * API to the weather service
	 */
	Api: {
		currentByCoordinates: function(latitude, longitude){
			var url = document.location.protocol + "//api.openweathermap.org/data/2.5/weather?callback=?&units=metric&lat=" + latitude +"&lon=" + longitude;
			U.log('Calling currentByCoordinates by url: ' + url);
			$.getJSON(url, function(response){
				Weather.currentLocation(response);
			});

		}
	}
}

var U = {
	log: function(text){
		$('#log').prepend(text +'\n');
	}
}

var Location = {
	latitude: null,
	longitude: null,

	getLocation: function(){
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(Location.success, Location.error);
		}
		else{
			// @TODO
			console.log("Your browser does not support Geolocation!");
		}
	},
	success: function(position){
		Location.latitude = position.coords.latitude;
		Location.longitude = position.coords.longitude;
		U.log('Located device at (lat / lon) ' + position.coords.latitude + ' / ' + position.coords.longitude);
		Weather.currentLocation();
	},
	error: function(error){
		switch(error.code) {
			case error.TIMEOUT:
				U.log("A timeout occured! Please try again!");
				break;
			case error.POSITION_UNAVAILABLE:
				U.log('We can\'t detect your location. Sorry!');
				break;
			case error.PERMISSION_DENIED:
				U.log('Please allow geolocation access for this to work.');
				break;
			case error.UNKNOWN_ERROR:
				U.log('An unknown error occured!');
				break;
		}
	}
}

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