describe('controllers', function() {
    'use strict';
    var scope, ctrl, location;

    beforeEach (module ('brickSlopes.controllers'));

    beforeEach(inject(function(_EventSelectionFactory_) {
        spyOn(_EventSelectionFactory_, 'getSelectedEvent').andReturn(2);
    }));

    describe('adminRegisteredMocs Controller', function() {
        var mockBackend;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_) {
            scope = $rootScope.$new();
            ctrl = $controller('adminRegisteredMocs', { $scope: scope});
            location = $location;
            mockBackend = _$httpBackend_;
            mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(201, mocs);
        }));

        describe('Print Dialog', function() {
            it('should open a page to print cards', function() {
                scope.printMocs();
                expect(location.path()).toBe('/admin/printRegisteredMocs');
            });
        });

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
                expect(scope.registeredMocs[0].displayName).toBe('Brian Pilati');
            });
        });
    });
});
