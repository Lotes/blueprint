/**
 * @class NeuronType
 */
export enum NeuronType {
    /**
     * Describes a neuron that sends an activating signal over the outgoing connections.
     * @property ACTIVATE
     * @static
     */
    ACTIVATE,
    /**
     * Describes a neuron that sends an inhibiting signal over the outgoing connections.
     * @property INHIBIT
     * @static
     */
    INHIBIT,
    /**
     * Describes a neuron that strengthens other connections when activated.
     * @property ASSOCIATE
     * @static
     */
    ASSOCIATE,
    /**
     * Describes a neuron that weakens other connections when activated.
     * @property DISASSOCIATE
     * @static
     */
    DISASSOCIATE
}

export class Type {
    name: string;
    validate: (value: any) => boolean;
    constructor(name: string, validate: (value: any) => boolean) {
        this.name = name;
        this.validate = validate;
    }
}

export interface TypeDictionary {
    [name: string]: Type;
}
export var types: TypeDictionary = {};
function defineType(name: string, validate: (value: any) => boolean) {
    if (name in types)
        throw new Error('Type "'+name+'" was already defined!');
    types[name] = new Type(name, validate);
}

//boolean
defineType('Boolean', function (value) {
    return typeof (value) === 'boolean';
});
//integers
defineType('Integer', function (value) {
    return typeof(value) === 'number' && value === Math.floor(value);
});
defineType('PositiveInteger', function (value) {
    return types['Integer'].validate(value) && value > 0;
});
defineType('NonPositiveInteger', function (value) {
    return types['Integer'].validate(value) && value <= 0;
});
defineType('NegativeInteger', function (value) {
    return types['Integer'].validate(value) && value < 0;
});
defineType('NonNegativeInteger', function (value) {
    return types['Integer'].validate(value) && value >= 0;
});
//reals
defineType('Real', function (value) {
    return typeof (value) === 'number';
});
defineType('PositiveReal', function (value) {
    return types['Real'].validate(value) && value > 0;
});
defineType('NonPositiveReal', function (value) {
    return types['Real'].validate(value) && value <= 0;
});
defineType('NegativeReal', function (value) {
    return types['Real'].validate(value) && value < 0;
});
defineType('NonNegativeReal', function (value) {
    return types['Real'].validate(value) && value >= 0;
});
defineType('Percentage', function (value) {
    return types['Real'].validate(value) && value >= 0 && value <= 1;
});
//string
defineType('String', function (value) {
    return typeof (value) === 'string';
});
defineType('Identifier', function (value) {
    return typeof (value) === 'string' && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value);
});
defineType('NeuronType', function (value) {
    return value === NeuronType.ACTIVATE
        || value === NeuronType.INHIBIT
        || value === NeuronType.ASSOCIATE
        || value === NeuronType.DISASSOCIATE;
});

export interface ActualParameters {
    [name: string]: any;
}

export interface FormalParameter {
    type: Type;
    defaultValue?: any;
}

export interface FormalParameters {
    [name: string]: FormalParameter;
}