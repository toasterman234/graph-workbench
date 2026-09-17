# Handoff context

Updated 2026-09-17. This is the handoff for the next agent.

## Why this exists

The product direction is a visual environment for defining domain ontologies and then making methodology, workflows, state, artifacts, evidence, and execution inspectable as a graph. The immediate user pain is understanding what actually happened: plans, logs, evidence trails, artifacts, and work getting knocked off or blocked. Research is the first domain.

## Current MVP

The first slice intentionally starts with visual modeling:

1. Define object types and their semantics.
2. Define relationship types and endpoint constraints.
3. Place objects in a graph.
4. Define a methodology as a node with a reusable workflow subgraph.
5. Define workflow steps, states, transition conditions, and expected artifacts.
6. Inspect and edit definitions, then save or exchange JSON.

The bundled research example has 11 objects and 5 relationship types. The `Evidence-led research` methodology opens to six objects and five workflow edges.

## Decisions already made

- Workflow definitions are separate from runtime instances.
- A methodology subgraph is a focused view of the same graph, not a copied graph.
- This repository is an isolated local draft tool and does not mutate canonical PDS/Modelith/LinkML or source-native data.
- Existing ontology canvas experiments are historical evidence only.
- Definitions should remain inspectable and explicit. A completed state should eventually have evidence explaining why it is complete.
- Research findings must preserve uncertainty and conflicting evidence.

## Verification

- `npm test`: 4 passing model tests.
- Browser smoke test passed at `http://127.0.0.1:4317`.
- Browser showed the research graph, selected the methodology, and opened its workflow subgraph.
- No external data or credentials are bundled.

## Known limitations

- No real database or graph backend; data is browser localStorage.
- No multi-user collaboration or version history beyond undo/redo.
- No live execution, logs, evidence ingestion, artifact store, or runtime state.
- Inspector edits only descriptions for existing objects; richer typed property editing is not wired yet.
- Graph layout is manual and basic; it does not auto-layout or minimize edge crossings.
- The model schema is a practical draft, not an OWL/RDF/SHACL implementation.

## Recommended next slice

Use the editor to encode one real research methodology from Ben's work. Add richer property editing and explicit constraints first. Then add a separate runtime model for a research run: `Run`, `RunStep`, `LogEvent`, `Evidence`, `Artifact`, and `StateChange`, linked back to the methodology definition. A later adapter can ingest execution records without changing the definition graph.

## Product questions to resolve next

- Which research runner supplies the first real execution records?
- Which artifacts count as evidence for each step?
- Which state changes are automatic, human-confirmed, or evidence-gated?
- Should subgraphs be reusable modules, permissions boundaries, saved views, or all three?
- Which semantic interchange format matters first: JSON, RDF/OWL, LinkML, or a project-specific format?

## Repository hygiene

The source of truth is this repository. Do not copy files from deprecated Vault experiments into it without a new decision. Keep runtime integrations in separate modules and document whether they are read-only, derived, or authoritative.
