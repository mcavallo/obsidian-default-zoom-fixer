#!/usr/bin/env bun

import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT_DIR = import.meta.dir + '/..';
const RESOURCES_DIR = join(ROOT_DIR, 'resources');
const DIST_DIR = join(ROOT_DIR, 'dist');

async function buildManifest() {
  // Read package.json for version
  const packageJson = await Bun.file(join(ROOT_DIR, 'package.json')).json();
  const version = packageJson.version;

  if (!version) {
    throw new Error('No version found in package.json');
  }

  // Read manifest.json
  const manifestPath = join(RESOURCES_DIR, 'manifest.json');
  const manifest = await Bun.file(manifestPath).json();

  // Update version
  manifest.version = version;

  // Ensure dist directory exists
  await mkdir(DIST_DIR, { recursive: true });

  // Write updated manifest to dist
  const outputPath = join(DIST_DIR, 'manifest.json');
  await Bun.write(outputPath, JSON.stringify(manifest, null, 2) + '\n');

  console.log(`✓ Manifest copied to dist/ with version ${version}`);
}

buildManifest().catch((error) => {
  console.error('Failed to build manifest:', error);
  process.exit(1);
});
