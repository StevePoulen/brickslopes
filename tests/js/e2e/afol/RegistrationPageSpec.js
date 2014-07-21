'use strict';
var mc = new (require( '../lib/MasterController.js'));
var registrationPage = require( '../lib/RegisrationPage.js');

describe('E2E: login page', function() {
    beforeEach( function() {
        browser.driver.manage().window().maximize();
        mc.signedIn();
    });

    describe('Registration', function() {
        it('should register a new user', function() {
            registrationPage.tab.click().then(function(){});
            mc.validateCurrentUrl('/#/afol/2/eventRegistration.html');
            registrationPage.badgeLine2.sendKeys('Mr. Business');
            registrationPage.badgeLine3.sendKeys('Everything is Awesome');
            registrationPage.comments.sendKeys('Thank you');
            registrationPage.submit.click().then(function(){});
            mc.validateCurrentUrl('/#/afol/eventPayment.html');
            registrationPage.submit.click().then(function(){
                mc.getInstance().sleep(5000);
            });
            mc.validateCurrentTitle('Choose a way to pay - PayPal');
        });
    });
});
