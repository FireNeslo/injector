var Injector = require('..');
var expect = require('chai').expect;
var injector;
var modules;
var base;

/* values */
var error = new Error('fail');
function fail() {
  throw error;
}
var resolved = {resolved:true};
var value = {value:"value"}
var promise = Promise.resolve(resolved);
function factory(value, promise) {
  return {
    value : value === promise
  }
}



describe('Injector', function(){
  it('should work as a constructor', function() {
    expect(new Injector()).to.be.an.instanceof(Injector);
  })
  it('should work as a function', function() {
    expect(Injector()).to.be.an.instanceof(Injector);
  })
  it('should work as a mixin', function() {
    var object = {}; Injector.call(object);
    expect(object.define).to.be.an.instanceof(Function);
    expect(object.require).to.be.an.instanceof(Function);
  })

  beforeEach(function(){
    modules = {};
    base = Injector();
    base.define('value', [], value);
    injector = new Injector([base], modules);
    injector.define('promise', [], promise);
  });

  describe('#define(name, deps, value)', function(){
    it('should return promise', function(){
      var  promise = injector.define('factory', ['value','promise'], factory);
      expect(promise).to.be.an.instanceof(Promise);
      expect(modules.value.promise).to.be.an.instanceof(Promise);
      expect(modules.promise.promise).to.be.an.instanceof(Promise);
      return promise.then(function() {
        expect(modules.factory.promise).to.be.an.instanceof(Promise);
      })
    });
    it('should reject on error', function(){
      return injector.define('fail', [], fail).
      catch(function(e) {
        expect(e).to.equal(error);
      })
    })
  });

  describe('#require(name)', function(){
    beforeEach(function(){
      injector.define('factory', ['value','promise'], factory);
    });
    it('should return promise', function(){
      expect(injector.require('value')).to.be.an.instanceof(Promise);
    });
    it('should be able to require inherited values', function(){
      return injector.require('value').then(function(val) {
        return expect(val).to.equal(val);
      });
    });
    it('should be able to require values with dependencies', function(){
      return injector.require('factory').then(function(val) {
        return expect(val.value).to.equal(false);
      });
    });
  });
});