var fs = require('fs');
var fse = require('fs-extra');
var xmldoc = require("xmldoc");
var args = process.argv.slice(2);
var inputFile = args[0];
var outputFile = args[1];

//usage "node main.js ast.xml ast.puml"

var content = fs.readFileSync(inputFile, 'utf8');
var xmlDoc = new xmldoc.XmlDocument(content);

var classes = xmlDoc.childrenNamed('class');

function Package(name) {
	this.name = name;
	this.children = {};
	this.print = function() {
		var subPackages = '';
		for(var name in this.children) {
			var child = this.children[name];
			subPackages += child.print() + '\n';
		}
		return 'package '+this.name+' {\n'+subPackages+'\n}';
	};
}

function Class(name, xml) {
	this.name = name;
	this.isInterface = xml.attr['interface'] === '1';
	this.print = function() {
		return (this.isInterface ? 'interface' : 'class') + ' ' + this.name + '{\n}';
	};
}

var rootPackage = new Package('root');
classes.forEach(function(c) {
	var path = c.attr.path.split('.');
	var pack = rootPackage;
	for(var index=0; index<path.length-1; index++) {
		var curr = path[index];
		if(!(curr in pack.children))
			pack.children[curr] = new Package(curr);
		pack = pack.children[curr];
	}
	var name = path[path.length-1];
	pack.children[name] = new Class(name, c);
});

fs.writeFileSync(outputFile, rootPackage.print());