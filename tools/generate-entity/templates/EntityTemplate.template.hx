package {{:package}};

/* THIS FILE WAS GENERATED BY THE 'generate-entity' tool.
 * DO NOT CHANGE ANYTHING HERE! CHANGE THE TEMPLATES INSTEAD! 
 */

class {{:entityName}}Template
	implements {{:entityName}}Configurator<{{:entityName}}Template>
	implements {{:entityName}}Configuration
{
	{{for variables}}{{if configurable}}
	private var _{{:name}}: {{:type}} = {{:value}};
	{{/if}}{{/for}}
	
	public function new() {}
	
	{{for variables}}{{if configurable}}
	public function get{{:name.capitalize()}}(): {{:type}} { return _{{:name}}; }
	{{/if}}{{/for}}
	
	/* INTERFACE {{:entityName}}Configurator<{{:entityName}}Template> */
	{{for variables}}{{if configurable}}
	public function {{:name}}(value: {{:type}}): {{:~root.entityName}}Template { _{{:name}} = value; return this; }
	{{/if}}{{/for}}
}