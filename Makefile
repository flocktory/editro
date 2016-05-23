bin = ./node_modules/.bin
checksum = $(bin)/checksum
build_path = build


.PHONY: build
build:
	rm -rf $(build_path)
	NODE_ENV=production BUILD_PATH=$(build_path) $(bin)/webpack
	# Копируем статические файлы
	cp src/flock_push_worker.js $(build_path)/push_worker.js
	cp src/provider.html $(build_path)/provider.html
	# Проставляем хеши файлам
	cat $(build_path)/provider.js | $(checksum) | xargs -I {} sed -i.bak "s|___PROVIDER_HASHED_NAME___|provider.{}.js|g" "$(build_path)/provider.html"
	cat $(build_path)/provider.js | $(checksum) | xargs -I {} mv $(build_path)/provider.js $(build_path)/provider.{}.js
	cat $(build_path)/guerilla.js | $(checksum) | xargs -I {} sed -i.bak "s|___GUERILA_HASHED_NAME___|guerilla.{}.js|g" "$(build_path)/loader.js"
	cat $(build_path)/guerilla.js | $(checksum) | xargs -I {} mv $(build_path)/guerilla.js $(build_path)/guerilla.{}.js
	rm $(build_path)/*.bak
	ls $(build_path)

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
