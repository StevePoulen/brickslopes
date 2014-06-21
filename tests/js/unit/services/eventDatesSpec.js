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

    describe('Event Dates API', function() {
        describe('Get', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, EventDatesAPI) {
                mockBackend = _$httpBackend_;
                service = EventDatesAPI;
                mockBackend.expectGET('/controllers/eventDates.php').respond(201);
            }));

            it('should get all the dates for all events', function() {
                var load = service.get();

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(undefined);
            });
        });
    });

    describe('Event Dates', function() {
        var eventDates, service;
        beforeEach(inject(function(EventDates) {
            service = EventDates;
            eventDates = {
                '2': [
                    {
                        eventId: 2,
                        startDate: '2015-05-16 08:00:00',
                        endDate: '2015-05-16 20:00:00',
                        type: 'AFOL'
                    },
                    {
                        eventId: 2,
                        startDate: '2015-05-15 08:00:00',
                        endDate: '2015-05-15 20:00:00',
                        type: 'PUBLIC'
                    },
                    {
                        eventId: 2,
                        startDate: '2015-05-16 15:00:00',
                        endDate: '2015-05-16 20:00:00',
                        type: 'PUBLIC'
                    },
                ]
            }

        }));

        describe('Factory', function() {
            var mockBackend, data;
            beforeEach(inject(function(_$httpBackend_) {
                mockBackend = _$httpBackend_;
                mockBackend.expectGET('/controllers/eventDates.php').respond(201, eventDates);
                mockBackend.flush();
            }));

            it('should get all the events', function() {
                expect(service.getAllEvents()).toEqualData(eventDates);
            });

            it('should get the year for an event', function() {
                expect(service.getEventYear(2)).toEqualData('2015');
            });

            it('should get the public dates for an event', function() {
                expect(service.getPublicDates(2)).toEqualData('May 15 & 16, 2015');
            });
        });
    });
});
