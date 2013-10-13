$(document).ready(function(){
	Navigation.init();
	Weather.Dom.onlineState(-1);
	if(!Weather.Dom.showCurrent()){
		Location.getLocation();
	}
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


var U = {
	log: function(text){
		$('#log').prepend(text +'\n');
	}
}

var Navigation = {
	bindEvents: function(){
		$('.container .content').children().hide().first().show();;
		$('.navbar .nav a').click(function(){
			var clicked = this;
			$('.navbar .nav li').removeClass('active');
			$(clicked).parent('li').addClass('active');
			$('.container .content').children().fadeOut(300);
			$('.container .content div.' + $(clicked).attr('data-content')).delay(300).fadeIn(300);
			$('.navbar-collapse').removeClass('in').addClass('collapse');
			return true;
		});
	},
	init: function(){
		Navigation.bindEvents();
	}
}

var Weather = {
	value: null,
	/**
	 * in seconds
	 */
	expire: 60,

	currentLocation: function(apiData){
		var dataSet = Storage.restore('currentLocation');
		if(dataSet){
			Weather.Dom.showCurrent(dataSet);
			if(dataSet.created >= new Date().getTime() - 1000 * Weather.expire){
				U.log('Lifetime: ' + ((1000 * Weather.expire - (new Date().getTime() - dataSet.created)) / 1000).toString());
				return;
			}
			U.log('Lifetime expired');
		}
		if(!apiData){
			Weather.Api.currentByCoordinates(Location.position.latitude, Location.position.longitude);
		}else{
			U.log('Location based api data: ' + apiData.main.temp + ' °C  ' + apiData.name + ', ' + apiData.sys.country);
			Weather.value = apiData;


			var dataSet = Weather.DataSetFactory.fromCurrent(apiData);
			Storage.store('currentLocation', dataSet);
			Weather.Dom.showCurrent(dataSet);
		}
	},

	Dom: {
		showCurrent: function(dataSet){
			if(!dataSet){
				var dataSet = Storage.restore('currentLocation');
			}
			if(dataSet){
				// fill frontend
				$('.currentLocation h1').html(dataSet.city + ', ' + dataSet.country);
				$('.currentLocation .temperature').html(Math.round(dataSet.temperature));
				$('.currentLocation .conditions').attr('data-icon', IconMapping[dataSet.conditions]);
				var date = new Date(dataSet.created);
				$('.currentLocation span.updated').html('Updated: <br/>' + date.toString());

				$('.currentLocation').fadeIn('slow');
				if(dataSet.created >= new Date().getTime() - 1000 * Weather.expire){
					return true;
				}
			}
			return false;
		},
		onlineState: function(state){
			$('.onlineState').removeClass('label-danger label-warning label-success');
			switch(state){
				//
				case 0:
					$('.onlineState').html('offline').addClass('label-danger').show();
					break;
				case 1:
					$('.onlineState').html('online').addClass('label-success').hide();
					break;
				default:
					$('.onlineState').html('unknown').addClass('label-warning').hide();
					break;
			}
		}
	},

	/**
	 * Builds dataSets by api data
	 */
	DataSetFactory: {
		fromCurrent: function(data){
			var dataSet = {
				created: new Date().getTime(),
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
		success: false,
		currentByCoordinates: function(latitude, longitude){
			var url = document.location.protocol + "//api.openweathermap.org/data/2.5/weather?callback=?&units=metric&lat=" + latitude +"&lon=" + longitude;
			U.log('Calling currentByCoordinates by url: ' + url);
			Weather.Dom.onlineState(-1);
			$.getJSON(url, function(response){
				Weather.currentLocation(response);
				Weather.Api.success = true;
				Weather.Dom.onlineState(1);
			});
			// error handling for jsonp
			setTimeout(function() {
				if (!Weather.Api.success){
					Weather.Dom.onlineState(0);
				}}, 5 * 1000);
		}
	}
}

/**
 * Wrapper for localStorage
 * @type {{store: Function, restore: Function, clear: Function}}
 */
var Storage = {
	store: function (key, data){
		U.log('Storing with key "'+ key + '": ' + JSON.stringify(data));
		localStorage[key] = JSON.stringify(data);
	},
	restore: function(key){

		if(localStorage[key]){
			U.log('Restoring with key "'+ key + '": ' + localStorage[key]);
			return JSON.parse(localStorage[key]);
		}else{
			U.log('Failed restoring with key "'+ key + '"');
		}
	},
	clear: function (){
		U.log('Clearing storage');
		localStorage.clear();
	}
}

var Location = {
	position: {
		latitude: null,
		longitude: null
	},

	getLocation: function(){
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(Location.success, Location.error);
		}
		else{
			// @TODO
			U.log("Your browser does not support Geolocation!");
		}
	},
	success: function(position){
		Location.position.latitude = position.coords.latitude;
		Location.position.longitude = position.coords.longitude;
		Storage.store('lastLocation', Location.position);
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
		if(Storage.restore('lastLocation')){
			Location.position = Storage.restore('lastLocation');
			Weather.currentLocation();
		}
	}
}