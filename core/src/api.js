(function() {
    /**
	 * @module Blueprint
	 */    
    var Application = require('./Application');
    var types = require('./types');

    /**
     * Describes the public level of blueprint.
     * @class BlueprintAPI
     * @constructor
     */
    function BlueprintAPI() { }
    BlueprintAPI.prototype = {
        /**
         * Creates a blueprint application. All definitions will assigned to the application that creates it.
         * @method application
         */
        application: function () {
            return new Application();
        },
        /**
         * Serves a list of types.
         * @property types
         */
        types: types
    };
    module.exports = new BlueprintAPI();
})();