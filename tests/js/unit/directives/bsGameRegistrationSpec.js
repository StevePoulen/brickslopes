'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {
    beforeEach(
        module(
            'brickSlopes.directives',
            'brickSlopes.services',
            'app/partials/registered/bsGameRegistration.html'
        )
    );

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('bsModal', function() {
        var scope, element, compile;
        beforeEach(inject(function($compile, $rootScope, $templateCache) {
            var template = $templateCache.get('app/partials/registered/bsGameRegistration.html');
            $templateCache.put('partials/registered/bsGameRegistration.html', template);
            scope = $rootScope.$new();
            element = angular.element('<bs-game-registration></bs-game-registration>');
            compile = $compile;
        }));

        describe('Contents', function() {
            beforeEach(function() {
                scope.game = {
                    showCTAButton: true,
                    gameId: 2
                };
                scope.userGameList = {
                    1: {
                        gameId: 1,
                        userId: 3
                    }
                }
                element = compile(element)(scope);
                scope.canRegister = true;
                scope.$digest();
            });

            it('should have a visible play button', function() {
                expect($(element).find('.actionButtonGames').text()).toContain('PLAY!');
            });

            it('should have a visible play button', function() {
                expect($(element).find('.actionButtonGames').hasClass('ng-hide')).toBe(false);
            });

            it('should have a hidden Remove button', function() {
                expect($(element).find('.actionButtonDeleteGames').text()).toContain('REMOVE ME');
            });

            it('should have a hidden Remove button', function() {
                expect($(element).find('.actionButtonDeleteGames').hasClass('ng-hide')).toBe(true);
            });
        });
    });
});
