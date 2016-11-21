describe('EventSelectionFactory', function() {
    'use strict';

    beforeEach(module('brickSlopes'));
    var eventSelectionFactory;

    beforeEach(inject(function(_EventSelectionFactory_) {
        eventSelectionFactory = _EventSelectionFactory_;
    }));

    it('should return the current selected event', function() {
        expect(eventSelectionFactory.getSelectedEvent()).toBe(4);
    });
});
