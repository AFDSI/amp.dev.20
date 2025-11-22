/**
 * Copyright 2024 The AMP HTML Authors. All Rights Reserved.
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

/**
 * Returns URL query parameters as JSON for amp-state initialization.
 * This enables client-side filtering on statically hosted pages.
 *
 * Used by the category filter on /documentation/components/ and similar pages.
 */
exports.handler = async (event) => {
  const params = event.queryStringParameters || {};

  // Normalize and return filter parameters
  const response = {
    category: (params.category || '').toLowerCase().trim(),
    format: (params.format || 'websites').toLowerCase().trim(),
    level: (params.level || 'beginner').toLowerCase().trim(),
  };

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
    body: JSON.stringify(response),
  };
};
