(function() {
  var Property, PropertyEditor, PropertyEditors, PropertyLabelView, PropertyTextEditor, PropertyView, PropertyViews,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  PropertyView = (function() {
    function PropertyView(template) {
      this.template = template;
    }

    return PropertyView;

  })();

  PropertyLabelView = (function(superClass) {
    extend(PropertyLabelView, superClass);

    function PropertyLabelView($scope) {
      PropertyLabelView.__super__.constructor.call(this, "<span ng-class=\"{ \'property-value-read-only\': readOnly }\">{{ value }}</span>");
    }

    return PropertyLabelView;

  })(PropertyView);

  PropertyEditor = (function() {
    function PropertyEditor(template) {
      this.template = template;
    }

    return PropertyEditor;

  })();

  PropertyTextEditor = (function(superClass) {
    extend(PropertyTextEditor, superClass);

    function PropertyTextEditor($scope) {
      PropertyTextEditor.__super__.constructor.call(this, "<input \n  ng-class=\"{ \'property-value-error\': hasError }\" \n  type=\"text\" \n  ng-model=\"value\"\n  ng-keypress=\"$event.which !== 13 || applyValue()\"\n/>");
    }

    return PropertyTextEditor;

  })(PropertyEditor);

  PropertyEditors = {
    TEXT: PropertyTextEditor
  };

  PropertyViews = {
    LABEL: PropertyLabelView
  };

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

  angular.module('blueprint').factory('PropertyViews', function() {
    return PropertyViews;
  }).factory('PropertyEditors', function() {
    return PropertyEditors;
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
