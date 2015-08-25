(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,__class__: EReg
};
var EditorMain = function() { };
EditorMain.__name__ = true;
EditorMain.main = function() {
	var model = null;
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var IMap = function() { };
IMap.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
var editor = {};
editor.PropertiesObject = function() {
	this.changedHandlers = new haxe.ds.StringMap();
	this.data = new haxe.ds.StringMap();
	this.properties = new haxe.ds.StringMap();
};
editor.PropertiesObject.__name__ = true;
editor.PropertiesObject.prototype = {
	onPropertyChanged: function(name,handler) {
		if(!this.hasProperty(name)) return;
		this.changedHandlers.get(name).push(handler);
	}
	,offPropertyChanged: function(name,handler) {
		if(!this.hasProperty(name)) return;
		if(handler != null) {
			var _this = this.changedHandlers.get(name);
			HxOverrides.remove(_this,handler);
		} else {
			var value = new Array();
			this.changedHandlers.set(name,value);
		}
	}
	,triggerPropertyChanged: function(name) {
		if(!this.hasProperty(name)) return;
		var _g = 0;
		var _g1 = this.changedHandlers.get(name);
		while(_g < _g1.length) {
			var handler = _g1[_g];
			++_g;
			handler();
		}
	}
	,getPropertyNames: function() {
		var result = new Array();
		var keys = this.properties.keys();
		while(keys.hasNext()) result.push(keys.next());
		return result;
	}
	,hasProperty: function(name) {
		return this.properties.exists(name);
	}
	,addProperty: function(name,init,fini,get,set) {
		var property = new editor.Property(name,init,fini,get,set);
		this.properties.set(name,property);
		var value = new Array();
		this.changedHandlers.set(name,value);
		property.initialize(this.data);
	}
	,removeProperty: function(name) {
		var property = this.getProperty(name);
		property.finalize(this.data);
		this.properties.remove(name);
		this.changedHandlers.remove(name);
	}
	,getProperty: function(name) {
		return this.properties.get(name);
	}
	,getPropertyValue: function(name) {
		return this.getProperty(name).getValue(this.data);
	}
	,setPropertyValue: function(name,value) {
		this.getProperty(name).setValue(this.data,value);
		this.triggerPropertyChanged(name);
	}
	,isPropertyReadable: function(name) {
		return this.getProperty(name).isReadable();
	}
	,isPropertyWriteable: function(name) {
		return this.getProperty(name).isWriteable();
	}
	,__class__: editor.PropertiesObject
};
editor.Connection = function() {
	editor.PropertiesObject.call(this);
};
editor.Connection.__name__ = true;
editor.Connection.__super__ = editor.PropertiesObject;
editor.Connection.prototype = $extend(editor.PropertiesObject.prototype,{
	__class__: editor.Connection
});
editor.Connector = function() {
	editor.PropertiesObject.call(this);
};
editor.Connector.__name__ = true;
editor.Connector.__super__ = editor.PropertiesObject;
editor.Connector.prototype = $extend(editor.PropertiesObject.prototype,{
	__class__: editor.Connector
});
editor.Helpers = function() {
};
editor.Helpers.__name__ = true;
editor.Helpers.isIdentifier = function(str) {
	var regex = new EReg("^[a-zA-Z_][a-zA-Z0-9_]*$",null);
	return regex.match(str);
};
editor.Helpers.isNamespacedIdentifier = function(str) {
	var regex = new EReg("^[a-zA-Z_][a-zA-Z0-9_]*(\\.[a-zA-Z_][a-zA-Z0-9_]*)?$",null);
	return regex.match(str);
};
editor.Helpers.prototype = {
	__class__: editor.Helpers
};
editor.Module = function() {
	this.connections = new Array();
	this.nodes = new Array();
	var _g = this;
	editor.PropertiesObject.call(this);
	this.addProperty("name",function(data) {
		data.set("name","Module");
	},function(data1) {
		data1.remove("name");
	},function(data2) {
		return js.Boot.__cast(data2.get("name") , String);
	},function(data3,value) {
		if(!editor.Helpers.isNamespacedIdentifier(value)) throw new Error("This is not a valid module name!");
		data3.set("name",value);
	});
	this.addProperty("nodes",function(data4) {
		data4.set("nodes",_g.nodes);
	},function(data5) {
		data5.remove("nodes");
	},function(data6) {
		return js.Boot.__cast(data6.get("nodes") , Array);
	});
};
editor.Module.__name__ = true;
editor.Module.__super__ = editor.PropertiesObject;
editor.Module.prototype = $extend(editor.PropertiesObject.prototype,{
	addNode: function(node) {
		var oldParent = node.getParent();
		if(oldParent != null) oldParent.removeNode(node);
		this.nodes.push(node);
		node.setParent(this);
	}
	,removeNode: function(node) {
		if(node.getParent() != this) return;
		HxOverrides.remove(this.nodes,node);
		node.setParent(null);
	}
	,addConnection: function(source,destination) {
		return null;
	}
	,removeConnection: function(connection) {
	}
	,__class__: editor.Module
});
editor.Node = function() {
	editor.PropertiesObject.call(this);
};
editor.Node.__name__ = true;
editor.Node.__super__ = editor.PropertiesObject;
editor.Node.prototype = $extend(editor.PropertiesObject.prototype,{
	getParent: function() {
		return this.parent;
	}
	,setParent: function(module) {
		this.parent = module;
	}
	,__class__: editor.Node
});
editor.Property = function(name,init,fini,get,set) {
	this.name = name;
	this.init = init;
	this.fini = fini;
	this.get = get;
	this.set = set;
};
editor.Property.__name__ = true;
editor.Property.prototype = {
	getName: function() {
		return this.name;
	}
	,initialize: function(data) {
		this.init(data);
	}
	,finalize: function(data) {
		this.fini(data);
	}
	,getValue: function(data) {
		if(!this.isReadable()) throw new Error("Property '" + this.name + "' is not readable!");
		return this.get(data);
	}
	,setValue: function(data,value) {
		if(!this.isWriteable()) throw new Error("Property '" + this.name + "' is not writeable!");
		this.set(data,value);
	}
	,isReadable: function() {
		return this.get != null;
	}
	,isWriteable: function() {
		return this.set != null;
	}
	,__class__: editor.Property
};
var haxe = {};
haxe.ds = {};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.StringMap
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
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
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
};
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
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
EditorMain.main();
})();
