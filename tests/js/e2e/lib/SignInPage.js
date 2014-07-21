'use strict';
var mc = new (require( '../lib/MasterController.js'));
var Page = require('astrolabe').Page;

module.exports = Page.create({
  //context pulls in the protractor config
  signedIn: { writable:true, configurable:true, value:false },
  url: { get: function() { return this.context.params.env.baseUrl + '' } },
  email: { get: function() { return element(by.model('email')) } },
  password: { get: function() { return element(by.model('password')) } },
  submit:   { get: function() { return element(by.css('.formButton')) } },
  builderLogin: { get: function() { return element(by.id('t_clickBuilder'))  }},
  builderLogout: { get: function() { return element(by.id('t_clickLogout'))  }},
    doSignIn: {
        value: function(email, password) {
            this.go();
            this.builderLogin.click().then(function(){});
            mc.validateCurrentUrl('/#/afol/login.html');
            this.email.sendKeys(email);
            this.password.sendKeys(password);
            this.submit.click().then(function(){});
            mc.validateCurrentUrl('/#/afol/index.html');
            return this.signedIn = true;
        }
    },
    doSignOut: {
        value: function() {
            this.builderLogout.click().then(function(){});
            mc.validateCurrentUrl('/#/afol/login.html');
            return this.signedIn = false;
        }
    }
});
