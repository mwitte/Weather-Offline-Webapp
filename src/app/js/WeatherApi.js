/**
 * API to the weather service
 */
var WeatherApi = {
	success: false,
	/**
	 *
	 * @param position
	 * @param successCallback
	 * @param errorCallback
	 * @param timeout in seconds when a call should be failed
	 */
	currentByCoordinates: function(position, successCallback, errorCallback, timeout){
		if(typeof position === 'undefined'){
			if(errorCallback){
				errorCallback();
			}
			return false;
		}
		var url = document.location.protocol + "//api.openweathermap.org/data/2.5/weather?callback=?&units=metric&lat=" + position.latitude +"&lon=" + position.longitude;
		U.log('Calling currentByCoordinates by url: ' + url);
		$.getJSON(url, function(response){
			WeatherApi.success = true;
			if(successCallback){
				successCallback(WeatherApi.DataSetFactory.fromCurrent(response));
			}
		});
		// error handling for jsonp
		setTimeout(function() {
			if (!WeatherApi.success){
				if(errorCallback){
					errorCallback();
				}
			}}, timeout * 1000);
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
	}
}