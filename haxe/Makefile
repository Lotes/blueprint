compile:
	haxe -lib promhx -cp src -main blueprint.Main
	
entities:
	node tools/generate-entity/main.js tools/generate-entity/input/Neuron.json src/blueprint/entities/neuron
	node tools/generate-entity/main.js tools/generate-entity/input/Light.json src/blueprint/entities/light
	node tools/generate-entity/main.js tools/generate-entity/input/Gauge.json src/blueprint/entities/gauge
	node tools/generate-entity/main.js tools/generate-entity/input/Random.json src/blueprint/entities/random
	node tools/generate-entity/main.js tools/generate-entity/input/Button.json src/blueprint/entities/button
	node tools/generate-entity/main.js tools/generate-entity/input/Slider.json src/blueprint/entities/slider