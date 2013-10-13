/**
 * Mapping for the weather icon font
 */
var IconMapping = {
	"thunder": "Z",
	"drizzle": "Q",
	"rain": "R",
	"snow": "W",
	"atmosphere": "M",
	"sun": "B",
	"semi-cloud": "H",
	"cloud": "Y",
	"extreme": "F"
}

var Weather = {
	/**
	 * Expire time for the weather data.
	 */
	expire: 60,

	handleNewData: function(dataSet){
		Weather.Dom.state(1);
		Storage.store('currentLocation', dataSet);
		Weather.Dom.showCurrent(dataSet);
	},
	handleNoData: function(){
		Weather.Dom.state(0);
	},
	currentLocation: function(position){
		var dataSet = WeatherApi.currentByCoordinates(position, Weather.handleNewData, Weather.handleNoData, 10);
	},
	locationUnavailable: function(){
		Weather.Dom.state(0, "Location not available");
	},

	Dom: {
		showCurrent: function(dataSet){
			if(!dataSet){
				var dataSet = Storage.restore('currentLocation');
			}
			if(dataSet){
				// fill frontend
				$('.currentLocation .weather .city').html(dataSet.city + ', ' + dataSet.country);
				$('.currentLocation .weather .temperature').html(Math.round(dataSet.temperature));
				$('.currentLocation .weather .conditions').attr('data-icon', IconMapping[dataSet.conditions]);
				var date = new Date(dataSet.created);
				$('.currentLocation .weather span.updated').html('Updated: <br/>' + date.toString());

				$('.currentLocation .weather').fadeIn('slow');
				if(dataSet.created >= new Date().getTime() - 1000 * Weather.expire){
					$('.loading').hide();
					return true;
				}
			}
			return false;
		},
		state: function(state, label){
			$('.state').removeClass('label-danger label-warning label-success');
			switch(state){
				//
				case 0:
					if(typeof label === 'undefined'){
						var label = 'offline';
					}
					$('.stateLabel').html(label).addClass('label-danger').show();
					break;
				case 1:
					if(typeof label === 'undefined'){
						var label = 'online';
					}
					$('.stateLabel').html(label).addClass('label-success').hide();
					break;
				default:
					if(typeof label === 'undefined'){
						var label = 'unknown';
					}
					$('.stateLabel').html(label).addClass('label-warning').hide();
					break;
			}
		}
	},


}