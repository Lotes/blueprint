angular
  .module('blueprint')
  .factory('bpEditorData', function() {
    var editor = {
      config: {
        neuron: {
          outerRadius: 15,
          innerRadius: 10  
        }
      },
      modes: [
        {
          name: 'readOnly',
          label: 'Read only',
          description: 'Don\'t touch this!',
          iconClass: 'glyphicon-remove-circle'
        },
        { 
          name: 'move',
          label: 'Move',
          description: 'Move environment',
          iconClass: 'glyphicon-pushpin'
        },
        { 
          name: 'select',
          label: 'Select',
          description: 'Select/move/delete nodes, connections and anchors',
          iconClass: 'glyphicon-hand-up'
        },
        {
          name: 'neuron',
          label: 'Neuron',
          description: '...',
          iconClass: 'glyphicon-plus'
        },
        {
          name: 'module',
          label: 'Module',
          description: 'Add a complete neuron module.',
          iconClass: 'glyphicon-plus'
        },
        {
          name: 'connect',
          label: 'Connect',
          description: 'Connect nodes',
          iconClass: 'glyphicon-resize-small'          
        },
        {
          name: 'anchor',
          label: 'Add anchor',
          description: '...',
          iconClass: 'glyphicon-plus'
        },
        { 
          name: 'run',
          label: 'Run',
          description: 'Execute neuronal net.',
          iconClass: 'glyphicon-play'
        },
      ],
      toolsMenu: [
        { type: 'button', mode: 'readOnly' },
        { type: 'button', mode: 'move' },
        { type: 'button', mode: 'select' },
        { type: 'dropDown', title: 'Add node', items: [
          { type: 'button', mode: 'neuron' },
          { type: 'button', mode: 'module' }
        ]},
        { type: 'button', mode: 'connect' },
        { type: 'button', mode: 'anchor' }
      ],
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

