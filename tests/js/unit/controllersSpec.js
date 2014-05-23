'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    beforeEach(module('brickSlopes.controllers', 'brickSlopes.services'));

    var scope, ctrl, location;
    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('afolIndex Controller', function() {
        beforeEach(inject(function($controller, $rootScope, $location) {
            scope = $rootScope.$new();
            ctrl = $controller('afolIndex', { $scope: scope});
            location = $location;
        }));

        it('should redirect to eventRegistration', function() {
            scope.clickRegistration();
            expect(location.path()).toBe('/afol/eventRegistration.html');
        });

        it('should redirect to the index on close', function() {
            scope.closeDialog();
            expect(location.path()).toBe('/afol/index.html');
        });
    });

    describe('afolIndex Controller', function() {
        var mockBackend, loader;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_, GetAfolMocList) {
            scope = $rootScope.$new();
            ctrl = $controller('afolIndex', { $scope: scope});
            location = $location;
            mockBackend = _$httpBackend_;
            loader = GetAfolMocList;
        }));

        it('should set the mocCount variable', function() {
            var returnList = {'afolMocCount': 22};
            mockBackend.expectGET('/controllers/mocs/getRegisteredMocList.php').respond(returnList);

            mockBackend.flush();
            expect(scope.mocCount).toBe(22);
        });
    });

    describe('afolIndex Controller', function() {
        var mockBackend, loader;
        beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_, GetAfolMocList) {
            scope = $rootScope.$new();
            ctrl = $controller('afolIndex', { $scope: scope});
            location = $location;
            mockBackend = _$httpBackend_;
            loader = GetAfolMocList;
        }));

        it('should set the mocListvariable', function() {
            var returnList = {'afolMocCount': 22, 'mocs': {'firstName': 'Steve'}};
            mockBackend.expectGET('/controllers/mocs/getRegisteredMocList.php').respond(returnList);

            mockBackend.flush();
            expect(scope.mocList).toEqual({'firstName': 'Steve'});
        });
    });
});
