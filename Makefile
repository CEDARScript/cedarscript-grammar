.PHONY: all dist d play p clean c version v install i test t build b

all: clean build install test version

dist d: all
	scripts/check-version.sh
	twine upload dist/*

play p:
	echo y | ./build.sh

clean c:
	rm -rfv dist/cedarscript_*.whl dist/cedarscript_*.tar.gz target/
	rm -rfv src/cedarscript_*.egg-info src/cedarscript_*/lib*.{so,dylib,dll}

version v:
	git describe --tags ||:
	python -m setuptools_scm

install i:
	pip install --upgrade --force-reinstall -e .

test t:
	pytest --cov=src/cedarscript_grammar tests/ --cov-report term-missing

build b:
	echo n | ./build.sh
	# SETUPTOOLS_SCM_PRETEND_VERSION=0.0.1
	python -m build
