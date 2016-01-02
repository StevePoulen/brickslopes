describe('service', function() {
    'use strict';

    beforeEach(module('brickSlopes.services'));

    beforeEach(inject(function(_EventSelectionFactory_) {
        spyOn(_EventSelectionFactory_, 'getSelectedEvent').andReturn(2);
    }));

    describe('Registered Afols', function() {
        describe('Get', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, RegisteredAfols) {
                mockBackend = _$httpBackend_;
                service = RegisteredAfols;
                mockBackend.expectGET('/controllers/registered/registeredAfols.php?eventId=2').respond(201, registeredAfols);
            }));

            it('should load registered afols count', function() {
                var load = service.getCount(2);
                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(2);
            });

            it('should get all of the registered afols', function() {
                var load = service.get(2);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqual(registeredAfols);
            });
        });

        describe('Get - No Afols', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, RegisteredAfols) {
                mockBackend = _$httpBackend_;
                service = RegisteredAfols;
                mockBackend.expectGET('/controllers/registered/registeredAfols.php?eventId=2').respond(201, []);
            }));

            it('should load registered afols count', function() {
                var load = service.getCount(2);
                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(0);
            });

            it('should get all of the registered afols', function() {
                var load = service.get(2);

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqual([]);
            });
        });

        describe('SendEmailPayment', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, RegisteredAfols) {
                mockBackend = _$httpBackend_;
                service = RegisteredAfols;
                mockBackend.expectGET('/controllers/admin/sendEmail.php?eventId=2&type=registrationPaid&userId=2').respond(201);
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
