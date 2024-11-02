.PHONY: all version play build test dist clean

all: clean build test

version:
	git describe --tags
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
	rm -rfv dist/cedarscript_*.whl dist/cedarscript_*.tar.gz target/
	rm -rfv src/cedarscript_*.egg-info src/cedarscript_*/lib*.{so,dylib,dll}

