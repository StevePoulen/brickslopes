describe('service', function() {
    'use strict';

    beforeEach(module('brickSlopes'));

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('Get All Feedback', function() {
        var mockBackend, service, data;
        beforeEach(inject(function(_$httpBackend_, Feedback) {
            mockBackend = _$httpBackend_;
            service = Feedback;
            mockBackend.expectGET('/controllers/public/feedback.php').respond(feedback);
        }));

        it('should load all feedback', function() {
            var load = service.get();
            load.then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toEqualData(feedback);
        });
    });

    describe('Create Feedback', function() {
        var mockBackend, service, data, dto;
        beforeEach(inject(function(_$httpBackend_, Feedback) {
            dto = {};
            mockBackend = _$httpBackend_;
            service = Feedback;
            mockBackend.expectPOST('/controllers/public/feedback.php', dto).respond(201);
        }));

        it('should create a user moc', function() {
            var load = service.create(dto);
            load.then(function(_data) {
                data = _data;
            });

            mockBackend.flush();
            expect(data).toEqualData(201);
        });
    });
});
