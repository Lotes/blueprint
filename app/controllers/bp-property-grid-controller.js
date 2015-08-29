angular
  .module('blueprint')
  .controller('bpPropertyGridController', function($scope, Property, PropertyViews, PropertyEditors) {
    $scope.context = [{
      id: 'markman',
      name: 'Markus',
      age: 29
    }, {
      id: 'jay',
      name: 'Jenny',
      age: 28
    }];
    $scope.obj = $scope.context[0];
    $scope.props = [
      new Property({
        name: 'Id',
        accessor: 'id',
        category: 'General information',
        view: PropertyViews.LABEL,
        editor: PropertyEditors.TEXT,
        description: 'Identifier of the person.',
        validate: function(newValue, object, context) { 
          if(newValue === null || newValue === '')
            throw new Error('Value must be a non-empty string!');
          var ids = _.pluck(_.without(context, object), 'id');
          if(_.contains(ids, newValue))
            throw new Error('Value must be unique!');
        }
      }), 
      new Property({
        name: 'Name',
        accessor: 'name',
        category: 'General information',
        view: PropertyViews.LABEL,
        editor: PropertyEditors.TEXT,
        description: 'How the person is called?'
      }), 
      new Property({
        name: 'Age',
        accessor: 'age',
        category: 'Numeric stuff',
        view: PropertyViews.LABEL,
        description: 'How old is the person?'
      })
    ];
  });