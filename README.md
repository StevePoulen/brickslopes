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

# css Tests
`$ make css_test`
