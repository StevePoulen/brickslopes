'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {
    beforeEach(
        module(
            'app/partials/afol/eventThemesDirective.html',
            'brickSlopes.directives'
        )
    );

    var scope, element;

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('bsTheme', function() {
        var template;
        beforeEach(inject(function($compile, $rootScope, $templateCache) {
            var template = $templateCache.get('app/partials/afol/eventThemesDirective.html');
            $templateCache.put('partials/afol/eventThemesDirective.html', template);
            scope = $rootScope.$new();
            scope.theme = {
                'theme': 'Brian',
                'awards': [
                    {
                        'award': 'Pilati',
                        'place': 2
                    },
                    {
                        'award': 'Ogel',
                        'place': 1
                    }
                ]
            };
            element = angular.element('<bs-theme></bs-theme>');
            $compile(element)(scope);
            scope.$digest();
        }));

        it('should have Theme text', function() {
            expect($(element.find('div')[0]).html()).toContain('Brian');
        });

        it('should have Award text', function() {
            expect($(element.find('li')[0]).html()).toBe('Ogel');
        });

        it('should have Award text', function() {
            expect($(element.find('li')[1]).html()).toBe('Pilati');
        });
    });
});
