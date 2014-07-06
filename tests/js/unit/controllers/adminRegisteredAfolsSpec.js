'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    var scope, ctrl, location;

    beforeEach (
        module (
            'brickSlopes.controllers'
        )
    );

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('adminRegisteredAfols Controller', function() {
        var mockBackend;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_) {
            scope = $rootScope.$new();
            ctrl = $controller('adminRegisteredAfols', { $scope: scope});
            location = $location;
            mockBackend = _$httpBackend_;
            mockBackend.expectGET('/controllers/registeredAfols.php?eventId=2').respond(201, registeredAfols);
        }));

        describe('Default Variables', function() {
            it('should have an eventId variable', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should have an eventName variable', function() {
                expect(scope.eventId).toBeUndefined;
            });

            it('should have an eventName variable', function() {
                mockBackend.flush();
                expect(scope.registeredAfols).toEqualData(registeredAfols['2']['registeredAfols']);
            });

            it('should have a registeredAfols lisit', function() {
                mockBackend.flush();
                expect(scope.eventName).toEqualData('BrickSlopes - Salt Lake City');
            });
        });

        describe('Confirm Payment', function() {
            var lineItem, payload;
            beforeEach(function() {
                scope.afol = {
                    'paid': 'maybe',
                    'registrationId': 32
                };

                lineItem = {
                    registrationLineItemId: 22,
                    paid: 'NO'
                }

                payload = {
                    registrationLineItemId: 22,
                    registrationId: 32,
                    revoke: 'no'
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
                    'paid': 'maybe',
                    'registrationId': 32
                };

                lineItem = {
                    registrationLineItemId: 22,
                    paid: 'YES'
                }

                payload = {
                    registrationLineItemId: 22,
                    registrationId: 32,
                    revoke: 'yes'
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
