JSCS_PATH = ./node_modules/.bin/jscs
CSSLINT_PATH = ./node_modules/.bin/csslint
KARMA_PATH = ./node_modules/.bin/karma
KARMA_CONFIG = ./tests/js/fixtures/karma.conf.js
KARMA_AUTO_WATCH_CONFIG = ./tests/js/fixtures/karma_auto_watch.conf.js
PROTRACTOR_PATH = ./node_modules/.bin/protractor
PROTRACTOR_CONFIG = ./tests/js/fixtures/protractorConf.js

# Performs code governance (lint + style) test
lint:
	@$(JSCS_PATH) ./app/js/*
	@$(JSCS_PATH) ./tests/js/unit/*

# Performs code governance (lint + style) test for css
csslint:
	@$(CSSLINT_PATH) ./app/css/*

# Performs JavaScript unit tests
unit_js:
	@$(KARMA_PATH) start $(KARMA_CONFIG) $*

unit_auto_watch_js:
	@$(KARMA_PATH) start $(KARMA_AUTO_WATCH_CONFIG) $*

# Performs JavaScript end-to-end tests
e2e_js:
	@$(PROTRACTOR_PATH) $(PROTRACTOR_CONFIG)

# Performs PHP unit tests
unit_php:
	phpunit

# Performs compass builds
compass_compile:
	compass compile

# Run all test targets
test:
	@make unit_php
	#@make csslint
	@make lint
	@make unit_js
	@make e2e_js

js_test:
	@make lint
	@make unit_auto_watch_js

e2e_test:
	@make e2e_js

php_test:
	@make unit_php

css_test:
	@make csslint

# Ignore directory structure
.PHONY: lint unit tests
