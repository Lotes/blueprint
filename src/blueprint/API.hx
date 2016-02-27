package blueprint;
import blueprint.entities.instance.*;

@:expose("blueprint")
class API 
{	
	public static function module(): ModuleBuilder { return new ModuleBuilder(); }
	
	static function main() 
	{
		return 0;
	}	
}