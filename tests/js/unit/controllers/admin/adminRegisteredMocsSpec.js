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

    describe('adminRegisteredMocs Controller', function() {
        var mockBackend;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_) {
            scope = $rootScope.$new();
            ctrl = $controller('adminRegisteredMocs', { $scope: scope});
            location = $location;
            mockBackend = _$httpBackend_;
            mockBackend.expectGET('/controllers/mocs/mocs.php?eventId=2').respond(201, mocs);
        }));

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/admin/index.html');
            });
        });

        describe('Default Variables', function() {
            it('should have a predicate variable', function() {
                expect(scope.predicate).toBe('firstName');
            });

            it('should have a reverse variable', function() {
                expect(scope.reverse).toBe(false);
            });

            it('should have a registeredUsers list', function() {
                mockBackend.flush();
                expect(scope.registeredMocs[0].displayName).toEqualData('Brian Pilati');
            });
        });
    });
});
