describe('registeredAfolsService', function() {
    'use strict';

    var mockBackend, registeredAfolsService, data;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(
        _$httpBackend_,
        _RegisteredAfols_
    ) {
        mockBackend = _$httpBackend_;
        registeredAfolsService = _RegisteredAfols_;
    }));

    describe('Registered Afols', function() {
        describe('Get', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/registered/registeredAfols.php?eventId=2').respond(window.registeredAfols);
            });

            it('should load registered afols count', function() {
                registeredAfolsService.getCount(2).then(function(_data_) {
                    data = _data_;
                });

                mockBackend.flush();
                expect(data).toBe(2);
            });

            it('should get all of the registered afols', function() {
                registeredAfolsService.get(2).then(function(_data_) {
                    data = _data_;
                });

                mockBackend.flush();
                expect(data).toEqual(window.registeredAfols);
            });
        });

        describe('Get - No Afols', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/registered/registeredAfols.php?eventId=2').respond([]);
            });

            it('should load registered afols count', function() {
                registeredAfolsService.getCount(2).then(function(_data_) {
                    data = _data_;
                });

                mockBackend.flush();
                expect(data).toBe(0);
            });

            it('should get all of the registered afols', function() {
                registeredAfolsService.get(2).then(function(_data_) {
                    data = _data_;
                });

                mockBackend.flush();
                expect(data).toEqual([]);
            });
        });

        describe('SendEmailPayment', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/admin/sendEmail.php?eventId=2&type=registrationPaid&userId=2').respond(201);
            });

            it('should send a request for an email', function() {
                registeredAfolsService.sendPaymentEmail(2).then(function(_data_) {
                    data = _data_;
                });

                mockBackend.flush();
                expect(data).toBeUndefined();
            });
        });
    });
});
