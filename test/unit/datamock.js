var getMockedData = function () {
    return dataview({
        testString: "foobar",
        testNumber: 1,
        testArray: [1, 2, 3, 4],
        testObject: {
            foo: {
                testString: "string",
                testNumber: 2,
                testArray: [null, 1, {foo: "bar" }, [5, 6]],
                testNull: null,
                testEmptyArray: [],
                testObject: {
                    foo: 1
                }
            }
        },
        testNull: null,
        testEmptyArray: []
    });
};

var getMockedView = function () {
    return {
        update: function () {
            this.update.apply(this, arguments);
        },
        add: function () {
            this.add.apply(this, arguments);
        },
        remove: function () {
            this.remove.apply(this, arguments);
        }
    };
};