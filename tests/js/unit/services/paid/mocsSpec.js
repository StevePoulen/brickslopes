describe('service', function() {
    'use strict';
    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(_EventSelectionFactory_) {
        spyOn(_EventSelectionFactory_, 'getSelectedEvent').andReturn(2);
    }));

    describe('MocDetails', function() {
        var mockBackend, service, data, window;
        beforeEach(inject(function(_$httpBackend_, MocDetails, $window) {
            mockBackend = _$httpBackend_;
            service = MocDetails;
            window = $window;
            mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(mocs);
        }));

        it('should load registered afol moc list count', function() {
            var load = service.getCount(2);
            load.then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toBe(3);
        });

        it('should load registered afol moc list count', function() {
            var load = service.getList(2);
            load.then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toEqual(mocs);
        });

        it('should load an individuals afol moc list', function() {
            window.sessionStorage.userId = 2;
            var load = service.getListByUserId(2);
            load.then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toEqual(userTwoMoc);
        });

        it('should load individual afol moc list count', function() {
            window.sessionStorage.userId = 2;
            var load = service.getCountByUser(2);
            load.then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toBe(1);
        });

        it('should load individual moc', function() {
            window.sessionStorage.userId = 1;
            service.getMocById(3).then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data.title).toBe("Corey's Castle");
        });

        it('should return undefined if the moc is not found', function() {
            window.sessionStorage.userId = 2;
            service.getMocById(3).then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toBeUndefined();
        });

        it('should return undefined if the moc is not found', function() {
            window.sessionStorage.userId = 2;
            service.getMocById(3).then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toBeUndefined();
        });
    });

    describe('Create Moc', function() {
        var mockBackend, service, data, dto;
        beforeEach(inject(function(_$httpBackend_, MocDetails) {
            dto = {};
            mockBackend = _$httpBackend_;
            service = MocDetails;
            mockBackend.expectPOST('/controllers/paid/mocs.php', dto).respond(201);
        }));

        it('should create a user moc', function() {
            var load = service.create(dto);
            load.then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toBe(201);
        });
    });

    describe('Update Moc', function() {
        var mockBackend, service, data, dto;
        beforeEach(inject(function(_$httpBackend_, MocDetails) {
            dto = {};
            mockBackend = _$httpBackend_;
            service = MocDetails;
            mockBackend.expectPATCH('/controllers/paid/mocs.php', dto).respond(200);
        }));

        it('should update a user moc', function() {
            var load = service.update(dto);
            load.then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toBe(200);
        });
    });

    describe('MocDetails Cached', function() {
        var mockBackend, service, data, window;
        beforeEach(inject(function(_$httpBackend_, MocDetails, $window) {
            mockBackend = _$httpBackend_;
            service = MocDetails;
            window = $window;
            mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(mocs);
        }));

        it('should only call the api once with the cache enabled', function() {
            var load = service.getCount(2);
            load.then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toBe(3);

            var load = service.getCount(2);
            var flushError = false;
            try {
                mockBackend.flush();
            } catch (err) {
                flushError = true;
            }

            expect(flushError).toBe(true);
        });

        it('should only call the api twice with the cache disabled', function() {
            var load = service.getCount(2);
            load.then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toBe(3);

            var load = service.getCount(2);
            var flushError = false;
            try {
                mockBackend.flush();
            } catch (err) {
                flushError = true;
            }

            expect(flushError).toBe(true);

            mockBackend.expectGET('/controllers/paid/mocs.php?eventId=2').respond(mocs);
            service.expireCache(2);
            mockBackend.flush();
        });
    });

});
