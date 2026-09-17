import test from 'node:test'; import assert from 'node:assert/strict';
import { sampleModel, validateModel, parseModel, canConnect, removeNode, visibleGraph } from './model.mjs';
test('sample model validates and exposes workflow subgraph',()=>{const m=sampleModel();assert.equal(validateModel(m),m);const wf=visibleGraph(m,'research');assert.equal(wf.nodes.length,6);assert.equal(wf.edges.length,5)});
test('typed workflow relation rejects cross-workflow steps',()=>{const m=sampleModel();const r=m.relationships.find(x=>x.id==='precedes');const a=m.nodes.find(x=>x.id==='frame'),b=m.nodes.find(x=>x.id==='gather');assert.equal(canConnect(m,r,a,b),true);b.parent=null;assert.equal(canConnect(m,r,a,b),false)});
test('malformed JSON and dangling edges are rejected',()=>{assert.throws(()=>parseModel('{"version":1}'));const m=sampleModel();m.edges[0].source='missing';assert.throws(()=>validateModel(m))});
test('removing methodology removes its children and edges',()=>{const m=sampleModel();removeNode(m,'research');assert.equal(m.nodes.length,4);assert.equal(m.edges.length,1);assert.equal(validateModel(m),m)});
