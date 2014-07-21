'use strict';
var mc = new (require( '../lib/MasterController.js'));
var Page = require('astrolabe').Page;

module.exports = Page.create({
  //context pulls in the protractor config
    signedIn: { writable:true, configurable:true, value:false },
    url: { get: function() { return mc.getBaseUrl() + '/#/afol/index.html' } },
    tab: { get: function() { return element(by.id('t_clickRegistration')) } },
    badgeLine2: { get: function() { return element(by.model('badgeLine2')) } },
    badgeLine3: { get: function() { return element(by.model('badgeLine3')) } },
    comments: { get: function() { return element(by.model('comments')) } },
    submit:   { get: function() { return element(by.css('.formButton')) } },

    waitForPaypal: {
        value: function() {
            var toContinue = true;
            var max = 5;
            var counter = 0;
            while (toContinue && counter < max) {
                console.log(browser.driver.getTitle());
                mc.driver.getTitle().then(function(title) {
                    if (title != 'Choose a way to pay - PayPal') {
                        console.log('sleeping', title);
                        mc.getInstance().sleep(1000);
                    } else {
                        toContinue = false;
                    }
                });
                counter++;
            }
        }
    }
});
