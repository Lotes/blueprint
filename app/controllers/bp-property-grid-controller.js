angular
  .module('blueprint')
  .controller('bpPropertyGridController', function($scope, Property, PropertyView, PropertyEditor) {
    $scope.obj = {
      id: 'markman',
      name: 'Markus',
      age: 29
    };
    $scope.props = [
      new Property({
        name: 'Id',
        accessor: 'id',
        category: 'General information',
        view: PropertyView.LABEL,
        editor: PropertyEditor.TEXT,
        description: 'Identifier of the person.',
        validate: function(newValue, context) { return true; }
      }), 
      new Property({
        name: 'Name',
        accessor: 'name',
        category: 'General information',
        view: PropertyView.LABEL,
        editor: PropertyEditor.TEXT,
        description: 'How the person is called?',
        validate: function(newValue, context) { return true; }
      }), 
      new Property({
        name: 'Age',
        accessor: 'age',
        category: 'Numeric stuff',
        view: PropertyView.LABEL,
        editor: PropertyEditor.TEXT,
        description: 'How old is the person?'
      })
    ];
  });