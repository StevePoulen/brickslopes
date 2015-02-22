'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    var scope, ctrl, location;

    beforeEach (module('Admin'));

    describe('adminRegisteredMocs Controller', function() {
        var mockBackend;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_) {
            scope = $rootScope.$new();
            ctrl = $controller('PrintMocs', { $scope: scope});
            location = $location;
            mockBackend = _$httpBackend_;
            mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(201, mocs);
        }));

        describe('Close Dialog', function() {
            it('should redirect to index page', function() {
                scope.closeDialog();
                expect(location.path()).toBe('/admin/index.html');
            });
        });

        describe('Print Me', function() {
            it('should open a new page', function() {
                var open = false;
                var write = false;
                var close = false;
                spyOn(window, "open").andReturn(
                    {
                        document: {
                            open: function() { open = true;},
                            write: function() { write = true;},
                            close: function() { close = true;}
                        }
                    }
                );
                spyOn(document, "getElementById").andReturn({innerHTML: 'hello'});
                scope.printMocs();
                expect(window.open).toHaveBeenCalledWith('', '_blank', 'width=300,height=300');
                expect(document.getElementById).toHaveBeenCalledWith('printMocs');
                expect(open).toBe(true);
                expect(write).toBe(true);
                expect(close).toBe(true);
            });
        });

        it('should have a registeredUsers list', function() {
            mockBackend.flush();
            expect(scope.registeredMocs[0].displayName).toBe('Brian Pilati');
        });
    });
});
