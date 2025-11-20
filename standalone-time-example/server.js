/**
 * Standalone Express server with time API
 *
 * This is an isolated instance of the time API example from amp.dev
 * demonstrating Express + API endpoint pattern.
 */
'use strict';

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Time API endpoint
app.get('/api/time', (request, response) => {
  // Set no-cache headers
  response.set({
    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  response.json({
    time: new Date().toLocaleTimeString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Standalone time example running at http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/time`);
});
