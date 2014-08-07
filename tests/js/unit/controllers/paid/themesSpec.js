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

    describe('afolEventThemes Controller', function() {
        var mockBackend, loader, location, response;
        beforeEach(inject(function($controller, $rootScope, _$httpBackend_, $location) {
            scope = $rootScope.$new();
            ctrl = $controller('afolEventThemes', { $scope: scope});
            mockBackend = _$httpBackend_;
            response = [{'eventId': 234, 'theme': 'Pirates'}];
            mockBackend.expectGET('/controllers/paid/themes.php?eventId=2').respond(201, response);
            location = $location;
        }));

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/registered/index.html');
            });
        });

        describe('Defult Values', function() {
            it('should have an eventId variable', function() {
                expect(scope.eventId).toBe(2);
            });

            it('should have an eventId variable', function() {
                expect(scope.themeList).toEqualData([]);
            });

            it('should get event details', function() {
                mockBackend.flush();
                expect(scope.themeList).toEqualData(response);
            });
        });
    });
});
