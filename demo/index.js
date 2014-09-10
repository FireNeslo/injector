var Injector = require('..');
var injector = Injector();


injector.define('one', [], 1)
injector.define('two', [], Promise.resolve(2))
injector.define('three', [], function factory () {
	return 3;
})

injector.define('log sum', 
	[ 'one', 'two', 'three' ],
	function log (one, two, three) {
		console.log('%d + %d + %d = %d', one, two, three, one+two+three);
	}
);