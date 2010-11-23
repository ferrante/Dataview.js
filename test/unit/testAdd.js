var TestAdd = TestCase("TestAdd", {
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
    
    "test if it is possible to add a value to array at a valid index using view method" : function () {
        var value = "new_value",
            index = 6;
            
        this.connection.on({
            testArray: "add"
        });
        
        this.view.add(index, value);
        assertEquals("value should be added", value, this.data.get("testArray")[index]);
    },
    
    "test if it is possible to add a value to array at a valid index using data method" : function () {
        var value = "new_value",
            index = 60;
            
        this.data.add("testArray", index, value);
        assertEquals("value should be added", value, this.data.get("testArray")[index]);
    },
    
    "test if it is possible to add a value to array without passing a index using view method" : function () {
        var value = "new_value";
            
        this.connection.on({
            testArray: "add"
        });
        
        this.view.add(value);
        
        assertEquals("value should be added", value, this.data.get("testArray").pop());
    },
    
    "test if it is possible to add a value to array without passing a index using data method" : function () {
        var value = "new_value";
        
        this.data.add("testArray", value);
        
        assertEquals("value should be added", value, this.data.get("testArray").pop());
    },
    
    "test if it is not possible to add a value to array at a negative index using view method" : function () {
        var value = "new_value",
            index = -10;
            
        this.connection.on({
            testArray: "add"
        });
        
        this.view.add(index, value);
        assertUndefined("value should not be added", this.data.get("testArray")[index]);
    },
    
    "test if it is not possible to add a value to array at a negative index using data method" : function () {
        var value = "new_value",
            index = -10;
            
        this.data.add("testArray", index, value);

        assertUndefined("value should not be added", this.data.get("testArray")[index]);
    },
    
    "test if it is not possible to add a value to array at the undefined index using view method" : function () {
        var value = "new_value",
            index,
            originalLength = this.data.get("testArray").length;
            
        this.connection.on({
            testArray: "add"
        });
        
        this.view.add(index, value);

        assertUndefined("value should not be added", this.data.get("testArray")[index]);
        assertEquals("value should be added at the end of array", value, this.data.get("testArray")[originalLength]);
    },
    
    "test if it is not possible to add a value to array at the undefined index using data method" : function () {
        var value = "new_value",
            index,
            originalLength = this.data.get("testArray").length;
        
        this.data.add("testArray", index, value);

        assertUndefined("value should not be added at undefined index", this.data.get("testArray")[index]);
        assertEquals("value should be added at the end of array", value, this.data.get("testArray")[originalLength]);
    },
    
    "test if it is not possible to add a value to array at the null index using view method" : function () {
        var value = "new_value",
            index = null,
            originalLength = this.data.get("testArray").length;
            
        this.connection.on({
            testArray: "add"
        });
        
        this.view.add(index, value);

        assertUndefined("value should not be added at null index", this.data.get("testArray")[index]);
        assertEquals("value should be added at the end of array", value, this.data.get("testArray")[originalLength]);
    },
    
    "test if it is not possible to add a value to array at the null index using data method" : function () {
        var value = "new_value",
            index = null,
            originalLength = this.data.get("testArray").length;
        
        this.data.add("testArray", index, value);

        assertUndefined("value should not be added at null index", this.data.get("testArray")[index]);
        assertEquals("value should be added at the end of array", value, this.data.get("testArray")[originalLength]);
    },
    
    "test if it is not possible to add a value to array at the NaN index using view method" : function () {
        var value = "new_value",
            index = Number.NaN,
            originalLength = this.data.get("testArray").length;
                        
        this.connection.on({
            testArray: "add"
        });
        
        this.view.add(index, value);

        assertUndefined("value should not be added at NaN index", this.data.get("testArray")[index]);
        assertEquals("array length should not be changed", originalLength, this.data.get("testArray").length);
    },
    
    "test if it is not possible to add a value to array at the NaN index using data method" : function () {
        var value = "new_value",
            index = Number.NaN,
            originalLength = this.data.get("testArray").length;
        
        this.data.add("testArray", index, value);

        assertUndefined("value should not be added at NaN index", this.data.get("testArray")[index]);
        assertEquals("array length should not be changed", originalLength, this.data.get("testArray").length);    },
    
    "test if it is possible to add a value to object at a valid key using view method" : function () {
        var value = "new_value",
            key = "new_key";
            
        this.connection.on({
            testObject: "add"
        });
        
        this.view.add(key, value);
        assertEquals("value should be added", value, this.data.get("testObject")[key]);
    },
    
    "test if it is possible to add a value to object at a valid key using data method" : function () {
        var value = "new_value",
            key = "new_key";
            
        this.data.add("testObject", key, value);
        assertEquals("value should be added", value, this.data.get("testObject")[key]);
    },
    
    "test if it is possible to add a value to a few properties using view method" : function () {
        var value = "new_value",
            key = "new_key";
            
        this.connection.on({
            testObject: "add",
            "testObject.foo.testObject": "add"
        });
        
        this.view.add(key, value);
        assertEquals("value should be added", value, this.data.get("testObject")[key]);
        assertEquals("value should be added", value, this.data.get("testObject.foo.testObject")[key]);
    },
    
    "test if it is possible to add a value to a few properties using data method" : function () {
        var value = "new_value",
            key = "new_key";
                        
        this.data.add(["testObject", "testObject.foo.testObject"], key, value);
        assertEquals("value should be added", value, this.data.get("testObject")[key]);
        assertEquals("value should be added", value, this.data.get("testObject.foo.testObject")[key]);
    },
    
    "test if a new added key to the object is mapped" : function () {
        var value = "new_value",
            key = "new_key";
                        
        this.data.add(["testObject", "testObject.foo.testObject"], key, value);
        assertEquals("key should be mapped", value, this.data.get("testObject."+key));
        assertEquals("key should be mapped", value, this.data.get("testObject.foo.testObject."+key));
    }
});