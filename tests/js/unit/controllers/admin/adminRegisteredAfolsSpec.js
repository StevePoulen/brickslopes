describe('controllers', function() {
    'use strict';
    var scope, ctrl, location;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(_EventSelectionFactory_) {
        spyOn(_EventSelectionFactory_, 'getSelectedEvent').andReturn(2);
    }));

    describe('adminRegisteredAfols Controller', function() {
        var mockBackend;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_) {
            scope = $rootScope.$new();
            ctrl = $controller('adminRegisteredAfols', {
                $scope: scope
            });
            location = $location;
            mockBackend = _$httpBackend_;
            mockBackend.expectGET('/controllers/registered/registeredAfols.php?eventId=2').respond(201, registeredAfols);
        }));

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/admin/index.html');
            });
        });

        describe('Default Variables', function() {
            it('should have a predicate variable', function() {
                expect(scope.predicate).toBe('firstName');
            });

            it('should have a reverse variable', function() {
                expect(scope.reverse).toBe(false);
            });

            it('should have a showModal variable', function() {
                expect(scope.showModal).toBe(false);
            });

            it('should have an eventId variable', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should have an eventName variable', function() {
                expect(scope.eventId).toBeUndefined;
            });

            it('should have an eventName variable', function() {
                mockBackend.flush();
                expect(scope.registeredAfols).toEqual(registeredAfols['2']['registeredAfols']);
            });

            it('should have a registeredAfols lisit', function() {
                mockBackend.flush();
                expect(scope.eventName).toBe('BrickSlopes - Salt Lake City');
            });

            it('should have a comments variable', function() {
                mockBackend.flush();
                expect(scope.registeredAfols.comments).toEqual(registeredAfols['2']['registeredAfols'].comments);
            });
        });

        describe('Show Email Option', function() {
            it('should show the feature', function() {
                scope.afol = {
                    'paid': 'YES'
                };
                expect(scope.showEmailOption()).toBe(true);
            });

            it('should hide the feature', function() {
                scope.afol = {
                    'paid': 'yes'
                };
                expect(scope.showEmailOption()).toBe(false);
            });

            it('should hide the feature', function() {
                scope.afol = {
                    'paid': 'NO'
                };
                expect(scope.showEmailOption()).toBe(false);
            });
        });

        describe('Send Email', function() {
            beforeEach(function() {
                scope.afol = {
                    'userId': 32
                };
            });

            it('should send an email request', function() {
                scope.sendEmail();
                mockBackend.expectGET('/controllers/admin/sendEmail.php?eventId=2&type=registrationPaid&userId=32').respond(201);
                mockBackend.flush();
            });
        });

        describe('Confirm Payment', function() {
            var lineItem, payload;
            beforeEach(function() {
                scope.afol = {
                    paid: 'maybe',
                    registrationId: 32,
                    userId: 1234
                };

                lineItem = {
                    registrationLineItemId: 22,
                    paid: 'NO'
                }

                payload = {
                    registrationLineItemId: 22,
                    registrationId: 32,
                    userId: 1234,
                    revoke: 'no',
                    eventId: 2
                }
            });

            it('should mark a payment paid and registration paid', function() {
                var response = {
                    registrationPaid: true
                }

                scope.confirmPayment(lineItem);
                mockBackend.expectPATCH('/controllers/admin/payment.php', payload).respond(201, response);
                mockBackend.flush();

                expect(scope.afol.paid).toBe('YES');
            });

            it('should mark a payment paid and registration not paid', function() {
                var response = {
                    registrationPaid: false
                }

                scope.confirmPayment(lineItem);
                mockBackend.expectPATCH('/controllers/admin/payment.php', payload).respond(201, response);
                mockBackend.flush();

                expect(scope.afol.paid).toBe('NO');
            });
        });

        describe('Revoke Payment', function() {
            var lineItem, payload;
            beforeEach(function() {
                scope.afol = {
                    paid: 'maybe',
                    registrationId: 32,
                    userId: 1324
                };

                lineItem = {
                    registrationLineItemId: 22,
                    paid: 'YES'
                }

                payload = {
                    registrationLineItemId: 22,
                    registrationId: 32,
                    userId: 1324,
                    revoke: 'yes',
                    eventId: 2
                }
            });

            it('should mark a payment revoked and registration not paid', function() {
                var response = {
                    registrationPaid: false
                }

                scope.confirmPayment(lineItem);
                mockBackend.expectPATCH('/controllers/admin/payment.php', payload).respond(201, response);
                mockBackend.flush();

                expect(scope.afol.paid).toBe('NO');
            });

            it('should mark a payment revoked and registration not paid', function() {
                var response = {
                    registrationPaid: true
                }


                scope.confirmPayment(lineItem);
                mockBackend.expectPATCH('/controllers/admin/payment.php', payload).respond(201, response);
                mockBackend.flush();

                expect(scope.afol.paid).toBe('NO');
            });

        });
    });
});
