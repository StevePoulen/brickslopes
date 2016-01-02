describe('controllers', function() {
    'use strict';
    var scope, ctrl, location;

    beforeEach(module('brickSlopes.controllers'));

    beforeEach(inject(function(_EventSelectionFactory_) {
        spyOn(_EventSelectionFactory_, 'getSelectedEvent').andReturn(2);
    }));

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
                expect(scope.themeList).toEqual([]);
            });

            it('should get event details', function() {
                mockBackend.flush();
                expect(scope.themeList).toEqual(response);
            });
        });
    });
});
