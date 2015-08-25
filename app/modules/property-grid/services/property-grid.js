(function() {
  var Property, PropertyType;

  PropertyType = (function() {
    function PropertyType() {}

    return PropertyType;

  })();

  Property = (function() {
    function Property(name, type, get, set) {
      this.name = name;
      this.type = type;
      this.get = get;
      this.set = set;
    }

    return Property;

  })();

}).call(this);
