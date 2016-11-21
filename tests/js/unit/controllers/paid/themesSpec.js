describe('controllers', function() {
    'use strict';
    var scope, ctrl, location;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(_EventSelectionFactory_) {
        spyOn(_EventSelectionFactory_, 'getSelectedEvent').andReturn(2);
    }));

    describe('afolEventThemes Controller', function() {
        var mockBackend, loader, location;
        beforeEach(inject(function($controller, $rootScope, _$httpBackend_, $location) {
            scope = $rootScope.$new();
            ctrl = $controller('afolEventThemes', { $scope: scope});
            mockBackend = _$httpBackend_;
            mockBackend.expectGET('/controllers/paid/themes.php?eventId=2').respond(201, window.themes);
            location = $location;
        }));

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/registered/index.html');
            });
        });

        describe('Default Values', function() {
            it('should have an 3 themes variable', function() {
                expect(scope.publicList).toEqual([]);
                expect(scope.afolList).toEqual([]);
                expect(scope.bcsList).toEqual([]);
            });

            it('should have a three lists after digest', function() {
                mockBackend.flush();
                expect(scope.afolList).toEqual([
                    window.themes[0],
                    window.themes[1],
                    window.themes[2]
                ]);
                expect(scope.bcsList).toEqual([window.themes[3]]);
                expect(scope.publicList).toEqual([window.themes[4]]);
            });
        });
    });
});
