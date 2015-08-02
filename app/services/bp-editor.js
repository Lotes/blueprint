angular
  .module('blueprint')
  .factory('bpEditor', function($rootScope) {
    //tool/mode/mousemove/selection
    var editor = {
      modes: {
        select: { 
          label: 'Select',
          description: 'Select/move/delete nodes, connections and anchors',
          iconClass: 'glyphicon-hand-up'
        },
        neuron: {
          label: 'Add neuron',
          description: '...',
          iconClass: 'glyphicon-plus'
        },
        connect: {
          label: 'Connect',
          description: 'Connect nodes',
          iconClass: 'glyphicon-resize-small'          
        },
        anchor: {
          label: 'Add anchor',
          description: '...',
          iconClass: 'glyphicon-plus'
        },
        run: { 
          label: 'Run',
          description: 'Execute neuronal net.',
          iconClass: 'glyphicon-play'
        },
      },
      snapToGrid: true,
      mode: 'select',
      setMode: function(newMode) {
        editor.mode = newMode;
        $rootScope.$broadcast('editorModeChange');
      },
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
      select: function(type, node) { 
        editor.selectionType = type;
        console.log("selected "+type);
        editor.selection = node;
      }
    };
    return editor;
  });

