---
title: Memory Providers
description: Learn how memory works in MAIAR and how to build your own provider
sidebar_position: 2
---

# Memory in MAIAR

A _memory provider_ is the persistence layer that MAIAR uses to store the things an agent has seen and done – trigger events, context chains, and any metadata that might be useful the next time the agent is invoked.

MAIAR's design treats memory as an append-only ledger of _tasks_ that happened in a given [Space](../04-core-utilities/spaces.md). Every provider implements the same small interface so that you can back your agent with SQLite, Postgres, Redis, MongoDB — or your own exotic storage engine — without touching core runtime code.

---

## High-level flow

1. A plugin trigger fires and creates an `AgentTask` object containing the initial **trigger context** plus an empty `contextChain`.
2. The runtime hands the task to the `MemoryManager`.
3. `MemoryManager` calls `memoryProvider.storeMemory(...)` so the trigger is persisted _before_ the pipeline starts.
4. Each pipeline step can update the persisted row via `updateMemory(...)` (usually to attach the completed `contextChain`).
5. When later work needs historical context it calls `queryMemory(...)` with flexible filtering options (time-range, space prefix, etc.).

---

## Core concepts

### Memory

```ts
interface Memory {
  id: string; // uuid generated by the provider
  spaceId: string; // identifier of the space the task occurred in
  trigger: string; // JSON-stringified Context that kicked things off
  context?: string; // JSON-stringified final context chain (set later)
  createdAt: number; // unix ms timestamp of the trigger
  updatedAt?: number; // unix ms timestamp of the last update
  metadata?: Record<string, unknown>; // free-form user data
}
```

### Space

A _Space_ is a hierarchical address (think folder path) that groups related memories. A request can:

- look **inside one concrete space** (`spaceId`), or
- **fan-out** to _related_ spaces by:
  - `prefix` – any `spaceId` that _starts with_ the given string
  - `pattern` – a SQLite/Posix glob or SQL regex pattern.

```ts
interface Space {
  id: string;
  relatedSpaces?: {
    prefix?: string;
    pattern?: string;
  };
}
```

:::info
Want the full details on Spaces? Check the dedicated guide: [Spaces](../04-core-utilities/spaces.md)
:::

---

## The Memory Plugin

Each provider ships with a **Memory Plugin** – a normal MAIAR plugin that wraps the raw storage API in a few high-level executors so the pipeline (and your prompts) can manipulate memory using plain language commands instead of SQL/REST calls. This memory table should be it's own sandboxed table in the database so the agent can't modify action execution history.

### Why a plugin?

- Keeps the runtime 100 % storage-agnostic – the plugin knows _how_ to talk to the database so the LLM doesn't have to.
- Lets LLMs reuse the same verbs (`memory:query`, `memory:add_document`, `memory:remove_document`) no matter which database you swap in.
- Gives you a single place to expose **extra** capabilities – e.g. full-text search, vector similarity, bulk import – without changing core code.

### Standard executors

| Executor                 | Purpose                                                  |
| ------------------------ | -------------------------------------------------------- |
| `memory:query`           | Retrieve memories that match a SQL / SQL-like predicate. |
| `memory:add_document`    | Persist an arbitrary text blob as a new memory row.      |
| `memory:remove_document` | Delete documents that match a query.                     |

The concrete names match the table below for built-in providers, but you can add your own.

```ts
// inside a pipeline step definition
{
  pluginId: "plugin-sqlite-memory",
  action: "memory:query"
}
```

## When a plugin is available on the memory providers `getPlugin()` method, it is automatically registered when the provider is registered.

## The `MemoryProvider` interface

```ts
abstract class MemoryProvider {
  // lifecycle
  init(): Promise<void> | void;
  checkHealth(): Promise<void> | void;
  shutdown(): Promise<void> | void;

  // every provider ships with a plugin so that the agent can
  //   ◦ query its own past            (memory:query)
  //   ◦ save arbitrary docs/snippets  (memory:add_document)
  //   ◦ remove stale docs             (memory:remove_document)

  getPlugin(): Plugin;

  // data operations
  storeMemory(memory: Omit<Memory, "id">): Promise<string>;
  updateMemory(id: string, patch: Partial<Memory>): Promise<void>;
  queryMemory(options: QueryMemoryOptions): Promise<Memory[]>;
}
```

The runtime registers exactly one provider:

```ts
const runtime = await Runtime.init({
  modelProviders: [openAiProvider],
  memoryProvider: new SQLiteMemoryProvider({ dbPath: "./data/memory.db" }),
  plugins: [...otherPlugins],
  capabilityAliases: []
});
```

Internally `Runtime` → `MemoryManager` → your provider – nothing else touches the database.

---

## Built-in providers

| Package                     | Storage     | Notes                                                 |
| --------------------------- | ----------- | ----------------------------------------------------- |
| `@maiar-ai/memory-sqlite`   | SQLite file | Zero-dependency, great for local agents & tests       |
| `@maiar-ai/memory-postgres` | Postgres    | Scales vertically and horizontally, use in production |

Each ships with a **Memory Plugin** exposing the three executor-style actions (`memory:query`, `memory:add_document`, `memory:remove_document`) so pipelines and LLM prompts can manipulate long-term memory directly.

---

## Writing your own provider

1. **Extend** `MemoryProvider` and wire up your backend in `init()`
2. **Implement** the CRUD methods – keep them _fast_; they may run inside tight loops.
3. **Return** a `Plugin` from `getPlugin()` if you want chat-ops style access. A minimal stub is fine:
   ```ts
   class RedisMemoryPlugin extends Plugin {
     // …expose redis-specific executors here
   }
   ```
4. **Health checks** should be _cheap_ and _side-effect free_. The runtime calls `checkHealth()` once during startup.
5. **Index wisely** – queries are most often filtered by `space_id` plus `created_at`.

---

## Working with Spaces

Memory queries get their power from Spaces. A space can be the current Discord channel, a user DM, or a sub-thread inside Notion. Using `relatedSpaces` you can pull in past context that shares a common prefix (e.g. _all DM sessions with user_).

For the full spec and best-practice patterns, see the dedicated Spaces documentation: **[Spaces →](../04-core-utilities/spaces.md)**.
