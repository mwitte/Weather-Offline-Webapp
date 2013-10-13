/**
 * Handle the location browser api
 * @type {{position: {latitude: null, longitude: null}, getLocation: Function, success: Function, error: Function}}
 */

var Location = {

	successCallback: null,
	errorCallback: null,

	position: {
		latitude: null,
		longitude: null
	},

	/**
	 * Gets the current Location
	 * @param successCallback Callback function which gets called when the position was found
	 * @param errorCallback Callback function which gets called when something went wrong
	 */
	getLocation: function(successCallback, errorCallback){
		if(successCallback){
			Location.successCallback = successCallback;
		}
		if(errorCallback){
			Location.errorCallback = errorCallback;
		}

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(Location.success, Location.error);
		}
		else{
			// @TODO
			U.log("Your browser does not support Geolocation!");
			if(Location.errorCallback){
				Location.errorCallback();
				Location.errorCallback = null;
			}
		}
	},
	success: function(position){
		Location.position.latitude = position.coords.latitude;
		Location.position.longitude = position.coords.longitude;
		if(Location.successCallback){
			Location.successCallback(Location.position);
			Location.successCallback = null;
		}
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
		if(Location.errorCallback){
			Location.errorCallback();
			Location.errorCallback = null;
		}
	}
}