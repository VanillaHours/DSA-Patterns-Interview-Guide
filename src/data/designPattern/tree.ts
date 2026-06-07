import type { TaxonomyNode } from '../../types'
import { branch, decision } from './helpers'
import * as L from './leaves'

const treeBasedDesigns: TaxonomyNode = decision(
  'tree-based-designs-step4',
  'Tree-Based Designs',
  'teal',
  4,
  'Do you need hierarchical storage, ordered lookups, or path-based retrieval?',
  [
    branch(
      ['"prefix lookup"', '"autocomplete"', '"spell checker"', '"word search"'],
      'Trie Implementation',
      'Store strings in a prefix tree for fast prefix-based lookups.',
      L.trieImpl,
    ),
    branch(
      ['"binary search tree"', '"ordered map"', '"sorted data"', '"range queries"'],
      'Binary Search Tree',
      'Maintain sorted keys with O(log n) insert, delete, and search.',
      L.bst,
    ),
    branch(
      ['"segment tree"', '"fenwick tree"', '"range sum"', '"interval query"'],
      'Advanced Tree Structures',
      'Specialized trees for range queries, LCA, or balanced rotations.',
      L.advancedTree,
    ),
  ],
)

const graphBasedDesigns: TaxonomyNode = decision(
  'graph-based-designs-step4',
  'Graph-Based Designs',
  'teal',
  4,
  'Are you modeling relationships between entities or traversing networks?',
  [
    branch(
      ['"adjacency list"', '"adjacency matrix"', '"graph traversal"', '"bfs"', '"dfs"'],
      'Basic Graph Implementation',
      'Represent vertices and edges with standard graph primitives.',
      L.basicGraphImpl,
    ),
    branch(
      ['"weighted graph"', '"shortest path"', '"minimum spanning tree"', '"topological sort"'],
      'Specialized Graph',
      'Graphs with weighted edges, directed acyclic structures, or pathfinding.',
      L.specializedGraph,
    ),
  ],
)

const searchIndexDesigns: TaxonomyNode = decision(
  'search-index-step4',
  'Search & Index Structures',
  'teal',
  4,
  'Are you building a search engine or a database index for fast queries?',
  [
    branch(
      ['"full-text search"', '"inverted index"', '"document retrieval"', '"ranking"'],
      'Search Engine',
      'Index documents for fast keyword-based search with relevance ranking.',
      L.searchEngine,
    ),
    branch(
      ['"b-tree"', '"b+ tree"', '"database index"', '"disk-based storage"'],
      'Database Index',
      'Design on-disk or in-memory index structures for efficient lookups.',
      L.databaseIndex,
    ),
  ],
)

const treeGraphStep3: TaxonomyNode = decision(
  'tree-graph-step3',
  'Tree & Graph Structures',
  'teal',
  3,
  'Does the problem require tree-based, graph-based, or search-index data structures?',
  [
    branch(
      ['"binary tree"', '"bst"', '"trie"', '"segment tree"', '"nested"', '"hierarchy"'],
      'Tree-Based Designs',
      'Hierarchical data needs tree structures for efficient access and ordering.',
      treeBasedDesigns,
    ),
    branch(
      ['"directed graph"', '"undirected graph"', '"dag"', '"network"', '"vertex"', '"edge"'],
      'Graph-Based Designs',
      'Interconnected entities map naturally to graph representations.',
      graphBasedDesigns,
    ),
    branch(
      ['"search"', '"index"', '"query"', '"retrieval"', '"lookup"'],
      'Search & Index Structures',
      'Fast query and retrieval require specialized indexing strategies.',
      searchIndexDesigns,
    ),
  ],
)

const cacheDesignStep3: TaxonomyNode = decision(
  'cache-design-step3',
  'Cache Design',
  'teal',
  3,
  'What eviction policy or caching strategy does the problem describe?',
  [
    branch(
      ['"least recently used"', '"lru"', '"recently accessed"', '"page replacement"'],
      'LRU Cache',
      'Evict the least recently accessed item when capacity is full.',
      L.lruCache,
    ),
    branch(
      ['"least frequently used"', '"lfu"', '"access count"', '"frequency"'],
      'LFU Cache',
      'Evict the least frequently accessed item, with tiebreakers for recency.',
      L.lfuCache,
    ),
    branch(
      ['"ttl"', '"time-to-live"', '"expiration"', '"stale data"', '"time window"'],
      'Time-Based Caching',
      'Evict or refresh entries based on absolute time or sliding windows.',
      L.timeBasedCaching,
    ),
  ],
)

const customHashStep3: TaxonomyNode = decision(
  'custom-hash-step3',
  'Custom Hash Structures',
  'teal',
  3,
  'Do you need a custom hash map, hash set, or a specialized hashing approach?',
  [
    branch(
      ['"hash table"', '"hash map"', '"dictionary"', '"key-value"', '"collision"'],
      'Hash Map Implementation',
      'Design a hash map with chaining or open addressing for key-value storage.',
      L.hashmapImpl,
    ),
    branch(
      ['"hash set"', '"unique elements"', '"deduplication"', '"membership"'],
      'Hash Set Implementation',
      'Design a hash set for fast membership checks with uniqueness guarantees.',
      L.hashsetImpl,
    ),
    branch(
      ['"bloom filter"', '"consistent hash"', '"distributed hash"', '"rolling hash"'],
      'Specialized Hash',
      'Specialized hashing techniques for probabilistic or distributed use cases.',
      L.specializedHash,
    ),
  ],
)

const advancedCollectionsStep3: TaxonomyNode = decision(
  'advanced-collections-step3',
  'Advanced Collections',
  'teal',
  3,
  'Does the problem need multi-level data structures, stack/queue variations, or custom priority queues?',
  [
    branch(
      ['"multi-level"', '"nested structure"', '"compound key"', '"composite"'],
      'Multi-Level Data Structures',
      'Combine multiple primitive structures to model complex hierarchical data.',
      L.multiLevelDs,
    ),
    branch(
      ['"min stack"', '"deque"', '"circular buffer"', '"monotonic stack"', '"monotonic queue"'],
      'Stack & Queue Variants',
      'Augmented stacks or queues that track min/max or support range queries.',
      L.stackQueueVariants,
    ),
    branch(
      ['"priority queue"', '"heap"', '"custom comparator"', '"merge k sorted"'],
      'Custom Priority',
      'Design custom heap or priority queue with user-defined ordering.',
      L.customPriority,
    ),
  ],
)

const dataStructureDesign: TaxonomyNode = decision(
  'data-structure-design-step2',
  'Data Structure Design',
  'teal',
  2,
  'Does the problem involve building a cache, hash structure, advanced collection, or tree/graph?',
  [
    branch(
      ['"cache"', '"eviction"', '"lru"', '"lfu"', '"ttl"', '"expiration"'],
      'Cache Design',
      'Caching problems focus on eviction policies and fast lookups under capacity constraints.',
      cacheDesignStep3,
    ),
    branch(
      ['"hash"', '"hash set"', '"hash map"', '"dictionary"', '"bloom filter"'],
      'Custom Hash Structures',
      'Hash-based data structures focus on collision resolution and performance guarantees.',
      customHashStep3,
    ),
    branch(
      ['"stack"', '"queue"', '"deque"', '"priority"', '"heap"', '"collection"'],
      'Advanced Collections',
      'Combinations or variants of fundamental data structures for specific access patterns.',
      advancedCollectionsStep3,
    ),
    branch(
      ['"tree"', '"graph"', '"trie"', '"bst"', '"segment"', '"index"', '"search"'],
      'Tree & Graph Structures',
      'Hierarchical or relational data modeled through trees, graphs, and indexes.',
      treeGraphStep3,
    ),
  ],
)

const fileSystemStep3: TaxonomyNode = decision(
  'file-system-step3',
  'File System Design',
  'blue',
  3,
  'Is the problem about organizing files and directories or performing file operations?',
  [
    branch(
      ['"directory"', '"folder"', '"path"', '"hierarchy"', '"nested"', '"tree"'],
      'Directory Structure',
      'Model the hierarchical organization of files and directories.',
      L.directoryStructure,
    ),
    branch(
      ['"read"', '"write"', '"delete"', '"copy"', '"move"', '"file"', '"content"'],
      'File Operations',
      'Handle CRUD operations on files, content management, and access control.',
      L.fileOperations,
    ),
  ],
)

const rateLimitersStep3: TaxonomyNode = decision(
  'rate-limiters-step3',
  'Rate Limiters',
  'blue',
  3,
  'What rate limiting strategy does the problem require?',
  [
    branch(
      ['"sliding window"', '"fixed window"', '"request count"', '"rate limit"', '"quota"'],
      'Window-Based Limiters',
      'Count requests within a time window and reject when the quota is exceeded.',
      L.windowBasedLimiters,
    ),
    branch(
      ['"token bucket"', '"leaky bucket"', '"burst"', '"refill"', '"throttle"'],
      'Token Bucket',
      'Tokens accumulate at a fixed rate; each request consumes one or more tokens.',
      L.tokenBucket,
    ),
  ],
)

const memoryManagementStep3: TaxonomyNode = decision(
  'memory-management-step3',
  'Memory Management',
  'blue',
  3,
  'Does the problem involve object pooling or memory-efficient data representation?',
  [
    branch(
      ['"object pool"', '"memory pool"', '"allocate"', '"deallocate"', '"reuse"'],
      'Pool Allocators',
      'Pre-allocate a pool of objects to avoid frequent allocation and garbage collection.',
      L.poolAllocators,
    ),
    branch(
      ['"memory efficient"', '"compact"', '"sparse"', '"bitfield"', '"encoding"'],
      'Memory Efficient Structures',
      'Represent data in compact forms to minimize memory footprint.',
      L.memoryEfficient,
    ),
  ],
)

const reservationSystems: TaxonomyNode = decision(
  'reservation-systems-step4',
  'Reservation Systems',
  'blue',
  4,
  'Are you booking time slots or managing resource availability?',
  [
    branch(
      ['"calendar"', '"appointment"', '"time slot"', '"schedule"', '"booking"'],
      'Calendar Systems',
      'Manage time-based reservations with overlap detection and availability queries.',
      L.calendarSystems,
    ),
    branch(
      ['"resource booking"', '"seat reservation"', '"allocation"', '"availability"'],
      'Resource Booking',
      'Allocate limited resources to users with conflict resolution.',
      L.resourceBooking,
    ),
  ],
)

const parkingSystems: TaxonomyNode = decision(
  'parking-systems-step4',
  'Parking Systems',
  'blue',
  4,
  'Are you managing a parking lot with different vehicle types, rates, and space tracking?',
  [
    branch(
      ['"parking lot"', '"parking spot"', '"vehicle"', '"rate"', '"capacity"'],
      'Parking System',
      'Track available spots, assign spaces, and calculate fees for parked vehicles.',
      L.parkingSystem,
    ),
  ],
)

const gameImplementations: TaxonomyNode = decision(
  'game-implementations-step4',
  'Game Implementations',
  'blue',
  4,
  'Are you implementing a board game or another type of game?',
  [
    branch(
      ['"chess"', '"checkers"', '"tic-tac-toe"', '"board"', '"grid"', '"turn-based"'],
      'Board Games',
      'Implement turn-based board games with move validation and win detection.',
      L.boardGames,
    ),
    branch(
      ['"card game"', '"puzzle"', '"word game"', '"simulation"', '"round-based"'],
      'Other Games',
      'Implement card games, puzzles, or simulation-based games.',
      L.otherGames,
    ),
  ],
)

const businessLogicStep3: TaxonomyNode = decision(
  'business-logic-step3',
  'Business Logic Components',
  'blue',
  3,
  'Is the problem about reservation systems, parking systems, or game implementations?',
  [
    branch(
      ['"reservation"', '"booking"', '"appointment"', '"calendar"', '"scheduling"'],
      'Reservation Systems',
      'Manage reservations with time slots, resource allocation, and conflict detection.',
      reservationSystems,
    ),
    branch(
      ['"parking"', '"garage"', '"vehicle"', '"spot"', '"fee"', '"lot"'],
      'Parking Systems',
      'Design a parking lot management system with space tracking and billing.',
      parkingSystems,
    ),
    branch(
      ['"game"', '"board"', '"chess"', '"tictactoe"', '"player"', '"move"', '"turn"'],
      'Game Implementations',
      'Implement game logic including moves, rules, and win/loss conditions.',
      gameImplementations,
    ),
  ],
)

const systemDesignComponents: TaxonomyNode = decision(
  'system-design-components-step2',
  'System Design Components',
  'blue',
  2,
  'Does the problem involve file systems, rate limiting, memory management, or business logic?',
  [
    branch(
      ['"file"', '"directory"', '"folder"', '"path"', '"filesystem"', '"storage"'],
      'File System Design',
      'Organize and manipulate hierarchical file and directory structures.',
      fileSystemStep3,
    ),
    branch(
      ['"rate limit"', '"throttle"', '"quota"', '"bucket"', '"window"', '"request"'],
      'Rate Limiters',
      'Control the rate of requests to APIs or services with various strategies.',
      rateLimitersStep3,
    ),
    branch(
      ['"memory"', '"pool"', '"allocate"', '"compact"', '"sparse"', '"efficient"'],
      'Memory Management',
      'Manage memory through pooling, compact representations, or allocation strategies.',
      memoryManagementStep3,
    ),
    branch(
      ['"reservation"', '"booking"', '"parking"', '"game"', '"business"', '"logic"'],
      'Business Logic Components',
      'Implement domain-specific business rules and workflow logic.',
      businessLogicStep3,
    ),
  ],
)

const navigationStep3: TaxonomyNode = decision(
  'navigation-step3',
  'Navigation Systems',
  'green',
  3,
  'Are you implementing browser history navigation or menu navigation?',
  [
    branch(
      ['"browser history"', '"back"', '"forward"', '"url"', '"navigation stack"'],
      'Browser History',
      'Manage forward/back navigation with a stack or doubly linked list.',
      L.browserHistory,
    ),
    branch(
      ['"menu"', '"navigation"', '"dropdown"', '"sidebar"', '"tabs"'],
      'Menu Navigation',
      'Design hierarchical or flat menus for application navigation.',
      L.menuNavigation,
    ),
  ],
)

const textEditorsStep3: TaxonomyNode = decision(
  'text-editors-step3',
  'Text Editors',
  'green',
  3,
  'Does the problem describe a text editor with cursor operations and content manipulation?',
  [
    branch(
      ['"text editor"', '"cursor"', '"insert"', '"delete"', '"undo"', '"redo"'],
      'Text Editor',
      'Design a text editor with cursor movement, insertion, deletion, and undo/redo.',
      L.textEditor,
    ),
  ],
)

const typeaheadStep3: TaxonomyNode = decision(
  'typeahead-step3',
  'Typeahead & Autocomplete',
  'green',
  3,
  'Does the problem require real-time suggestions as the user types?',
  [
    branch(
      ['"autocomplete"', '"typeahead"', '"suggestion"', '"prefix"', '"predictive"'],
      'Autocomplete System',
      'Suggest completions based on prefix matching and frequency ranking.',
      L.autocompleteSystem,
    ),
  ],
)

const uiComponents: TaxonomyNode = decision(
  'ui-components-step2',
  'User Interface Components',
  'green',
  2,
  'Does the problem involve navigation, text editing, or typeahead/autocomplete?',
  [
    branch(
      ['"navigation"', '"browser"', '"history"', '"back"', '"forward"', '"menu"'],
      'Navigation Systems',
      'Manage user navigation state with history stacks or menu structures.',
      navigationStep3,
    ),
    branch(
      ['"text editor"', '"cursor"', '"insert"', '"delete"', '"document"'],
      'Text Editors',
      'Implement editor primitives for document creation and manipulation.',
      textEditorsStep3,
    ),
    branch(
      ['"autocomplete"', '"typeahead"', '"suggestion"', '"predictive"', '"prefix"'],
      'Typeahead & Autocomplete',
      'Provide real-time search suggestions as users type queries.',
      typeaheadStep3,
    ),
  ],
)

const creationalPatternsStep3: TaxonomyNode = decision(
  'creational-patterns-step3',
  'Creational Patterns',
  'purple',
  3,
  'Which creational pattern fits the object creation problem?',
  [
    branch(
      ['"factory"', '"factory method"', '"create"', '"product"', '"polymorphic"'],
      'Factory Method',
      'Define an interface for creating objects but let subclasses decide the concrete type.',
      L.factoryMethod,
    ),
    branch(
      ['"singleton"', '"single instance"', '"global"', '"one and only"'],
      'Singleton',
      'Ensure a class has exactly one instance and provide a global access point.',
      L.singleton,
    ),
    branch(
      ['"builder"', '"fluent"', '"step-by-step"', '"complex object"', '"configuration"'],
      'Builder',
      'Construct complex objects step-by-step, separating construction from representation.',
      L.builder,
    ),
  ],
)

const structuralPatternsStep3: TaxonomyNode = decision(
  'structural-patterns-step3',
  'Structural Patterns',
  'purple',
  3,
  'Which structural pattern helps compose classes or objects?',
  [
    branch(
      ['"adapter"', '"wrapper"', '"convert"', '"compatible"', '"interface mismatch"'],
      'Adapter',
      'Convert one interface to another so incompatible classes can work together.',
      L.adapter,
    ),
    branch(
      ['"decorator"', '"wrapper"', '"enhance"', '"add behavior"', '"runtime"'],
      'Decorator',
      'Attach additional responsibilities to an object dynamically at runtime.',
      L.decorator,
    ),
    branch(
      ['"composite"', '"tree"', '"part-whole"', '"hierarchy"', '"uniform"'],
      'Composite',
      'Compose objects into tree structures to represent part-whole hierarchies.',
      L.composite,
    ),
  ],
)

const behavioralPatternsStep3: TaxonomyNode = decision(
  'behavioral-patterns-step3',
  'Behavioral Patterns',
  'purple',
  3,
  'Which behavioral pattern defines communication between objects?',
  [
    branch(
      ['"iterator"', '"traversal"', '"aggregate"', '"collection"', '"sequential"'],
      'Iterator Pattern',
      'Provide a way to access elements of a collection sequentially without exposing its internals.',
      L.iteratorPattern,
    ),
    branch(
      ['"observer"', '"event"', '"listener"', '"notify"', '"publish-subscribe"'],
      'Observer',
      'Define a one-to-many dependency so changes in one object notify all dependents.',
      L.observer,
    ),
    branch(
      ['"strategy"', '"algorithm"', '"interchangeable"', '"behavior"', '"policy"'],
      'Strategy',
      'Define a family of algorithms and make them interchangeable at runtime.',
      L.strategy,
    ),
  ],
)

const designPatternsPrinciples: TaxonomyNode = decision(
  'design-patterns-principles-step2',
  'Design Patterns & Principles',
  'purple',
  2,
  'Does the problem call for creational, structural, or behavioral design patterns?',
  [
    branch(
      ['"factory"', '"singleton"', '"builder"', '"creation"', '"object creation"'],
      'Creational Patterns',
      'Patterns that abstract the object instantiation process to make a system independent of how its objects are created.',
      creationalPatternsStep3,
    ),
    branch(
      ['"adapter"', '"decorator"', '"composite"', '"wrapper"', '"interface"'],
      'Structural Patterns',
      'Patterns that compose classes or objects to form larger structures while keeping them flexible and efficient.',
      structuralPatternsStep3,
    ),
    branch(
      ['"iterator"', '"observer"', '"strategy"', '"behavior"', '"communication"'],
      'Behavioral Patterns',
      'Patterns that define communication and assignment of responsibilities between objects.',
      behavioralPatternsStep3,
    ),
  ],
)

export const dpRoot: TaxonomyNode = decision(
  'dp-root',
  'Design Pattern',
  'slate',
  1,
  'Before coding: read the problem statement and identify what kind of system or structure you are designing. Which family matches?',
  [
    branch(
      ['"cache"', '"hash"', '"tree"', '"graph"', '"stack"', '"queue"', '"priority"', '"data structure"'],
      '→ Data Structure Design',
      'Build specialized data structures from scratch with custom operations.',
      dataStructureDesign,
    ),
    branch(
      ['"file"', '"rate limit"', '"memory"', '"reservation"', '"parking"', '"business"', '"system"'],
      '→ System Design Components',
      'Design subsystems like file systems, rate limiters, or business logic engines.',
      systemDesignComponents,
    ),
    branch(
      ['"navigation"', '"browser"', '"text editor"', '"autocomplete"', '"typeahead"', '"ui"'],
      '→ User Interface Components',
      'Implement interactive UI elements and user-facing features.',
      uiComponents,
    ),
    branch(
      ['"factory"', '"singleton"', '"builder"', '"adapter"', '"decorator"', '"observer"', '"strategy"'],
      '→ Design Patterns & Principles',
      'Apply classic GoF design patterns to solve object-oriented design problems.',
      designPatternsPrinciples,
    ),
  ],
  {
    explanation:
      'Design problems are open-ended. Start by identifying the domain: are you building a low-level data structure, a system component, a user interface, or applying a known design pattern? Each branch has a distinct readProblem to narrow further.',
  },
)
