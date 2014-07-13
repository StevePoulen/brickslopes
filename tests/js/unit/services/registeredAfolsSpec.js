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

    describe('Registered Afols', function() {
        describe('Get', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, RegisteredAfols) {
                mockBackend = _$httpBackend_;
                service = RegisteredAfols;
                mockBackend.expectGET('/controllers/registeredAfols.php?eventId=2').respond(201, registeredAfols);
            }));

            it('should load registered afols count', function() {
                var load = service.getCount(2);
                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData(2);
            });

            it('should get all of the registered afols', function() {
                var load = service.get(2);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqualData(registeredAfols);
            });
        });

        describe('SendEmailPayment', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, RegisteredAfols) {
                mockBackend = _$httpBackend_;
                service = RegisteredAfols;
                mockBackend.expectGET('/controllers/admin/sendEmail.php?type=registrationPaid&userId=2').respond(201);
            }));

            it('should send a request for an email', function() {
                var load = service.sendPaymentEmail(2);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(undefined);
            });
        });
    });
});
