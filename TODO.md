TODO
====

- Forking erm�glichen -> ReadOnly-Versionen von Revisionen (Links zu editierbaren Ordnern)
- Beim Anklicken Objekt nach ganz vorne holen
- Knoten verbinden
- Anker hinzuf�gen
- Kurven statt Linien (wie aus einem Malprogramm, je Anker zwei Richthelfer)
- Beschriftungen als eigene Direktive und Raus aus Entit�ten

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
  -Neurontyp: aktivierend, hemmend, verkn�pfend, entkn�pfend

Eigenschaftsfenster
-------------------

-Anker
  -Position
-Neuronen
  -Position: Punkt
  -Name (eindeutig oder leer)
  -Typ: aktivierend, hemmend, verkn�pfend, entkn�pfend
  -Schwelle (Typ: reell >= 0)
  -eingehendes Potenzial (reell, berechnet aus eingehenden Verbindungen)
  -ausgehendes Potenzial (reell >= 0)
  -Maximalpotenzial MAXIMUM (reell >= 0)
  -Verst�rkungsfaktor V (reell >= 0)
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
  -Entkn�pfungskonstante D (reell >= 0)
  -Zerfallskonstante K (reell >= 0)
  -Quelle
  -Ziel
-sp�ter:
  -Labels
  -Eigenschaftsmonitore
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
    -Verlaufsplotter

Ausf�hrung
----------

-Zustand des Netzes
-Verbindungsmatrix f�r jeden Knoten
-abwechselnde Berechnung von Neuronen- und Verbindungspotenzialen