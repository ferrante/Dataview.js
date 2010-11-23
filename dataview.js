/*
Dataview.js - JavaScript library
Copyright (c) 2010 Damian Wielgosik (me@varjs.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
(function () {
    "use strict";

    var un, // undefined for comparison purposes
    
        /*  We have to parse nested properties like foo.bar.foobar.
            In this case root === foo.bar, prop === 'foobar'. 
            This is our path to get the property value in the fastest way.
            Thus, doing root[prop] we get foo.bar.foobar value.
        */
        parseProperty = function (property, data) {
            var sliced,
                root,
                prop,
                i;
            
            if (property in data) {
                return [data, property, property];
            } else {
                sliced = property.split('.');
                root = data;
                prop = sliced.pop();
                if (sliced.length) {
                    for (i = sliced.length - 1; i > -1; i -= 1) {
                        root = root[sliced[i]];
                    }
                }
                
                return [root, prop, property];
            }
        },
        getType = function (obj) {
            if (obj === un || obj === null) {
                return "[object Falsy]";
            }
            
            return Object.prototype.toString.call(obj);
        },
        dataview = function (data) { 
            var propertyMap = {}, // keeps all the callbacks and details of the property, speeding up getting the callbacks and values of nested properties
                freezed = {
                    normal: false,
                    strict: false
                },
                /*
                    Example: mapProperty("foo.bar", { bar: 1 }, "bar");
                    So if you want to get data.foo.bar you use root[shortenProperty]
                    Last item in the details array says whether a property is locked or not
                */
                mapProperty = function (property, root, shortenProperty) {
                    propertyMap[property] = {
                        update: [],
                        remove: [],
                        add: [],
                        details: [root, shortenProperty, property, getType(root[shortenProperty]), false]
                    };
                },
                /*
                    filterProperties loops through the passed properties, checks if they'are already parsed and added to the propertyMap. Then it returns the details array of each property.
                */
                filterProperties = function (properties) {
                    var i,
                        j,
                        ret = [],
                        p;
                
                    if (typeof properties !== "object") {
                        properties = [properties];
                    }
                    
                    for (i = 0, j = properties.length; i < j; i += 1) {
                        if (!(properties[i] in propertyMap)) {
                            p = parseProperty(properties[i], data);
                            mapProperty(p[1], p[0], p[2]);
                        }
                        if (!propertyMap[properties[i]].details[4]) {
                            ret[ret.length] = propertyMap[properties[i]].details;
                        }
                    }
                    return ret;
                },
                runCallbacks = function (type, property, key, value) {
                    var i, j, callbacks = propertyMap[property][type];
                    for (i = 0, j = callbacks.length; i < j; i += 1) {
                        (function(callbacks, i, key, value) {
                            window.setTimeout(function () {
                                callbacks[i](key, value);
                            }, 0);
                        })(callbacks, i, key, value);
                    }
                },
                addCallback = function (type, properties) {
                    var property,
                        i,
                        j;
                        
                    for (property in properties) {
                        if (property in propertyMap) {
                            propertyMap[property][type] = propertyMap[property][type].concat(properties[property]);
                        }
                    }
                },
                /*
                    Updates the properties by given value. If 'add' parameter is passed, it means we need to add a property. We have to take care that the existing property can be either array or pure object. At the end, function runs every callback binded to specific property which is being updated.
                */
                updateProperties = function (properties, value, key, add) {
                    var i,
                        j,
                        isKey = typeof key === "string" || typeof key === "number",
                        keyExists,
                        p,
                        action = add ? "add" : "update";
                    
                    for (i = 0, j = properties.length; i < j; i += 1) {
                        p = properties[i];
                        if (isKey) {
                            keyExists = p[0][p[1]] && key in p[0][p[1]];
                            if (p[3] === "[object Array]") {
                                if (add && keyExists) {
                                    p[0][p[1]].splice(key, 1, value);
                                } else if (keyExists || add && key > -1) {
                                    p[0][p[1]][key] = value;
                                } else {
                                    continue;
                                }
                            } else if (keyExists || (add && p[3] === "[object Object]")) {
                                p[0][p[1]][key] = value;
                                if (!keyExists) {
                                    mapProperty(p[2] + "." + key, p[0][p[1]], key);
                                }
                            } else if (p[3] === "[object Object]" && !keyExists) {                                
                                p = parseProperty(key, p[0][p[1]]);
                                if (p[1] in p[0]) {
                                    p[0][p[1]] = value;
                                } else {
                                    continue;
                                }
                            } else {
                                continue;                                
                            }
                        } else {
                            if (!add && (p[1] in p[0])) {
                                p[0][p[1]] = value;
                            } else if (add && p[3] === "[object Array]") {
                                key = p[0][p[1]].length;
                                p[0][p[1]].push(value);
                            } else if (add && !(p[1] in p[0])) {
                                p[0][p[1]] = value;
                            }
                        }
                        
                        p[3] = getType(p[0][p[1]]);
                        
                        if (p[2] in propertyMap && propertyMap[p[2]][action].length) {
                            runCallbacks(action, p[2], key, value);
                        }
                    }
                },
                /*
                    Pretty similar to updateProperties, except it removes the properties.
                */
                removeProperties = function (properties, key) {
                    var i,
                        j,
                        p,
                        keyExists,
                        isKey = key !== un && key !== null,
                        isArr,
                        rm = false;

                    for (i = 0, j = properties.length; i < j; i += 1) {
                        p = properties[i];
                        rm = false;
                        isArr = p[3] === "[object Array]";
                        if (isKey) {
                            keyExists = key in p[0][p[1]];
                            if (keyExists) { 
                                if (isArr) {
                                    p[0][p[1]].splice(key, 1);
                                } else if (key in p[0][p[1]]) {
                                    delete p[0][p[1]][key];
                                } else {
                                    continue;
                                }
                            } else {
                                if (typeof key === "string") {
                                    p = parseProperty(key, p[0][p[1]]);
                                    delete p[0][p[1]];
                                    rm = true;
                                    
                                } else {
                                    continue;
                                }
                            }
                        } else {
                            delete p[0][p[1]];
                            rm = true;
                        }
                        if (p[2] in propertyMap && propertyMap[p[2]].remove.length) {
                            runCallbacks("remove", p[2], key);
                        }

                        if (rm) {
                            delete propertyMap[p[2]];
                        }
                    }
                },
                /*
                    We have to proxy each view method to get this[update|remove|add] available.
                    It supports also the case when a method is connected to different data objects, so that's why __original magic.
                */
                proxyMethod = function (view, properties, method) {
                    var actions,
                        tmp = view[method],
                        tmp2 = view[method].__org || view[method];
                
                    properties = filterProperties(properties);
                
                    actions = {
                        add: function (key, value) {
                            if (arguments.length === 1) {
                                value = key;
                                key = un;
                            }
                            updateProperties(properties, value, key, "add");
                        },
                        remove: function (key) {
                            removeProperties(properties, key);
                        },
                        update: function (key, value) {
                            if (arguments.length === 1) {
                                value = key;
                                key = un;
                            }
                            updateProperties(properties, value, key);
                        }
                    };
                
                    if (!tmp.__proxied) {
                        tmp = function () {
                            var i,
                                j;
                            for (i = 0, j = tmp.__original.length; i < j; i += 1) {
                                tmp.__original[i].apply(actions, arguments);
                            }
                        };
                        
                        tmp.__proxied = true;
                        tmp.__original = [];
                        tmp.__org = tmp2;
                        view[method] = tmp;
                    }

                    tmp.__original.push(function () {
                        tmp2.apply(actions, arguments);
                    });
                },
                /*
                    Let's map all the properties in given data, so we can avoid spending time on doing that on the fly.
                */
                mapAllProperties = function (obj) {
                    var i,
                        root = arguments[1] || "";
                    for (i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            if (getType(obj[i]) === "[object Object]") {
                                mapAllProperties(obj[i], root + i + ".");
                            }

                            mapProperty(root + i, obj, i);
                        }
                    }
                    return root;
                },
                checkFreeze = function () {
                    if (freezed.strict) {
                        throw new Error("Couldn't modify the property. Data object is freezed!");
                    }
                };
                
            mapAllProperties(data);

            return {
                connect: function (view) {
                    var properties;
                        
                    if (freezed.normal) {
                        throw new Error("Couldn't connect a new view. Data object is freezed!");
                    }
                    
                    if (getType(view) !== "[object Object]") {
                        throw new Error("Couldn't connect a new view. Passed view is not an object!");
                    }
                
                    return {
                        on: function (property, action) {
                            var methods = [].concat(action),
                                configurationType = getType(property),
                                methodMap = {},
                                tmpProperties = {},
                                i,
                                j,
                                l;
                            
                            properties = property;
                            if (configurationType !== "[object Object]") {
                                properties = [].concat(properties); // in case 'properties' is a string we have to convert it to the array
                    
                                for (i = 0, j = properties.length; i < j; i += 1) {
                                    (tmpProperties[properties[i]] || (tmpProperties[properties[i]] = [])).push.apply(tmpProperties[properties[i]], methods);
                                }
                                properties = tmpProperties;
                            }
                        
                            if (typeof properties === "object") {
                                for (i in properties) {
                                    if (properties.hasOwnProperty(i)) {
                                        if (i in propertyMap && propertyMap[i].details[4]) {
                                            throw new Error("Couldn't connect new methods. Locked property: " + i);
                                        }
                                        properties[i] = [].concat(properties[i]); // let's convert it to the array
                    
                                        for (j = 0, l = properties[i].length; j < l; j += 1) {
                                            (methodMap[properties[i][j]] || (methodMap[properties[i][j]] = [])).push(i);
                                        }
                                    }
                                }
                            }
                            
                            for (i in methodMap) {
                                proxyMethod(view, methodMap[i], i);
                            }

                            return this;
                        },
                        lock: function () {
                            var i;
                            for (i in properties) {
                                if (properties.hasOwnProperty(i)) {
                                    propertyMap[i].details[4] = true;
                                }
                            }
                        }
                    };
                },
                update: function (property, key, value) {
                    checkFreeze();
                    if (arguments.length === 2) {
                        value = key;
                        key = un;
                    }
                    
                    updateProperties(filterProperties(property), value, key);
                },
                remove: function (property, key) {
                    checkFreeze();
                    removeProperties(filterProperties(property), key);
                },
                add: function (property, key, value) {
                    checkFreeze();
                    if (arguments.length === 2) {
                        value = key;
                        key = un;
                    }
   
                    updateProperties(filterProperties(property), value, key, "add");
                },
                onUpdate: function (opts) {
                    addCallback("update", opts);
                },
                onRemove: function (opts) {
                    addCallback("remove", opts);
                },
                onAdd: function (opts) {
                    addCallback("add", opts);
                },
                freeze: function (strictMode) {
                    freezed.strict = !!strictMode;
                    freezed.normal = true;
                },
                get: function (property) {
                    if (arguments.length === 0) {
                        return data;
                    } else {
                        if (property in propertyMap) {
                            var p = propertyMap[property].details;
                            return p[0][p[1]];
                        }
                    }
                }
            };
        };
    
    this.dataview = function (data) {
        return dataview(data);
    };
    this.dataview.version = "0.8.1";
})();