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

    describe('Event Details', function() {
        describe('Get', function() {
            var mockBackend, service, data, eventId;
            beforeEach(inject(function(_$httpBackend_, EventDetails) {
                eventId = 22;
                mockBackend = _$httpBackend_;
                service = EventDetails;
                mockBackend.expectGET('/controllers/event.php?eventId=22').respond(201);
            }));

            it('should get event details', function() {
                service.query({eventId: eventId}, function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData([]);
            });
        });
    });
});
