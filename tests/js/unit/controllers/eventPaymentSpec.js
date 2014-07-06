'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    var scope, ctrl, location;

    beforeEach(
        module(
            'brickSlopes.controllers',
            'app/partials/afol/eventPayment.html'
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
                expect(scope.registrationLineItems).toEqualData(registrationLineItems[2]['lineItems']);
            });

            it('should have an totalAmount variable ', function() {
                expect(scope.totalAmount).toBe('100.00');
            });
        });

        describe('PaypalPayload', function() {
            beforeEach(function() {
                setFixtures('<form id="paypalSubmitForm"></form>');
                mockBackend.expectGET('/controllers/registrationLineItems.php?eventId=2').respond(registrationLineItems);
                mockBackend.flush();
                scope.createFormData();
            });

            it('should have a paypal payload cart object', function() {
                expect($('#paypalSubmitForm').find('input')[0].type).toBe('hidden');
                expect($('#paypalSubmitForm').find('input')[0].name).toBe('cmd');
                expect($('#paypalSubmitForm').find('input')[0].value).toBe('_cart');
            });

            it('should have a paypal payload upload object', function() {
                expect($('#paypalSubmitForm').find('input')[1].type).toBe('hidden');
                expect($('#paypalSubmitForm').find('input')[1].name).toBe('upload');
                expect($('#paypalSubmitForm').find('input')[1].value).toBe('1');
            });

            it('should have a paypal payload business object', function() {
                expect($('#paypalSubmitForm').find('input')[2].type).toBe('hidden');
                expect($('#paypalSubmitForm').find('input')[2].name).toBe('business');
                expect($('#paypalSubmitForm').find('input')[2].value).toBe('events@brickslopes.com');
            });

            it('should have a paypal payload current_code object', function() {
                expect($('#paypalSubmitForm').find('input')[3].type).toBe('hidden');
                expect($('#paypalSubmitForm').find('input')[3].name).toBe('currency_code');
                expect($('#paypalSubmitForm').find('input')[3].value).toBe('USD');
            });

            it('should have a paypal payload item_name_1 object', function() {
                expect($('#paypalSubmitForm').find('input')[4].type).toBe('hidden');
                expect($('#paypalSubmitForm').find('input')[4].name).toBe('item_name_1');
                expect($('#paypalSubmitForm').find('input')[4].value).toBe('Event Pass');
            });

            it('should have a paypal payload amount_1 object', function() {
                expect($('#paypalSubmitForm').find('input')[5].type).toBe('hidden');
                expect($('#paypalSubmitForm').find('input')[5].name).toBe('amount_1');
                expect($('#paypalSubmitForm').find('input')[5].value).toBe('60.00');
            });

            it('should have a paypal payload shipping_1 object', function() {
                expect($('#paypalSubmitForm').find('input')[6].type).toBe('hidden');
                expect($('#paypalSubmitForm').find('input')[6].name).toBe('shipping_1');
                expect($('#paypalSubmitForm').find('input')[6].value).toBe('0');
            });

            it('should have a paypal payload item_name_2 object', function() {
                expect($('#paypalSubmitForm').find('input')[7].type).toBe('hidden');
                expect($('#paypalSubmitForm').find('input')[7].name).toBe('item_name_2');
                expect($('#paypalSubmitForm').find('input')[7].value).toBe('Meet and Greet');
            });

            it('should have a paypal payload amount_2 object', function() {
                expect($('#paypalSubmitForm').find('input')[8].type).toBe('hidden');
                expect($('#paypalSubmitForm').find('input')[8].name).toBe('amount_2');
                expect($('#paypalSubmitForm').find('input')[8].value).toBe('10.00');
            });

            it('should have a paypal payload shipping_2 object', function() {
                expect($('#paypalSubmitForm').find('input')[9].type).toBe('hidden');
                expect($('#paypalSubmitForm').find('input')[9].name).toBe('shipping_2');
                expect($('#paypalSubmitForm').find('input')[9].value).toBe('0');
            });

            it('should have a paypal payload item_name_3 object', function() {
                expect($('#paypalSubmitForm').find('input')[10].type).toBe('hidden');
                expect($('#paypalSubmitForm').find('input')[10].name).toBe('item_name_3');
                expect($('#paypalSubmitForm').find('input')[10].value).toBe('T-Shirt');
            });

            it('should have a paypal payload amount_3 object', function() {
                expect($('#paypalSubmitForm').find('input')[11].type).toBe('hidden');
                expect($('#paypalSubmitForm').find('input')[11].name).toBe('amount_3');
                expect($('#paypalSubmitForm').find('input')[11].value).toBe('30.00');
            });

            it('should have a paypal payload shipping_3 object', function() {
                expect($('#paypalSubmitForm').find('input')[12].type).toBe('hidden');
                expect($('#paypalSubmitForm').find('input')[12].name).toBe('shipping_3');
                expect($('#paypalSubmitForm').find('input')[12].value).toBe('0');
            });
        });
    });
});
