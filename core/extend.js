(function() {
	/*
		Beispiel von CoffeeScript:
			
			function Animal(name) {
				this.name = name;
			}
			
			function Snake(name, color) {
				Snake.__super__.constructor.apply(this, arguments);
			}
			
			extend(Snake, Animal);

			//Aufruf von Vater-Methode
			Snake.prototype.move = function() {
				Snake.__super__.move.call(this, 45);
			};
	*/
	
	var hasProp = {}.hasOwnProperty,
		extend = function(child, parent) { 
			for (var key in parent) { 
				if (hasProp.call(parent, key)) 
					child[key] = parent[key]; 
			} 
			function ctor() { 
				this.constructor = child; 
			} 
			ctor.prototype = parent.prototype; 
			child.prototype = new ctor(); 
			child.__super__ = parent.prototype; 
			return child; 
		};	
	module.exports = extend;
	
})();