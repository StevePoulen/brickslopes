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

    describe('MocDetails', function() {
        var mockBackend, service, data;
        beforeEach(inject(function(_$httpBackend_, MocDetails) {
            mockBackend = _$httpBackend_;
            service = MocDetails;
            mockBackend.expectGET('/controllers/registered/mocs.php?eventId=2').respond(mocs);
        }));

        it('should load registered afol moc list count', function() {
            var load = service.getCount(2);
            load.then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toEqualData(3);
        });

        it('should load registered afol moc list count', function() {
            var load = service.getList(2);
            load.then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toEqualData(mocs);
        });
    });

    describe('Create Moc', function() {
        var mockBackend, service, data, dto;
        beforeEach(inject(function(_$httpBackend_, MocDetails) {
            dto = {};
            mockBackend = _$httpBackend_;
            service = MocDetails;
            mockBackend.expectPOST('/controllers/registered/mocs.php', dto).respond(201);
        }));

        it('should create a user moc', function() {
            var load = service.create(dto);
            load.then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toEqualData(201);
        });
    });
});
