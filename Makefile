FIND_SCSS_SOURCES=find scss -name \*.scss

dist/style.css: $(shell $(FIND_SCSS_SOURCES))
	sassc scss/index.scss dist/style.css

FIND_SOURCES=find src -name \*.js

locales.po: $(shell $(FIND_SOURCES))
	@echo Collect keys
	@$(FIND_SOURCES) | \
		xgettext --from-code=UTF-8 --language=JavaScript \
		-kt:1,2t -kt:1c,2,3t \
		-ktp:1,2,4t -ktp:1c,2,3,5t \
		--default-domain english \
		--output-dir=./ \
		--add-comments \
		-o en-US.po \
		-f -;
