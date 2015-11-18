var should = require('should');
var blueprint = require('../src/api');

describe('API: use cases', function () {
    it('should correctly compute connection', function () {
        var app = blueprint.application();
        app.connection('SimpleConnection', {
            $parameters: {
                weight:{
                    type: blueprint.types.NonNegativeReal,
                    'default': 1
                }
            },
            $state: {
                weight: {
                    type: blueprint.types.NonNegativeReal,
                    'default': function ($parameters) { 
                        return $parameters.weight;
                    }
                }
            },
            $compute: function ($oldState, $newState, $source) {
                $newState.weight = $oldState.weight * 1.1;
                return $source.output * $oldState.weight;
            }
        });

        //https://docs.angularjs.org/api/ng/service/$parse

        /*var injector = app.getInjector();
        injector.invoke(function (SimpleConnection, SimpleConnectionProvider) {
            var connection = new SimpleConnection( { //SimpleConnection === SimpleConnectionProvider.$get()
                source: null,
                destination: null,
                weight: 1
            });
            var state = { weight: 23.0 };
            var input = {};
            var output = {};
            var returnValue = SimpleConnectionProvider.compute(connection, input, state, output);
            returnValue.should.be.equal.to(23);
        });*/
    });
});