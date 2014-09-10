!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.nsloInjector=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}]},{},[1])(1)
});
//# sourceMappingURL=nslo-injector.js.map