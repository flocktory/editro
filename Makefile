FIND_SCSS_SOURCES=find scss -name \*.scss

dist/style.css: $(shell $(FIND_SCSS_SOURCES))
	sassc scss/index.scss lib/style.css
