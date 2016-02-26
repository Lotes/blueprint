var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var jsrender = require('jsrender');
var args = process.argv.slice(2);
var inputFile = args[0];
var outputFolder = args[1];
var templates = [
	{
		name: 'entity',
		file: '{{:entityName}}.hx',
		template: path.join(__dirname, 'templates', 'Entity.template.hx')
	},
	{
		name: 'builder',
		file: '{{:entityName}}Builder.hx',
		template: path.join(__dirname, 'templates', 'EntityBuilder.template.hx')
	},
	{
		name: 'configuration',
		file: '{{:entityName}}Configuration.hx',
		template: path.join(__dirname, 'templates', 'EntityConfiguration.template.hx')
	},
	{
		name: 'configurator',
		file: '{{:entityName}}Configurator.hx',
		template: path.join(__dirname, 'templates', 'EntityConfigurator.template.hx')
	},
	{
		name: 'template',
		file: '{{:entityName}}Template.hx',
		template: path.join(__dirname, 'templates', 'EntityTemplate.template.hx')
	},
	{
		name: 'mutable',
		file: 'Mutable{{:entityName}}.hx',
		template: path.join(__dirname, 'templates', 'MutableEntity.template.hx')
	}
];

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

//read in input
var input = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

//create output folder
fse.mkdirsSync(outputFolder);
fse.emptyDirSync(outputFolder);

//apply templates
templates.forEach(function(t) {	
	if(!input.templates[t.name])
		return;
	
	var fileNameContent = t.file;
	var fileNameTemplate = jsrender.templates(fileNameContent);
	var fileName = path.join(outputFolder, fileNameTemplate.render(input));
	
	var templateContent = fs.readFileSync(t.template, 'utf8');
	var template = jsrender.templates(templateContent);
	var fileContent = template.render(input);
	
	fs.writeFileSync(fileName, fileContent);
});