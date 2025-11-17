# Default Zoom Fixer for Obsidian

Fixes Obsidian's broken zoom‑level persistence on Linux (e.g. under XWayland or Wayland). Many users report that Obsidian's default zoom resets to 100% on restart, especially on Wayland/X11 setups. This plugin forces and remembers your preferred zoom level reliably.

![Settings](.github/docs/settings.png)

## Installing

1. Open the Obsidian **Settings** and go to **Community Plugins**
2. Click **Turn on community plugins** to enable the use of custom plugins
3. Click the **Browse** button to open the community plugins search
4. Search for `Default Zoom Fixer`, select it and click the **Install** button
5. You will find `Default Zoom Fixer` in your list of **Current plugins**. Switch the toggle to enable the plugin.

## Building

If you'd like to build the plugin yourself follow these instructions. This plugin uses TypeScript and Bun. You will need [Bun](https://bun.sh) installed in order to build it.

### Build

```sh
bun install
make build
```

### Install to vault

```sh
VAULT_PATH=/path/to/vault make install
```

Or manually:

```sh
mkdir -p /path/to/vault/.obsidian/plugins/default-zoom-fixer
cp -r dist/* /path/to/vault/.obsidian/plugins/default-zoom-fixer/
```

After installing the plugin files, restart Obsidian.
