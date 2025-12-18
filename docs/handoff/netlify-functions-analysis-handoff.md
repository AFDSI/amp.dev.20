# Handoff Document: Netlify Functions Analysis for amp.dev.22

**Date:** 2025-12-18
**From:** amp.dev.20 session
**To:** amp.dev.22 session
**Objective:** Analyze `netlify/functions/` in amp.dev.22 for consistency, Node 22 compatibility, and identify irregularities

---

## Context

### Background

We successfully implemented a standalone time API example demonstrating the Express (local testing) → Netlify Functions (deployment) pattern. This work is in `amp.dev.20` at:
- `standalone-time-example/` - Working Express + function example
- `docs/requirements/topic-search-and-domain-configuration.md` - Requirements for topic search and multi-domain config

### Current Situation

**amp.dev.22** is the updated repository that includes:
1. **Working `amp-site-search`** implementation that depends on `netlify/functions/`
2. **Updated functions in `netlify/functions/search_do/`** to support amp-site-search
3. **Node 22 event handling updates** applied to some (but possibly not all) functions

**amp.dev.20** does NOT have these updates.

### The Problem

We need to verify that all Netlify functions in amp.dev.22 are:
- Consistent in their event handling patterns
- Compatible with Node 22
- Free of irregularities or errors
- Following the updated calling structure for Node 22 components

---

## Objective

Analyze `netlify/functions/` directory in **amp.dev.22** and:

1. **Review `search_do` function** - Understand the amp-site-search implementation
2. **Check Node 22 event handling** - Verify all functions use the updated pattern
3. **Identify inconsistencies** - Find functions that don't follow the pattern
4. **Report irregularities** - Document any errors or issues

---

## Key Areas to Investigate

### 1. Node 22 Event Handler Pattern

**Question:** What is the correct event handler signature for Node 22?

Look for patterns like:
```javascript
// Old pattern (may be in amp.dev.20)
exports.handler = async (event, context) => { ... }

// New pattern (likely in amp.dev.22)
exports.handler = async (event, context) => { ... }
// OR
export const handler = async (event, context) => { ... }
```

**Action:** Document the standard pattern used in amp.dev.22

### 2. search_do Function Structure

**Location:** `netlify/functions/search_do/`

**Questions:**
- How is it structured?
- What dependencies does it use?
- How does it integrate with amp-site-search?
- What is the event handling pattern?
- Are there any helper modules or shared code?

**Action:** Read and document the complete implementation

### 3. Function Inventory

**Location:** `netlify/functions/`

**Expected structure (based on amp.dev.20):**
```
netlify/functions/
├── search_do/                           # NEW - amp-site-search
├── examples_api_*/                      # ~40+ example functions
├── autosuggest.js                       # Standalone files
└── cache.js
```

**Action:**
- List all functions
- Categorize by type (search, examples, utilities)
- Identify which have been updated for Node 22

### 4. Consistency Check

**Compare across functions:**
- Event handler signatures
- Response format (statusCode, headers, body)
- Error handling patterns
- Dependency imports (require vs import)
- Use of async/await
- CORS headers handling

**Action:** Create a comparison matrix

### 5. Known Patterns from amp.dev.20

For reference, here are patterns from the old repo:

**Time API (amp.dev.20):**
```javascript
// netlify/functions/examples_api_time/examples_api_time.js
const handler = async () => {
  const time = new Date().toLocaleTimeString();
  const body = JSON.stringify({time});

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': ev.headers?.origin || '',
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      'Content-Type': 'application/json',
    },
    body,
  };
};

module.exports = {handler};
```

**Action:** Compare this with amp.dev.22 patterns

---

## Specific Tasks for New Session

### Task 1: Initial Reconnaissance
```bash
cd netlify/functions
ls -la | wc -l          # Count total functions
find . -name "*.js" | head -20
```

### Task 2: Analyze search_do
```bash
ls -la netlify/functions/search_do/
cat netlify/functions/search_do/*.js
```

**Questions to answer:**
- What does search_do do?
- How does it interface with Google Custom Search API?
- What is the response format?
- Is it using Node 22 event handling?

### Task 3: Sample Function Comparison

Pick 5-10 representative functions:
- `search_do/` (new)
- `examples_api_time/`
- `examples_api_hello/`
- `examples_api_autosuggest_cities/`
- `examples_api_amp-form_submit_form/`

Compare:
- Handler signature
- Event parameter usage
- Response structure
- Error handling

### Task 4: Pattern Detection

Run searches to find patterns:
```bash
# Find all handler exports
grep -r "exports.handler" netlify/functions/ | head -20
grep -r "export.*handler" netlify/functions/ | head -20

# Find event parameter usage
grep -r "async (event" netlify/functions/ | head -20

# Find Node version indicators
find netlify/functions -name "package.json" -exec cat {} \;
```

### Task 5: Create Analysis Report

Write to: `_claude/analysis/netlify-functions-analysis.md`

Include:
1. **Summary** - Overall state of functions
2. **Node 22 Pattern** - Document the standard
3. **search_do Deep Dive** - Complete analysis
4. **Consistency Matrix** - Table comparing functions
5. **Irregularities** - List of issues found
6. **Recommendations** - What needs to be fixed

---

## Expected Outputs

### 1. Analysis Report

**Location:** `_claude/analysis/netlify-functions-analysis.md`

**Sections:**
- Executive summary
- Node 22 event handling pattern
- search_do implementation details
- Function consistency matrix
- Identified irregularities
- Recommendations

### 2. Function Inventory

**Location:** `_claude/analysis/function-inventory.csv`

**Format:**
```csv
Function Name,Type,Event Handler,Node Version,Status,Notes
search_do,search,async (event),22,OK,amp-site-search integration
examples_api_time,example,async (),unknown,Needs review,No event param
...
```

### 3. Pattern Template

**Location:** `_claude/analysis/node22-function-template.js`

**Content:** A reference template showing the correct Node 22 pattern

---

## Related Documents

### In amp.dev.20 (completed work)
- `standalone-time-example/` - Working standalone example
- `docs/requirements/topic-search-and-domain-configuration.md` - Requirements doc
- `standalone-time-example/server.js` - Express local testing pattern
- `standalone-time-example/public/index.html` - Test frontend

### To Create in amp.dev.22
- `_claude/analysis/netlify-functions-analysis.md` - Main analysis
- `_claude/analysis/function-inventory.csv` - Function list
- `_claude/analysis/node22-function-template.js` - Reference template
- `_claude/analysis/irregularities.md` - Issues found

---

## Key Questions to Answer

1. **What is the Node 22 event handler pattern?**
   - Is it different from the old pattern?
   - Do all functions follow it?

2. **How does search_do work?**
   - What API does it call?
   - How does it handle queries?
   - What is the response structure?

3. **Which functions have been updated?**
   - Is there a clear pattern?
   - Can we identify which haven't been updated?

4. **What are the inconsistencies?**
   - Different handler signatures?
   - Different error handling?
   - Missing headers or CORS?

5. **What needs to be fixed?**
   - Which functions need updates?
   - What is the priority?
   - Can we create a migration script?

---

## Success Criteria

✅ Complete inventory of all Netlify functions
✅ Documented Node 22 event handling pattern
✅ Deep analysis of search_do implementation
✅ Consistency matrix comparing all functions
✅ List of irregularities with severity ratings
✅ Actionable recommendations for fixes

---

## Next Steps After Analysis

Once analysis is complete:

1. **Review findings** with user
2. **Prioritize fixes** based on severity
3. **Create migration plan** for outdated functions
4. **Update amp.dev.20** with patterns from amp.dev.22
5. **Document standard** for future function development

---

## Notes

- The user mentioned that `search_do` was updated to support `amp-site-search`
- Other files were also updated to support "event handling in node 22"
- None of these changes exist in amp.dev.20
- The goal is to ensure overall consistency based on the updated calling structure

---

## Contact Context

If you need to reference back to the original conversation:
- Thread: "Netlify Functions Analysis"
- Starting point: Standalone time example (`amp.dev.20`)
- Current objective: Analyze functions in `amp.dev.22`
- Key concern: Node 22 compatibility and consistency

---

*This handoff document should be read by Claude in the new session with amp.dev.22 loaded.*
