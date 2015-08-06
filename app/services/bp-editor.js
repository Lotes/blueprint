angular
  .module('blueprint')
  .factory('bpEditor', function($rootScope) {
    //tool/mode/mousemove/selection
    var editor = {
      modes: {
        readOnly: {
          label: 'Read only',
          description: 'Don\'t touch this!',
          iconClass: 'glyphicon-remove-circle'
        },
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
        quad: {
          label: 'Add quad',
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
      types: {
        'string': {
          label: 'String',
          description: 'A chain of characters',
          validator: null
        },
        'integer': {
          label: 'Integer',
          description: 'Whole numbers',
          validator: function(value) {
            return typeof(value) === 'number' && Math.floor(value) == value;  
          }
        },
        'integer>=0': {
          label: 'Non-negative integer (>=0)',
          description: 'Whole numbers >=0',
          validator: function(value) {
            return typeof(value) === 'number' && Math.floor(value) == value && value >= 0;  
          }
        },
        'real': {
          label: 'Real number',
          description: 'Floating-point number',
          validator: function(value) {
            return typeof(value) === 'number';  
          }
        },
        'real>=0': {
          label: 'Non-negative real number (>=0)',
          description: 'Floating-point number >=0',
          validator: function(value) {
            return typeof(value) === 'number' && value >= 0;  
          }
        },
        'boolean': {
          label: 'Boolean value',
          description: 'True/false or yes/no',
          validator: function(value) {
            return typeof(value) === 'boolean';  
          }
        }
      }
    };
    return editor;
  });

