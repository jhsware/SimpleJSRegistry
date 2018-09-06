var expect = require('expect.js');

var createInterface = require('../../lib').createInterface;
var createAdapter = require('../../lib').createAdapter;

describe('Compat', function () {
    describe('Adapter Factory', function() {
        it('can create an adapter', function() {
            var IUser = createInterface({name: 'IUser'});
            var IDisplayWidget = createInterface({name: 'IDisplayWidget'});

            var adapter = createAdapter({
                implements: IDisplayWidget,
                adapts: IUser
            })
            
            expect(adapter).not.to.be(undefined);
        });
    });
});