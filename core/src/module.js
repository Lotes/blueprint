(function() {
    /*
       Requires globals:
         * Backbone
         * Underscore
     */
    var basics = require('./basics');

	/**
	 * @module Blueprint
	 */
	module.exports = {
        NeuronType: require('./NeuronType'),
        module: basics.module
	};	
	
})();