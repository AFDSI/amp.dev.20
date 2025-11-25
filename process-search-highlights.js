/**
 * Process search-promoted-pages files for dev server
 * Mimics the staticify task processing
 */

const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, 'dist/static/files/search-promoted-pages');
const outputDir = path.join(__dirname, 'pages/static/search/highlights');

// Base URL for development environment
const BASE_URL = 'http://localhost:8080';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get list of JSON files
const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.json'));

console.log(`Processing ${files.length} search highlight files...`);

files.forEach(filename => {
  const inputPath = path.join(inputDir, filename);
  const outputPath = path.join(outputDir, filename);

  // Read and parse JSON
  const rawJSON = fs.readFileSync(inputPath, 'utf-8');
  const data = JSON.parse(rawJSON);

  // Convert URLs to absolute (same as staticify does)
  for (const page of data.pages) {
    page.url = new URL(page.url, BASE_URL).toString();
  }

  for (const component of data.components) {
    component.url = new URL(component.url, BASE_URL).toString();
  }

  // Wrap in result object (same as staticify does)
  const processed = {
    result: data,
    initial: true
  };

  // Write processed file
  fs.writeFileSync(outputPath, JSON.stringify(processed), 'utf-8');
  console.log(`  Processed ${filename}`);
});

console.log(`\nDone! Files written to ${outputDir}`);
