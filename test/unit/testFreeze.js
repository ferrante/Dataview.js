var TestFreeze = TestCase("TestFreeze", {
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
    
    "test if freezing works in normal mode" : function () {
        var error = false;
            
        this.connection.on("testArray", "update");
        this.data.freeze();
        
        try {
            this.data.connect({});
        } catch(e) {
            error = true;
        }
        
        assertTrue("object should be freezed", error);
    },
    
    "test if freezing works in strict mode" : function () {
        var error = false;
            
        this.connection.on("testArray", "update");
        this.data.freeze(true);
        
        try {
            this.data.connect({});
        } catch(e) {
            error = true;
        }
        
        assertTrue("object should be freezed", error);
        
        error = false;
        
        try {
            this.data.update("testString", "new string");
        } catch(e) {
            error = true;
        }
        
        assertTrue("object should be freezed", error);
    }
});