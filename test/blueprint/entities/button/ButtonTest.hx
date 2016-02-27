package blueprint.entities.button;

import massive.munit.util.Timer;
import massive.munit.Assert;
import massive.munit.async.AsyncFactory;
import blueprint.entities.button.*;
import blueprint.entities.instance.*;

class ButtonTest 
{
	private var MINIMUM: Float = 0;
	private var MAXIMUM: Float = 100;
	private var ENABLED: Bool = true;
	private var NAME: String = "Name";
	private var creator: DummyModuleInstanceCreator;
	
	@Before
	public function setup() 
	{
		this.creator = new DummyModuleInstanceCreator();
	}
	
	@Test
	public function Build_Set_InstanceEquals():Void
	{
		var builder = new ButtonBuilder(this.creator, new ButtonTemplate());
		var button = builder
			.enabled(ENABLED)
			.maximum(MAXIMUM)
			.minimum(MINIMUM)
			.name(NAME)
			.build();
		Assert.areEqual(ENABLED, button.getEnabled());
		Assert.areEqual(MINIMUM, button.getMinimum());
		Assert.areEqual(MAXIMUM, button.getMaximum());
		Assert.areEqual(NAME, creator.getLastName());
	}
	
	@Test
	public function Build_Twice_Fail():Void
	{
		var builder = new ButtonBuilder(this.creator, new ButtonTemplate());
		builder.build();
		Assert.areEqual(null, creator.getLastName());
		try 
		{
			builder.build(); //error
			Assert.fail("Exception expected!");
		} catch (err: Error) { }
	}
	
	@Test
	public function Template_Set_InstanceEquals():Void
	{
		var builder = new ButtonBuilder(this.creator, new ButtonTemplate());
		var template = builder
			.enabled(ENABLED)
			.maximum(MAXIMUM)
			.minimum(MINIMUM)
			.template();
		Assert.areEqual(ENABLED, template.getEnabled());
		Assert.areEqual(MINIMUM, template.getMinimum());
		Assert.areEqual(MAXIMUM, template.getMaximum());
	}
}