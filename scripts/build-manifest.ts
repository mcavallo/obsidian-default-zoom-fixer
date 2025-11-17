#!/usr/bin/env bun

import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT_DIR = import.meta.dir + '/..';
const DIST_DIR = join(ROOT_DIR, 'dist');

async function writeManifest(path: string, manifest: any): Promise<void> {
  await Bun.write(path, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`✓ Manifest written to ${path} with version ${manifest.version}`);
}

async function buildManifest() {
  // Read package.json for version
  const packageJson = await Bun.file(join(ROOT_DIR, 'package.json')).json();
  const version = packageJson.version;

  if (!version) {
    throw new Error('No version found in package.json');
  }

  // Read manifest.json and set the new version
  const manifestPath = join(ROOT_DIR, 'manifest.json');
  const manifest = await Bun.file(manifestPath).json();

  // Update version
  manifest.version = version;

  // Ensure dist directory exists
  await mkdir(DIST_DIR, { recursive: true });

  // Write updated manifest to dist and root
  await writeManifest(join(DIST_DIR, 'manifest.json'), manifest);
  await writeManifest(manifestPath, manifest);
}

buildManifest().catch((error) => {
  console.error('Failed to build manifest:', error);
  process.exit(1);
});
