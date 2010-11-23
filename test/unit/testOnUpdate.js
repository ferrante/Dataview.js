var TestOnUpdate = TestCase("TestOnUpdate", {
    setUp: function () {
        this.data = getMockedData();
        this.view = getMockedView();
        this.connection = this.data.connect(this.view);
        this.clock = sinon.useFakeTimers();
    },
    
    tearDown: function () {
        this.data = null;
        this.view = null;
        this.connection = null;
    },
    
    "test if callback is fired after executing a view method" : function () {
        var callback = false;
        
        this.connection.on("testArray", "update");
        
        this.data.onUpdate({
            testArray : function () {
                callback = true;
            }
        });
        
        this.view.update(2);
        this.clock.tick(100);
                
        assertTrue("callback should be fired", callback);
        
        callback = false;
        
        this.view.update();
        this.clock.tick(100);
                
        assertTrue("callback should be fired", callback);
        
        callback = false;

        this.view.update([]);
        this.clock.tick(100);

        assertTrue("callback should be fired", callback); 
    },
    
    "test if callback is fired after executing a data method" : function () {
        var callback = false;
                
        this.data.onUpdate({
            testArray : function () {
                callback = true;
            }
        });
        
        this.data.update("testArray", 2);
        this.clock.tick(100);
                
        assertTrue("callback should be fired", callback);
        
        callback = false;
        
        this.data.update("testArray");
        this.clock.tick(100);
                
        assertTrue("callback should be fired", callback);
        
        callback = false;

        this.data.update("testArray", []);
        this.clock.tick(100);

        assertTrue("callback should be fired", callback);
    },
    
    "test if callback is not fired after executing a view method with invalid arguments" : function () {
        var callback = false;
                
        this.data.onUpdate({
            testArray : function () {
                callback = true;
            }
        });
        
        this.connection.on("testArray", "update");
        
        this.view.update(10, "new value"); // index 10 does not exist
        this.clock.tick(100);
                
        assertFalse("callback should not be fired", callback);
        
        this.view.update(-1, "new value"); // index -1 is invalid
        this.clock.tick(100);
                
        assertFalse("callback should not be fired", callback);
    },
    
    "test if callback is not fired after executing a data method with invalid arguments" : function () {
        var callback = false;
                
        this.data.onUpdate({
            testArray : function () {
                callback = true;
            }
        });
        
        this.data.update("testArray", 10, "new value"); // index 10 does not exist
        this.clock.tick(100);
                
        assertFalse("callback should not be fired", callback);
        
        this.data.update("testArray", -1, "new value"); // index -1 is invalid
        this.clock.tick(100);
                
        assertFalse("callback should not be fired", callback);
    }
});