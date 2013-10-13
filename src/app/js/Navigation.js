/**
 * Builds the navigation
 * @type {{bindEvents: Function, init: Function}}
 */
var Navigation = {
	bindEvents: function(){
		$('.container .content').children().hide().first().fadeIn('slow');
		$('.navbar .nav a').click(function(){
			var clicked = this;
			$('.navbar .nav li').removeClass('active');
			$(clicked).parent('li').addClass('active');
			$('.container .content').children().fadeOut(300);
			$('.container .content div.' + $(clicked).attr('data-content')).delay(300).fadeIn(300);
			$('.navbar-collapse').removeClass('in').addClass('collapse');
			return true;
		});

		$('.update button').click(function(){
			$('.loading').show();
			Location.getLocation(Weather.currentLocation, Weather.locationUnavailable);
		});
	},
	init: function(){
		Navigation.bindEvents();
	}
}