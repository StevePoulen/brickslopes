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

    describe('afolEditProfile Controller', function() {
        var mockBackend, loader;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_) {
            scope = $rootScope.$new();
            ctrl = $controller('afolEditProfile', { $scope: scope});
            location = $location;
            mockBackend = _$httpBackend_;
        }));

        describe('Close Dialog', function() {
            it('should redirect to admin index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/admin/index.html');
            });
        });

        describe('Default Values', function() {
            it('should have a userObject variable', function() {
                expect(scope.userObject).toBeUndefined();
            });

            it('should hydrate the userObject variable', function() {
                mockBackend.expectGET('/controllers/user.php').respond(200, singleUser);
                mockBackend.flush();
                singleUser.memberSince = 'May 16th, 2014';
                expect(scope.userObject).toEqualData(singleUser);
            });
        });
    });
});

