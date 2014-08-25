brickslopes
===========

The website for BrickSlopes, A LEGO Fan Event

Installation for coding and testing
===================================

`$ npm install`
`$ make compass_compile`

Installation of the local environment
=====================================

# `$ cp config/config_template.php config/config.php `
# Edit the file

Compass
=======
`$ compass compile`

`$ compass watch`

Unit Tests
=========

# All Tests
`$ npm test`

# js and lint Tests with autoWatch: true
`$ make js_test`

# php Tests
`$ make php_test`

# e2e Tests
`$ make e2e_test`

# e2e Tests Suites
`$ make e2e_test_suite SUITE=<suite_name>`

# css Tests
`$ make css_test`

Configure Local Mail Sending on a Mac for email testing
=======================================================
http://blog.anupamsg.me/2012/02/14/enabling-postfix-for-outbound-relay-via-gmail-on-os-x-lion-11/

Simply follow all the instructions and you will be able to send e-mails
