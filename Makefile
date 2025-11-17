.PHONY: help

help:
	@echo "Available targets:"
	@awk -F: "/^[a-zA-Z0-9_-]+:/ {target = \$$1; deps = \$$2; gsub(/^[ \t]+|[ \t]+$$/, \"\", deps); if (deps != \"\") {print target \" (\" deps \")\"} else {print target}}" Makefile | grep -v '^#' | grep -v '^\.'

# Build targets
cleanup:
	bunx rimraf dist

build_source:
	bun build --entry src/main.ts --outdir dist --format cjs --external obsidian

build_manifest:
	bun scripts/build-manifest.ts

build: cleanup build_source build_manifest

install:
	@mkdir -p ./test/vault/.obsidian/plugins/default-zoom-fixer
	@cp -rf dist/* ./test/vault/.obsidian/plugins/default-zoom-fixer/
	@echo "✓ Plugin installed to ./test/vault/.obsidian/plugins/default-zoom-fixer"

# Linting and formatting targets
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

# Run all checks (type-check, lint, format)
check: type-check lint format-check

# Testing targets
test:
	bun test

test-watch:
	bun test --watch

test-coverage:
	bun test --coverage
