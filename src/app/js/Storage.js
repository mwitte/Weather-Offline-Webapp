/**
 * Wrapper for localStorage
 * @type {{store: Function, restore: Function, clear: Function}}
 */
var Storage = {

	/**
	 * Stores data into the browser storage by key
	 * @param key
	 * @param data
	 */
	store: function (key, data){
		U.log('Storing with key "'+ key + '": ' + JSON.stringify(data));
		localStorage[key] = JSON.stringify(data);
	},

	/**
	 * Restores data from the browser storage by key
	 * @param key
	 * @param data
	 */
	restore: function(key){

		if(localStorage[key]){
			U.log('Restoring with key "'+ key + '": ' + localStorage[key]);
			return JSON.parse(localStorage[key]);
		}else{
			U.log('Failed restoring with key "'+ key + '"');
		}
	},

	/**
	 * Clears the browser storage
	 */
	clear: function (){
		U.log('Clearing storage');
		localStorage.clear();
	}
}