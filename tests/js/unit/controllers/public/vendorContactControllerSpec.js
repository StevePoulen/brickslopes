describe('Vendor Contact', function() {
    'use strict';

    var scope, mockBackend;

    beforeEach(module('brickSlopes'));

    describe('vendorContact Controller', function() {
        beforeEach(inject(function(
            _$controller_,
            _$rootScope_,
            _$httpBackend_
        ) {
            scope = _$rootScope_.$new();
            _$controller_('vendorContactController', {
                $scope: scope
            });
            scope.$digest();
            mockBackend = _$httpBackend_;
        }));

        describe('Default Values', function() {
            it('should have a typeOfProducts variable', function() {
                expect(scope.data.typeOfProducts).toBe('Type of Products ...');
            });

            it('should have a captchaInit variable', function() {
                expect(scope.captchaInit).toBe('LeGo1');
            });

            it('should have a timer variable', function() {
                expect(scope.timer).toBe(false);
            });

            it('should have a verifying variable', function() {
                expect(scope.verifying).toBe(false);
            });
        });

        describe('Submit an email', function() {
            beforeEach(function() {
                scope.data = Object({
                    businessName: 'Cody Emporium',
                    contactName: 'Cody Ottley',
                    email: 'cody.ottley@bs.com',
                    phoneNumber: '8013334444',
                    typeOfProducts: 'Everything is Awesome!',
                    space: '4 tables',
                    associates: '3 associates',
                    webSite: '',
                    captcha: 'bingo'
                });
            });

            it('should submit an email on success', function() {
                var expectedPost = {
                    businessName: 'Cody Emporium',
                    contactName: 'Cody Ottley',
                    email: 'cody.ottley@bs.com',
                    phoneNumber: '8013334444',
                    typeOfProducts: 'Everything is Awesome!',
                    space: '4 tables',
                    associates: '3 associates',
                    webSite: '',
                    captcha: 'bingo'
                };
                scope.vendorContactForm = {
                    $setPristine: function() {}
                };
                scope.submitVendorInformation();
                mockBackend.expectPOST('/controllers/public/vendorContact.php', expectedPost).respond(201);
                mockBackend.flush();
                expect(scope.displayMessage).toBe('Your e-mail has been sent.');
                expect(scope.timer).toBe(true);
                expect(scope.data).toEqual(Object({
                    businessName: '',
                    contactName: '',
                    email: '',
                    phoneNumber: '',
                    typeOfProducts: 'Type of Products ...',
                    space: '',
                    associates: '',
                    webSite: '',
                    captcha: ''
                }));
            });
        });
    });
});
