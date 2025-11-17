.PHONY: help

help:
	@echo "Available targets:"
	@awk -F: "/^[a-zA-Z0-9_-]+:/ {target = \$$1; deps = \$$2; gsub(/^[ \t]+|[ \t]+$$/, \"\", deps); if (deps != \"\") {print target \" (\" deps \")\"} else {print target}}" Makefile | grep -v '^#' | grep -v '^\.'

# --------------------------------
# Build targets
# --------------------------------

cleanup:
	bunx rimraf dist

build_source:
	bun scripts/build-source.ts

build_manifest:
	bun scripts/build-manifest.ts

build: cleanup build_source build_manifest

install:
	$(eval VAULT := $(or $(VAULT_PATH),./test/vault))
	$(eval PLUGIN_DIR := $(VAULT)/.obsidian/plugins/default-zoom-fixer)
	@mkdir -p $(PLUGIN_DIR)
	@cp -rf dist/* $(PLUGIN_DIR)/
	@echo "✓ Plugin installed to $(PLUGIN_DIR)"

# --------------------------------
# Linting and formatting targets
# --------------------------------

lint:
	bunx eslint .

lint-fix:
	bunx eslint . --fix

type-check:
	bunx tsc --noEmit

format:
	bunx prettier --write .

format-check:
	bunx prettier --check .

check: type-check lint format-check

# --------------------------------
# Testing targets
# --------------------------------

test:
	bun test

test-watch:
	bun test --watch

test-coverage:
	bun test --coverage

# --------------------------------
# Release targets
# --------------------------------

release:
	bunx semantic-release
