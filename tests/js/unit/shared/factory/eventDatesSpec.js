describe('Event Dates Factory', function() {
    'use strict';

    var service;
    var mockBackend, data;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(
        _EventDates_,
        _EventSelectionFactory_,
        _$httpBackend_
    ) {
        data = null;
        service = _EventDates_;
        mockBackend = _$httpBackend_;
    }));

    describe('Event Dates Success', function() {
        beforeEach(function() {
            mockBackend.expectGET('/controllers/public/eventDates.php').respond(201, eventDates);
        });

        it('should get all the events', function() {
            service.getAllEvents().then(function(_data_) {
                data = _data_;
            });
            mockBackend.flush();
            expect(data).toEqual(eventDates);
        });

        describe('getEventYear', function() {
            it('should get the year for an event', function() {
                service.getEventYear().then(function(_data_) {
                    data = _data_;
                });
                mockBackend.flush();
                expect(data).toEqual('2015');
            });

            it('should get the year for an event - cached', function() {
                spyOn(service, 'getCache').and.returnValue('cached');
                service.getEventYear().then(function(_data_) {
                    data = _data_;
                });
                mockBackend.flush();
                expect(data).toEqual('cached');
            });
        });

        describe('getPassType', function() {
            it('should get the pass type for an event', function() {
                service.getPassType().then(function(_data_) {
                    data = _data_;
                });
                mockBackend.flush();
                expect(data).toEqual('4-Day');
            });

            it('should get the pass type for an event - cached', function() {
                spyOn(service, 'getCache').and.returnValue('cached');
                service.getPassType().then(function(_data_) {
                    data = _data_;
                });
                mockBackend.flush();
                expect(data).toEqual('cached');
            });
        });

        describe('getPassDates', function() {
            it('should get the pass dates for an event', function() {
                service.getPassDates().then(function(_data_) {
                    data = _data_;
                });
                mockBackend.flush();
                expect(data).toBe('May 14th thru 17th');
            });

            it('should get the pass dates for an event - cached', function() {
                spyOn(service, 'getCache').and.returnValue('cached');
                service.getPassDates().then(function(_data_) {
                    data = _data_;
                });
                mockBackend.flush();
                expect(data).toBe('cached');
            });

            it('should get the pass dates for an event - afolTimestampts cached', function() {
                service.getCache = function(input) {
                    if (input === 'afolTimestamps') {
                        return {
                            start: [
                                '2015-05-14 08:00:00'
                            ],
                            end: [
                                '2015-05-15 08:00:00'
                            ],
                            last: 0,
                            size: 1
                        };
                    }
                };
                spyOn(service, 'getCache').and.callThrough();
                service.getPassDates().then(function(_data_) {
                    data = _data_;
                });
                mockBackend.flush();
                expect(data).toBe('May 14th thru 15th');
            });
        });

        describe('meetAndGreetDinnerDate', function() {
            it('should get the meetAndGreetDinnerDate for an event', function() {
                service.getMeetAndGreetDinnerDate().then(function(_data_) {
                    data = _data_;
                });
                mockBackend.flush();
                expect(data).toBe('Thursday, May 14th');
            });

            it('should get the meetAndGreetDinnerDate for an event - cached', function() {
                spyOn(service, 'getCache').and.returnValue('cached');
                service.getMeetAndGreetDinnerDate().then(function(_data_) {
                    data = _data_;
                });
                mockBackend.flush();
                expect(data).toBe('cached');
            });
        });

        describe('getPublicDatesTogether', function() {
            it('should get the public dates for an event', function() {
                service.getPublicDatesTogether().then(function(_data_) {
                    data = _data_;
                });
                mockBackend.flush();
                expect(data).toEqual('May 15 & 16, 2015');
            });

            it('should get the public dates for an event - cached', function() {
                spyOn(service, 'getCache').and.returnValue('cached');
                service.getPublicDatesTogether().then(function(_data_) {
                    data = _data_;
                });
                mockBackend.flush();
                expect(data).toEqual('cached');
            });
        });

        describe('getPublicDates', function() {
            it('should get the public dates and times for an event', function() {
                service.getPublicDates().then(function(_data_) {
                    data = _data_;
                });
                mockBackend.flush();
                expect(data[0].date).toEqual('Friday, May 15th');
                expect(data[0].hours).toEqual('9 am to 8 pm');
                expect(data[1].date).toEqual('Saturday, May 16th');
                expect(data[1].hours).toEqual('3 pm to 8 pm');
            });

            it('should get the public dates and times for an event - cached', function() {
                spyOn(service, 'getCache').and.returnValue('cached');
                service.getPublicDates().then(function(_data_) {
                    data = _data_;
                });
                mockBackend.flush();
                expect(data).toEqual('cached');
            });

            it('should get the pass dates for an event - getPublicTimestamps cached', function() {
                service.getCache = function(input) {
                    if (input === 'publicTimestamps') {
                        return {
                            start: [
                                '2015-05-16 08:00:00'
                            ],
                            end: [
                                '2015-05-17 08:00:00'
                            ],
                            last: 0,
                            size: 1
                        };
                    }
                };
                spyOn(service, 'getCache').and.callThrough();
                service.getPublicDates().then(function(_data_) {
                    data = _data_;
                });
                mockBackend.flush();
                expect(data[0].date).toBe('Saturday, May 16th');
            });
        });

        describe('getEventMonthYear', function() {
            it('should get the month and year for an event', function() {
                service.getEventMonthYear().then(function(_data_) {
                    data = _data_;
                });
                mockBackend.flush();
                expect(data).toEqual('May, 2015');
            });

            it('should get the month and year for an event - cached', function() {
                spyOn(service, 'getCache').and.returnValue('cached');
                service.getEventMonthYear().then(function(_data_) {
                    data = _data_;
                });
                mockBackend.flush();
                expect(data).toEqual('cached');
            });
        });
    });
});
