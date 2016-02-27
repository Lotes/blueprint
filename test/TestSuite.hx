import massive.munit.TestSuite;

import blueprint.entities.button.ButtonTest;
import blueprint.entities.instance.ModuleBuilderTest;
import ExampleTest;

/**
 * Auto generated Test Suite for MassiveUnit.
 * Refer to munit command line tool for more information (haxelib run munit)
 */

class TestSuite extends massive.munit.TestSuite
{		

	public function new()
	{
		super();

		add(blueprint.entities.button.ButtonTest);
		add(blueprint.entities.instance.ModuleBuilderTest);
		add(ExampleTest);
	}
}
