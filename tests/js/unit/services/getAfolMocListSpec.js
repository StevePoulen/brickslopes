'use strict';

/* jasmine specs for services go here */

describe('service', function() {
    beforeEach(module('brickSlopes.services'));

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('GetAfolMocList', function() {
        var mockBackend, loader, data;
        beforeEach(inject(function(_$httpBackend_, GetAfolMocList) {
            var returnList = {'afolMocCount': 22, 'mocs': {'firstName': 'Cody'}};
            mockBackend = _$httpBackend_;
            loader = GetAfolMocList;
            mockBackend.expectGET('/controllers/mocs/getRegisteredMocList.php').respond(returnList);
        }));

        it('should load registered afol moc list count', function() {
            var load = loader.getCount();
            load.then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toEqualData(22);
        });

        it('should load registered afol moc list count', function() {
            var load = loader.getList();
            load.then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toEqualData({firstName: 'Cody'});
        });
    });
});
