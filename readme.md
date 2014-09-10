nslo-injector - v0.0.0
===
Very simple Injector mixin
## Install
### npm
```bash
$ npm install FireNeslo/injector --save
```
### bower
```bash
$ bower install FireNeslo/injector --save
```
## Usage
```js
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
```
## Test
```bash
$ npm install -g mocha
$ npm test
```
##API

<!-- Start /home/fireneslo/Dropbox/nslo/injector/index.js -->

## Injector(injectors)

Creates a new Injector

### Params: 

* **array** *injectors* 

## require(name)

require an instance from the injector

### Params: 

* **string|array** *name* - name of module or list of modules to require;

## define(name, dependencies, fn)

Define an instance

### Params: 

* **string** *name* - the instance name
* **string[]** *dependencies* - the instance dependencies
* **function|object|Promise** *fn* - the instance factory or value

<!-- End /home/fireneslo/Dropbox/nslo/injector/index.js -->

