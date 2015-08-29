class PropertyView
  constructor: (@template) ->
  
class PropertyLabelView extends PropertyView
  constructor: ($scope) ->
    super("""<span ng-class="{ \'property-value-read-only\': readOnly }">{{ value }}</span>""")

class PropertyEditor
  constructor: (@template) ->

class PropertyTextEditor extends PropertyEditor
  constructor: ($scope) ->
    super("""
      <input 
        ng-class="{ \'property-value-error\': hasError }" 
        type="text" 
        ng-model="value"
        ng-keypress="$event.which !== 13 || applyValue()"
      />
    """)
  
PropertyEditors = {
  TEXT: PropertyTextEditor
}

PropertyViews = {
  LABEL: PropertyLabelView  
}
  
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
  .factory('PropertyViews', () -> PropertyViews)
  .factory('PropertyEditors', () -> PropertyEditors)
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