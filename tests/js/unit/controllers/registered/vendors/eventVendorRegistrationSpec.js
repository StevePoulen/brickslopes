'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    var scope, ctrl, location, mockBackend, route;

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

    describe('vendorRegistration Controller', function() {
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_ , $route) {
            route = $route;
            route = {current: {params:{eventId:2, storeId:'undefined'}}};
            scope = $rootScope.$new();
            ctrl = $controller('vendorRegistration', { $scope: scope, $route: route});
            location = $location;
            mockBackend = _$httpBackend_;
        }));

        describe('Default Values', function() {
            it('should have a button variable', function() {
                expect(scope.buttonText).toBe('Register');
            });

            it('should have an isStoreUpdate variable', function() {
                expect(scope.isStoreUpdate).toBe(false);
            });

            it('should have a displayErrorMessage variable', function() {
                expect(scope.displayErrorMessage).toBeUndefined();
            });

            it('should have a name variable', function() {
                expect(scope.name).toBeUndefined();
            });

            it('should have a description variable', function() {
                expect(scope.description).toBeUndefined();
            });

            it('should have a url variable', function() {
                expect(scope.url).toBe('https://<your_store_url>');
            });

            it('should have a logo variable', function() {
                expect(scope.logo).toBe('https://<your_logo_url>');
            });

            it('should have an eventId variable ', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should have an storeId variable ', function() {
                expect(scope.storeId).toBe('undefined');
            });
        });

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/registered/eventMe.html');
            });
        });

        describe('Create Vendor', function() {
            var vendorDTO;
            beforeEach(function() {
                vendorDTO = {
                    eventId: 2,
                    storeId: 'undefined',
                    name: 'My Store',
                    description: 'The sweet life',
                    url: 'https://www.url.com',
                    logo: 'https://www.logo.com'
                }
            });

            it('should create a store', function() {
                scope.registrationForm = {'$setPristine': function() {}};
                scope.name = 'My Store';
                scope.description = 'The sweet life';
                scope.url = 'https://www.url.com';
                scope.logo = 'https://www.logo.com';
                scope.submitRegistration();
                mockBackend.expectPOST('/controllers/registered/vendors/vendorRegistration.php', vendorDTO).respond(201, {storeId: '1234'});
                mockBackend.flush();
                expect(location.path()).toBe('/registered/2/1234/tableRegistration.html');
                expect(scope.buttonText).toBe('Register');
                expect(scope.name).toBe('My Store');
                expect(scope.description).toBe('The sweet life');
                expect(scope.url).toBe('https://www.url.com');
                expect(scope.logo).toBe('https://www.logo.com');
            });

            it('should display an error', function() {
                scope.name = 'My Store';
                scope.description = 'The sweet life';
                scope.url = 'https://www.url.com';
                scope.logo = 'https://www.logo.com';
                scope.submitRegistration();
                mockBackend.expectPOST('/controllers/registered/vendors/vendorRegistration.php', vendorDTO).respond(400, 1);
                mockBackend.flush();
                expect(location.path()).toBe('');
                expect(scope.displayErrorMessage).toBe('The Vendor travails.');
            });
        });

        describe('Update Vendor', function() {
            var vendorDTO;
            beforeEach(inject(function($controller) {
                vendorDTO = {
                    storeId: 2,
                    name: 'My Store',
                    description: 'The sweet life',
                    url: 'https://www.url.com',
                    logo: 'https://www.logo.com'
                }
                route = {current: {params:{storeId:2}}};
                ctrl = $controller('vendorRegistration', { $scope: scope, $route: route});
            }));

            it('should update a store', function() {
                scope.isStoreUpdate = true;
                scope.called = true;
                scope.registrationForm = {'$setPristine': function() {}};
                scope.name = 'My Store';
                scope.description = 'The sweet life';
                scope.url = 'https://www.url.com';
                scope.logo = 'https://www.logo.com';
                scope.submitRegistration();
                mockBackend.expectPATCH('/controllers/registered/vendors/vendorRegistration.php', vendorDTO).respond('200');
                mockBackend.flush();
                expect(location.path()).toBe('/registered/eventMe.html');
            });

            it('should display an error', function() {
                scope.isStoreUpdate = true;
                scope.called = true;
                scope.name = 'My Store';
                scope.description = 'The sweet life';
                scope.url = 'https://www.url.com';
                scope.logo = 'https://www.logo.com';
                scope.submitRegistration();
                mockBackend.expectPATCH('/controllers/registered/vendors/vendorRegistration.php', vendorDTO).respond(400, 1);
                mockBackend.flush();
                expect(location.path()).toBe('');
                expect(scope.displayErrorMessage).toBe('The Vendor travails.');
            });
        });
    });
});
