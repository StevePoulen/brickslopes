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
    submit:   { get: function() { return element(by.css('.formButton')) } }
});
