.PHONY: all play p clean c build b test t install i dist d version v

all: clean build test install version

version v:
	git describe --tags ||:
	python -m setuptools_scm

play p:
	echo y | ./build.sh

install i:
	pip install --upgrade --force-reinstall -e .

build b:
	echo n | ./build.sh
	# SETUPTOOLS_SCM_PRETEND_VERSION=0.0.1
	python -m build

test t:
	pytest --cov=src/cedarscript_grammar tests/ --cov-report term-missing

dist d: clean test build
	scripts/check-version.sh
	twine upload dist/*

clean c:
	rm -rfv dist/cedarscript_*.whl dist/cedarscript_*.tar.gz target/
	rm -rfv src/cedarscript_*.egg-info src/cedarscript_*/lib*.{so,dylib,dll}
