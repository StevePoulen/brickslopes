JSCS_PATH = ./node_modules/.bin/jscs
KARMA_PATH = ./node_modules/.bin/karma
KARMA_CONFIG = ./tests/js/fixtures/karma.conf.js

# Performs code governance (lint + style) test
lint:
	@$(JSCS_PATH) ./app/js/*
	@$(JSCS_PATH) ./tests/js/unit/*

# Performs JavaScript unit tests
unit_js:
	@$(KARMA_PATH) start $(KARMA_CONFIG) $*

# Performs PHP unit tests
unit_php:
	phpunit

# Performs compass builds
compass_compile:
	compass compile

# Run all test targets
test:
	@make unit_php
	@make lint
	@make unit_js

js_test:
	@make lint
	@make unit_js

php_test:
	@make unit_php

# Ignore directory structure
.PHONY: lint unit tests
