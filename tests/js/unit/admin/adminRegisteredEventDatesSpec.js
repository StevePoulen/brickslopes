describe('Admin Registered Event Dates', function() {
    'use strict';
    var scope, ctrl, location;
    var mockBackend;

    beforeEach(module('brickSlopes'));

    beforeEach(inject(function($controller, $rootScope, $location, _$httpBackend_) {
        scope = $rootScope.$new();
        ctrl = $controller('adminRegisteredEventDates', {
            $scope: scope
        });

        location = $location;
        mockBackend = _$httpBackend_;
        mockBackend.expectGET('/controllers/admin/eventDates.php?eventId=4').respond(201, window.eventDates['2']);
        mockBackend.flush();
    }));

    it('should redirect to index page', function() {
        scope.closeDialog();
        expect(location.path()).toBe('/admin/index.html');
    });

    it('should have default variables', function() {
        expect(scope.eventDates[0]).toEqual({
            eventDatesId: 1,
            eventId: 2,
            startDate: '2015-05-14 18:00:00Z',
            endDate: '2015-05-15 02:00:00Z',
            type: 'AFOL',
            startDay: 'Thursday, May 14th',
            startTime: '12:00 PM',
            endDay: 'Thursday, May 14th',
            endTime: '8:00 PM'
        });

        expect(scope.data).toEqual(Object({
            startDate: '2015-05-14 18:00:00Z',
            endDate: '2015-05-15 02:00:00Z',
            eventDatesId: 1
        }));

        expect(scope.options).toEqual(Object({
            showWeeks: false,
            hstep: 1,
            mstep: 15,
            isMeridian: true
        }));
    });

    it('should handle a submitDate event', function() {
        scope.data = Object({
            startDate: '2015-05-16 17:00:00Z',
            endDate: '2015-05-17 01:00:00Z',
            eventDatesId: 1
        })

        var expectedPatch = Object({
            startDate: '2015-05-16 17:00:00Z',
            endDate: '2015-05-17 01:00:00Z',
            eventDatesId: 1
        });
        mockBackend.expectPATCH('/controllers/admin/eventDates.php', expectedPatch).respond();
        scope.submitDate();
        mockBackend.flush();

        expect(scope.eventDates[0]).toEqual({
            eventDatesId: 1,
            eventId: 2,
            startDate: '2015-05-16 17:00:00Z',
            endDate: '2015-05-17 01:00:00Z',
            type: 'AFOL',
            startDay: 'Saturday, May 16th',
            startTime: '11:00 AM',
            endDay: 'Saturday, May 16th',
            endTime: '7:00 PM'
        });
    });
});
