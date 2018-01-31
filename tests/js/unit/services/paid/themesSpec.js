describe('service', function() {
    'use strict';
    beforeEach(module('brickSlopes'));

    describe('Themes', function() {
        describe('Get', function() {
            var mockBackend, service, data;
            beforeEach(inject(function(_$httpBackend_, Themes) {
                mockBackend = _$httpBackend_;
                service = Themes;
                mockBackend.expectGET('/controllers/paid/themes.php?eventId=2').respond(201, window.themes);
            }));

            it('should get a list of themes and awards for an event', function() {
                var load = service.getList();

                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data[0].theme).toBe('Adventure');
            });

            it('should load the game list count', function() {
                var load = service.getCount();
                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(5);
            });

            it('should load individual moc by theme', function() {
                service.getThemeObject('Castle').then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data.theme).toBe('Castle');
            });
        });
    });
});
