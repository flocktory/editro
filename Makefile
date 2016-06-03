bin = ./node_modules/.bin
checksum = $(bin)/checksum
build_path = build


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



.PHONY: coverage
coverage:
	babel-node ./node_modules/istanbul/lib/cli.js cover ./node_modules/.bin/_mocha -- \
		-t 4000 -r setupUnits.js --compilers coffee:coffee-script/register,js:babel-register \
		--recursive src/**/*.unit.js
