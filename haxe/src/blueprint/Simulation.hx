package blueprint;

import promhx.*;

interface Simulation 
{
	function step(): Promise<Void>;
}