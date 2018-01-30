describe('feedbackService', function() {
    'use strict';

    var mockBackend, feedbackService, data, dto;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(
        Feedback,
        _$httpBackend_
    ) {
        mockBackend = _$httpBackend_;
        feedbackService = Feedback;
    }));

    describe('Get All Feedback', function() {
        beforeEach(function() {
            mockBackend.expectGET('/controllers/public/feedback.php').respond(window.feedback);
        });

        it('should load all feedback', function() {
            feedbackService.get().then(function(_data_) {
                data = _data_;
            });

            mockBackend.flush();
            expect(data).toEqual(window.feedback);
        });
    });

    describe('Create Feedback', function() {
        beforeEach(function() {
            dto = Object({});
            mockBackend.expectPOST('/controllers/public/feedback.php', dto).respond(201);
        });

        it('should create a user moc', function() {
            feedbackService.create(dto).then(function(_data_) {
                data = _data_;
            });

            mockBackend.flush();
            expect(data).toEqual(201);
        });
    });
});
