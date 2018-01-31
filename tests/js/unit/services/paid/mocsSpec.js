describe('mocDetailsService', function() {
    'use strict';

    var mockBackend, mocDetailsService, data, mockWindow, dto;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(
        _$httpBackend_,
        _MocDetails_,
        _$window_
    ) {
        mockBackend = _$httpBackend_;
        mocDetailsService = _MocDetails_;
        mockWindow = _$window_;
    }));

    describe('MocDetails', function() {
        beforeEach(function() {
            mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(window.mocs);
        });

        it('should load registered afol moc list count', function() {
            mocDetailsService.getCount(2).then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toBe(3);
        });

        it('should load registered afol moc list count', function() {
            mocDetailsService.getList(2).then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toEqual(window.mocs);
        });

        it('should load an individuals afol moc list', function() {
            mockWindow.sessionStorage.userId = 2;
            mocDetailsService.getListByUserId(2).then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toEqual(window.userTwoMoc);
        });

        it('should load individual afol moc list count', function() {
            mockWindow.sessionStorage.userId = 2;
            mocDetailsService.getCountByUser(2).then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toBe(1);
        });

        it('should load individual moc', function() {
            mockWindow.sessionStorage.userId = 1;
            mocDetailsService.getMocById(3).then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data.title).toBe("Corey's Castle");
        });

        it('should return undefined if the moc is not found', function() {
            mockWindow.sessionStorage.userId = 2;
            mocDetailsService.getMocById(3).then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toBeUndefined();
        });

        it('should return undefined if the moc is not found', function() {
            mockWindow.sessionStorage.userId = 2;
            mocDetailsService.getMocById(3).then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toBeUndefined();
        });
    });

    describe('Create Moc', function() {
        beforeEach(function() {
            dto = Object({});
            mockBackend.expectPOST('/controllers/paid/mocs.php', dto).respond(201);
        });

        it('should create a user moc', function() {
            mocDetailsService.create(dto).then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toBe(201);
        });
    });

    describe('Update Moc', function() {
        beforeEach(function() {
            dto = Object({});
            mockBackend.expectPATCH('/controllers/paid/mocs.php', dto).respond();
        });

        it('should update a user moc', function() {
            mocDetailsService.update(dto).then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toBe(200);
        });
    });

    describe('MocDetails Cached', function() {
        beforeEach(function() {
            mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(window.mocs);
        });

        it('should only call the api once with the cache enabled', function() {
            mocDetailsService.getCount(2).then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toBe(3);

            mocDetailsService.getCount(2);

            var flushError = false;
            try {
                mockBackend.flush();
            } catch (err) {
                flushError = true;
            }

            expect(flushError).toBe(true);
        });

        it('should only call the api twice with the cache disabled', function() {
            mocDetailsService.getCount(2).then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toBe(3);

            mocDetailsService.getCount(2);
            var flushError = false;
            try {
                mockBackend.flush();
            } catch (err) {
                flushError = true;
            }

            expect(flushError).toBe(true);

            mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(window.mocs);
            mocDetailsService.expireCache(2);
            mockBackend.flush();
        });
    });
});
