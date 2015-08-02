TODO
====

- Forking ermöglichen -> ReadOnly-Versionen von Revisionen (Links zu editierbaren Ordnern)
- Beim Anklicken Objekt nach ganz vorne holen
- Knoten verbinden
- Anker hinzufügen
- Kurven statt Linien

Eigenschaftsfenster
-------------------

-Anker
  -Position
-Neuronen
  -Position: Punkt
  -Name (eindeutig)
  -Typ: aktivierend, hemmend, verknüpfend, entknüpfend
  -Schwelle (Typ: reell >= 0)
  -eingehendes Potenzial (reell, berechnet aus eingehenden Verbindungen)
  -ausgehendes Potenzial (reell >= 0)
  -Maximalpotenzial MAXIMUM
  -Verstärkungsfaktor V 
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
  -Entknüpfungskonstante D
  -Zerfallskonstante K  
  -Quelle
  -Ziel
-später:
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

Ausführung
----------

-Zustand des Netzes
-Verbindungsmatrix für jeden Knoten
-abwechselnde Berechnung von Neuronen- und Verbindungspotenzialen