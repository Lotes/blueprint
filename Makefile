compile:
	haxe -lib promhx -cp src -main blueprint.Main

test:
	haxelib run munit test -cpp > tests.txt

coverage:
	haxelib run munit test -cpp -coverage > coverage.txt
	
entities:
	node tools/generate-entity/main.js tools/generate-entity/input/Neuron.json src/blueprint/entities/neuron
	node tools/generate-entity/main.js tools/generate-entity/input/Light.json src/blueprint/entities/light
	node tools/generate-entity/main.js tools/generate-entity/input/Gauge.json src/blueprint/entities/gauge
	node tools/generate-entity/main.js tools/generate-entity/input/Random.json src/blueprint/entities/random
	node tools/generate-entity/main.js tools/generate-entity/input/Button.json src/blueprint/entities/button
	node tools/generate-entity/main.js tools/generate-entity/input/Slider.json src/blueprint/entities/slider
	
ast.xml:	
	haxe -xml ast.xml -cp src -main blueprint.Main
	
uml: ast.xml
	node tools\generate-uml\main.js ast.xml uml\ast.puml
	puml generate uml\ast.puml -o uml\ast.png
	del ast.xml