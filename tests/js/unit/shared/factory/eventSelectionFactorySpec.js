'use strict';
describe('EventSelectionFactory', function() {
    beforeEach(module('BrickSlopesShared'));
    var eventSelectionFactory;

    beforeEach(inject(function(_EventSelectionFactory_) {
        eventSelectionFactory = _EventSelectionFactory_;
    }));

    it('should return the current selected event', function() {
        expect(eventSelectionFactory.getSelectedEvent()).toBe(3);
    });
});
