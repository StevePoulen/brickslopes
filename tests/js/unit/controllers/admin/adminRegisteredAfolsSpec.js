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

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/afol/admin.html');
            });
        });

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

        describe('Show Email Option', function() {
            it('should show the feature', function() {
                scope.afol = {'paid': 'YES'};
                expect(scope.showEmailOption()).toBe(true);
            });

            it('should hide the feature', function() {
                scope.afol = {'paid': 'yes'};
                expect(scope.showEmailOption()).toBe(false);
            });

            it('should hide the feature', function() {
                scope.afol = {'paid': 'NO'};
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
