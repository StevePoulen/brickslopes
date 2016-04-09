describe('directives', function() {
    'use strict';
    var scope, element;

    beforeEach(module('brickSlopes.directives'));

    describe('bsTheme', function() {
        beforeEach(inject(function($compile, $rootScope, $templateCache) {
            var template = $templateCache.get('app/partials/paid/eventThemesDirective.html');
            $templateCache.put('partials/paid/eventThemesDirective.html', template);
            scope = $rootScope.$new();
            scope.theme = {
                theme: 'Brian',
                selectable: 'YES',
                awards: [
                    {
                        award: 'Pilati',
                        place: 2
                    },
                    {
                        award: 'Ogel',
                        place: 1
                    }
                ]
            };
            element = angular.element('<bs-theme color="red"></bs-theme>');
            $compile(element)(scope);
            scope.$digest();
        }));

        it('should have a color scope variable', function() {
            expect(scope.color).toContain('red');
        });

        it('should have Theme text', function() {
            expect($(element.find('div')[0]).html()).toContain('Brian');
        });

        it('should have Award text', function() {
            expect($(element.find('div')[1]).html()).toContain('Ogel');
        });

        it('should have Award text', function() {
            expect($(element.find('div')[3]).html()).toContain('Pilati');
        });
    });
});
