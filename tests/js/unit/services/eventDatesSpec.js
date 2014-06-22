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
        var service, scope;
        beforeEach(inject(function($rootScope, EventDates) {
            scope = $rootScope.$new();
            service = EventDates;
        }));

        describe('Factory', function() {
            var mockBackend, data;
            beforeEach(inject(function(_$httpBackend_) {
                mockBackend = _$httpBackend_;
                mockBackend.expectGET('/controllers/eventDates.php').respond(201, eventDates);
            }));

            it('should get all the events', function() {
                var data = undefined;
                service.getAllEvents().then(function(_data) {
                    data = _data;
                });
                mockBackend.flush();
                expect(data).toEqualData(eventDates);
            });

            it('should get the year for an event', function() {
                var data = undefined;
                service.getEventYear(2).then(function(_data) {
                    data = _data;
                });
                mockBackend.flush();
                expect(data).toEqualData('2015');
            });

            it('should get the pass type for an event', function() {
                var data = undefined;
                service.getPassType(2).then(function(_data) {
                    data = _data;
                });
                mockBackend.flush();
                expect(data).toEqualData('4-Day');
            });

            it('should get the pass dates for an event', function() {
                var data = undefined;
                service.getPassDates(2).then(function(_data) {
                    data = _data;
                });
                mockBackend.flush();
                expect(data).toBe('May 14th thru 17th');
            });

            it('should get the meetAndGreetDinnerDate for an event', function() {
                var data = undefined;
                service.getMeetAndGreetDinnerDate(2).then(function(_data) {
                    data = _data;
                });
                mockBackend.flush();
                expect(data).toBe('Thursday, May 14th');
            });

            it('should get the public dates for an event', function() {
                var data = undefined;
                service.getPublicDatesTogether(2).then(function(_data) {
                    data = _data;
                });
                mockBackend.flush();
                expect(data).toEqualData('May 15 & 16, 2015');
            });

            it('should get the public dates and times for an event', function() {
                var data = undefined;
                service.getPublicDates(2).then(function(_data) {
                    data = _data;
                });
                mockBackend.flush();
                expect(data[0].date).toEqualData('Friday, May 15th');
                expect(data[0].hours).toEqualData('9 am to 8 pm');
                expect(data[1].date).toEqualData('Saturday, May 16th');
                expect(data[1].hours).toEqualData('3 pm to 8 pm');
            });

            it('should get the month and year for an event', function() {
                var data = undefined;
                service.getEventMonthYear(2).then(function(_data) {
                    data = _data;
                });
                mockBackend.flush();
                expect(data).toEqualData('May, 2015');
            });
        });
    });
});
