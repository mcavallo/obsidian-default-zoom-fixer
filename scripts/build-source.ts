#!/usr/bin/env bun

import { join } from 'node:path';

const ROOT_DIR = import.meta.dir + '/..';
const packageJson = await Bun.file(join(ROOT_DIR, 'package.json')).json();

const result = await Bun.build({
  entrypoints: ['./src/main.ts'],
  outdir: './dist',
  format: 'cjs',
  external: ['obsidian'],
  minify: true,
  banner: `/*!
 * Default Zoom Fixer for Obsidian
 * Copyright (c) ${new Date().getFullYear()} Mariano Cavallo
 *
 * Source code available at: ${packageJson.repository}
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */`,
});

if (!result.success) {
  console.error('Build failed:');
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

console.log('✓ Source built successfully');
