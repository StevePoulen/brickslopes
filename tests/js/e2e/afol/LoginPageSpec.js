'use strict';
var mc = new (require( '../lib/MasterController.js'));
var signInPage = require( '../lib/SignInPage.js');

describe('E2E: login page', function() {
    beforeEach( function() {
        if(signInPage.signedIn) {
            signInPage.doSignOut();
        }
    });

    describe('Login and then logout', function() {
        it('should login with valid credentials', function() {
            expect(signInPage.doSignIn(mc.params.login.primaryUser,mc.params.login.primaryUserPwd)).toBe(true);
            expect(signInPage.signedIn).toBe(true);
            expect(signInPage.doSignOut()).toBe(false);
            expect(signInPage.signedIn).toBe(false);
        });
    });
});

