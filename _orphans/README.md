# Orphan Files for Bootstrap

This directory contains bootstrap versions of files that are normally generated during the build process. These files are needed for the development environment to start properly.

## Purpose

When working on a new branch or fresh clone, certain files required by the development server don't exist yet because they're generated during the build process. To enable a smooth development experience, this directory provides baseline versions of these files that are automatically copied to their proper locations when you run `npm run bootstrap`.

## Files

- **componentSamples.json**: Maps AMP components to their example pages. Copied to `pages/shared/data/componentSamples.json`
- **samples.json**: Contains the structure and metadata for sample categories. Copied to `examples/static/samples/samples.json`
- **growPageLoader.js**: Utility for loading Grow-generated pages (reference copy)
- **search-promoted-pages.json**: Promoted pages for search functionality (reference copy)

## How It Works

The bootstrap process (`npm run bootstrap`) automatically:
1. Checks if the required files already exist in their destination locations
2. If they don't exist, copies the orphan versions to enable development to start
3. Skips copying if the files already exist (to preserve any generated versions)

## Maintenance

These files are typically updated when:
- The structure of component samples changes significantly
- New sample categories are added
- The development environment requirements change

The files in this directory should represent a minimal, working baseline for development purposes.
