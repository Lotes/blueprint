TODO
====

- Forking erm�glichen -> ReadOnly-Versionen von Revisionen (Links zu editierbaren Ordnern)
- Beim Anklicken Objekt nach ganz vorne holen
- Knoten verbinden
- Anker hinzuf�gen
- Kurven statt Linien

Eigenschaftsfenster
-------------------

-Anker
  -Position
-Neuronen
  -Position: Punkt
  -Name (eindeutig)
  -Typ: aktivierend, hemmend, verkn�pfend, entkn�pfend
  -Schwelle (Typ: reell >= 0)
  -eingehendes Potenzial (reell, berechnet aus eingehenden Verbindungen)
  -ausgehendes Potenzial (reell >= 0)
  -Maximalpotenzial MAXIMUM
  -Verst�rkungsfaktor V 
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
  -Typ: abh�ngig vom Quellknoten (implizit)
  -Lernkonstante L (Verkn�pfungskonstante)
  -Entkn�pfungskonstante D
  -Zerfallskonstante K  
  -Quelle
  -Ziel
-sp�ter:
  -globale Variablen
  -Verz�gerungsketten
  -Zeitgef�hl
  -Eingabe:
    -Schieberegler
    -Schalter
    -Netzhaut
  -Ausgabe:
    -Servos
    -Motor
    -Ventile

Ausf�hrung
----------

-Zustand des Netzes
-Verbindungsmatrix f�r jeden Knoten
-abwechselnde Berechnung von Neuronen- und Verbindungspotenzialen