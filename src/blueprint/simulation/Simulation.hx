package blueprint.simulation ;

import promhx.*;

interface Simulation 
{
	function step(): Promise<Void>;
}