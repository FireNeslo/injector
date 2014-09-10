function defer() {'use strict';
  var deferred = {};
  deferred.promise = new Promise(function(resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
}
/**
 * Creates a new Injector
 * @module nslo-injector
 * @param {array} injectors
 */
function Injector(injectors, modules) {'use strict';
  if(!this) return new Injector(injectors, modules);
  if(!modules) modules = {};
  function get(name) {
    if(modules[name]) return modules[name];
    var module = modules[name] = defer();
    if(injectors) injectors.forEach(function(injector) {
      injector.require(name).then(module.resolve, module.reject);
    });
    return module;
  }
	/**
	* require an instance from the injector
	* @param {string|array} name - name of module or list of modules to require;
	* @returns {Promise}
	*/
  function require(name, locals) {
    return Array.isArray(name) ? Promise.all(name.map(require)) : get(name).promise;
  }
	/**
	 * Define an instance
	 * @param {string}                name - the instance name
	 * @param {string[]}      dependencies - the instance dependencies
	 * @param {function|object|Promise} fn - the instance factory or value
	 * @returns {Promise}
	 */
  function define(name, dependencies, fn) {
    return require(dependencies).then(function(deps) {
      var defer = get(name);
      try { defer.resolve(fn.apply ? fn.apply(fn, deps) : fn); }
      catch (error) { defer.reject(error); }
      return defer.promise;
    });
  }
  return this.require = require, this.define = define, this;
}
module.exports = Injector;