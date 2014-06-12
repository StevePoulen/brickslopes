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

    describe('Event Registration', function() {
        describe('Create', function() {
            var mockBackend, loader, data, eventDetails;
            beforeEach(inject(function(_$httpBackend_, EventRegistration) {
                eventDetails = {
                    'userId': '1',
                    'eventId': '2'
                };
                mockBackend = _$httpBackend_;
                loader = EventRegistration;
                mockBackend.expectPOST('/controllers/eventRegistration.php', eventDetails).respond(201);
            }));

            it('should register a user for an event', function() {
                var load = loader.create(eventDetails);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(undefined);
            });
        });
    });
});
