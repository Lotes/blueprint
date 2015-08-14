TODO
====

- Verschieben der Ansicht
- Ursprungspunkt
- Knoten verbinden
- Verbindungen l�schen
- Knoten l�schen
- Anker hinzuf�gen
- Anker l�schen
- Beim Anklicken Objekt nach ganz vorne holen
- Beschriftungen als eigene Direktive und Raus aus Entit�ten
- NW.js-Editor bauen -> serverseitig auf node.js umsteigen

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
  -Typ
	-Wert
-Typ
  -reell
  -reell >= 0
  -Neurontyp: aktivierend, hemmend, verkn�pfend, entkn�pfend
  -ja/nein
  -Ganzzahl
  -Ganzzahl >= 0
  -Zeichenkette

Eigenschaftsfenster
-------------------

-Anker
  -Position
-Neuronen
  -Position: Punkt
  -Name (eindeutig oder leer)
  -Typ: aktivierend, hemmend, verkn�pfend, entkn�pfend
  -Schwelle (Typ: reell >= 0)
  -eingehende Potenziale ai*gi (reell, berechnet aus eingehenden Verbindungen)
  -ausgehendes Potenzial A (reell >= 0)
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
  -Labels (MathJAX+Angular+Variables)
  -Eigenschaftsmonitore
  -globale Variablen
  -Verz�gerungsketten
  -Zeitgef�hl
  -Eingabe:
    -Schieberegler
    -Schalter
    -Netzhaut
    -RandomNeuron
    -Funktionsgenerator
  -Ausgabe:
    -Servos
    -Motor
    -Ventile
    -Verlaufsplotter

Ausf�hrung
----------

-Zustand des Netzes
-Verbindungsmatrix f�r jeden Knoten
-Berechnung von Neuronenpotenzialen
-Anzeige der Eingabepotenziale (alter Zustand in rot)
-Anzeige der Ausgabepotenziale (neuer Zustand in gr�n)
-je gr��er das Potenzial, desto dicker die Verbindung (\x -> max(sqrt x, 5))
-Potenzial von 0 -> grau
-Step-Mode, Continous-Mode