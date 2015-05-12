'use strict';

var common = require('./common');

var create = function (params) {
    /*
        extends -- (optional) list of object prototypes to inherit from
        implements -- (optional) list of interfaces this prototype implements (besides those that are inherited)
    
        create({
            extends: [SuperObjectPrototype_1, SuperObjectPrototype_2],
            implements: [IMyObjectInterface, IListableItem]
        })
    */
    
    // TODO: obj.interfaceId is used in several places so we should probably have
    // an object specific interfaceId (although it isn't a good name), perhaps use the first interface
    // in implements list and add a prefix?
    
    var extendThese = params.extends,
        implementsInterfaces = params.implements || [],
        constructor = params.constructor;
        
    if (params.extends) {
        delete params.extends;
    };
    
    // The object prototype gets the iname of the first implement
    // interface. It is used when functions are inherited using
    // extends
    if (params.implements && params.implements.length > 0) {
        params._iname = params.implements[0].name;
    };
    
    if (params.implements) {
        delete params.implements
    };
    
    if (params.constructor) {
        // Rename the constructor param so it can be added with the
        // other params
        params._constructor = params.constructor;
        delete params.constructor;
    };
    
    var ObjectPrototype = function (data) {
        // Run the constructor
        this._constructor && this._constructor(data);
        
        // Add the remaining data. The constructors might mutate this and we only
        // want to add what is left
        for (var key in data) {
            this[key] = data[key];
        };
    };
        
    ObjectPrototype.prototype.toJSON = function () {
        var data = {};
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                // Only pass own properties
                var tmp = this[key];
                if (tmp && typeof tmp === "object" && tmp.hasOwnProperty("_iname")) {
                    // Recursively prepare objects for stringify
                    data[key] = tmp.toJSON();
                } else if (typeof tmp !== "function") {
                    data[key] = tmp;
                }
            }
        }
        return data;
    }
        
    ObjectPrototype.prototype._implements = []
    
    // If extends other do first so they get overridden by those passed as params
    // Inehrited prototypes with lower index have precedence
    common.extendPrototypeWithThese(ObjectPrototype, extendThese);
        
    // The rest of the params are added as methods, overriding previous
    common.addMembers(ObjectPrototype, params);
    
    // Add the interfaces so they can be checked
    // TODO: Filer so we remove duplicates from existing list (order makes difference)
    ObjectPrototype.prototype._implements = implementsInterfaces.concat(ObjectPrototype.prototype._implements);
        
    return ObjectPrototype;
}

module.exports.create = create;