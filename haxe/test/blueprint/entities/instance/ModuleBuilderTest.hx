package blueprint.entities.instance;

import massive.munit.util.Timer;
import massive.munit.Assert;
import massive.munit.async.AsyncFactory;
import blueprint.entities.instance.ModuleBuilder;

class ModuleBuilderTest 
{
	var instance:ModuleBuilder; 
	
	public function new() 
	{
		
	}
	
	@BeforeClass
	public function beforeClass():Void
	{
	}
	
	@AfterClass
	public function afterClass():Void
	{
	}
	
	@Before
	public function setup():Void
	{
	}
	
	@After
	public function tearDown():Void
	{
	}
	
	@Test
	public function testExample():Void
	{
		new ModuleBuilder().name("Blubb").description("Quak").build(function(creator) { creator.button().build(); });
	}
}