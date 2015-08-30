angular
  .module('blueprint')
  .controller('bpMainController', function($scope, bpModuleRepository, $routeParams, $location,
      bpEditorData, bpNet, $templateCache, $http, $q, Module, Property, PropertyEditors, PropertyViews) {
    var self = this;    
        
    //toolsbar
    var name = $routeParams.name;
    $scope.modes = bpEditorData.modes;
    $scope.tools = {
      mode: 'select',
      snapToGrid: true,
      selection: null
    };
    
    //property grid
    $scope.selectedObject = null;
    $scope.properties = [];
    $scope.$watch('tools.selection', function() {
      if($scope.tools.selection != null && $scope.tools.selection.length == 1) {
        $scope.selectedObject = $scope.tools.selection[0].getEntity();
        $scope.properties = [
          new Property({
            name: 'Class',
            accessor: 'module.name',
            view: PropertyViews.LABEL,
            description: 'quak'
          }),
          new Property({
            name: 'Parent',
            accessor: 'parentModule.name',
            view: PropertyViews.LABEL,
            description: 'quak'
          }),
          new Property({
            name: 'Name',
            accessor: 'name',
            view: PropertyViews.LABEL,
            editor: PropertyEditors.TEXT,
            validate: function(newValue, object, context) {
              if(newValue === null || newValue === '')
                throw new Error('Value must be a non-empty string!');
              var ids = _.pluck(_.without(context.nodes, object), 'name');
              if(_.contains(ids, newValue))
                throw new Error('Value must be unique!');  
            }
          }),
          new Property({
            name: 'X',
            category: 'Layout',
            accessor: 'position.coordinates[0]',
            view: PropertyViews.LABEL,
            description: 'quak'
          }),
          new Property({
            name: 'Y',
            category: 'Layout',
            accessor: 'position.coordinates[1]',
            view: PropertyViews.LABEL,
            description: 'quak'
          })
        ];
      } else {
        $scope.selectedObject = null;
        $scope.properties = [];
      }
    });
    
    //size
    $scope.width = 0;
    $scope.height = 0;
    $scope.canvasResized = function(w, h) {
      $scope.width = w;
      $scope.height = h;  
    };
    
    //fetch module
    $scope.data = null;
    $scope.ready = true;
    
    this.loadModule = function(name) {
      $scope.ready = false;
      bpModuleRepository
        .get(name)
        .then(function(module) { $scope.data = module; $scope.ready = true; },
              function(err) { alert(err.message); });
    };
    this.loadModule($routeParams.name || 'example');
    
    //save module
    $scope.saving = false;
    $scope.save = function() {
      if(!$scope.data)
        return;
      saving = true;
      bpModuleRepository
        .save($scope.data)
        .then(function(res) { $scope.saving = false; $location.path(res.data.name); location.reload(true); },
              function(err) { alert(err.message); $scope.saving = false; });
    };
  });