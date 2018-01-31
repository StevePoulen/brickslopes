describe('controllers', function() {
    'use strict';
    var scope, location;
    var mockBackend, route;

    beforeEach(module('brickSlopes'));

    describe('eventAfols Controller', function() {
        beforeEach(inject(function(
            _$controller_,
            _$httpBackend_,
            _$location_,
            _$rootScope_,
            _$route_
        ) {
            route = _$route_;
            route = Object({
                current: {
                    params: {
                        eventId: 2
                    }
                }
            });
            scope = _$rootScope_.$new();
            _$controller_('afolEventVendors', {
                $scope: scope,
                $route: route
            });
            location = _$location_;
            mockBackend = _$httpBackend_;
            mockBackend.expectGET('/controllers/registered/vendors/vendors.php?eventId=2').respond(window.vendors);
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
                expect(scope.vendorList[0].name).toBe(window.vendors[0].name);
            });
        });
    });
});
