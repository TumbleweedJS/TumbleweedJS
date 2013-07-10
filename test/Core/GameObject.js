define(['TW/Core/GameObject', 'TW/Utils/inherit'], function(GO, inherit) {

	module('Core');


	test('empty GO', function() {
		var obj = new GO();

		deepEqual(obj.listComponents(), []);
		strictEqual(obj.hasComponent('Acomp'), false);
	});

	test("GO methods after added two component", function() {
		var FirstComponent = function() {};
		FirstComponent.name = 'first';
		var SecondComponent = function() {};
		SecondComponent.name = 'second';
		var DerivatedGO = function() {};

		inherit(DerivatedGO, GO);
		GO.implement(DerivatedGO, FirstComponent, SecondComponent);

		var instance = new DerivatedGO();
		deepEqual(instance.listComponents(), ['firstComponent', 'secondComponent'], "check listComponents()");
		equal(instance.hasComponent('first'), true, "has first Component");
		equal(instance.hasComponent('second'), true, "has second Component");
		equal(instance.hasComponent('third'), false, "has not third Component");
	});

	test("access properties using two small component", function() {
		var FirstComponent = function() {
			this.first = true;
		};
		FirstComponent.name = 'first';

		FirstComponent.firstMethod = function() {
			this.first = false;
		};

		var SecondComponent = function() {
			this.second = 33;
		};
		SecondComponent.deps = ['first'];

		var DerivatedGO = function() {
			this.derivated = "ok";
		};
		DerivatedGO.method = function() {
			this.derivated = "perfect";
		};

		inherit(DerivatedGO, GO);
		GO.implement(DerivatedGO, FirstComponent, SecondComponent);



		var instance = new DerivatedGO();

		strictEqual(instance.derivated, "ok", "class properties are always present.");
		strictEqual(instance.first, true, "first component propertie is valid.");
		strictEqual(instance.second, 33, "second component propertie is valid.");

		strictEqual(instance.firstMethod, FirstComponent.firstMethod, "method are also copied.");

		instance.method();
		instance.firstMethod();

		strictEqual(instance.derivated, "perfect", "class methods works well.");
		strictEqual(instance.first, false, "component methods also works well.");

		strictEqual(instance.name, undefined, "name components should not be copied.");
		strictEqual(instance.deps, undefined, "dependencies should not be copied.");
	});

	test('using components with dependencies', function() {
		var FirstComponent = function() {};
		FirstComponent.deps = ['./TestComponent'];
		FirstComponent.method = function() {
			strictEqual(this.attribute, "test", 'Remote required component is loaded');
		};

		var DerivatedGO = function() {};

		inherit(DerivatedGO, GO);
		GO.implement(DerivatedGO, FirstComponent);

		var instance = new DerivatedGO();

		expect(1);
		instance.method();
	});

	test('passing params to constructors', function() {
		var FirstComponent = function(params) {
			this.result = params.var1 * params.var2;
		};

		var DerivatedGO = function(params) {
			GO(params);
		};

		inherit(DerivatedGO, GO);
		GO.implement(DerivatedGO, FirstComponent);

		var instance = new DerivatedGO( { var1: 3, var2: 3 });
		strictEqual(instance.result, 9);

		instance = new DerivatedGO( { var1: 4, var2: 2 });
		strictEqual(instance.result, 8);

	});
});
