'use strict';

/*
 * create_subclass.js
 */
function createSubclass(SuperClass, name, methods) {
    var Subclass;
    eval('Subclass = function ' + name + '() { this.initialize.apply(this, arguments) }');
    Subclass.prototype = new SuperClass();
    Subclass.prototype = Object.create(SuperClass.prototype);

    for (var key in methods) {
        if (methods.hasOwnProperty(key)) {
            Subclass.prototype[key] = methods[key];
        }
    }

    return Subclass;
}

/*
 * dom_ready.js
 */

/**
 * Wordt afgetrapt als de dom geladen is, kan op elk moment worden gebruikt omdat het resultaat gecached wordt
 * @param  {Function} func callback functie voor als dom al geladen is
 * @return {Any}           returned wat er door func wordt gereturned
 */
function domReady(func) {
    var self = this, args = Array.prototype.slice.call(arguments, 1);
    if (isReady.call(this)) return callFunc();
    else document.addEventListener('readystatechange', callFunc);

    function callFunc() {
        document.removeEventListener('readystatechange', callFunc);
        return func.apply(self, args);
    }
}

domReady.isReady = isReady;

/**
 * Returned true als de dom geladen is
 * @return {Boolean}
 */
function isReady() {
    var readyState = document.readyState;
    return readyState == 'loading' ? false : readyState;
}
