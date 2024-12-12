.PHONY: all dist d play p clean c version v install i test t build b

ci: clean build install test

all: ci version

dist d: all
	scripts/check-version.sh
	# Win MSYS2 support: force config file location
	twine upload $$(test -e ~/.pypirc && echo '--config-file ~/.pypirc') dist/*

play p:
	echo y | ./build.sh

clean c:
	rm -rfv out dist target build/bdist.* src/*.egg-info src/cedarscript_*/lib*.{so,dylib,dll}

version v:
	git describe --tags ||:
	python -m setuptools_scm

install i:
	pip install --upgrade --force-reinstall -e .\
	&& pip show cedarscript-grammar

test t:
	pytest --cov=src/cedarscript_grammar tests/ --cov-report term-missing

build b:
	echo n | ./build.sh
	# SETUPTOOLS_SCM_PRETEND_VERSION=0.0.1
	python -m build
