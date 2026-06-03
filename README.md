# 🧠 DSA Patterns — Interview Cheatsheet

[![GitHub Pages](https://img.shields.io/badge/Live-GitHub%20Pages-blue?logo=github)](https://vanillahours.github.io/DSA-Patterns-Interview-Guide/)
[![Vite](https://img.shields.io/badge/built%20with-Vite-646cff?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)

> Proactive revision cheatsheets for coding interviews — one template per sub-pattern, 1–2 line changes per problem.  
> Forked from [Yassir-aykhlf/DSA-Taxonomies](https://github.com/Yassir-aykhlf/DSA-Taxonomies).

---

## 🌐 Live Site

**https://vanillahours.github.io/DSA-Patterns-Interview-Guide/**

---

## 📋 Available Patterns

| # | Pattern | Leaves | Problems |
|---|---------|--------|----------|
| 1 | **Two Pointers** 🎯 | 27 | 60+ |
| 2 | **Linked List** 🔗 | 16 | ~30 |
| 3 | **Sorting** 🔄 | 14 | ~30 |
| 4 | **Prefix Sum** 📊 | 14 | ~30 |
| 5 | **Hash Map / Set** 🗂️ | — | — |
| 6 | **Stack & Queue** 📚 | 23 | 60+ |
| 7 | **Heap / Priority Queue** ⛰️ | 13 | 36 |

---

## 🚀 Quick Start

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # production build to dist/
```

---

## 🎓 Training Flow

Each sub-pattern leaf walks you through **7 stages**:

| # | Stage | What it does |
|---|-------|--------------|
| 1 | 🔍 **Prompt X-Ray** | Highlights signals & constraints in real LeetCode wording |
| 2 | 🎯 **Constraint Budget** | Shows which constraint chips this leaf needs |
| 3 | 🗣️ **Say It Out Loud** | 15-second interview script with practice mode |
| 4 | 🧩 **Template Slots** | Mad Libs–style base code with per-problem fills |
| 5 | 🧬 **Variation Helix** | Evolution chain across related LC problems |
| 6 | 🩸 **Mistake Autopsy** | Wrong code → killing test case → one-line fix |
| 7 | ✅ **Topic Receipt** | Mark complete, export summary |

Plus extras: **family card grid**, **global constraint explorer**, **must-know table**.

---

## 🏗️ Architecture

```
src/
├── data/               # Pattern data (1 folder per pattern)
│   ├── twoPointers/
│   ├── hashMap/
│   ├── stackQueue/
│   ├── linkedList/
│   ├── sorting/
│   ├── prefixSum/
│   └── heap/
│       ├── helpers.ts          # Tree construction helpers
│       ├── asciiTree.ts        # Visual tree reference
│       ├── constraints.ts      # Constraint definitions
│       ├── familyMeta.ts       # Family-level metadata
│       ├── tree.ts             # Decision tree nodes & branches
│       ├── decisionEnhancements.ts  # Per-node training guides
│       ├── leafEnhancements.ts      # Per-leaf training guides
│       ├── leaves.ts           # Leaf templates & problem data
│       └── index.ts            # Barrel export
├── components/         # UI components (pattern-agnostic)
├── types/              # TypeScript interfaces
└── utils/              # Tree walk, constraint matching
```

Each pattern is registered in `data/patternData.ts` — adding a new pattern is just creating a folder + 1 line in the registry.

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| [Vite](https://vitejs.dev/) | Build tool ⚡ |
| [React 18](https://reactjs.org/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Types |
| [GitHub Pages](https://pages.github.com/) | Hosting |

---

## 📝 Adding a New Pattern

1. Copy an existing pattern folder (e.g., `prefixSum/`) and rename
2. Update `leaves.ts` with your templates & LC problems
3. Update `tree.ts` with the decision tree
4. Write `decisionEnhancements.ts` and `leafEnhancements.ts` matching the types
5. Register in `src/data/patternData.ts`
6. Add to `src/data/patternsMeta.ts`
7. Run `npx tsc --noEmit && npx vite build` to verify
