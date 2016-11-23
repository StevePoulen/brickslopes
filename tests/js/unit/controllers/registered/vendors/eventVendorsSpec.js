describe('controllers', function() {
    'use strict';
    var scope, ctrl, location;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(_EventSelectionFactory_) {
        spyOn(_EventSelectionFactory_, 'getSelectedEvent').andReturn(2);
    }));

    describe('eventAfols Controller', function() {
        var mockBackend, route;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_, $route) {
            route = $route;
            route = {
                current: {
                    params: {
                        eventId: 2
                    }
                }
            }
            scope = $rootScope.$new();
            ctrl = $controller('afolEventVendors', {
                $scope: scope,
                $route: route
            });
            location = $location;
            mockBackend = _$httpBackend_;
            mockBackend.expectGET('/controllers/registered/vendors/vendors.php?eventId=2').respond(201, vendors);
        }));

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/registered/index.html');
            });
        });

        describe('Click Vendors', function() {
            it('should redirect to Vendor Registration page', function() {
                scope.clickVendors();
                expect(location.path()).toBe('/registered/2/undefined/vendorRegistration.html');
            });
        });

        describe('Default Variables', function() {
            it('should have an eventId variable', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should have an vendorList variable', function() {
                expect(scope.vendorList).toEqual([]);
            });

            it('should have a vendorListvariable', function() {
                mockBackend.flush();
                expect(scope.vendorList[0].name).toBe(vendors[0].name);
            });
        });

    });
});
