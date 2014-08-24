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
            ctrl = $controller('afolEventVendors', { $scope: scope, $route: route});
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

        describe('Default Variables', function() {
            it('should have an eventId variable', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should have an vendorList variable', function() {
                expect(scope.vendorList).toEqualData([]);
            });

            it('should have a vendorListvariable', function() {
                mockBackend.flush();
                expect(scope.vendorList[0].name).toBe(vendors[0].name);
            });
        });

    });
});
