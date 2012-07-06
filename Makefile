REPORTER = spec
TESTS = test/*.js

test:
	@NODE_ENV=test mocha \
		--reporter $(REPORTER) \
		--ui bdd \
		--timeout 500000 \
		--growl \
		$(TESTS)

.PHONY: test
