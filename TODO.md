TODO
====

Backlogs
--------
- Readonly-Modus für Modulinstanzen im PropertyGrid
- Zentrum von Modulen und Labels anzeigen?
- Neuronen hinzufügen
- Module hinzufügen
- Beschriftungen als eigene Direktive (Labels)
- Mehrsprachigkeit
- Tag- und Volltextsuche

Eigenschaften
-------------
//- Laufzeit
	- Potential Neuron
	- Potential Verbindung
- Entwurfszeit
	- Neuron
		- Grenzwert (threshold)
		- Verststärkung (factor)
		- Maximalpotential (maximum)
	- Aktivator
	- Inhibitor
	- Assoziator
	- Disassoziator

Ausführung
----------
- Zustand des Netzes
- Verbindungsmatrix für jeden Knoten
- Berechnung von Neuronenpotenzialen
- Anzeige der Eingabepotenziale (alter Zustand in rot)
- Anzeige der Ausgabepotenziale (neuer Zustand in grün)
- je größer das Potenzial, desto dicker die Verbindung (\x -> max(sqrt x, 5))
- Potenzial von 0 -> grau
- Step-Mode, Continous-Mode