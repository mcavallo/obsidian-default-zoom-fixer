.PHONY: list cleanup build_source build_manifest build install
.PHONY: lint lint-fix type-check format format-check check

list:
	@LC_ALL=C $(MAKE) -pRrq -f $(firstword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/(^|\n)# Files(\n|$$)/,/(^|\n)# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | grep -E -v -e '^[^[:alnum:]]' -e '^$@$$'

# Build targets
cleanup:
	bunx rimraf dist

build_source:
	bun build --entry src/main.ts --outdir dist --format cjs --external obsidian

build_manifest:
	bun scripts/build-manifest.ts

build: cleanup build_source build_manifest

install:
	@mkdir -p ~/Documents/Notes/Obsidian/Notes/.obsidian/plugins/zoom-fixer
	@cp -rf dist/* ~/Documents/Notes/Obsidian/Notes/.obsidian/plugins/zoom-fixer/
	@echo "✓ Plugin installed to ~/Documents/Notes/Obsidian/Notes/.obsidian/plugins/zoom-fixer"

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
