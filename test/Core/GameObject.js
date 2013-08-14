define(['TW/Core/GameObject', 'TW/Utils/inherit'], function(GO, inherit) {

	module('Core');


	test('empty GO', function() {
		var obj = new (GO.makeClass([]))();

		deepEqual(obj.listComponents(), []);
		strictEqual(obj.hasComponent('Acomp'), false);
	});

	test("GO methods after added two component", function() {
		var FirstComponent = GO.makeComponent('first', []);
		var SecondComponent = GO.makeComponent('second', [], function() {});

		var DerivatedGO = GO.makeClass([FirstComponent, SecondComponent]);

		var instance = new DerivatedGO();
		deepEqual(instance.listComponents(), ['first', 'second'], "check listComponents()");
		equal(instance.hasComponent('first'), true, "has first Component");
		equal(instance.hasComponent('second'), true, "has second Component");
		equal(instance.hasComponent('third'), false, "has not third Component");
	});

	test("access properties using two small component", function() {
		var FirstComponent = GO.makeComponent('first', [], function() {
			this.first = true;
		});

		FirstComponent.prototype.firstMethod = function() {
			this.first = false;
		};

		var SecondComponent = GO.makeComponent('second', [], function() {
			this.second = 33;
		});

		var DerivatedGO = GO.makeClass([FirstComponent, SecondComponent], function() {
			this.derivated = "ok";
		});

		DerivatedGO.prototype.method = function() {
			this.derivated = "perfect";
		};


		var instance = new DerivatedGO();

		strictEqual(instance.derivated, "ok", "class properties are always present.");
		strictEqual(instance.first, true, "first component property is valid.");
		strictEqual(instance.second, 33, "second component property is valid.");

		strictEqual(instance.firstMethod, FirstComponent.prototype.firstMethod, "method are also copied.");

		instance.method();
		instance.firstMethod();

		strictEqual(instance.derivated, "perfect", "class methods works well.");
		strictEqual(instance.first, false, "component methods also works well.");
		strictEqual(instance.name, undefined, "name components should not be copied.");
	});

	test('using components with dependencies', function() {
		var FirstComponent = GO.makeComponent('first', []);
		FirstComponent.prototype.method = function() {
			return "2";
		};

		var SecondComponent = GO.makeComponent('second', [FirstComponent]);

		var DerivatedGO = GO.makeClass([SecondComponent]);

		var instance = new DerivatedGO();

		expect(1);
		strictEqual(instance.method(), "2", 'required component is loaded');
	});

	test('passing params to constructors', function() {
		var FirstComponent = GO.makeComponent('first', [], function(params) {
			this.mult = params.var1 * params.var2;
		});

		var DerivatedGO = GO.makeClass([FirstComponent], function(params) {
			this.add = params.var1 + params.var2;
		});

		var instance = new DerivatedGO( { var1: 3, var2: 3 });
		strictEqual(instance.mult, 9, 'params are passed to component constructor');
		strictEqual(instance.add, 6, 'params are passed to mult constructor');

		instance = new DerivatedGO( { var1: 4, var2: 2 });
		strictEqual(instance.mult, 8, 'params are passed to component constructor');
		strictEqual(instance.add, 6, 'params are passed to class constructor');

	});
});
