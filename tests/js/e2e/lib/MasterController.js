'use strict';

var MasterController = function() {
  init: {
    this.protractor = require('protractor');
    this.loadProtractorParams();
    this.signInPage = require('./SignInPage');
    this.ptor = this.protractor.getInstance();
    this.setDriver();
    this.setBrowserWindow();
  }
}

MasterController.prototype = {
    setBrowserWindow: function() {
        var width = 1440;
        var height = 900;
        browser.driver.manage().window().setSize(width, height);
    },
    loadProtractorParams: function() {
        this.params = browser.params;
    },

    getInstance: function() {
        return this.ptor;
    },

    validateCurrentTitle: function(expectTitle) {
        var self = this;
        this.driver.getTitle().then(function(title) {
            expect(expectTitle).toBe(title);
        });
    },

    validateCurrentUrl: function(expectUrl) {
        var self = this;
        this.ptor.getCurrentUrl().then(function(newUrl) {
            expect(self.getBaseUrl() + expectUrl).toBe(newUrl);
        });
    },

    waitForAngular: function() {
        this.ptor.waitForAngular();
    },

    setDriver: function() {
        this.driver = this.ptor.driver;
    },

    signedIn: function() {
        if(! this.signInPage.signedIn) {
            this.signInPage.doSignIn(this.params.login.primaryUser, this.params.login.primaryUserPwd);
        }
    },

    getBaseUrl: function() {
        return this.params.env.baseUrl;
    },

    signOut: function() {
        this.signInPage.doSignOut();
    },
};

module.exports = MasterController;
