/**
 * Copyright 2025 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const signale = require('signale');

/**
 * Bootstrap orphan files for development environment.
 * These files are normally generated during the build process but are needed
 * for the development server to start. This script copies bootstrap versions
 * from the _orphans directory to their proper locations.
 */
function bootstrapOrphans() {
  const orphansDir = path.join(__dirname, '../../_orphans');

  // Define the mapping of orphan files to their destination paths
  const fileMappings = [
    {
      src: path.join(orphansDir, 'componentSamples.json'),
      dest: path.join(__dirname, '../../pages/shared/data/componentSamples.json'),
      description: 'Component samples mapping'
    },
    {
      src: path.join(orphansDir, 'samples.json'),
      dest: path.join(__dirname, '../../examples/static/samples/samples.json'),
      description: 'Samples metadata'
    }
  ];

  signale.info('Bootstrapping orphan files for development environment...');

  let copiedCount = 0;
  let skippedCount = 0;

  for (const mapping of fileMappings) {
    try {
      // Check if source file exists
      if (!fs.existsSync(mapping.src)) {
        signale.warn(`Orphan file not found: ${path.basename(mapping.src)}`);
        continue;
      }

      // Check if destination already exists
      if (fs.existsSync(mapping.dest)) {
        signale.debug(`Skipping ${mapping.description}: file already exists`);
        skippedCount++;
        continue;
      }

      // Ensure destination directory exists
      const destDir = path.dirname(mapping.dest);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      // Copy the file
      fs.copyFileSync(mapping.src, mapping.dest);
      signale.success(`Copied ${mapping.description}`);
      copiedCount++;
    } catch (error) {
      signale.error(`Failed to copy ${mapping.description}: ${error.message}`);
    }
  }

  if (copiedCount > 0) {
    signale.complete(`Bootstrapped ${copiedCount} orphan file(s)`);
  }
  if (skippedCount > 0) {
    signale.info(`Skipped ${skippedCount} existing file(s)`);
  }
  if (copiedCount === 0 && skippedCount === 0) {
    signale.info('No orphan files needed to be bootstrapped');
  }
}

module.exports = {
  bootstrapOrphans
};
