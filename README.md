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

## React prototype

The repository also contains a minimal React/Vite surface under `react-app/`.

```bash
cd react-app
npm install
npm run dev
```

It reuses the version 1 model and sample data from the parent directory. The React surface is intentionally read-only and small while the vanilla MVP remains the fuller editing reference.

### Graph visualization choices

| Option | Best fit | Tradeoff |
| --- | --- | --- |
| React + SVG (current prototype) | Small custom editor, full control over semantics and styling | We own layout, hit testing, pan/zoom, and edge routing |
| React Flow / XYFlow | Fast node editor with handles, selection, minimap, and custom React nodes | Its workflow-centric model may need adaptation for ontology semantics and very large graphs |
| Cytoscape.js | Mature graph algorithms, compound nodes, filtering, and larger graph exploration | Imperative integration and less natural React component model |
| Sigma.js + graphology | Large read-heavy graph exploration and WebGL rendering | More work for rich node editing and workflow authoring |
| D3 | Bespoke layouts and data visualizations | Lowest-level option; highest implementation cost |

Recommendation: use **React Flow/XYFlow** when editing interactions become the bottleneck; use **Cytoscape.js** for a later large-graph explorer; keep the current SVG model as the semantic reference and smallest dependency surface.
