# AMP.dev.20 Command Reference

**Last Updated**: 2025-11-25
**Context**: Commands used during filter implementation and local environment setup

---

## Git Operations

### Status & Information
```bash
# Check repository status
git status

# Show current branch
git branch --show-current

# View recent commits
git log --oneline -3
git log --oneline -5

# Show git diff
git diff
```

### Branch Operations
```bash
# Checkout branch
git checkout main
git checkout <branch-name>

# Fetch remote branch
git fetch origin <branch-name>
git fetch origin claude/analyze-repo-workflow-01GfhJkRCTNazzYR2XQqfrGP

# Merge branch
git merge origin/<branch-name>
git merge origin/claude/analyze-repo-workflow-01GfhJkRCTNazzYR2XQqfrGP
```

### Commit & Push
```bash
# Stage files
git add <file-path>
git add frontend/templates/views/partials/category-filter.j2

# Commit with message
git commit -m "$(cat <<'EOF'
Your commit message here
EOF
)"

# Push to remote
git push -u origin <branch-name>
git push origin main
```

### Repository Cleanup
```bash
# Reset to remote state
git reset --hard origin/main

# Remove untracked files (DESTRUCTIVE)
git clean -fdx
```

---

## Build & Compilation

### Full Build Pipeline
```bash
# Complete build from scratch
npx gulp build

# Build pages only
npx gulp buildPages

# Prepare build (imports from GitHub)
npx gulp buildPrepare

# Build sample files
npx gulp buildSamples

# Staticify (copy static assets)
npx gulp staticify
```

### Import Operations
```bash
# Import all content from GitHub
npx gulp importAll

# Import components only
npx gulp importComponents

# With rate limiting delay (milliseconds)
GITHUB_IMPORT_DELAY=5000 npx gulp importComponents
GITHUB_IMPORT_DELAY=8000 npx gulp buildPrepare
```

### Grow Build Commands
```bash
# Change to pages directory
cd pages

# Build with Grow
grow build

# Preprocess only (validation)
grow preprocess

# Return to root
cd ..
```

---

## Development Server

### Start Development Server
```bash
# Start full development environment
npx gulp develop

# Stop server
# Press Ctrl+C
```

### Server Monitoring
```bash
# Check if server is running
ps aux | grep "gulp develop"
ps aux | grep grow

# View active processes
top | grep grow
```

---

## Package Management

### Node Dependencies
```bash
# Install dependencies
npm install

# View available scripts
npm run

# Check for specific script
npm run build  # (may not exist)
```

### Gulp Tasks
```bash
# List all available gulp tasks
npx gulp --tasks
```

---

## File System Operations

### Directory Navigation
```bash
# List directory contents
ls
ls -la
ls -lh

# Check specific files
ls pages/content/amp-dev/documentation/components/reference/amp-img-v0.1.md
ls dist/static/files/search-promoted-pages/

# List with patterns
ls pages/content/amp-dev/documentation/components/reference/ | grep -v "@"
ls baseline-*.tar.gz
```

### Directory Creation
```bash
# Create directory with parents
mkdir -p dist/examples/sources/documentation/components
mkdir -p dist/examples/sources/documentation/guides-and-tutorials

# Create placeholder files
touch dist/examples/sources/documentation/components/.gitkeep
```

### File Operations
```bash
# Copy files
cp ../amp.dev.20.backup/baseline-*.tar.gz .
cp -r /path/to/source/* /path/to/destination/

# Remove files/directories
rm -rf dist/
rm -rf build/
rm baseline-*.tar.gz

# Move/rename
mv amp.dev.20 amp.dev.20.backup
```

### File Inspection
```bash
# View file contents
cat filename.txt

# View with line numbers
cat -n filename.txt

# Check file existence
ls <file-path> 2>&1
```

---

## Search & Navigation

### File Search
```bash
# Find files by pattern
find . -name "podspec.yaml" -type f
find . -name "_reference" -type d

# Search file contents
grep -r "search-promoted-pages" platform/
grep "roadmap" build_output.log
grep -i "error\|traceback" build.log | head -20
```

### Process Search
```bash
# Find running processes
ps aux | grep "grow build"
ps aux | grep gulp
```

---

## Archive & Backup Operations

### Create Backups
```bash
# Create tarball backup
tar -czf baseline-$(date +%Y%m%d).tar.gz \
  pages/content/amp-dev/documentation/components/reference/ \
  dist/examples/ \
  dist/inline-examples/

# Alternative: backup specific directories
tar -czf baseline-20251125.tar.gz \
  pages/content/amp-dev/documentation/components/reference/ \
  dist/
```

### Extract Backups
```bash
# Extract tarball
tar -xzf baseline-*.tar.gz
tar -xzf baseline-20251125.tar.gz

# List tarball contents
tar -tzf baseline-*.tar.gz
tar -tzf baseline-*.tar.gz | grep "amp-img-v0.1.md"
```

---

## Environment Configuration

### Environment Variables
```bash
# Set GitHub token (rate limiting)
export GITHUB_TOKEN=gho_xxxxxxxxxxxxx

# Get GitHub token using CLI
gh auth token

# Set import delay
GITHUB_IMPORT_DELAY=8000 npx gulp buildPrepare
```

### Shell Configuration
```bash
# Check current working directory
pwd

# Check environment info
uname -a  # OS information
node --version  # Node version
npm --version  # NPM version
```

---

## Testing & Validation

### HTTP Testing
```bash
# Test endpoint
curl http://localhost:8080/search/highlights?locale=en

# Test with specific options
curl -s "https://raw.githubusercontent.com/..."
```

### Build Validation
```bash
# Check for errors in build output
grow build 2>&1 | grep -i "error\|traceback" | head -20
grow build 2>&1 | grep roadmap

# With timeout
timeout 60 grow build 2>&1 | grep -i roadmap
```

### File Verification
```bash
# Verify critical files exist
ls pages/content/amp-dev/documentation/components/reference/amp-img-v0.1.md \
   pages/content/amp-dev/documentation/components/reference/amp-bind-v0.1.md \
   pages/content/amp-dev/documentation/components/reference/amp-form-v0.1.md

# Check search files
ls dist/static/files/search-promoted-pages/en.json

# Check examples
ls dist/examples/sources/ | head -5
```

---

## Daily Health Check Workflow

**Beginning of Day - Environment Verification**:

```bash
# 1. Git status
git status

# 2. Current branch
git branch --show-current

# 3. Critical files exist
ls pages/content/amp-dev/documentation/components/reference/amp-img-v0.1.md \
   pages/content/amp-dev/documentation/components/reference/amp-bind-v0.1.md \
   pages/content/amp-dev/documentation/components/reference/amp-form-v0.1.md

# 4. Search promoted pages built
ls dist/static/files/search-promoted-pages/en.json

# 5. Example directories exist
ls dist/examples/sources/ | head -5

# 6. Template validation
cd pages && grow preprocess && cd ..

# 7. Start dev server (test)
npx gulp develop
# Press Ctrl+C after verification
```

---

## Common Workflows

### Fresh Environment Setup
```bash
# Clean clone
git clone https://github.com/AFDSI/amp.dev.20.git amp.dev.20
cd amp.dev.20

# Install dependencies
npm install

# Build
GITHUB_IMPORT_DELAY=8000 npx gulp buildPrepare
npx gulp buildSamples
npx gulp buildPages

# Start development
npx gulp develop
```

### Recover from Build Issues
```bash
# Option 1: Restore from backup
tar -xzf baseline-*.tar.gz

# Option 2: Clean rebuild
rm -rf dist/
GITHUB_IMPORT_DELAY=8000 npx gulp buildPrepare
npx gulp buildSamples
npx gulp buildPages

# Restart development
npx gulp develop
```

### Deploy to Netlify
```bash
# Ensure on main branch
git checkout main

# Merge changes
git merge <feature-branch>

# Push to trigger Netlify build
git push origin main
```

---

## Troubleshooting Commands

### GitHub Rate Limits
```bash
# Check rate limit status
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/rate_limit

# Import with increased delay
GITHUB_IMPORT_DELAY=10000 npx gulp importComponents
```

### Missing Directories
```bash
# Create expected directories
mkdir -p dist/examples/sources/documentation/components
mkdir -p dist/examples/sources/documentation/guides-and-tutorials
mkdir -p dist/static/files/search-promoted-pages
```

### Process Management
```bash
# Kill hung process
ps aux | grep grow
kill <PID>

# Force kill if needed
kill -9 <PID>
```

---

## Notes

- **Rate Limiting**: Use `GITHUB_IMPORT_DELAY` environment variable (milliseconds)
- **Build Order**: `buildPrepare` → `buildSamples` → `buildPages` → `develop`
- **Backups**: Create after successful imports to avoid re-downloading
- **Clean Builds**: Use `git clean -fdx` with caution (removes all untracked files)
- **Develop Loop**: Constant "routes rebuilt" messages indicate template errors

---

## Related Files

- `.gitignore` - Add `baseline-*.tar.gz` to ignore backup files
- `gulpfile.js/` - Gulp task definitions
- `platform/lib/pipeline/gitHubImporter.js` - Rate limiting configuration
- `platform/config/podspec.yaml` - Grow configuration
