(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var IMap = function() { };
IMap.__name__ = true;
Math.__name__ = true;
var NeuronType = { __ename__ : true, __constructs__ : ["ACTIVATE","INHIBIT","ASSOCIATE","DISASSOCIATE"] };
NeuronType.ACTIVATE = ["ACTIVATE",0];
NeuronType.ACTIVATE.__enum__ = NeuronType;
NeuronType.INHIBIT = ["INHIBIT",1];
NeuronType.INHIBIT.__enum__ = NeuronType;
NeuronType.ASSOCIATE = ["ASSOCIATE",2];
NeuronType.ASSOCIATE.__enum__ = NeuronType;
NeuronType.DISASSOCIATE = ["DISASSOCIATE",3];
NeuronType.DISASSOCIATE.__enum__ = NeuronType;
var computation = {};
computation.Worker = function() {
};
computation.Worker.__name__ = true;
computation.Worker["export"] = function(script) {
	self.onmessage = function(e) { script.onMessage(JSON.parse(e.data)); };;
};
computation.Worker.prototype = {
	onMessage: function(message) {
	}
	,postMessage: function(message) {
		self.postMessage(JSON.stringify(message));
	}
	,__class__: computation.Worker
};
var WorkerMain = function() {
	computation.Worker.call(this);
};
WorkerMain.__name__ = true;
WorkerMain.main = function() {
	computation.Worker["export"](new WorkerMain());
};
WorkerMain.__super__ = computation.Worker;
WorkerMain.prototype = $extend(computation.Worker.prototype,{
	initialize: function(netData) {
		var x = null;
	}
	,answerSuccess: function(id,message) {
		this.postMessage({ id : id, type : "success", body : message});
	}
	,answerError: function(id,error) {
		this.postMessage({ id : id, type : "error", body : error});
	}
	,notify: function(id,message) {
		this.postMessage({ id : id, type : "notify", body : message});
	}
	,onMessage: function(message) {
		var id = message.id;
		var body = message.body;
		var action = body.action;
		switch(action) {
		case "initialize":
			try {
				this.initialize(body.data);
				this.answerSuccess(id,null);
			} catch( err ) {
				if( js.Boot.__instanceof(err,Error) ) {
					this.answerError(id,err.message);
				} else throw(err);
			}
			break;
		case "cancel":
			break;
		case "step":
			break;
		}
	}
	,__class__: WorkerMain
});
computation.Connection = function(net,source,destination) {
	this.net = net;
	this.source = source;
	this.destination = destination;
};
computation.Connection.__name__ = true;
computation.Connection.prototype = {
	getSource: function() {
		return this.source;
	}
	,getDestination: function() {
		return this.destination;
	}
	,getConnectionType: function() {
		return this.source.getNeuronType();
	}
	,__class__: computation.Connection
};
computation.ConnectionState = function(weight) {
	this.weight = weight;
};
computation.ConnectionState.__name__ = true;
computation.ConnectionState.prototype = {
	getWeight: function() {
		return this.weight;
	}
	,__class__: computation.ConnectionState
};
computation.Net = function(learningConstant,unlearningConstant,decayConstant) {
	this.connectionsByDestination = new haxe.ds.ObjectMap();
	this.connectionsBySource = new haxe.ds.ObjectMap();
	this.connections = new Array();
	this.neurons = new Array();
	this.learningConstant = learningConstant;
	this.unlearningConstant = unlearningConstant;
	this.decayConstant = decayConstant;
};
computation.Net.__name__ = true;
computation.Net.prototype = {
	getLearningConstant: function() {
		return this.learningConstant;
	}
	,getUnlearningConstant: function() {
		return this.unlearningConstant;
	}
	,getDecayConstant: function() {
		return this.decayConstant;
	}
	,addNeuron: function(type,threshold,factor,maximum) {
		var neuron = new computation.Neuron(this,type,threshold,factor,maximum);
		this.neurons.push(neuron);
		return neuron;
	}
	,connect: function(source,destination) {
		var connection = new computation.Connection(this,source,destination);
		this.connections.push(connection);
		if(!(this.connectionsBySource.h.__keys__[source.__id__] != null)) {
			var value = new Array();
			this.connectionsBySource.set(source,value);
		}
		if(!(this.connectionsByDestination.h.__keys__[destination.__id__] != null)) {
			var value1 = new Array();
			this.connectionsByDestination.set(destination,value1);
		}
		this.connectionsBySource.h[source.__id__].push(connection);
		this.connectionsByDestination.h[destination.__id__].push(connection);
		return connection;
	}
	,getNeurons: function() {
		return this.neurons;
	}
	,getConnections: function() {
		return this.connections;
	}
	,getIncomingConnections: function(neuron) {
		if(!(this.connectionsByDestination.h.__keys__[neuron.__id__] != null)) return new Array();
		return this.connectionsByDestination.h[neuron.__id__];
	}
	,getOutgoingConnections: function(neuron) {
		if(!(this.connectionsBySource.h.__keys__[neuron.__id__] != null)) return new Array();
		return this.connectionsBySource.h[neuron.__id__];
	}
	,__class__: computation.Net
};
computation.NetState = function(net) {
	this.connectionStates = new haxe.ds.ObjectMap();
	this.neuronStates = new haxe.ds.ObjectMap();
	this.net = net;
};
computation.NetState.__name__ = true;
computation.NetState.prototype = {
	initialize: function() {
		var _g = 0;
		var _g1 = this.net.getNeurons();
		while(_g < _g1.length) {
			var neuron = _g1[_g];
			++_g;
			var value = new computation.NeuronState(0);
			this.neuronStates.set(neuron,value);
		}
		var _g2 = 0;
		var _g11 = this.net.getConnections();
		while(_g2 < _g11.length) {
			var connection = _g11[_g2];
			++_g2;
			var value1 = new computation.ConnectionState(0);
			this.connectionStates.set(connection,value1);
		}
	}
	,getNeuronState: function(neuron) {
		return this.neuronStates.h[neuron.__id__];
	}
	,getConnectionState: function(connection) {
		return this.connectionStates.h[connection.__id__];
	}
	,setNeuronState: function(neuron,potential) {
		var value = new computation.NeuronState(potential);
		this.neuronStates.set(neuron,value);
	}
	,setConnectionState: function(connection,weight) {
		var value = new computation.ConnectionState(weight);
		this.connectionStates.set(connection,value);
	}
	,nextState: function() {
		var newState = new computation.NetState(this.net);
		var _g = 0;
		var _g1 = this.net.getNeurons();
		while(_g < _g1.length) {
			var neuron = _g1[_g];
			++_g;
			var potential = 0.0;
			var _g2 = 0;
			var _g3 = neuron.getIncomingConnections();
			while(_g2 < _g3.length) {
				var connection = _g3[_g2];
				++_g2;
				var sign;
				if(connection.getConnectionType() == NeuronType.INHIBIT) sign = -1; else sign = 1;
				var input = this.getNeuronState(connection.getSource()).getPotential();
				var weight = this.getConnectionState(connection).getWeight();
				potential += sign * weight * input;
			}
			var threshold = neuron.getThreshold();
			if(potential > threshold) {
				var maximum = neuron.getMaximum();
				var factor = neuron.getFactor();
				potential = Math.min(maximum,(potential - threshold) * factor);
			} else potential = 0;
			newState.setNeuronState(neuron,potential);
		}
		var _g4 = 0;
		var _g11 = this.net.getConnections();
		while(_g4 < _g11.length) {
			var connection1 = _g11[_g4];
			++_g4;
			var connectionState = this.getConnectionState(connection1);
			var weight1 = connectionState.getWeight();
			var newWeight = weight1;
			var connectionType = connection1.getConnectionType();
			if(connectionType == NeuronType.ACTIVATE || connectionType == NeuronType.INHIBIT) {
				var source = connection1.getSource();
				var sourceState = this.getNeuronState(source);
				var sourcePotential = sourceState.getPotential();
				var destination = connection1.getDestination();
				var destinationState = newState.getNeuronState(destination);
				var destinationPotential = destinationState.getPotential();
				var associations = new Array();
				var disassociations = new Array();
				var _g21 = 0;
				var _g31 = this.net.getIncomingConnections(destination);
				while(_g21 < _g31.length) {
					var neighbourConnection = _g31[_g21];
					++_g21;
					var _g41 = neighbourConnection.getConnectionType();
					switch(_g41[1]) {
					case 2:
						associations.push(neighbourConnection);
						break;
					case 3:
						disassociations.push(neighbourConnection);
						break;
					default:
					}
				}
				var gain = 0.0;
				var _g22 = 0;
				while(_g22 < associations.length) {
					var association = associations[_g22];
					++_g22;
					var associator = association.getSource();
					var av = this.getNeuronState(associator).getPotential();
					if(av > 0) {
						var ai = sourcePotential;
						var aj = destinationPotential;
						var gv = this.getConnectionState(association).getWeight();
						var L = this.net.getLearningConstant();
						gain += ai * aj * av * gv * L;
					}
				}
				if(gain > 0) newWeight = Math.pow(Math.sqrt(weight1) + gain,2);
				var descent = 0.0;
				var _g23 = 0;
				while(_g23 < disassociations.length) {
					var disassociation = disassociations[_g23];
					++_g23;
					var disassociator = disassociation.getSource();
					var ad = this.getNeuronState(disassociator).getPotential();
					if(ad > 0) {
						var aj1 = destinationPotential;
						var gd = this.getConnectionState(disassociation).getWeight();
						var D = this.net.getUnlearningConstant();
						descent += ad * gd * aj1 * D;
					}
				}
				if(descent > 0) newWeight = Math.sqrt(Math.pow(weight1,2) - descent);
				var T = this.net.getDecayConstant();
				if(gain == 0 && descent == 0 && weight1 < T) newWeight = Math.sqrt(Math.pow(weight1,2) - this.net.getDecayConstant());
			}
			newState.setConnectionState(connection1,newWeight);
		}
		return newState;
	}
	,__class__: computation.NetState
};
computation.Neuron = function(net,type,threshold,factor,maximum) {
	this.net = net;
	this.type = type;
	this.threshold = threshold;
	this.factor = factor;
	this.maximum = maximum;
};
computation.Neuron.__name__ = true;
computation.Neuron.prototype = {
	getNet: function() {
		return this.net;
	}
	,getNeuronType: function() {
		return this.type;
	}
	,getThreshold: function() {
		return this.threshold;
	}
	,getFactor: function() {
		return this.factor;
	}
	,getMaximum: function() {
		return this.maximum;
	}
	,getIncomingConnections: function() {
		return this.net.getIncomingConnections(this);
	}
	,getOutgoingConnections: function() {
		return this.net.getOutgoingConnections(this);
	}
	,__class__: computation.Neuron
};
computation.NeuronState = function(potential) {
	this.potential = potential;
};
computation.NeuronState.__name__ = true;
computation.NeuronState.prototype = {
	getPotential: function() {
		return this.potential;
	}
	,__class__: computation.NeuronState
};
var haxe = {};
haxe.ds = {};
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
haxe.ds.ObjectMap.__name__ = true;
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.prototype = {
	set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe.ds.ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,__class__: haxe.ds.ObjectMap
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
haxe.ds.ObjectMap.count = 0;
WorkerMain.main();
})();
