var TestUpdate = TestCase("TestUpdate", {
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
    
    "test if it is possible to update a string property using view method" : function () {
        var value = "new_value";
            
        this.connection.on({
            testString : "update",
            "testObject.foo.testString" : "update"
        });
        
        this.view.update(value);
        
        assertEquals("property should be updated", value, this.data.get("testString"));
        assertEquals("property should be updated", value, this.data.get("testObject.foo.testString"));
    },
    
    "test if it is possible to update a string property using data method" : function () {
        var value = "new_value";
        
        this.data.update("testString", value);
        this.data.update("testObject.foo.testString", value);
        
        assertEquals("property should be updated", value, this.data.get("testString"));
        assertEquals("property should be updated", value, this.data.get("testObject.foo.testString"));
    },
    
    "test if it is possible to update two properties at once using view method" : function () {
        var value = "new_value";
            
        this.connection.on({
            testString : "update",
            testArray : "update"
        });
        
        this.view.update(value);
        
        assertEquals("property should be updated", value, this.data.get("testString"));
        assertEquals("property should be updated", value, this.data.get("testArray"));
    },
    
    "test if it is possible to update two properties at once using data method" : function() {
        var value = "new_value";

        this.data.update(["testArray", "testString"], value);
        
        assertEquals("property should be updated", value, this.data.get("testString"));
        assertEquals("property should be updated", value, this.data.get("testArray"));
    },
    
    "test if it is possible to update an array in a valid position using view method" : function () {
        var value = "new_value",
            index = 1;
            
        this.connection.on({
            testArray : "update",
            "testObject.foo.testArray" : "update"
        });
        
        this.view.update(index, value);
        
        assertEquals("property should be updated", value, this.data.get("testArray")[index]);
        assertEquals("property should be updated", value, this.data.get("testObject.foo.testArray")[index]);
    },
    
    "test if it is possible to update an array in a valid position using data method" : function () {
        var value = "new_value",
            index = 1;
        
        this.data.update("testArray", index, value);
        this.data.update("testObject.foo.testArray", index, value);
        
        assertEquals("property should be updated", value, this.data.get("testArray")[index]);
        assertEquals("property should be updated", value, this.data.get("testObject.foo.testArray")[index]);
    },
    
    "test if it is possible to update an array using view method with the undefined index" : function () {
        var value = "new_value1",
            index;
            
        this.connection.on({
            testArray : "update",
            "testObject.foo.testArray" : "update"
        });
        
        this.view.update(index, value);
        
        assertUndefined("index should not be added", this.data.get("testArray")[index]);
        assertEquals("property should be updated", value, this.data.get("testArray"));
        
        assertUndefined("index should not be added", this.data.get("testObject.foo.testArray")[index]);
        assertEquals("property should be updated", value, this.data.get("testObject.foo.testArray"));
    },
    
    "test if it is possible to update an array using data method with the undefined index" : function () {
        var value = "new_value",
            index;
            
        this.data.update("testArray", index, value);
        this.data.update("testObject.foo.testArray", index, value);
        
        assertUndefined("index should not be added", this.data.get("testArray")[index]);
        assertEquals("property should be updated", value, this.data.get("testArray"));
        
        assertUndefined("index should not be added", this.data.get("testObject.foo.testArray")[index]);
        assertEquals("property should be updated", value, this.data.get("testObject.foo.testArray"));
    },
    
    "test if it is possible to update an array using view method with null as the index" : function () {
        var value = "new_value",
            index = null;
                        
        this.connection.on({
            testArray : "update",
            "testObject.foo.testArray" : "update"
        });
        
        this.view.update(index, value);
        
        assertUndefined("index should not be added", this.data.get("testArray")[index]);
        assertEquals("property should be updated", value, this.data.get("testArray"));
        
        assertUndefined("index should not be added", this.data.get("testObject.foo.testArray")[index]);
        assertEquals("property should be updated", value, this.data.get("testObject.foo.testArray"));
    },
    
    "test if it is possible to update an array using data method with null as the index" : function () {
        var value = "new_value",
            index = null;
                        
        this.data.update("testArray", index, value);
        this.data.update("testObject.foo.testArray", index, value);
        
        assertUndefined("index should not be added", this.data.get("testArray")[index]);
        assertEquals("property should be updated", value, this.data.get("testArray"));
        
        assertUndefined("index should not be added", this.data.get("testObject.foo.testArray")[index]);
        assertEquals("property should be updated", value, this.data.get("testObject.foo.testArray"));
    },
    
    "test if it is not possible to update an array at negative index using view method" : function () {
        var value = "new_value1",
            index = -1,
            originalValue = this.data.get("testArray");;
            
        this.connection.on({
            testArray : "update"
        });
        
        this.view.update(index, value);
        
        assertUndefined("index should not be added", this.data.get("testArray")[index]);
        assertEquals("property should be updated", originalValue, this.data.get("testArray"));
    },
    
    "test if it is not possible to update an array at negative index using view method" : function () {
        var value = "new_value",
            index = -1,
            originalValue = this.data.get("testArray");
            
        this.data.update("testArray", index, value);
        
        assertUndefined("index should not be added", this.data.get("testArray")[index]);
        assertEquals("property should be updated", originalValue, this.data.get("testArray"));
    },
    key
    "test if it is possible to update an object at valid key using view method" : function () {
        var value = "new_value",
            key = "foo";
            
        this.connection.on({
            testObject : "update",
            "testObject.foo.testObject" : "update"
        });
        
        this.view.update(key, value);
        
        assertEquals("property should be updated", value, this.data.get("testObject")[key]);
        assertEquals("property should be updated", value, this.data.get("testObject.foo.testObject")[key]);
    },
    
    "test if it is possible to update an object at valid key using data method" : function () {
        var value = "new_value",
            key = "foo";

        this.data.update("testObject", key, value);
        this.data.update("testObject.foo.testObject", key, value);
                
        assertEquals("property should be updated", value, this.data.get("testObject")[key]);
        assertEquals("property should be updated", value, this.data.get("testObject.foo.testObject")[key]);
    },
    
    "test if it is possible to update an object at valid nested key using view method" : function () {
        var value = "new_value",
            key = "testObject.foo";
        
        this.connection.on({
            "testObject.foo" : "update"
        });
        
        this.view.update(key, value);
        
        assertEquals("property should be updated", value, this.data.get("testObject.foo."+key));
    },
    
    "test if it is possible to update an object at valid nested key using data method" : function () {
        var value = "new_value",
            key = "testObject.foo";
        
        this.data.update("testObject.foo", key, value);
        
        assertEquals("property should be updated", value, this.data.get("testObject.foo."+key));
    },
    
    "test if it is not possible to update an object at nonexisting key using view method" : function () {
        var value = "new_value",
            key = "foofofofofo";
            
        this.connection.on({
            testObject : "update",
            "testObject.foo.testObject" : "update"
        });
        
        this.view.update(key, value);
        
        assertUndefined("key should not be added", this.data.get("testObject")[key]);
        assertUndefined("key should not be added", this.data.get("testObject.foo.testObject")[key]);
    },
    
    "test if it is not possible to update an object at nonexisting key using data method" : function () {
        var value = "new_value",
            ke = "foofofoofof";
        
        this.data.update("testObject", key, value);
        this.data.update("testObject.foo.testObject", key, value);
        
        assertUndefined("key should not be added", this.data.get("testObject")[key]);
        assertUndefined("key should not be added", this.data.get("testObject.foo.testObject")[key]);
    }
});