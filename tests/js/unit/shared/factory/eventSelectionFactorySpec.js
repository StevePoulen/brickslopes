describe('EventSelectionFactory', function() {
    'use strict';

    var eventSelectionFactory;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function(_EventSelectionFactory_) {
        eventSelectionFactory = _EventSelectionFactory_;
    }));

    it('should return the current selected event', function() {
        expect(eventSelectionFactory.getSelectedEvent()).toBe(2);
    });
});
