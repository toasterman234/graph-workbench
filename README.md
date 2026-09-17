# Graph Workbench

Graph Workbench is a small, local-first visual editor for modeling ontologies and methodology workflows. It is the first MVP for a broader idea: make the objects, relationships, processes, state, artifacts, and evidence of work visible in one connected workspace.

The current example is an illustrative research methodology. It shows how a `Methodology` contains `Step` objects, how steps produce artifacts, and how sources support findings. Double-click **Evidence-led research** to open its workflow subgraph.

## Run it

Requires Node.js 20+ and no dependency install.

```bash
npm test
npm start
```

Then open <http://127.0.0.1:4317>.

## What is included

- SVG graph canvas with drag, pan, zoom, and fit view
- Object type definitions with roles, colors, descriptions, and properties
- Typed relationship definitions with endpoint constraints
- Methodology nodes and focused workflow subgraphs
- Workflow states, transition conditions, and completion criteria
- Inspector editing for objects and relationships
- Outline view, undo/redo, localStorage persistence, and JSON import/export
- Model validation that rejects malformed documents, dangling edges, invalid endpoints, and cyclic methodology nesting

## Deliberate boundary

This is a local draft authoring tool. It does not write to the Personal Domain System, import source-native data, execute workflows, or display live logs and evidence. Runtime instances and execution adapters are the next governed product slice. Definitions and future runtime instances are intentionally separate.

The prior `Canvas-First Ontology Lab` and `Semantic Canvas Fork` experiments are historical context, not this tool's semantic authority. Do not treat this repository as a replacement for Modelith or LinkML.

## Model format

`model.mjs` contains the version 1 document format, sample model, validation, and graph helpers. Exported JSON is portable and human-readable. The browser stores the current draft under `graph-workbench.v1` in localStorage.

## Handoff state

See [CONTEXT.md](CONTEXT.md) for the product intent, decisions, current evidence, known limitations, and a roadmap for the next agent.
