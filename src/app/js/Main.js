$(document).ready(function(){
	Navigation.init();
	if(!Weather.Dom.showCurrent()){
		Location.getLocation(Weather.currentLocation, Weather.locationUnavailable);
	}
});