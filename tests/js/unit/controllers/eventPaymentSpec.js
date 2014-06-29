'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    var scope, ctrl, location;

    beforeEach(
        module(
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

    describe('afolEventPayment Controller', function() {
        var mockBackend, loader, window, location, response;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_ ) {
            scope = $rootScope.$new();
            ctrl = $controller('afolEventPayment', { $scope: scope});
            location = $location;
            mockBackend = _$httpBackend_;
        }));

        describe('Default Values', function() {
            it('should have an registrationLineItems variable ', function() {
                expect(scope.registrationLineItems).toBe(undefined);
            });

            it('should have an eventId variable ', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should have an totalAmount variable ', function() {
                expect(scope.totalAmount).toBe(0);
            });

            it('should have a verifying variable', function() {
                expect(scope.verifying).toBe(false);
            });

            it('should have a displayMessage variable', function() {
                expect(scope.displayMessage).toBe('');
            });

            it('should have a timer variable', function() {
                expect(scope.timer).toBe(false);
            });

            it('should have a success variable', function() {
                expect(scope.success).toBe(true);
            });
        });

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/afol/index.html');
            });
        });

        describe('Digest', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/registrationLineItems.php?eventId=2').respond(registrationLineItems);
                mockBackend.flush();
            });

            it('should populate the registrationLineItem variable', function() {
                expect(scope.registrationLineItems).toEqualData(registrationLineItems[2]);
            });

            it('should have an totalAmount variable ', function() {
                expect(scope.totalAmount).toBe(100.00);
            });
        });

        describe('Submit Payment', function() {
            beforeEach(function() {
                var paypalPayload = {
                    'cmd': '_cart',
                    'upload': '1',
                    'business': 'events@brickslopes.com',
                    'currency_code': 'USD',
                    'item_name_1': 'Event Pass',
                    'amount_1': 60,
                    'shipping_1': 0,
                    'item_name_2': 'Meet and Greet',
                    'amount_2': 10,
                    'shipping_2': 0,
                    'item_name_3': 'T-Shirt',
                    'amount_3': 30,
                    'shipping_3': 0,
                }
                mockBackend.expectGET('/controllers/registrationLineItems.php?eventId=2').respond(registrationLineItems);
                mockBackend.flush();
                mockBackend.expectPOST('https://www.paypal.com/cgi-bin/webscr', paypalPayload).respond();
                scope.submitPayment();
                mockBackend.flush();
            });

            it('should have a verifying variable', function() {
                expect(scope.verifying).toBe(true);
            });

            it('should have a location path', function() {
                expect(location.path()).toBe('/afol/eventMe.html');
            });
        });
    });
});
