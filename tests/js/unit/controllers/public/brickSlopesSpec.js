'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
    var window;
    beforeEach (
        module (
            'brickSlopes.controllers'
        )
    );

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    describe('brickslopes', function() {
        beforeEach(inject(function(_$window_) {
            window = _$window_;
            storeSession(window, sessionData);
        }));

        afterEach(function() {
            deleteSession(window);
        });

        describe('BrickSlopes storeSession', function() {
            it('should have an undefined token', function() {
                expect(window.sessionStorage.token).toBe('1234567890');
            });

            it('should have an undefined firstName', function() {
                expect(window.sessionStorage.firstName).toBe('Ember');
            });

            it('should have an undefined lastName', function() {
                expect(window.sessionStorage.lastName).toBe('Pilati');
            });

            it('should have an undefined Admin', function() {
                expect(window.sessionStorage.admin).toBe('NO');
            });

            it('should have an undefined Registered', function() {
                expect(window.sessionStorage.registered).toBe('YES');
            });

            it('should have an undefined userId', function() {
                expect(window.sessionStorage.userId).toBe('080898');
            });

            it('should have an undefined paid', function() {
                expect(window.sessionStorage.paid).toBe('YES');
            });
        });

        describe('BrickSlopes deleteSession', function() {
            it('should have an undefined token', function() {
                deleteSession(window);
                expect(window.sessionStorage.token).toBeUndefined();
            });

            it('should have an undefined firstName', function() {
                deleteSession(window);
                expect(window.sessionStorage.firstName).toBeUndefined();
            });

            it('should have an undefined lastName', function() {
                deleteSession(window);
                expect(window.sessionStorage.lastName).toBeUndefined();
            });

            it('should have an undefined Admin', function() {
                deleteSession(window);
                expect(window.sessionStorage.admin).toBeUndefined();
            });

            it('should have an undefined Registered', function() {
                deleteSession(window);
                expect(window.sessionStorage.registered).toBeUndefined();
            });

            it('should have an undefined paid', function() {
                deleteSession(window);
                expect(window.sessionStorage.paid).toBeUndefined();
            });

            it('should have an undefined userId', function() {
                deleteSession(window);
                expect(window.sessionStorage.userId).toBeUndefined();
            });
        });

        describe('BrickSlopes deleteSession if jwt data is missing', function() {
            it('should have an undefined token', function() {
                expect(window.sessionStorage.token).toBe('1234567890');
                storeSession(window, {token: '1234567890'});
                expect(window.sessionStorage.token).toBeUndefined();
            });

            it('should have an undefined firstName', function() {
                expect(window.sessionStorage.firstName).toBe('Ember');
                storeSession(window, {firstName: 'Ember'});
                expect(window.sessionStorage.firstName).toBeUndefined();
            });

            it('should have an undefined lastName', function() {
                expect(window.sessionStorage.lastName).toBe('Pilati');
                storeSession(window, {lastName: 'Ember'});
                expect(window.sessionStorage.lastName).toBeUndefined();
            });

            it('should have an undefined Admin', function() {
                expect(window.sessionStorage.admin).toBe('NO');
                storeSession(window, {admin: 'NO'});
                expect(window.sessionStorage.admin).toBeUndefined();
            });

            it('should have an undefined Registered', function() {
                expect(window.sessionStorage.registered).toBe('YES');
                storeSession(window, {registered: 'YES'});
                expect(window.sessionStorage.registered).toBeUndefined();
            });

            it('should have an undefined paid', function() {
                expect(window.sessionStorage.paid).toBe('YES');
                storeSession(window, {paid: 'YES'});
                expect(window.sessionStorage.paid).toBeUndefined();
            });

            it('should have an undefined userId', function() {
                expect(window.sessionStorage.userId).toBe('080898');
                storeSession(window, {userId: '051675'});
                expect(window.sessionStorage.userId).toBeUndefined();
            });
        });
    });
});
