bin = ./node_modules/.bin

.PHONY: build
build:
	NODE_ENV=production $(bin)/webpack -p

.PHONY: install
install:
	npm install

.PHONY: lint
lint:
	$(bin)/eslint src

.PHONY: test
test:
	$(bin)/mocha -r setupUnits.js --compilers js:babel-register --recursive src/**/*.unit.js


.PHONY: test-w
test-w:
	@make test || true
	@fswatch -r0 ./src | xargs -0 -n1 -I{} make test

