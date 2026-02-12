# Advanced Search System

A fast, responsive, and mobile-friendly advanced search system for ToolForge AI with fuzzy matching, filters, and real-time suggestions.

## Features

### 1. Instant Fuzzy Search
- **Levenshtein Distance Algorithm**: Matches similar terms even with typos
- **Multi-field Search**: Searches across tool names, descriptions, taglines, features, and tags
- **Weighted Relevance Scoring**: Prioritizes exact matches and name matches
- **Real-time Results**: Debounced search with 300ms delay for optimal performance

### 2. Smart Filtering
- **Category Filters**: Filter by Writing, Images, Video, Code, Chat, etc.
- **Pricing Filters**: Free, Freemium, Paid, Enterprise
- **Multiple Selection**: Select multiple categories and pricing options
- **Active Filter Display**: Visual badges showing active filters
- **Quick Clear**: One-click to clear all filters

### 3. Advanced Sorting
- Most Relevant (default for searches)
- Most Popular (by views)
- Newest First
- Highest Rated
- Price: Low to High

### 4. Search Suggestions
- Auto-complete as you type
- Suggests tool names, tags, and categories
- Click to apply suggestion instantly
- Based on fuzzy matching across the database

### 5. Search Analytics
- Track search queries and result counts
- Track clicked tools from search results
- IP hash for privacy-compliant tracking
- Useful for understanding user intent

### 6. Performance Optimization
- **In-memory Caching**: 5-minute cache for search results
- **Debounced Requests**: Prevents excessive API calls
- **Edge Runtime**: Fast response times using Vercel Edge
- **Pagination**: Efficient handling of large result sets

### 7. Responsive & Mobile-Friendly
- Full-screen modal on mobile
- Touch-optimized filters
- Swipeable filter panels
- Optimized for all screen sizes

### 8. Keyboard Shortcuts
- **⌘K / Ctrl+K**: Open search from anywhere
- **/** (forward slash): Quick search access
- **Escape**: Close search modal
- Desktop-only visual indicator

## File Structure

```
src/
├── components/
│   └── search/
│       ├── AdvancedSearch.tsx    # Main search modal component
│       ├── SearchShortcut.tsx    # Keyboard shortcut handler
│       ├── index.ts              # Export barrel
│       └── README.md             # This file
├── lib/
│   └── search.ts                 # Search algorithms & utilities
└── app/
    └── api/
        └── search/
            └── route.ts          # Search API endpoint
```

## Usage

### Basic Integration

```tsx
import { AdvancedSearch } from '@/components/search';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Search</button>
      <AdvancedSearch isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
```

### With Keyboard Shortcuts

```tsx
import { AdvancedSearch, SearchShortcut } from '@/components/search';

function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AdvancedSearch isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <SearchShortcut onOpen={() => setIsOpen(true)} />
    </>
  );
}
```

## API Endpoints

### GET /api/search

Search for tools with optional filters and pagination.

**Query Parameters:**
- `q` or `query` (string): Search query
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (max: 100, default: 20)
- `category` (string): Filter by category
- `pricing` (string): Filter by pricing model
- `sortBy` (string): Sort order (relevance, popular, newest, rating, price)
- `featured` (boolean): Show only featured tools
- `suggestions` (boolean): Return suggestions instead of results

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [...tools],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

### POST /api/search

Track search analytics.

**Request Body:**
```json
{
  "query": "video editing",
  "results_count": 42,
  "clicked_tool_id": "uuid-here"
}
```

## Search Algorithm

The fuzzy search uses **Levenshtein distance** to calculate similarity:

1. **Exact Match**: Substring matching (highest priority)
2. **Word Boundary Match**: Matches words that start with query
3. **Fuzzy Match**: Similarity score above threshold (0.6-0.7)
4. **Weighted Scoring**:
   - Name: 5x weight
   - Tagline: 3x weight
   - Description: 2x weight
   - Features: 1.5x weight
   - Tags: 1x weight

## Caching Strategy

- **Cache Duration**: 5 minutes
- **Max Cache Size**: 100 entries
- **Cache Key**: JSON stringified search parameters
- **Automatic Cleanup**: Oldest entries removed when limit reached

## Customization

### Adjust Fuzzy Match Threshold

```ts
// In lib/search.ts
export function fuzzyMatch(query: string, target: string, threshold = 0.6) {
  // Lower threshold = more lenient matching
  // Higher threshold = stricter matching
}
```

### Modify Search Weights

```ts
// In lib/search.ts - calculateSearchScore function
const weights = {
  name: 5,        // Increase for name priority
  tagline: 3,     // Adjust as needed
  description: 2,
  features: 1.5,
  tags: 1,
};
```

### Change Cache Settings

```ts
// In lib/search.ts - SearchCache class
private maxAge = 5 * 60 * 1000; // Change cache duration
private maxSize = 100;           // Change max cache entries
```

## Performance Tips

1. **Enable Caching**: The cache significantly reduces API calls
2. **Adjust Debounce**: Increase delay for slower connections
3. **Limit Results**: Lower the default limit for faster responses
4. **Index Database**: Ensure proper indexes on search columns
5. **Use Edge Runtime**: Already enabled for sub-100ms responses

## Mobile Optimizations

- Full-screen modal on mobile devices
- Larger touch targets (min 44x44px)
- Collapsible filter sections
- Swipe-friendly interface
- Auto-focus on search input
- No hover states on touch devices

## Accessibility

- Keyboard navigation support
- ARIA labels on all interactive elements
- Focus management
- Screen reader friendly
- High contrast mode support

## Future Enhancements

- [ ] Voice search integration
- [ ] Search history
- [ ] Saved searches
- [ ] Advanced boolean operators (AND, OR, NOT)
- [ ] Search query suggestions based on popular searches
- [ ] Typo correction with "Did you mean...?"
- [ ] Search results preview cards
- [ ] A/B testing for relevance scoring
- [ ] Elasticsearch integration for larger datasets
- [ ] Multi-language search support

## License

Part of ToolForge AI - All rights reserved
