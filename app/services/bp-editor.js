angular
  .module('blueprint')
  .factory('bpEditor', function($rootScope) {
    //tool/mode/mousemove/selection
    var editor = {
      modes: {
        select: { 
          label: 'Select',
          description: 'Select/move/delete nodes, connections and anchors',
          icon: null
        },
        connect: {
          label: 'Connect',
          description: 'Connect nodes',
          icon: null          
        },
        neuron: {
          label: 'Add neuron',
          description: '...',
          icon: null
        },
        run: { 
          label: 'Run',
          description: 'Execute neuronal net.',
          icon: null
        },
      },
      snapToGrid: true,
      currentMode: 'select',
      selectionType: null, //could be: node, connection, anchor
      selection: null,
      snapPosition: function(position) { 
        if(!editor.snapToGrid)
          return position;
        return [
          Math.round(position[0] / 25) * 25,
          Math.round(position[1] / 25) * 25
        ];
      },
      unselect: function() { 
        $rootScope.$broadcast('unselect'); 
        editor.selectionType = null;
        editor.selection = null;
      },
      selectNode: function(node) { 
        editor.selectionType = 'node';
        editor.selection = node;
      }
    };
    return editor;
  });

