.PHONY: all version play build test dist clean

all: build test

version:
	python -m setuptools_scm

play:
	echo y | ./build.sh

build:
	echo n | ./build.sh
	python -m setuptools_scm

test:
	pytest --cov=src/cedarscript_grammar tests/ --cov-report term-missing

dist: build test
	scripts/check-version.sh
	rm -rf dist/
	python -m build && twine upload dist/*
clean:
	rm -rf target/
	rm -f src/cedarscript_grammar/lib*.{so,dylib,dll}
	rm -f /dist/
