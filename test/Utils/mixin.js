
define(['TW/Utils/mixin'], function(mixin) {

	module('mixin');

	test("mixin on instance", function() {
		var mixObj = {
			property: 'foo',
			method: function() {
				return 'bar';
			}
		};

		var Class = function() {
			this.classProperty = true;
		};
		Class.prototype.classMethod = function() {
			return 'baz';
		};

		var instance1 = new Class();
		var instance2 = new Class();

		mixin(instance2, mixObj);

		strictEqual(instance1.classProperty, true, 'no mixed instance has no change');
		strictEqual(instance1.classMethod(), 'baz', 'no mixed instance has no change');
		strictEqual(instance2.classProperty, true, 'mixed instance has always class property');
		strictEqual(instance2.classMethod(), 'baz', 'mixed instance has always class method');
		strictEqual(instance1.property, undefined, 'no mixed instance has not mixObj property');
		strictEqual(instance2.property, 'foo', 'mixed instance has mixObj property');
		strictEqual(instance1.method, undefined, 'no mixed instance has not mixObj method');
		strictEqual(instance2.method(), 'bar', 'mixed instance has mixObj method');
	});

	test("mixin on class prototype", function() {
		var mixObj = {
			property: 'foo',
			method: function() {
				return 'bar';
			}
		};

		var Class = function() {
			this.classProperty = true;
		};
		Class.prototype.classMethod = function() {
			return 'baz';
		};
		mixin(Class.prototype, mixObj);

		var instance = new Class();

		strictEqual(instance.classProperty, true, 'new instance has class property');
		strictEqual(instance.classMethod(), 'baz', 'new instance has class method');

		strictEqual(instance.property, 'foo', 'new instance has mixObj property');
		strictEqual(instance.method(), 'bar', 'mixed instance has mixObj method');
	});

});