describe('themesService', function() {
    'use strict';
    beforeEach(module('brickSlopes'));
    var mockBackend, themesService, data;

    describe('Themes', function() {
        describe('Get', function() {
            beforeEach(inject(function(
                _$httpBackend_,
                _Themes_
            ) {
                mockBackend = _$httpBackend_;
                themesService = _Themes_;
                mockBackend.expectGET('/controllers/paid/themes.php?eventId=2').respond(window.themes);
            }));

            it('should get a list of themes and awards for an event', function() {
                themesService.getList().then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data[0].theme).toBe('Adventure');
            });

            it('should load the game list count', function() {
                themesService.getCount().then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(5);
            });

            it('should load individual moc by theme', function() {
                themesService.getThemeObject('Castle').then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data.theme).toBe('Castle');
            });
        });
    });
});
