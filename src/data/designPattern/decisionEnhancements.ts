import type { DecisionEnhancement, PatternGateEnhancement } from '../../types/decisionEnhancement'

function d(partial: DecisionEnhancement): DecisionEnhancement { return partial }

const PATTERN_GATE: PatternGateEnhancement = {
  yesSignals: [
    'Building a data structure from scratch with custom operations',
    'Designing a system component like a file system or rate limiter',
    'Implementing UI features like navigation or text editing',
    'Applying a classic GoF design pattern',
    'Open-ended design problem with multiple valid approaches',
  ],
  whenAtThisStep: 'Confirm design pattern fits: building a specialized system, data structure, UI component, or applying an OOP pattern.',
  xray: [
    { text: '**data structure design** — implement LRU cache, hash map, trie, BST, graph', kind: 'signal' },
    { text: '**system components** — file system, rate limiter, memory pool, reservation system', kind: 'signal' },
    { text: '**UI components** — browser history, text editor, autocomplete', kind: 'signal' },
    { text: '**design patterns** — creational, structural, behavioral GoF patterns', kind: 'signal' },
    { text: '**open-ended** — multiple valid architectures, trade-offs to evaluate', kind: 'goal' },
    { text: '**state management** — tracking position, history, selection, or mode', kind: 'constraint' },
    { text: '**capacity constraints** — memory limits, rate limits, fixed sizes', kind: 'constraint' },
  ],
  budget: ['cache', 'hash', 'collection', 'tree', 'graph', 'search index', 'file system', 'rate limiter', 'memory', 'reservation', 'game', 'navigation', 'creational', 'structural', 'behavioral', 'oop'],
  sayIt: [
    'Is the problem about building a data structure, a system component, a UI feature, or applying a design pattern?',
    'Does it require implementing custom operations on a specialized structure?',
    'Is there a known design pattern that fits the problem architecture?',
  ],
  branchGuides: {
    'data-structure-design-step2': {
      proceed: 'WHEN: building LRU cache, hash map, tree, graph, or specialized collection',
    },
    'system-design-components-step2': {
      proceed: 'WHEN: designing file system, rate limiter, memory manager, or business logic system',
    },
    'ui-components-step2': {
      proceed: 'WHEN: implementing browser history, text editor, or autocomplete UI',
    },
    'design-patterns-principles-step2': {
      proceed: 'WHEN: applying creational, structural, or behavioral GoF design pattern',
    },
  },
  notThisPattern: [
    { signal: 'Simple API wrapper or CRUD service', actually: 'Use standard architecture — no specialized data structure needed' },
    { signal: 'Pure algorithm problem (no custom state management)', actually: 'Use algorithm pattern — focus on computation, not structure' },
  ],
  misidentify: [
    {
      cause: 'Over-designing with a pattern where simple approach works',
      wrong: 'Implement full decorator pattern for simple logging',
      testCase: 'Log method calls on a single class',
      fix: 'Use a simple wrapper function or inheritance for one-off logging',
    },
    {
      cause: 'Confusing data structure design with algorithm problem',
      wrong: 'Build a custom hash map for a simple two-sum problem',
      testCase: 'Find two numbers that sum to target in an array',
      fix: 'Use std::unordered_map / built-in hash set — no custom implementation needed',
    },
  ],
}

const DECISION_ENHANCEMENTS: Record<string, DecisionEnhancement> = {
  'dp-root': d({
    whenAtThisStep: 'You identified a design problem. Now pick the domain family.',
    xray: [
      { text: '**data structure design**: cache, hash, tree, graph, collections', kind: 'signal' },
      { text: '**system components**: file system, rate limiter, memory, business logic', kind: 'signal' },
      { text: '**UI components**: navigation, text editor, typeahead', kind: 'signal' },
      { text: '**design patterns**: creational, structural, behavioral', kind: 'signal' },
    ],
    budget: ['data structure', 'system', 'ui', 'pattern'],
    sayIt: ['Building a data structure, a system component, a UI feature, or applying a design pattern?'],
    branchGuides: {
      'data-structure-design-step2': { proceed: 'yes — data structure: cache, hash, collection, tree/graph' },
      'system-design-components-step2': { proceed: 'yes — system: file system, rate limiter, memory, business logic' },
      'ui-components-step2': { proceed: 'yes — UI: navigation, text editor, typeahead' },
      'design-patterns-principles-step2': { proceed: 'yes — pattern: creational, structural, behavioral' },
    },
    notThisPattern: [
      { signal: 'Standard CRUD or API design', actually: 'Use standard architecture patterns' },
    ],
  }),

  'data-structure-design-step2': d({
    whenAtThisStep: 'Data structure design. Which category?',
    xray: [
      { text: '**cache design**: LRU, LFU, TTL-based eviction policies', kind: 'signal' },
      { text: '**custom hash**: hash map, hash set, bloom filter, consistent hashing', kind: 'signal' },
      { text: '**advanced collections**: multi-level, stack/queue variants, custom priority', kind: 'signal' },
      { text: '**tree & graph**: BST, trie, segment tree, adjacency structures', kind: 'signal' },
    ],
    budget: ['cache', 'hash', 'collection', 'tree'],
    sayIt: ['Cache with eviction policy, custom hash structure, advanced collection, or tree/graph structure?'],
    branchGuides: {
      'cache-design-step3': { proceed: 'yes — cache: LRU, LFU, or TTL-based eviction' },
      'custom-hash-step3': { proceed: 'yes — hash: hash map, hash set, or specialized hash' },
      'advanced-collections-step3': { proceed: 'yes — collection: multi-level, stack/queue, or custom priority' },
      'tree-graph-step3': { proceed: 'yes — tree/graph: tree-based, graph-based, or search index' },
    },
    notThisPattern: [
      { signal: 'System-level component, not a data structure', actually: 'Use system design components family' },
    ],
  }),

  'system-design-components-step2': d({
    whenAtThisStep: 'System design component. Which type?',
    xray: [
      { text: '**file system**: directory hierarchy, file operations, path management', kind: 'signal' },
      { text: '**rate limiters**: sliding window, token bucket, leaky bucket', kind: 'signal' },
      { text: '**memory management**: object pools, compact structures, allocators', kind: 'signal' },
      { text: '**business logic**: reservations, parking, games', kind: 'signal' },
    ],
    budget: ['file system', 'rate limiter', 'memory', 'business logic'],
    sayIt: ['File system, rate limiter, memory management, or business logic component?'],
    branchGuides: {
      'file-system-step3': { proceed: 'yes — file system: directory structure or file operations' },
      'rate-limiters-step3': { proceed: 'yes — rate limiter: window-based or token bucket' },
      'memory-management-step3': { proceed: 'yes — memory: pool allocator or memory efficient structures' },
      'business-logic-step3': { proceed: 'yes — business logic: reservation, parking, or game system' },
    },
    notThisPattern: [
      { signal: 'Low-level data structure, not a system', actually: 'Use data structure design family' },
    ],
  }),

  'ui-components-step2': d({
    whenAtThisStep: 'UI component. Which type?',
    xray: [
      { text: '**navigation**: browser history, menu navigation, forward/back', kind: 'signal' },
      { text: '**text editors**: cursor, insert, delete, undo/redo, document model', kind: 'signal' },
      { text: '**typeahead**: autocomplete, prefix matching, suggestion ranking', kind: 'signal' },
    ],
    budget: ['navigation', 'text editor', 'typeahead'],
    sayIt: ['Navigation system, text editor, or typeahead/autocomplete?'],
    branchGuides: {
      'navigation-step3': { proceed: 'yes — navigation: browser history or menu navigation' },
      'text-editors-step3': { proceed: 'yes — text editor: cursor, insert, delete, undo/redo' },
      'typeahead-step3': { proceed: 'yes — typeahead: autocomplete with prefix matching' },
    },
    notThisPattern: [
      { signal: 'Backend system component', actually: 'Use system design components family' },
    ],
  }),

  'design-patterns-principles-step2': d({
    whenAtThisStep: 'Design patterns. Which category?',
    xray: [
      { text: '**creational**: factory method, singleton, builder', kind: 'signal' },
      { text: '**structural**: adapter, decorator, composite', kind: 'signal' },
      { text: '**behavioral**: iterator, observer, strategy', kind: 'signal' },
    ],
    budget: ['creational', 'structural', 'behavioral'],
    sayIt: ['Creational, structural, or behavioral design pattern?'],
    branchGuides: {
      'creational-patterns-step3': { proceed: 'yes — creational: factory, singleton, builder' },
      'structural-patterns-step3': { proceed: 'yes — structural: adapter, decorator, composite' },
      'behavioral-patterns-step3': { proceed: 'yes — behavioral: iterator, observer, strategy' },
    },
    notThisPattern: [
      { signal: 'Custom data structure, not a pattern', actually: 'Use data structure design family' },
    ],
  }),

  'cache-design-step3': d({
    whenAtThisStep: 'Cache design. Which eviction policy?',
    xray: [
      { text: '**LRU**: doubly linked list + hash map, O(1) get/put', kind: 'signal' },
      { text: '**LFU**: frequency tracking, min-frequency eviction', kind: 'signal' },
      { text: '**TTL**: time-based expiration, background cleanup', kind: 'signal' },
    ],
    budget: ['lru', 'lfu', 'ttl'],
    sayIt: ['LRU (least recently used), LFU (least frequently used), or TTL (time-based) eviction?'],
    branchGuides: {
      'lru-cache-leaf': { proceed: 'LRU: linked list + hash map for O(1) operations (LC 146)' },
      'lfu-cache-leaf': { proceed: 'LFU: frequency buckets for O(1) operations (LC 460)' },
      'time-cache-leaf': { proceed: 'TTL: time-based expiration with lazy/active cleanup' },
    },
    notThisPattern: [
      { signal: 'Not a cache problem', actually: 'Use other data structure category' },
    ],
  }),

  'custom-hash-step3': d({
    whenAtThisStep: 'Custom hash structure. Which variant?',
    xray: [
      { text: '**hash map**: key-value, chaining or open addressing', kind: 'signal' },
      { text: '**hash set**: unique elements, membership checks', kind: 'signal' },
      { text: '**specialized hash**: bloom filter, consistent hash, rolling hash', kind: 'signal' },
    ],
    budget: ['hash map', 'hash set', 'specialized hash'],
    sayIt: ['Hash map, hash set, or specialized hashing (bloom filter, consistent hash, rolling hash)?'],
    branchGuides: {
      'hashmap-leaf': { proceed: 'hash map: chaining or open addressing (LC 706, 981)' },
      'hashset-leaf': { proceed: 'hash set: fast membership checks (LC 705, 359)' },
      'specialized-hash-leaf': { proceed: 'specialized: bloom filter, consistent hash, rolling hash' },
    },
    notThisPattern: [
      { signal: 'Standard library hash is sufficient', actually: 'Use built-in hash — no custom implementation needed' },
    ],
  }),

  'advanced-collections-step3': d({
    whenAtThisStep: 'Advanced collection. Which type?',
    xray: [
      { text: '**multi-level**: nested structures, composite key maps', kind: 'signal' },
      { text: '**stack/queue**: min stack, deque, circular buffer, monotonic', kind: 'signal' },
      { text: '**custom priority**: heap with custom comparator, merge-sorted', kind: 'signal' },
    ],
    budget: ['multi-level', 'stack/queue', 'priority'],
    sayIt: ['Multi-level data structure, stack/queue variant, or custom priority queue?'],
    branchGuides: {
      'multi-level-leaf': { proceed: 'multi-level: nested maps, composite keys, compound structures' },
      'stack-queue-leaf': { proceed: 'stack/queue: min stack, deque, circular buffer, monotonic (LC 155, 239)' },
      'custom-priority-leaf': { proceed: 'priority: custom heap, comparator, merge k sorted (LC 295, 23)' },
    },
    notThisPattern: [
      { signal: 'Simple single-level structure suffices', actually: 'Use standard collection' },
    ],
  }),

  'tree-graph-step3': d({
    whenAtThisStep: 'Tree or graph structure. Which domain?',
    xray: [
      { text: '**tree-based**: BST, trie, segment tree, fenwick tree', kind: 'signal' },
      { text: '**graph-based**: adjacency list/matrix, weighted, DAG', kind: 'signal' },
      { text: '**search index**: inverted index, b-tree, full-text search', kind: 'signal' },
    ],
    budget: ['tree', 'graph', 'search index'],
    sayIt: ['Tree-based (BST, trie, segment), graph-based (adjacency, weighted), or search/index structure?'],
    branchGuides: {
      'tree-based-designs-step4': { proceed: 'yes — tree: BST, trie, segment tree, fenwick' },
      'graph-based-designs-step4': { proceed: 'yes — graph: adjacency, weighted, DAG, pathfinding' },
      'search-index-step4': { proceed: 'yes — index: inverted index, b-tree, search engine' },
    },
    notThisPattern: [
      { signal: 'Simple array or hash-based structure', actually: 'Use cache/hash/collection family' },
    ],
  }),

  'file-system-step3': d({
    whenAtThisStep: 'File system design. Which aspect?',
    xray: [
      { text: '**directory structure**: tree hierarchy, paths, nesting', kind: 'signal' },
      { text: '**file operations**: read, write, delete, copy, move, content management', kind: 'signal' },
    ],
    budget: ['directory', 'file ops'],
    sayIt: ['Modeling directory hierarchy or implementing file CRUD operations?'],
    branchGuides: {
      'directory-structure-leaf': { proceed: 'directory: tree of folders, path resolution (LC 588, 1233)' },
      'file-operations-leaf': { proceed: 'file ops: read/write/delete, content management (LC 588, 1472)' },
    },
    notThisPattern: [
      { signal: 'Not a file system problem', actually: 'Use other system component category' },
    ],
  }),

  'rate-limiters-step3': d({
    whenAtThisStep: 'Rate limiter. Which algorithm?',
    xray: [
      { text: '**window-based**: sliding window, fixed window, request counting', kind: 'signal' },
      { text: '**token bucket**: tokens accumulate at fixed rate, consumed per request', kind: 'signal' },
    ],
    budget: ['window', 'token bucket'],
    sayIt: ['Window-based (sliding/fixed window counting) or token bucket (rate-based replenishment)?'],
    branchGuides: {
      'window-limiter-leaf': { proceed: 'window: track request count within time windows' },
      'token-bucket-leaf': { proceed: 'token bucket: token accumulation and consumption per request' },
    },
    notThisPattern: [
      { signal: 'No rate limiting requirement', actually: 'Use other system component category' },
    ],
  }),

  'memory-management-step3': d({
    whenAtThisStep: 'Memory management. Which strategy?',
    xray: [
      { text: '**pool allocators**: pre-allocate objects, reuse, avoid GC', kind: 'signal' },
      { text: '**memory efficient**: sparse, compact, bitfield, encoding', kind: 'signal' },
    ],
    budget: ['pool', 'compact'],
    sayIt: ['Object pool allocator for reuse, or memory-efficient compact representation?'],
    branchGuides: {
      'pool-leaf': { proceed: 'pool: pre-allocate and reuse objects to avoid allocation overhead' },
      'compact-leaf': { proceed: 'compact: sparse, bitfield, or encoded representation for minimal footprint' },
    },
    notThisPattern: [
      { signal: 'Standard allocation is fine', actually: 'Use default memory management' },
    ],
  }),

  'business-logic-step3': d({
    whenAtThisStep: 'Business logic component. Which domain?',
    xray: [
      { text: '**reservation**: calendar booking, time slots, conflict detection', kind: 'signal' },
      { text: '**parking**: spot tracking, vehicle types, fee calculation', kind: 'signal' },
      { text: '**game**: board games, card games, turn-based logic, win detection', kind: 'signal' },
    ],
    budget: ['reservation', 'parking', 'game'],
    sayIt: ['Reservation/booking system, parking lot management, or game implementation?'],
    branchGuides: {
      'reservation-systems-step4': { proceed: 'yes — reservation: calendar, booking, time slots' },
      'parking-systems-step4': { proceed: 'yes — parking: spot tracking, rates, vehicle types' },
      'game-implementations-step4': { proceed: 'yes — game: board games, card games, turn-based' },
    },
    notThisPattern: [
      { signal: 'Infrastructure component, not business logic', actually: 'Use file system, rate limiter, or memory management' },
    ],
  }),

  'navigation-step3': d({
    whenAtThisStep: 'Navigation system. Which type?',
    xray: [
      { text: '**browser history**: back/forward stack, URL management', kind: 'signal' },
      { text: '**menu navigation**: hierarchical menus, sidebar, tabs', kind: 'signal' },
    ],
    budget: ['browser history', 'menu'],
    sayIt: ['Browser history with back/forward navigation, or application menu/sidebar navigation?'],
    branchGuides: {
      'browser-history-leaf': { proceed: 'browser history: stack-based forward/back (LC 1472)' },
      'menu-nav-leaf': { proceed: 'menu: hierarchical or flat navigation structure' },
    },
    notThisPattern: [
      { signal: 'Not a UI navigation problem', actually: 'Use other UI component category' },
    ],
  }),

  'text-editors-step3': d({
    whenAtThisStep: 'Text editor. Which features?',
    xray: [
      { text: '**cursor**: move left/right, start/end, word boundaries', kind: 'signal' },
      { text: '**content ops**: insert, delete at cursor position', kind: 'signal' },
      { text: '**undo/redo**: stack of operations for reversible edits', kind: 'signal' },
    ],
    budget: ['cursor', 'content', 'undo'],
    sayIt: ['Cursor movement, content insertion/deletion, or undo/redo functionality?'],
    branchGuides: {
      'text-editor-leaf': { proceed: 'text editor: cursor, insert, delete, undo/redo (LC 716, 588)' },
    },
    notThisPattern: [
      { signal: 'Not a text editing problem', actually: 'Use other UI component category' },
    ],
  }),

  'typeahead-step3': d({
    whenAtThisStep: 'Typeahead/autocomplete. Which approach?',
    xray: [
      { text: '**prefix matching**: trie-based or sorted dictionary lookups', kind: 'signal' },
      { text: '**ranking**: frequency, recency, or relevance ordering of suggestions', kind: 'signal' },
      { text: '**real-time**: debounce, incremental search, result caching', kind: 'signal' },
    ],
    budget: ['prefix', 'ranking', 'real-time'],
    sayIt: ['Prefix matching (trie/dictionary), suggestion ranking, or real-time debounced search?'],
    branchGuides: {
      'autocomplete-leaf': { proceed: 'autocomplete: prefix trie with frequency ranking (LC 642, 1268)' },
    },
    notThisPattern: [
      { signal: 'Not an autocomplete/typeahead problem', actually: 'Use other UI component category' },
    ],
  }),

  'tree-based-designs-step4': d({
    whenAtThisStep: 'Tree-based design. Which tree structure?',
    xray: [
      { text: '**trie**: prefix tree for strings, autocomplete, spell check', kind: 'signal' },
      { text: '**BST**: binary search tree, ordered map, sorted data, range queries', kind: 'signal' },
      { text: '**advanced**: segment tree, fenwick tree, LCA, balanced rotations', kind: 'signal' },
    ],
    budget: ['trie', 'bst', 'advanced tree'],
    sayIt: ['Trie (prefix tree), binary search tree (ordered map), or advanced tree (segment, fenwick, LCA)?'],
    branchGuides: {
      'trie-leaf': { proceed: 'trie: prefix matching, autocomplete (LC 208, 211, 642)' },
      'bst-leaf': { proceed: 'BST: ordered operations, range queries (LC 703, 173, 715)' },
      'advanced-tree-leaf': { proceed: 'advanced: segment/fenwick/LCA (LC 307, 315, 236)' },
    },
    notThisPattern: [
      { signal: 'Graph-based problem, not tree', actually: 'Use graph-based designs' },
    ],
  }),

  'graph-based-designs-step4': d({
    whenAtThisStep: 'Graph-based design. Which representation?',
    xray: [
      { text: '**basic**: adjacency list/matrix, BFS/DFS traversal', kind: 'signal' },
      { text: '**specialized**: weighted edges, shortest path, MST, topological', kind: 'signal' },
    ],
    budget: ['basic graph', 'specialized graph'],
    sayIt: ['Basic graph (adjacency, traversal) or specialized graph (weighted, pathfinding, DAG)?'],
    branchGuides: {
      'basic-graph-leaf': { proceed: 'basic: adjacency list/matrix, graph traversal (LC 133, 261, 323)' },
      'specialized-graph-leaf': { proceed: 'specialized: weighted, shortest path, MST, topological (LC 743, 1584, 210)' },
    },
    notThisPattern: [
      { signal: 'Tree-based problem', actually: 'Use tree-based designs' },
    ],
  }),

  'search-index-step4': d({
    whenAtThisStep: 'Search & index structure. Which type?',
    xray: [
      { text: '**search engine**: inverted index, full-text search, document ranking', kind: 'signal' },
      { text: '**database index**: b-tree, b+ tree, on-disk storage, efficient lookups', kind: 'signal' },
    ],
    budget: ['search engine', 'database index'],
    sayIt: ['Search engine (inverted index, full-text) or database index (b-tree, b+ tree)?'],
    branchGuides: {
      'search-engine-leaf': { proceed: 'search: inverted index, document retrieval, ranking' },
      'database-index-leaf': { proceed: 'database: b-tree/b+ tree for disk-backed indexed storage' },
    },
    notThisPattern: [
      { signal: 'Single data structure, not an indexing system', actually: 'Use tree-based or graph-based designs' },
    ],
  }),

  'reservation-systems-step4': d({
    whenAtThisStep: 'Reservation system. Which type?',
    xray: [
      { text: '**calendar**: appointment booking, time slots, overlap detection', kind: 'signal' },
      { text: '**resource booking**: seat assignment, allocation, availability', kind: 'signal' },
    ],
    budget: ['calendar', 'resource booking'],
    sayIt: ['Calendar/appointment system or resource booking/allocation system?'],
    branchGuides: {
      'calendar-leaf': { proceed: 'calendar: time slot management, overlap detection (LC 1229, 729)' },
      'resource-booking-leaf': { proceed: 'resource: allocate limited resources with conflict resolution' },
    },
    notThisPattern: [
      { signal: 'Not a reservation/bookin g problem', actually: 'Use parking or game systems' },
    ],
  }),

  'parking-systems-step4': d({
    whenAtThisStep: 'Parking system. Which features?',
    xray: [
      { text: '**spot tracking**: available/occupied spots, vehicle types', kind: 'signal' },
      { text: '**fee calculation**: hourly rates, tiered pricing, discounts', kind: 'signal' },
      { text: '**capacity management**: max capacity, entry/exit logging', kind: 'signal' },
    ],
    budget: ['spot tracking', 'fee calculation', 'capacity'],
    sayIt: ['Spot assignment tracking, fee/rate calculation, or capacity management?'],
    branchGuides: {
      'parking-system-leaf': { proceed: 'parking: spot assignment, rates, capacity (LC 1603)' },
    },
    notThisPattern: [
      { signal: 'Not a parking problem', actually: 'Use reservation or game systems' },
    ],
  }),

  'game-implementations-step4': d({
    whenAtThisStep: 'Game implementation. Which game type?',
    xray: [
      { text: '**board games**: chess, checkers, tic-tac-toe, grid-based', kind: 'signal' },
      { text: '**other games**: card games, puzzles, word games, simulations', kind: 'signal' },
    ],
    budget: ['board game', 'card game', 'puzzle'],
    sayIt: ['Board game (chess, tic-tac-toe) or other game (cards, puzzles, simulations)?'],
    branchGuides: {
      'board-games-leaf': { proceed: 'board: grid-based, move validation, win detection (LC 348, 794, 1275)' },
      'other-games-leaf': { proceed: 'other: card games, puzzles, word games, simulations' },
    },
    notThisPattern: [
      { signal: 'Not a game implementation', actually: 'Use reservation or parking systems' },
    ],
  }),

  'creational-patterns-step3': d({
    whenAtThisStep: 'Creational pattern. Which one?',
    xray: [
      { text: '**factory method**: interface for creation, subclasses decide type', kind: 'signal' },
      { text: '**singleton**: single instance, global access point', kind: 'signal' },
      { text: '**builder**: step-by-step construction, fluent interface', kind: 'signal' },
    ],
    budget: ['factory', 'singleton', 'builder'],
    sayIt: ['Factory method (polymorphic creation), singleton (single instance), or builder (fluent construction)?'],
    branchGuides: {
      'factory-leaf': { proceed: 'factory: interface-based creation, subclasses decide concrete type' },
      'singleton-leaf': { proceed: 'singleton: single instance with global access point' },
      'builder-leaf': { proceed: 'builder: step-by-step fluent construction of complex objects' },
    },
    notThisPattern: [
      { signal: 'Structural or behavioral pattern needed', actually: 'Use structural or behavioral patterns family' },
    ],
  }),

  'structural-patterns-step3': d({
    whenAtThisStep: 'Structural pattern. Which one?',
    xray: [
      { text: '**adapter**: convert interface, make incompatible classes work together', kind: 'signal' },
      { text: '**decorator**: add behavior dynamically, wrapper at runtime', kind: 'signal' },
      { text: '**composite**: tree structure, part-whole hierarchy, uniform interface', kind: 'signal' },
    ],
    budget: ['adapter', 'decorator', 'composite'],
    sayIt: ['Adapter (interface conversion), decorator (dynamic behavior), or composite (tree hierarchy)?'],
    branchGuides: {
      'adapter-leaf': { proceed: 'adapter: wrap incompatible interface with compatible one' },
      'decorator-leaf': { proceed: 'decorator: add responsibilities dynamically at runtime' },
      'composite-leaf': { proceed: 'composite: tree of part-whole hierarchies with uniform interface' },
    },
    notThisPattern: [
      { signal: 'Creational or behavioral pattern needed', actually: 'Use creational or behavioral patterns family' },
    ],
  }),

  'behavioral-patterns-step3': d({
    whenAtThisStep: 'Behavioral pattern. Which one?',
    xray: [
      { text: '**iterator**: sequential access to collection without exposing internals', kind: 'signal' },
      { text: '**observer**: one-to-many dependency, publish-subscribe', kind: 'signal' },
      { text: '**strategy**: interchangeable algorithms, runtime selection', kind: 'signal' },
    ],
    budget: ['iterator', 'observer', 'strategy'],
    sayIt: ['Iterator (collection traversal), observer (event notification), or strategy (interchangeable algorithm)?'],
    branchGuides: {
      'iterator-leaf': { proceed: 'iterator: sequential access to aggregate elements' },
      'observer-leaf': { proceed: 'observer: publish-subscribe, notify dependents on change' },
      'strategy-leaf': { proceed: 'strategy: family of interchangeable algorithms, runtime selection' },
    },
    notThisPattern: [
      { signal: 'Creational or structural pattern needed', actually: 'Use creational or structural patterns family' },
    ],
  }),
}

export function getDecisionEnhancement(id: string): DecisionEnhancement | undefined {
  return DECISION_ENHANCEMENTS[id]
}

export function getPatternGate(): PatternGateEnhancement {
  return PATTERN_GATE
}
