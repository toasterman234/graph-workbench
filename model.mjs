export const STORAGE_KEY = 'graph-workbench.v1';
export const clone = value => structuredClone(value);
export const uid = () => crypto.randomUUID();
export function sampleModel() {
  const types = [
    ['methodology', 'Methodology', '#537b68', 'methodology', 'A reusable way of organizing research.'],
    ['step', 'Step', '#667caf', 'step', 'An activity definition with expected outputs and completion criteria.'],
    ['question', 'Question', '#a37b42', 'entity', 'A question that a research process is intended to address.'],
    ['source', 'Source', '#88759c', 'entity', 'Material that can support or challenge a finding.'],
    ['finding', 'Finding', '#a56d60', 'entity', 'A conclusion with explicit evidence and uncertainty.'],
    ['artifact', 'Artifact', '#5b8c92', 'entity', 'An expected document or other research output.'],
  ].map(([id, name, color, role, description]) => ({ id, name, color, role, description, properties: [] }));
  const relationships = [
    ['addresses', 'addresses', 'methodology', 'question', 'The question this methodology is intended to investigate.', false],
    ['uses', 'uses', '*', 'source', 'An input to an activity or methodology.', false],
    ['produces', 'produces', '*', '*', 'An expected output. This does not assert that the output already exists.', false],
    ['supports', 'supports', 'source', 'finding', 'Evidence supporting a finding; not proof of its truth.', false],
    ['precedes', 'precedes', 'step', 'step', 'Directed workflow order; its condition describes when the next step may begin.', true],
  ].map(([id, name, sourceType, targetType, description, flow]) => ({ id, name, sourceType, targetType, description, flow }));
  const node = (id, type, title, x, y, parent = null, description = '', criteria = '') => ({ id, type, title, x, y, parent, description, criteria, states: type === 'step' ? ['Planned', 'In progress', 'Review', 'Complete'] : [], properties: {} });
  const nodes = [
    node('research', 'methodology', 'Evidence-led research', 410, 200, null, 'An illustrative research methodology. Open this node to explore its four-step workflow.'),
    node('question', 'question', 'The research question', 70, 80, null, 'Define the question and boundaries before gathering material.'),
    node('sources', 'source', 'Source collection', 70, 370, null, 'The sources this methodology expects as inputs.'),
    node('finding', 'finding', 'Supported findings', 780, 90, null, 'Expected findings, linked to evidence and limitations.'),
    node('report', 'artifact', 'Research brief', 780, 380, null, 'Expected synthesis artifact; this sample does not represent completed research.'),
    node('frame', 'step', 'Frame the question', 50, 170, 'research', 'Define scope, terms, and what would count as a useful answer.', 'A bounded question and explicit inclusion criteria.'),
    node('gather', 'step', 'Gather sources', 345, 170, 'research', 'Collect relevant material and record its provenance.', 'Sources have links, provenance, and relevance notes.'),
    node('analyze', 'step', 'Analyze evidence', 640, 170, 'research', 'Compare claims, disagreements, and limitations.', 'Each finding links to evidence; uncertainty is recorded.'),
    node('synthesize', 'step', 'Synthesize findings', 935, 170, 'research', 'Answer the question and document what remains unresolved.', 'A reviewed brief with citations and open questions.'),
    node('notes', 'artifact', 'Evidence notes', 345, 410, 'research', 'Expected source notes and quotations with provenance.'),
    node('synthesis', 'artifact', 'Synthesis document', 935, 410, 'research', 'Expected final output of the methodology.'),
  ];
  const edge = (id, type, source, target, condition = '') => ({ id, type, source, target, condition, description: '' });
  return { version: 1, name: 'Research studio', description: 'A local draft model of research concepts and methodology.', types, relationships, nodes, edges: [
    edge('r1', 'addresses', 'research', 'question'), edge('r2', 'uses', 'research', 'sources'), edge('r3', 'produces', 'research', 'finding'), edge('r4', 'produces', 'research', 'report'), edge('r5', 'supports', 'sources', 'finding'),
    edge('w1', 'precedes', 'frame', 'gather', 'The question and scope are agreed.'), edge('w2', 'precedes', 'gather', 'analyze', 'Sources are recorded with provenance.'), edge('w3', 'precedes', 'analyze', 'synthesize', 'Findings include evidence and limitations.'), edge('w4', 'produces', 'gather', 'notes'), edge('w5', 'produces', 'synthesize', 'synthesis'),
  ] };
}
export function blankModel() { const m = sampleModel(); return { ...m, name: 'Untitled model', description: '', nodes: [], edges: [] }; }
export function canConnect(model, rel, source, target) {
  return Boolean(source && target && rel && (rel.sourceType === '*' || rel.sourceType === source.type) && (rel.targetType === '*' || rel.targetType === target.type) && (!rel.flow || (source.parent && source.parent === target.parent && model.types.find(t => t.id === source.type)?.role === 'step' && model.types.find(t => t.id === target.type)?.role === 'step' && source.id !== target.id)));
}
export function validateModel(m) {
  const fail = message => { throw new Error(message); };
  const string = (value, label, required = false) => { if (typeof value !== 'string' || value.length > 20000 || (required && !value.trim())) fail(`${label} must be ${required ? 'nonempty ' : ''}text (at most 20,000 characters).`); };
  if (!m || m.version !== 1) fail('Expected a Graph Workbench version 1 document.');
  string(m.name, 'Model name', true); string(m.description, 'Model description');
  for (const key of ['types', 'relationships', 'nodes', 'edges']) {
    if (!Array.isArray(m[key]) || m[key].length > 2000) fail(`${key} must be a list of at most 2,000 entries.`);
    const ids = new Set();
    for (const item of m[key]) {
      if (!item || typeof item !== 'object') fail(`Invalid ${key} entry.`);
      string(item.id, `${key} ID`, true);
      if (ids.has(item.id)) fail(`Duplicate ${key} ID: ${item.id}`); ids.add(item.id);
    }
  }
  const types = new Map(m.types.map(t => [t.id, t]));
  const rels = new Map(m.relationships.map(r => [r.id, r]));
  const nodes = new Map(m.nodes.map(n => [n.id, n]));
  for (const t of m.types) {
    string(t.name, 'Type name', true); string(t.description, 'Type description');
    if (!/^#[0-9a-f]{6}$/i.test(t.color)) fail('Type color must be a six-digit hex color.');
    if (!['entity', 'step', 'methodology'].includes(t.role)) fail('Unknown type role.');
    if (!Array.isArray(t.properties)) fail('Type properties must be a list.');
    const names = new Set();
    for (const p of t.properties) {
      if (!p || !/^[A-Za-z][A-Za-z0-9_]*$/.test(p.name) || ['__proto__', 'constructor', 'prototype'].includes(p.name) || names.has(p.name)) fail('Property names must be unique identifiers.');
      names.add(p.name);
      if (!['string', 'number', 'boolean'].includes(p.type)) fail('Property type must be string, number, or boolean.');
    }
  }
  for (const r of m.relationships) {
    string(r.name, 'Relationship name', true); string(r.description, 'Relationship description');
    if (typeof r.flow !== 'boolean') fail('Relationship flow must be boolean.');
    for (const k of ['sourceType', 'targetType']) if (r[k] !== '*' && !types.has(r[k])) fail('Relationship refers to an unknown object type.');
  }
  for (const n of m.nodes) {
    if (!types.has(n.type)) fail('Object refers to an unknown type.');
    string(n.title, 'Object title', true); string(n.description, 'Object description'); string(n.criteria, 'Completion criteria');
    if (![n.x, n.y].every(v => Number.isFinite(v) && Math.abs(v) <= 100000)) fail('Object position is invalid.');
    if (n.parent !== null && (!nodes.has(n.parent) || types.get(nodes.get(n.parent).type).role !== 'methodology' || n.parent === n.id)) fail('Subgraph parent must be another methodology object.');
    const visited = new Set([n.id]); let parent = n.parent;
    while (parent) { if (visited.has(parent)) fail('Methodology nesting cannot form a cycle.'); visited.add(parent); parent = nodes.get(parent)?.parent; }
    if (!Array.isArray(n.states) || n.states.length > 100 || n.states.some(s => typeof s !== 'string' || !s.trim() || s.length > 200) || new Set(n.states).size !== n.states.length) fail('States must be unique, nonempty names (maximum 100).');
    if (!n.properties || typeof n.properties !== 'object' || Array.isArray(n.properties)) fail('Object properties must be a JSON object.');
    for (const [name, value] of Object.entries(n.properties)) {
      const definition = types.get(n.type).properties.find(p => p.name === name);
      if (!definition || typeof value !== definition.type || (typeof value === 'number' && !Number.isFinite(value))) fail(`Property ${name} does not match its type definition.`);
    }
  }
  for (const e of m.edges) {
    const r = rels.get(e.type);
    if (!canConnect(m, r, nodes.get(e.source), nodes.get(e.target))) fail('Relationship endpoints violate the type or workflow constraints. Workflow steps must share a methodology.');
    string(e.condition, 'Transition condition'); string(e.description, 'Relationship description');
  }
  return m;
}
export function parseModel(text) {
  if (text.length > 2_000_000) throw new Error('Import is limited to 2 MB.');
  return validateModel(JSON.parse(text));
}
export function removeNode(model, id) {
  const remove = new Set([id]);
  let changed = true;
  while (changed) { changed = false; for (const n of model.nodes) if (remove.has(n.parent) && !remove.has(n.id)) { remove.add(n.id); changed = true; } }
  model.nodes = model.nodes.filter(n => !remove.has(n.id));
  model.edges = model.edges.filter(e => !remove.has(e.source) && !remove.has(e.target));
}
export function visibleGraph(model, parent = null) {
  const nodes = model.nodes.filter(n => n.parent === parent);
  const ids = new Set(nodes.map(n => n.id));
  return { nodes, edges: model.edges.filter(e => ids.has(e.source) && ids.has(e.target)) };
}
