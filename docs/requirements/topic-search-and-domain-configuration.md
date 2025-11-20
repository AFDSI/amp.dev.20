# Requirements: Topic-Scoped Search and Multi-Domain Configuration

## Document Status

| Version | Date | Author | Status |
|---------|------|--------|--------|
| 0.1 | 2025-11-20 | Initial | Draft |

---

## 1. Executive Summary

This document defines requirements for two interconnected capabilities:

1. **Topic-Scoped Autosuggest Search** - Inline search fields on content pages that present controlled vocabulary terms and navigate users to curated resources (on-site and off-site)

2. **Multi-Domain Configuration** - Architecture to deploy `abc.dev` as a foundation for multiple specialized sites, each with unique configurations, content, and functions

These capabilities enable the consortium of companies to maintain a shared codebase while delivering customized experiences for each domain.

---

## 2. Business Context

### 2.1 Consortium Structure

`abc.dev` serves as the foundation for multiple specialized domains:

| Domain | Focus Area | Example Topics |
|--------|------------|----------------|
| `dailyfood.io` | Food products | Nutrition, ingredients, supply chain |
| `dailycare.io` | Personal care products | Formulations, safety, regulations |
| `electronic-label.io` | Electronic label manufacturing | Standards, compliance, technology |
| `ontomatica.io` | Ontology specification | Food, personal care, drugs, textiles |
| TBD | TBD | TBD |
| TBD | TBD | TBD |

### 2.2 Goals

- **Reusability**: Single codebase, multiple deployments
- **Customization**: Domain-specific branding, content, and functionality
- **Scalability**: Add new domains without architectural changes
- **Maintainability**: Centralized updates propagate to all domains

---

## 3. Topic-Scoped Autosuggest Search

### 3.1 Overview

Content pages may contain complex topics that benefit from supplementary resources. Rather than listing all references inline, a topic-scoped search field allows users to discover relevant resources through a controlled vocabulary.

### 3.2 User Experience

#### 3.2.1 Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  [amp-site-search in navbar] ← Site-wide search         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Page Title: Complex Topic X                            │
│  ─────────────────────────────                          │
│                                                         │
│  Explanatory content about the topic...                 │
│                                                         │
│  ┌───────────────────────────────────────────┐          │
│  │  Explore Related Resources                │          │
│  │  [Search topic terms... _______________]  │          │
│  │                                           │          │
│  │  Autosuggest dropdown:                    │          │
│  │  ┌─────────────────────────────────────┐  │          │
│  │  │ • Carbon sequestration              │  │          │
│  │  │ • Emissions trading                 │  │          │
│  │  │ • Renewable energy credits          │  │          │
│  │  └─────────────────────────────────────┘  │          │
│  └───────────────────────────────────────────┘          │
│                                                         │
│  When term selected, show links:                        │
│  ┌───────────────────────────────────────────┐          │
│  │  Resources for "Carbon sequestration"     │          │
│  │                                           │          │
│  │  • Carbon Capture Overview                │          │
│  │  • EPA Sequestration Guide ↗              │          │
│  │  • IPCC Report Chapter 5 ↗                │          │
│  └───────────────────────────────────────────┘          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 3.2.2 Interaction Flow

1. User focuses on topic search field
2. User types partial term
3. Autosuggest presents matching terms from controlled vocabulary
4. User selects term
5. System displays curated links for that term
6. User selects link
7. Navigation occurs (internal) or new tab opens with exit indicator (external)

#### 3.2.3 Visual Indicators

- **Internal links**: Standard link styling
- **External links**: Append ↗ symbol (or similar) to signal navigation away from domain

### 3.3 Technical Requirements

#### 3.3.1 Frontend Components

| Component | Description | Reusability |
|-----------|-------------|-------------|
| `topic-search-field` | Inline input with autosuggest | Reusable across pages |
| `autosuggest-dropdown` | Displays matching terms | Shared with amp-site-search |
| `link-results-panel` | Displays links for selected term | New component |

#### 3.3.2 API Endpoints

**Autosuggest Endpoint**

```
GET /api/topic-autosuggest?topic={topic-id}&q={query}

Response:
{
  "terms": [
    {"id": "term-1", "label": "Carbon sequestration"},
    {"id": "term-2", "label": "Carbon credits"},
    {"id": "term-3", "label": "Carbon footprint"}
  ]
}
```

**Links Endpoint**

```
GET /api/topic-links?topic={topic-id}&term={term-id}

Response:
{
  "term": "Carbon sequestration",
  "links": [
    {
      "title": "Carbon Capture Overview",
      "url": "/topics/carbon-capture",
      "type": "internal",
      "description": "Introduction to carbon capture technologies"
    },
    {
      "title": "EPA Sequestration Guide",
      "url": "https://epa.gov/carbon-sequestration",
      "type": "external",
      "description": "Official EPA guidance on sequestration projects"
    }
  ]
}
```

**Alternative: Combined Endpoint**

```
GET /api/topic-search?topic={topic-id}&q={query}

Response (includes both terms and links):
{
  "suggestions": [
    {
      "term": {"id": "term-1", "label": "Carbon sequestration"},
      "links": [...]
    }
  ]
}
```

#### 3.3.3 Data Storage

Controlled vocabulary and link mappings stored as structured data:

```
data/
└── topics/
    ├── climate-change/
    │   ├── vocabulary.yaml      # Terms and synonyms
    │   └── links.yaml           # Link mappings per term
    ├── nutrition/
    │   ├── vocabulary.yaml
    │   └── links.yaml
    └── ...
```

**Example: vocabulary.yaml**

```yaml
topic_id: climate-change
topic_label: Climate Change
terms:
  - id: carbon-sequestration
    label: Carbon sequestration
    synonyms:
      - carbon capture
      - CO2 sequestration
      - carbon storage
  - id: emissions-trading
    label: Emissions trading
    synonyms:
      - cap and trade
      - carbon trading
      - ETS
```

**Example: links.yaml**

```yaml
topic_id: climate-change
term_links:
  carbon-sequestration:
    - title: Carbon Capture Overview
      url: /topics/carbon-capture
      type: internal
      description: Introduction to carbon capture technologies
    - title: EPA Sequestration Guide
      url: https://epa.gov/carbon-sequestration
      type: external
      description: Official EPA guidance
  emissions-trading:
    - title: EU ETS Explained
      url: /topics/eu-ets
      type: internal
    - title: ICAP ETS Map
      url: https://icapcarbonaction.com/ets-map
      type: external
```

---

## 4. Multi-Domain Configuration

### 4.1 Overview

`abc.dev` serves as a foundation that can be configured and deployed for multiple domains. Each domain requires:

- Unique branding (Jinja templates, SASS/SCSS)
- Domain-specific content
- Custom API keys and service configurations
- Specialized functions

### 4.2 Configuration Architecture

#### 4.2.1 Directory Structure

```
abc.dev/
├── configurations/
│   ├── _base/                    # Shared defaults
│   │   ├── config.yaml
│   │   ├── secrets.yaml.example
│   │   └── features.yaml
│   ├── dailyfood.io/
│   │   ├── config.yaml           # Domain-specific config
│   │   ├── secrets.yaml          # API keys (gitignored)
│   │   ├── features.yaml         # Enabled features
│   │   └── topics/               # Domain topics
│   │       ├── nutrition/
│   │       └── food-safety/
│   ├── dailycare.io/
│   │   ├── config.yaml
│   │   ├── secrets.yaml
│   │   ├── features.yaml
│   │   └── topics/
│   ├── electronic-label.io/
│   ├── ontomatica.io/
│   └── ...
├── templates/
│   ├── _base/                    # Shared templates
│   └── overrides/
│       ├── dailyfood.io/         # Domain-specific overrides
│       └── ...
├── styles/
│   ├── _base/                    # Shared styles
│   └── themes/
│       ├── dailyfood.io/         # Domain-specific theme
│       └── ...
├── content/
│   ├── _shared/                  # Shared content
│   └── domains/
│       ├── dailyfood.io/
│       └── ...
├── netlify/
│   ├── functions/                # All available functions
│   └── configurations/           # Per-domain Netlify config
│       ├── dailyfood.io/
│       │   └── netlify.toml
│       └── ...
└── data/
    └── topics/                   # Controlled vocabularies
        ├── _shared/              # Cross-domain topics
        └── domains/
            ├── dailyfood.io/
            └── ...
```

#### 4.2.2 Configuration Files

**config.yaml - Domain Configuration**

```yaml
domain:
  id: dailyfood.io
  name: Daily Food
  tagline: "Quality food information"
  base_url: https://dailyfood.io

branding:
  logo: /assets/dailyfood-logo.svg
  primary_color: "#2E7D32"
  secondary_color: "#81C784"

seo:
  default_title_suffix: " | Daily Food"
  default_description: "Comprehensive food product information"

social:
  twitter: "@dailyfood"
  facebook: "dailyfoodio"
```

**secrets.yaml - API Keys and Credentials**

```yaml
# This file is gitignored - use secrets.yaml.example as template

google:
  search_api_key: "AIza..."
  search_engine_id: "017..."
  knowledge_graph_api_key: "AIza..."
  analytics_id: "G-XXXXXXXX"
  site_verification: "google-site-verification=..."

netlify:
  site_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**features.yaml - Feature Flags**

```yaml
features:
  amp_site_search: true
  topic_search: true
  newsletter_signup: true
  comments: false

topic_search:
  enabled_topics:
    - nutrition
    - food-safety
    - supply-chain

functions:
  enabled:
    - examples_api_time
    - examples_api_autosuggest_*
    - topic_autosuggest
    - topic_links
  disabled:
    - examples_api_amp-access_*  # Not needed for this domain
```

### 4.3 Function Configuration

#### 4.3.1 Function Registry

Functions are registered in a central manifest, then enabled/disabled per domain:

```
netlify/
├── functions/
│   ├── _registry.yaml            # Master list of all functions
│   ├── examples_api_time/
│   ├── topic_autosuggest/
│   └── ...
└── configurations/
    └── dailyfood.io/
        └── netlify.toml          # Domain-specific redirects
```

**_registry.yaml**

```yaml
functions:
  - id: examples_api_time
    description: Returns current server time
    category: examples

  - id: topic_autosuggest
    description: Returns autosuggest terms for topic search
    category: search
    requires_data:
      - topics/{domain}/*/vocabulary.yaml

  - id: topic_links
    description: Returns links for selected topic term
    category: search
    requires_data:
      - topics/{domain}/*/links.yaml
```

#### 4.3.2 Per-Domain Netlify Configuration

Each domain has its own `netlify.toml` with relevant redirects:

```toml
# configurations/dailyfood.io/netlify.toml

[build]
  publish = "dist/dailyfood.io"
  functions = "netlify/functions"

# Topic search endpoints
[[redirects]]
  from = "/api/topic-autosuggest"
  to = "/.netlify/functions/topic_autosuggest"
  status = 200

[[redirects]]
  from = "/api/topic-links"
  to = "/.netlify/functions/topic_links"
  status = 200

# Time API (if enabled)
[[redirects]]
  from = "/api/time"
  to = "/.netlify/functions/examples_api_time"
  status = 200
```

### 4.4 Build and Deployment

#### 4.4.1 Build Process

```bash
# Build for specific domain
npm run build -- --domain=dailyfood.io

# This:
# 1. Loads configurations/dailyfood.io/config.yaml
# 2. Merges with configurations/_base/config.yaml
# 3. Applies domain-specific templates and styles
# 4. Copies domain content
# 5. Generates netlify.toml from domain configuration
# 6. Outputs to dist/dailyfood.io/
```

#### 4.4.2 Environment Variables

Each domain deployment uses environment variables for secrets:

```bash
# Set in Netlify UI or CLI
GOOGLE_SEARCH_API_KEY=AIza...
GOOGLE_ANALYTICS_ID=G-XXXXXXXX
DOMAIN_ID=dailyfood.io
```

Functions read these at runtime:

```javascript
// In topic_autosuggest function
const domainId = process.env.DOMAIN_ID;
const vocabularyPath = `data/topics/domains/${domainId}/...`;
```

---

## 5. Development Workflow

### 5.1 Local Development

| Component | Tool | Purpose |
|-----------|------|---------|
| Static content | Grow / Eleventy | Page rendering |
| API endpoints | Express | Rapid iteration |
| Functions | Netlify CLI | Local function testing |

#### 5.1.1 Express for Local API Testing

```javascript
// examples/api/topic-autosuggest.js

const express = require('express');
const router = express.Router();

router.get('/topic-autosuggest', (req, res) => {
  const { topic, q } = req.query;
  // Load vocabulary, filter by query, return matches
});

module.exports = router;
```

#### 5.1.2 Testing with Netlify CLI

```bash
# Start local Netlify dev server
netlify dev

# Functions available at
# http://localhost:8888/.netlify/functions/topic_autosuggest
```

### 5.2 Testing

#### 5.2.1 Unit Tests

```
tests/
├── functions/
│   ├── topic_autosuggest.test.js
│   └── topic_links.test.js
├── data/
│   ├── vocabulary.test.js        # Validate vocabulary files
│   └── links.test.js             # Validate link mappings
└── integration/
    └── topic_search.test.js      # End-to-end search flow
```

#### 5.2.2 Test Data

```
tests/fixtures/
└── topics/
    └── test-topic/
        ├── vocabulary.yaml
        └── links.yaml
```

### 5.3 Deployment Pipeline

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Develop   │ ──► │   Stage     │ ──► │  Production │
│   (local)   │     │  (preview)  │     │   (live)    │
└─────────────┘     └─────────────┘     └─────────────┘
     │                    │                    │
  Express            Netlify              Netlify
  localhost          Preview URL          Custom domain
```

---

## 6. Data Management

### 6.1 Controlled Vocabulary Governance

- **Ownership**: Each domain has vocabulary maintainers
- **Review**: Changes to vocabulary require review
- **Versioning**: Vocabulary files are version controlled
- **Validation**: CI validates vocabulary structure and links

### 6.2 Link Maintenance

- **Link checking**: Automated checks for broken links
- **Expiration**: Links can have expiration dates
- **Analytics**: Track which links are selected

### 6.3 Cross-Domain Sharing

Some vocabularies may be shared across domains:

```yaml
# data/topics/_shared/sustainability/vocabulary.yaml
# Used by dailyfood.io, dailycare.io, electronic-label.io
```

Domains can extend shared vocabularies:

```yaml
# configurations/dailyfood.io/topics/sustainability/vocabulary.yaml
extends: _shared/sustainability
additional_terms:
  - id: food-waste-reduction
    label: Food waste reduction
```

---

## 7. Security Considerations

### 7.1 API Keys

- Store in `secrets.yaml` (gitignored)
- Use environment variables in production
- Rotate keys periodically
- Use separate keys per domain

### 7.2 External Links

- Validate URLs before adding to link mappings
- Consider link shortener for tracking
- Implement referrer policy for external navigation

### 7.3 Input Validation

- Sanitize search query input
- Validate topic and term IDs
- Rate limit API endpoints

---

## 8. Success Metrics

### 8.1 User Engagement

- Topic search usage rate
- Term selection rate
- Link click-through rate
- Time on page with topic search

### 8.2 Content Quality

- Vocabulary coverage (% of page topics with search)
- Link freshness (% of links validated recently)
- User feedback on resource relevance

### 8.3 Technical Performance

- API response time < 200ms
- Autosuggest latency < 100ms
- Zero broken internal links

---

## 9. Implementation Phases

### Phase 1: Foundation (Current)
- [x] Standalone example demonstrating Express + Netlify function pattern
- [ ] Requirements document (this document)
- [ ] Review existing autosuggest functions

### Phase 2: Prototype
- [ ] Build topic-autosuggest function
- [ ] Create sample vocabulary for one topic
- [ ] Implement frontend component
- [ ] Test on single page

### Phase 3: Domain Configuration
- [ ] Design configuration file structure
- [ ] Implement build process for multi-domain
- [ ] Create configuration for one domain (e.g., dailyfood.io)
- [ ] Deploy to Netlify

### Phase 4: Scale
- [ ] Add configurations for remaining domains
- [ ] Build vocabulary management tooling
- [ ] Implement analytics and monitoring
- [ ] Document for content maintainers

---

## 10. Open Questions

1. **Vocabulary format**: YAML vs JSON vs database?
2. **Link types**: Are there categories beyond internal/external (e.g., PDF, video)?
3. **Search behavior**: Fuzzy matching? Synonym expansion?
4. **Caching**: Cache vocabulary in function or load fresh?
5. **Analytics**: Track searches in Google Analytics or separate system?
6. **Content workflow**: How do content authors add/update terms and links?

---

## 11. References

### 11.1 Related Files

- `examples/api/` - Express API examples
- `netlify/functions/` - Existing Netlify functions
- `netlify/functions/examples_api_autosuggest_*/` - Current autosuggest pattern
- `standalone-time-example/` - Isolated Express + function example

### 11.2 External Resources

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [AMP Autocomplete Component](https://amp.dev/documentation/components/amp-autocomplete/)

---

## Appendix A: Example Implementation

### A.1 Topic Search Component (Conceptual)

```html
<!-- Inline topic search on content page -->
<div class="topic-search" data-topic="climate-change">
  <label for="topic-search-input">Explore Related Resources</label>
  <input
    type="text"
    id="topic-search-input"
    placeholder="Search climate change terms..."
    autocomplete="off"
  >
  <div class="autosuggest-dropdown" hidden>
    <!-- Populated by JavaScript -->
  </div>
  <div class="link-results" hidden>
    <!-- Populated when term selected -->
  </div>
</div>
```

### A.2 Function Skeleton

```javascript
// netlify/functions/topic_autosuggest/topic_autosuggest.js

const vocabularies = require('./vocabularies'); // Loaded at build time

const handler = async (event) => {
  const { topic, q } = event.queryStringParameters;

  if (!topic || !q) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing topic or query parameter' })
    };
  }

  const vocabulary = vocabularies[topic];
  if (!vocabulary) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Topic not found' })
    };
  }

  const matches = vocabulary.terms.filter(term =>
    term.label.toLowerCase().includes(q.toLowerCase()) ||
    term.synonyms?.some(syn => syn.toLowerCase().includes(q.toLowerCase()))
  );

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300'
    },
    body: JSON.stringify({ terms: matches.slice(0, 10) })
  };
};

module.exports = { handler };
```

---

*End of Requirements Document*
