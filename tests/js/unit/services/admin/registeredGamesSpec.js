describe('Factory', function() {
    'use strict';

    var mockBackend, registeredGamesService, data;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(
        _$httpBackend_,
        _RegisteredGames_
    ) {
        mockBackend = _$httpBackend_;
        registeredGamesService = _RegisteredGames_;
    }));

    describe('Registered Games', function() {
        describe('Get', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/admin/registeredGames.php?eventId=2').respond(window.registeredGames);
            });

            it('should load registered games count', function() {
                registeredGamesService.getCount(2).then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toBe(3);
            });

            it('should get all of the registered games', function() {
                registeredGamesService.get(2).then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqual(window.registeredGames);
            });
        });

        describe('Get - No Games', function() {
            beforeEach(function() {
                mockBackend.expectGET('/controllers/admin/registeredGames.php?eventId=2').respond([]);
            });

            it('should load registered games count', function() {
                registeredGamesService.getCount(2).then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqual(0);
            });

            it('should get all of the registered games', function() {
                registeredGamesService.get(2).then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
                expect(data).toEqual([]);
            });
        });
    });
});
