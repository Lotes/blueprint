(function () {
    var basics = require('./basics-rev2');
    var Processor = basics.Processor;

    function Parameter(type, initialValue) {
        if (!type || typeof (type.validate) !== 'function')
            throw new Error('Type has no validator!');
        if (typeof (initialValue) !== 'undefined' && !type.validate(initialValue))
            throw new Error('No valid default value!');
        this.type = type;
        this['default'] = initialValue;
    }
    Parameter.prototype = {
        validate: function (value) { 
            return this.type.validate(value);
        },
        hasInitial: function () { 
            return typeof (this['default']) !== 'undefined';
        },
        initial: function () {
            if (this.hasInitial())
                return this['default'];
            throw new Error('Parameter has no default value!');
        }
    };

    function readParameters(obj) {
        var result = {};
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                var def = obj[name];
                var parameter = null;
                if(typeof(def.validate) === 'function')
                    parameter = new Parameter(def);
                else
                    parameter = new Parameter(def.type, def['default']);
                result[name] = parameter;
            }
        }
        return result;
    }
    
    function validateAndInitialize(options, parameters) {
        //check defined values
        for (var name in options) {
            if (options.hasOwnProperty(name)) {
                if (!parameters.hasOwnProperty(name))
                    throw new Error('Unknown parameter "' + name + '"!');
                var parameter = parameters[name];
                var value = options[name];
                if (!parameter.validate(value))
                    throw new Error('"'+value+'" is no valid value for parameter "'+name+'"!');
            }
        }
        //fill undefined values, alert missing values
        for (var name in parameters) {
            if (parameters.hasOwnProperty(name)) {
                if (options.hasOwnProperty(name))
                    continue;
                var parameter = parameters[name];
                if(!parameter.hasInitial())
                    throw new Error('Parameter "' + name + '" is required, it has no default value!');
                options[name] = parameter.initial();
            }
        }
    }

    function annotate(fn) {
        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        var FN_ARG_SPLIT = /,/;
        var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var self = this;
        fn = fn.toString();
        var noCommentsText = fn.replace(STRIP_COMMENTS, '');
        var signatureText = noCommentsText.match(FN_ARGS)[1];
        var argTexts = signatureText.split(FN_ARG_SPLIT);
        var args = [];
        argTexts.forEach(function (arg) {
            arg.replace(FN_ARG, function(all, underscore, name){
                if(!self.has(name))
                    throw new Error('"'+name+'" is not a valid provider!');
                args.push(name);
            });
        });
        fn.$inject = args;
    }

    /**
     * A standalone blueprint application.
     * @class Application
     * @constructor
     */
    function Application() { 
        var definitions = {};
    }
    Application.prototype = {
        /**
         * Defines a processor node. A processor node accepts incoming and outgoing connections.
         * @method processor
         * @param name {String} the name under which the processor should be injectable
         * @param options.definition {Hash<Parameter>} defines the static structure parameters of this processor
         *
         * @param options.state {Hash<Parameter>} defines the runtime state (input and output)
         * @param options.input {Hash<Parameter>} defines the runtime state (input only)
         * @param options.output {Hash<Type>} defines the runtime state (output only)
         * @param options.compute {Function<Number>} defines the runtime computation function
         */
        processor: function (name, options) {
            if(name in this.definitions)
                throw new Error('Their already is a definition with the name "'+name+'".');
            options = options || {};
            var definition = readParameters(options.definition) || {};
            var compute = options.compute;
            if(typeof(compute) !== 'function')
                throw new Error('A compute function is required!');
            annotate(compute);
            function MyProcessor(myOptions) {
                myOptions = myOptions || {};
                MyProcessor.__super__.constructor.apply(this, [myOptions]);
                validateAndInitialize(myOptions, definition);
            }
            MyProcessor.prototype = {
                compute: function (self, input, oldState, newState, output) {
                    var mapping = {
                        $input: input,
                        $output: output,
                        $oldState: oldState,
                        $newState: newState
                    };
                    var injectedArguments = compute.$inject.map(function(argumentName) {
                        if(argumentName in mapping)
                            return mapping[element];
                        throw new Error('Unsupported argument: '+argumentName);
                    });
                    return compute.apply(self, injectedArguments);
                }
            };
            inherit(MyProcessor, Processor);
            this.definitions[name] = {
                type: 'processor',
                definition: MyProcessor
            };
            return MyProcessor;
        },
        sender: function (name, options) { 
            
        },
        receiver: function (name, options) { 
        
        },
        module: function (name, options) { 
            //wenn !isObject(options) dann Modul-Konstruktor zurückgeben
        },
        connection: function (name, options) {
        
        },
        simulate: function (moduleInstance) { 
            //return new Simulation(moduleInstance);
        }
    };

    module.exports = Application;

})();