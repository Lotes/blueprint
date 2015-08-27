angular
  .module('blueprint')
  .controller('bpPropertyGridController', function($scope) {
    $scope.obj = {
      id: 'markman',
      name: 'Markus',
      age: 29
    };
    $scope.props = [
      {
        name: 'Id',
        category: 'General information',
        description: 'Identifier of the person.',
        type: 'IdentifierType',
        validate: function(newValue, context) { return true; }
      }, {
        name: 'Name',
        category: 'General information',
        description: 'How the person is called?',
        type: 'LabelType',
        validate: function(newValue, context) { return true; }
      }, {
        name: 'Age',
        category: 'Numeric stuff',
        description: 'How old is the person?',
        type: 'NonNegativeIntegerType'
      }
    ];
  });