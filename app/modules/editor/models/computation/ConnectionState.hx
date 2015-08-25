package computation;

class ConnectionState
{
  private var weight: Float;  
  public function new(weight: Float) 
  {
     this.weight = weight;
  }
  public function getWeight() { return this.weight; }
}