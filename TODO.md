TODO
====

- Forking ermöglichen -> ReadOnly-Versionen von Revisionen (Links zu editierbaren Ordnern)
- Beim Anklicken Objekt nach ganz vorne holen
- Knoten verbinden
- Anker hinzufügen
- Kurven statt Linien (wie aus einem Malprogramm, je Anker zwei Richthelfer)
- Beschriftungen als eigene Direktive und Raus aus Entitäten

Variablen
---------

-Eigenshaft
	-Name
  -Typ
  -Initialwert/Binding
	-Wert
-Binding
  -Konstantenverweis (eindeutiger Name)
-Konstante
	-Name
  //-Namespace/Kategorie
  -Typ
	-Wert
-Typ
  -reell
  -reell >= 0
  -Neurontyp: aktivierend, hemmend, verknüpfend, entknüpfend

Eigenschaftsfenster
-------------------

-Anker
  -Position
-Neuronen
  -Position: Punkt
  -Name (eindeutig oder leer)
  -Typ: aktivierend, hemmend, verknüpfend, entknüpfend
  -Schwelle (Typ: reell >= 0)
  -eingehendes Potenzial (reell, berechnet aus eingehenden Verbindungen)
  -ausgehendes Potenzial (reell >= 0)
  -Maximalpotenzial MAXIMUM (reell >= 0)
  -Verstärkungsfaktor V (reell >= 0)
  -eingehende Verbindungen (je Connector)
  -ausgehende Verbindungen (je Connector)
-Quads
  -Position
  -Name
  -eingehende Verbindungen je Connector
  -ausgehende Verbindungen je Connector
-Verbindungen
  -Gewicht (Typ: reell >= 0)
  -eingehendes Potenzial (reell >= 0)
  -ausgehendes Potenzial (reell)
  -Typ: abhängig vom Quellknoten (implizit)
  -Lernkonstante L (Verknüpfungskonstante)
  -Entknüpfungskonstante D (reell >= 0)
  -Zerfallskonstante K (reell >= 0)
  -Quelle
  -Ziel
-später:
  -Labels
  -Eigenschaftsmonitore
  -globale Variablen
  -Verzögerungsketten
  -Zeitgefühl
  -Eingabe:
    -Schieberegler
    -Schalter
    -Netzhaut
  -Ausgabe:
    -Servos
    -Motor
    -Ventile
    -Verlaufsplotter

Ausführung
----------

-Zustand des Netzes
-Verbindungsmatrix für jeden Knoten
-abwechselnde Berechnung von Neuronen- und Verbindungspotenzialen