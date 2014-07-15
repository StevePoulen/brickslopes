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

    describe('eventMocRegistration Controller', function() {
        var mockBackend, loader, window, location, response;

        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_ , _$window_) {
            scope = $rootScope.$new();
            window = _$window_;
            window.sessionStorage.firstName = 'Cody';
            window.sessionStorage.lastName = 'Ottley';
            ctrl = $controller('afolMocRegistration', { $scope: scope, $window: window});
            location = $location;
            mockBackend = _$httpBackend_;
        }));

        afterEach(function() {
            delete window.sessionStorage;
        });

        describe('Default Values', function() {
            it('should have a firstName variable ', function() {
                expect(scope.firstName).toBe('Cody');
            });

            it('should have a lastName variable ', function() {
                expect(scope.lastName).toBe('Ottley');
            });

            it('should have a displayName variable ', function() {
                expect(scope.displayName).toBe('Cody Ottley');
            });

            it('should have a baseplateWidth variable ', function() {
                expect(scope.baseplateWidth).toBe(1);
            });

            it('should have a baseplateDepth variable ', function() {
                expect(scope.baseplateDepth).toBe(1);
            });

            it('should have a width variable ', function() {
                expect(scope.width.length).toBe(54);
                expect(scope.width[0]).toBe(1);
                expect(scope.width[53]).toBe(54);
            });

            it('should have a height variable ', function() {
                expect(scope.depth.length).toBe(6);
                expect(scope.depth[0]).toBe(1);
                expect(scope.depth[5]).toBe(6);
            });

            it('should have a theme variable ', function() {
                expect(scope.theme).toBe('Castle');
            });

            it('should have an eventId variable ', function() {
                expect(scope.eventId).toBe(2);
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
                mockBackend.expectGET('/controllers/themes.php?eventId=2').respond(themes);
                mockBackend.flush();
            });

            it('should populate the themeList variable', function() {
                expect(scope.themeList).toEqualData(themes);
            });
        });
    });
});
