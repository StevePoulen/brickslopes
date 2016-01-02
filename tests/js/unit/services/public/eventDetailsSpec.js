describe('service', function() {
    'use strict';
    beforeEach(module('brickSlopes.services'));

    beforeEach(inject(function(_EventSelectionFactory_) {
        spyOn(_EventSelectionFactory_, 'getSelectedEvent').andReturn(2);
    }));

    describe('Event Details', function() {
        describe('Get', function() {
            var mockBackend, service, data, eventId;
            beforeEach(inject(function(_$httpBackend_, EventDetails) {
                mockBackend = _$httpBackend_;
                service = EventDetails;
                mockBackend.expectGET('/controllers/public/event.php?eventId=2').respond(eventDetails);
                var load = service.get(eventId)
                load.then(function(_data) {
                    data = _data;
                });

                mockBackend.flush();
            }));

            it('should get event details name', function() {
                expect(data.name).toBe('BrickSlopes 2015');
            });

            it('should have Event Cost', function() {
                expect(data.costs.eventCost).toBe('65.00');
            });

            it('should have Event Discount', function() {
                expect(data.costs.eventDiscount).toBe('60.00');
            });

            it('should have T-Shirt Cost', function() {
                expect(data.costs.tShirtCost).toBe('20.00');
            });

            it('should have T-Shirt Discount', function() {
                expect(data.costs.tShirtDiscount).toBe('15.00');
            });

            it('should have Meet and Greet Cost', function() {
                expect(data.costs.meetAndGreetCost).toBe('15.00');
            });

            it('should have Meet and Greet Discount', function() {
                expect(data.costs.meetAndGreetDiscount).toBe('10.00');
            });

            it('should have a complete name badge Cost', function() {
                expect(data.costs.completeNameBadgeCost).toBe('10.00');
            });

            it('should have a complete name badge Discount', function() {
                expect(data.costs.completeNameBadgeDiscount).toBe('10.00');
            });

            it('should have a draft one Cost', function() {
                expect(data.costs.draftOneCost).toBe('15.00');
            });

            it('should have a draft one Discount', function() {
                expect(data.costs.draftOneDiscount).toBe('15.00');
            });

            it('should have a draft one Description', function() {
                expect(data.costs.draftOneDescription).toBe('Draft - $15');
            });

            it('should have a draft one draftOneId', function() {
                expect(data.draftOneId).toBe(23);
            });

            it('should have a draft two Cost', function() {
                expect(data.costs.draftTwoCost).toBe('25.00');
            });

            it('should have a draft two Discount', function() {
                expect(data.costs.draftTwoDiscount).toBe('25.00');
            });

            it('should have a draft two Description', function() {
                expect(data.costs.draftTwoDescription).toBe('Draft - $25');
            });

            it('should have a draft two draftTwoId', function() {
                expect(data.draftTwoId).toBe(24);
            });

            it('should have a formatted discount date', function() {
                expect(data.formattedDiscountDate).toBe('March 25th, 2015');
            });
        });
    });
});
