TestCase("TestOnAdd", {
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
        this.clock.restore();
    },
    
    "test if callback is fired after executing a view method" : function () {
        var callback = false;
        
        this.connection.on("testArray", "add");
        
        this.data.onAdd({
            testArray : function () {
                callback = true;
            }
        });
        
        this.view.add(2);
        this.clock.tick(100);
                
        assertTrue("callback should be fired", callback);
        
        callback = false;
        
        this.view.add(9);
        this.clock.tick(100);
                
        assertTrue("callback should be fired", callback);
    },
    
    "test if callback is fired after executing a data method" : function () {
        var callback = false;
                
        this.data.onAdd({
            testArray : function () {
                callback = true;
            }
        });
        
        this.data.add("testArray", 2);
        this.clock.tick(100);
                
        assertTrue("callback should be fired", callback);
        
        callback = false;
        
        this.data.add("testArray");
        this.clock.tick(100);
                
        assertTrue("callback should be fired", callback);
    },
    
    "test if callback is not fired after executing a view method with invalid arguments" : function () {
        var callback = false;
                
        this.data.onAdd({
            testArray : function () {
                callback = true;
            }
        });
        
        this.connection.on("testArray", "add");
        
        this.view.add(-1, "new value"); // index -1 is invalid
        this.clock.tick(100);
                
        assertFalse("callback should not be fired", callback);
    },
    
    "test if callback is not fired after executing a data method with invalid arguments" : function () {
        var callback = false;
                
        this.data.onAdd({
            testArray : function () {
                callback = true;
            }
        });

        this.data.add("testArray", -1, "new value"); // index -1 is invalid
        this.clock.tick(100);
                
        assertFalse("callback should not be fired", callback);
    }
});