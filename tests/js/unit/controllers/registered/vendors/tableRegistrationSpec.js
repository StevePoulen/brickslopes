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

    describe('TableRegistration Controller', function() {
        var mockBackend, loader, location, response, route;

        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_ , $route) {
            route = $route;
            route = {
                current: {
                    params: {
                        eventId: 2,
                        storeId: 33,
                        tableId: 'undefined'
                    }
                }
            };
            scope = $rootScope.$new();
            ctrl = $controller('TableRegistration', { $scope: scope, $route: route});
            location = $location;
            mockBackend = _$httpBackend_;
            mockBackend.expectGET('/controllers/public/event.php?eventId=2').respond(201, eventDetails);
        }));

        describe('Digest Values', function() {
            beforeEach(function() {
                mockBackend.flush();
            });

            it('should have an eventName variable', function() {
                expect(scope.eventName).toBe('BrickSlopes 2015');
            });
        });

        describe('Default Values', function() {
            it('should have a tables variable', function() {
                expect(scope.tables).toBe(2);
            });

            it('should have a tableRange variable', function() {
                expect(scope.tableRange[0]).toBe(1);
                expect(scope.tableRange[11]).toBe(12);
            });

            it('should have a button variable', function() {
                expect(scope.buttonText).toBe('Register');
            });

            it('should have a eventName variable', function() {
                expect(scope.eventName).toBeUndefined();
            });

            it('should have an isTableUpdate variable', function() {
                expect(scope.isTableUpdate).toBe(false);
            });

            it('should have a displayErrorMessage variable', function() {
                expect(scope.displayErrorMessage).toBeUndefined();
            });

            it('should have an eventId variable ', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should have an storeId variable ', function() {
                expect(scope.storeId).toBe(33);
            });

            it('should have an tableId variable ', function() {
                expect(scope.tableId).toBe('undefined');
            });
        });

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/registered/eventMe.html');
            });
        });

        describe('Create Vendor', function() {
            var tableDTO;
            beforeEach(function() {
                tableDTO = {
                    eventId: 2,
                    storeId: 33,
                    tableId: 'undefined',
                    tables: 2
                }
            });

            it('should create a table order', function() {
                scope.submitTableRegistration();
                mockBackend.expectPOST('/controllers/registered/vendors/tableRegistration.php', tableDTO).respond(201, {storeId: '1234'});
                mockBackend.flush();
                expect(scope.isTableUpdate).toBe(false);
                expect(scope.buttonText).toBe('Register');
                expect(scope.tables).toBe(2);
                expect(location.path()).toBe('/registered/2/1234/associateRegistration.html');
            });

            it('should display an error', function() {
                scope.name = 'My Store';
                scope.description = 'The sweet life';
                scope.url = 'https://www.url.com';
                scope.logo = 'https://www.logo.com';
                scope.submitTableRegistration();
                mockBackend.expectPOST('/controllers/registered/vendors/tableRegistration.php', tableDTO).respond(400, 1);
                mockBackend.flush();
                expect(location.path()).toBe('');
                expect(scope.displayErrorMessage).toBe('The Table travails.');
            });
        });
    });
});
