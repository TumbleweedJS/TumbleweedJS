
define(['TW/Utils/copyParam'], function(copyParam) {

	module("copyParam");

	test("copyParam helper", function() {
		var target = {};
		var default_context = {
			foo:    "default value",
			bar:    33,
			baz:    undefined           // baz is allowed, but has not default value.
		};

		copyParam(target, { foo: "some value", unknown: 3 }, default_context);

		deepEqual(target,  {
			foo:    "some value",
			bar:    33
		});
	});

});
