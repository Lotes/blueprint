package  ;

class NeuronState
{
  private var potential: Float;
  public function new(potential: Float) 
  {
    this.potential = potential;
  }
  public function getPotential(): Float { return this.potential; }
}