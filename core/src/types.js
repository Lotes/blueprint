(function () {
    function define(name, validate) {
        if (name in types)
            throw new Error('Type "'+name+'" was already defined!');
        types[name] = {
            name: name,
            validate: validate
        };
    }

    var types = {
        defineType: define    
    };
    
    //boolean
    define('Boolean', function (value) {
        return typeof (value) === 'boolean';
    });
    //integers
    define('Integer', function (value) { 
        return typeof(value) === 'number' && value === Math.floor(value);
    });
    define('PositiveInteger', function (value) {
        return types.Integer.validate(value) && value > 0;
    });
    define('NonPositiveInteger', function (value) {
        return types.Integer.validate(value) && value <= 0;
    });
    define('NegativeInteger', function (value) {
        return types.Integer.validate(value) && value < 0;
    });
    define('NonNegativeInteger', function (value) {
        return types.Integer.validate(value) && value >= 0;
    });
    //reals
    define('Real', function (value) {
        return typeof (value) === 'number';
    });
    define('PositiveReal', function (value) {
        return types.Real.validate(value) && value > 0;
    });
    define('NonPositiveReal', function (value) {
        return types.Real.validate(value) && value <= 0;
    });
    define('NegativeReal', function (value) {
        return types.Real.validate(value) && value < 0;
    });
    define('NonNegativeReal', function (value) {
        return types.Real.validate(value) && value >= 0;
    });
    //string
    define('String', function (value) {
        return typeof (value) === 'string';
    });
    //interface
    module.exports = types;
})();