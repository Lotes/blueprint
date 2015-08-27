(function() {
  var Property, PropertyEditor, PropertyView;

  PropertyView = (function() {
    function PropertyView(template) {
      this.template = template;
    }

    PropertyView.LABEL = new PropertyView('<span ng-class="{ \'property-value-read-only\': readOnly }">{{ value }}</span>');

    return PropertyView;

  })();

  PropertyEditor = (function() {
    function PropertyEditor(template) {
      this.template = template;
    }

    PropertyEditor.TEXT = new PropertyEditor('<input type="text" ng-model="value"/>');

    return PropertyEditor;

  })();

  Property = (function() {
    function Property(options) {
      this.name = options.name;
      this.accessor = options.accessor;
      this.view = options.view;
      this.editor = options.editor || null;
      this.category = options.category || 'General information';
      this.validate = options.validate || true;
      this.description = options.description || null;
    }

    return Property;

  })();

  angular.module('blueprint').factory('PropertyView', function() {
    return PropertyView;
  }).factory('PropertyEditor', function() {
    return PropertyEditor;
  }).factory('Property', function() {
    return Property;
  });


  /*
  Welche typen gibt es?
  -Ganzzahl
  -Fließkommazahl
  -Wahrheitswerte
  -Zeichenketten
  -arithmetische Ausdrücke
  -Latex(-Ausdrücke)
   */

}).call(this);
