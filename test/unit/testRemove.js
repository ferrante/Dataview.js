TestCase("TestRemove", {
    setUp: function () {
        this.data = getMockedData();
        this.view = getMockedView();
        this.connection = this.data.connect(this.view);
    },
    
    tearDown: function () {
        this.data = null;
        this.view = null;
        this.connection = null;
    },
    
    "test if it is possible to remove an an element from array in a valid position using view method" : function () {
        this.connection.on({
            testArray: "remove",
            "testObject.foo.testArray": "remove"
        });
        
        var indexToRemove = 1,
            simpleOriginalLength = this.data.get("testArray").length,
            nestedOriginalLength = this.data.get("testObject.foo.testArray").length,
            simpleOriginalValue = this.data.get("testArray")[indexToRemove],
            nestedOriginalValue = this.data.get("testObject.foo.testArray")[indexToRemove];
        
        this.view.remove(1);
         
        assertEquals("property should contain less items", simpleOriginalLength - 1, this.data.get("testArray").length);
        assertEquals("property should contain less items", this.data.get("testObject.foo.testArray").length, nestedOriginalLength - 1);
        
        this.view.remove(1);
         
        assertEquals("property should contain less items", this.data.get("testArray").length, simpleOriginalLength - 2);
        assertEquals("property should contain less items", this.data.get("testObject.foo.testArray").length, nestedOriginalLength - 2);
        
        assertNotEquals("indexes should be aligned", this.data.get("testArray")[indexToRemove], simpleOriginalValue);
        assertNotEquals("indexes should be aligned", this.data.get("testObject.foo.testArray")[indexToRemove], nestedOriginalValue);
        
    },
    
    "test if it is possible to remove an an element from array in a valid position using data method" : function () {
        var indexToRemove = 1,
            simpleOriginalLength = this.data.get("testArray").length,
            nestedOriginalLength = this.data.get("testObject.foo.testArray").length,
            simpleOriginalValue = this.data.get("testArray")[indexToRemove],
            nestedOriginalValue = this.data.get("testObject.foo.testArray")[indexToRemove];
       
        this.data.remove("testArray", indexToRemove);
        this.data.remove("testObject.foo.testArray", indexToRemove);
        
        
        assertEquals("property should contain less items", simpleOriginalLength - 1, this.data.get("testArray").length);
        assertEquals("property should contain less items", this.data.get("testObject.foo.testArray").length, nestedOriginalLength - 1);
        assertNotEquals("indexes should be aligned", this.data.get("testArray")[indexToRemove], simpleOriginalValue);
        assertNotEquals("indexes should be aligned", this.data.get("testObject.foo.testArray")[indexToRemove], nestedOriginalValue);
    },
    
    "test if it is possible to remove a whole array using view method" : function () {
        this.connection.on({
            testArray : "remove",
            "testObject.foo.testArray" : "remove"
        });
        
        this.view.remove();
        
        assertUndefined("property should be undefined", this.data.get("testArray"));
        assertUndefined("property should be undefined", this.data.get("testObject.foo.testArray"));
    },
    
    "test if it is possible to remove a whole array using data method" : function () {
        this.data.remove("testArray");
        this.data.remove("testObject.foo.testArray");
        
        assertUndefined("property should be undefined", this.data.get("testArray"));
        assertUndefined("property should be undefined", this.data.get("testObject.foo.testArray"));
    },
    
    "test if it is possible to remove a whole array using view method with null as the argument" : function () {
        this.connection.on({
            testArray : "remove",
            "testObject.foo.testArray" : "remove"
        });
        
        this.view.remove(null);
        
        assertUndefined("property should be undefined", this.data.get("testArray"));
        assertUndefined("property should undefined", this.data.get("testObject.foo.testArray"));
    },
    
    "test if it is possible to remove a whole array using data method with null as the argument" : function () {
        this.data.remove("testArray", null);
        this.data.remove("testObject.foo.testArray", null);
        
        assertUndefined("property should be undefined", this.data.get("testArray"));
        assertUndefined("property should be undefined", this.data.get("testObject.foo.testArray"));
    },
    
    "test if it is not possible to remove an element from array at negative index using view method" : function () {
        this.connection.on({
            testArray : "remove",
            "testObject.foo.testArray" : "remove"
        });
        
        this.view.remove(-1);
        
        assertNotNull("property should not be null", this.data.get("testArray"));
        assertNotNull("property should not be null", this.data.get("testObject.foo.testArray"));
        assertNotUndefined("property should not be undefined", this.data.get("testArray"));
        assertNotUndefined("property should not be undefined", this.data.get("testObject.foo.testArray"));
    },
    
    "test if it is not possible to remove an item from array at negative index using data method" : function () {
        this.data.remove("testArray", -1);
        this.data.remove("testObject.foo.testArray", -1);
        
        assertNotNull("property should not be null", this.data.get("testArray"));
        assertNotNull("property should not be null", this.data.get("testObject.foo.testArray"));
        assertNotUndefined("property should not be undefined", this.data.get("testArray"));
        assertNotUndefined("property should not be undefined", this.data.get("testObject.foo.testArray"));
    },
    
    "test if it is not possible to remove an item from array at out of bounds index using data method" : function () {
        var simpleOriginalLength = this.data.get("testArray").length,
            nestedOriginalLength = this.data.get("testObject.foo.testArray").length;
        
        
        this.data.remove("testArray", 10);
        this.data.remove("testObject.foo.testArray", 10);
        
        assertNotNull("property should not be null", this.data.get("testArray"));
        assertNotNull("property should not be null", this.data.get("testObject.foo.testArray"));
        assertNotUndefined("property should not be undefined", this.data.get("testArray"));
        assertNotUndefined("property should not be undefined", this.data.get("testObject.foo.testArray"));
        assertEquals("length should not have changed", simpleOriginalLength, this.data.get("testArray").length);
        assertEquals("length should not have changed", nestedOriginalLength, this.data.get("testObject.foo.testArray").length);
    },
    
    "test if it is not possible to remove an item from array at out of bounds index using view method" : function () {
        var simpleOriginalLength = this.data.get("testArray").length,
            nestedOriginalLength = this.data.get("testObject.foo.testArray").length;
            
        this.connection.on({
            testArray : "remove",
            "testObject.foo.testArray" : "remove"
        });
        
        this.view.remove(-1);
        
        assertNotNull("property should not be null", this.data.get("testArray"));
        assertNotNull("property should not be null", this.data.get("testObject.foo.testArray"));
        assertNotUndefined("property should not be undefined", this.data.get("testArray"));
        assertNotUndefined("property should not be undefined", this.data.get("testObject.foo.testArray"));
        assertEquals("length should not have changed", simpleOriginalLength, this.data.get("testArray").length);
        assertEquals("length should not have changed", nestedOriginalLength, this.data.get("testObject.foo.testArray").length);
    },
    
    "test if it is not possible to remove an item from array at NaN index using data method" : function () {
        var simpleOriginalLength = this.data.get("testArray").length,
            nestedOriginalLength = this.data.get("testObject.foo.testArray").length;
        
        this.data.remove("testArray", NaN);
        this.data.remove("testObject.foo.testArray", NaN);
        
        assertNotNull("property should not be null", this.data.get("testArray"));
        assertNotNull("property should not be null", this.data.get("testObject.foo.testArray"));
        assertNotUndefined("property should not be undefined", this.data.get("testArray"));
        assertNotUndefined("property should not be undefined", this.data.get("testObject.foo.testArray"));
        assertEquals("length should not have changed", simpleOriginalLength, this.data.get("testArray").length);
        assertEquals("length should not have changed", nestedOriginalLength, this.data.get("testObject.foo.testArray").length);
    },
    
    "test if it is not possible to remove an item from array at NaN index using view method" : function () {
        var simpleOriginalLength = this.data.get("testArray").length,
            nestedOriginalLength = this.data.get("testObject.foo.testArray").length;
        
        this.connection.on({
            testArray : "remove",
            "testObject.foo.testArray" : "remove"
        });
        
        this.view.remove(NaN);
        
        assertNotNull("property should not be null", this.data.get("testArray"));
        assertNotNull("property should not be null", this.data.get("testObject.foo.testArray"));
        assertNotUndefined("property should not be undefined", this.data.get("testArray"));
        assertNotUndefined("property should not be undefined", this.data.get("testObject.foo.testArray"));
        assertEquals("length should not have changed", simpleOriginalLength, this.data.get("testArray").length);
        assertEquals("length should not have changed", nestedOriginalLength, this.data.get("testObject.foo.testArray").length);
    },
    
    "test if it is possible to remove a whole object using view method" : function () {
        this.connection.on({
            testObject : "remove"
        });
        
        this.view.remove();
        
        assertUndefined("property should be undefined", this.data.get("testObject"));
    },
    
    "test if it is possible to remove a whole object using data method" : function () {
        this.data.remove("testObject");
        
        assertUndefined(" property should be undefined", this.data.get("testObject"));
    },
    
    "test if it is possible to remove a whole object using view method with null as the argument" : function () {
        this.connection.on({
            testObject : "remove"
        });
        
        this.view.remove(null);
        
        assertUndefined("property should be undefined", this.data.get("testObject"));
    },
    
    "test if it is possible to remove a whole object using data method with null as the argument" : function () {
        this.data.remove("testObject", null);
        
        assertUndefined("property should be undefined", this.data.get("testObject"));
    },
    
    "test if it is possible to remove an item from object at valid key using view method" : function () {
        this.connection.on({
            testObject: "remove"
        });
        
        this.view.remove("foo");
        
        assertUndefined("property should be undefined", this.data.get("testObject.foo"));
    },
    
    "test if it is possible to remove an item from object at valid key using data method" : function () {  
        this.data.remove("testObject", "foo");
        
        assertUndefined("property should be undefined", this.data.get("testObject.foo"));
    },
    
    "test if it is possible to remove an item from object at valid nested key using view method" : function () {
        this.connection.on({
            "testObject": "remove"
        });

        this.view.remove("foo.testString");
        
        assertUndefined("property should be undefined", this.data.get("testObject.foo.testString"));
    },
    
    ""test if it is possible to remove an item from object at valid nested key using data method"" : function () {  
        this.data.remove("testObject.foo.testString");
        
        assertUndefined("property should be undefined", this.data.get("testObject.foo.testString"));
    }
});