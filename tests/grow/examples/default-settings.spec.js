/**
 * File: default-settings.spec.js
 * Version: 1.0.0
 * Date: 2025-11-15
 *
 * Synopsis:
 * This test suite validates the behavior of AMP examples when rendered with
 * default settings in the Grow build system. It verifies that the generated
 * HTML maintains proper structure by ensuring there's only one headline element
 * (avoiding duplication from embedded examples) and that code snippets are
 * correctly positioned with appropriate CSS classes immediately following the headline.
 */
'use strict';

require('module-alias/register');

const fs = require('fs');
const cheerio = require('cheerio');
const project = require('@lib/utils/project');
const filePath =
  project.paths.GROW_BUILD_DEST + '/tests/examples/default_settings.html';

describe('config', () => {
  const generatedContent = fs.readFileSync(filePath);
  const $ = cheerio.load(generatedContent);

  it('check headline', () => {
    expect($('h1').length).toBe(
      1,
      'Should only have headline from page and not from example'
    );

    const divAfterHeadline = $('h1').nextAll('div');

    expect(divAfterHeadline.hasClass('ap-m-code-snippet')).toBe(
      true,
      'First div after headline should be the code snipped'
    );
  });
});
