TestCase("TestLock", {
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
    
    "test if locking works with inline configured connection" : function () {
        var newValue = "new_value",
            oldValue = this.data.get("testString");
            
        this.connection.on("testString", "update").lock();
        
        this.data.update("testString", newValue);

        assertEquals("property should not be changed", oldValue, this.data.get("testString"));
    },
    
    "test if locking works with inline configured connection on nested properties" : function () {
        var newValue = "new_value",
            oldValue = this.data.get("testObject.foo.testString");

         this.connection.on("testObject.foo.testString", "update").lock();

         this.data.update("testObject.foo.testString", newValue);

         assertEquals("property should not be changed", oldValue, this.data.get("testObject.foo.testString"));
    },
    
    "test if locking works with inline configured connection on simple property array"  : function () {
        var newValue = "new_value",
            oldValue = this.data.get("testString");
            
        this.connection.on(["testArray", "testString"], "update").lock();
        
        this.data.update("testString", newValue);
        
        assertEquals("property should not be changed", oldValue, this.data.get("testString"));
    },
    
    "test if locking works with inline configured connection on array with nested properties" : function () {
        var newValue = "new_value",
            oldValue = this.data.get("testObject.foo.testString");
                         
        this.connection.on(["testObject.foo.testArray", "testObject.foo.testString"], "update").lock();
        
        this.data.update("testObject.foo.testString", newValue);
        
        assertEquals("property should not be changed", oldValue, this.data.get("testObject.foo.testString"));
    },
    
    "test if locking works with object configured connection" : function () {
        var newValue = "new_value",
            oldValue = this.data.get("testArray");
            
        this.connection.on({
            testArray : "update"
        }).lock();
        
        this.data.update("testArray", newValue);
        
        assertEquals("property should not be changed", oldValue, this.data.get("testArray"));
    },
    
    "test if locking works with object configured connection on many properties" : function () {
        var newValue = "new_value",
            oldValue = this.data.get("testArray");
        
            
        this.connection.on({
            testArray : "update",
            testString : "add"
        }).lock();
        
        this.data.update("testArray", newValue);
        
        assertEquals("property should not be changed", oldValue, this.data.get("testArray"));
    }
});