class PropertyView
  constructor: (@template) ->
  @LABEL: new PropertyView('<span ng-class="{ \'property-value-read-only\': readOnly }">{{ value }}</span>')

class PropertyEditor
  constructor: (@template) ->
  @TEXT: new PropertyEditor('<input type="text" ng-model="value"/>')

class Property
  constructor: (options) ->
    @name = options.name;
    @accessor = options.accessor;
    @view = options.view;
    @editor = options.editor || null;
    @category = options.category || 'General information';
    @validate = options.validate || true;
    @description = options.description || null;

angular.module('blueprint')
  .factory('PropertyView', () -> PropertyView)
  .factory('PropertyEditor', () -> PropertyEditor)
  .factory('Property', () -> Property)
  ;    
    
###
Welche typen gibt es?
-Ganzzahl
-Fließkommazahl
-Wahrheitswerte
-Zeichenketten
-arithmetische Ausdrücke
-Latex(-Ausdrücke)
###