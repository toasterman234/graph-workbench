import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export function D3Graph({ model, parent, selected, onSelect }) {
  const svgRef = useRef(null);
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = 1200;
    const height = 600;
    const graph = model.nodes.filter(n => n.parent === parent);
    const ids = new Set(graph.map(n => n.id));
    const links = model.edges.filter(e => ids.has(e.source) && ids.has(e.target)).map(e => ({ ...e }));
    const nodes = graph.map(n => ({ ...n }));
    const typeById = new Map(model.types.map(t => [t.id, t]));
    const relationById = new Map(model.relationships.map(r => [r.id, r]));
    const scene = svg.append('g');
    const defs = svg.append('defs');
    defs.append('pattern').attr('id', 'd3-grid').attr('width', 24).attr('height', 24).attr('patternUnits', 'userSpaceOnUse').append('circle').attr('cx', 1).attr('cy', 1).attr('r', 1).attr('fill', '#cbd5c9');
    defs.append('marker').attr('id', 'd3-arrow').attr('viewBox', '0 0 10 10').attr('refX', 9).attr('refY', 5).attr('markerWidth', 7).attr('markerHeight', 7).attr('orient', 'auto').append('path').attr('d', 'M0 0 10 5 0 10z').attr('fill', '#829485');
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', 'url(#d3-grid)');
    const edge = scene.append('g').selectAll('path').data(links).join('path').attr('fill', 'none').attr('stroke', '#829485').attr('stroke-width', 1.5).attr('marker-end', 'url(#d3-arrow)');
    const label = scene.append('g').selectAll('text').data(links).join('text').attr('class', 'edge-label').attr('text-anchor', 'middle').text(e => relationById.get(e.type)?.name || e.type);
    const card = scene.append('g').selectAll('g').data(nodes).join('g').attr('class', 'node').on('click', (event, n) => { event.stopPropagation(); onSelect(n); });
    card.append('rect').attr('width', 236).attr('height', 78).attr('rx', 7).attr('fill', '#fbfcf8').attr('stroke', n => selected === n.id ? '#39704c' : '#d2dbd0').attr('stroke-width', n => selected === n.id ? 2.5 : 1.2);
    card.append('rect').attr('width', 4).attr('height', 78).attr('rx', 2).attr('fill', n => typeById.get(n.type)?.color || '#668866');
    card.append('text').attr('x', 17).attr('y', 22).attr('class', 'node-type').attr('fill', n => typeById.get(n.type)?.color || '#668866').text(n => typeById.get(n.type)?.name?.toUpperCase() || n.type);
    card.append('text').attr('x', 17).attr('y', 47).attr('class', 'node-title').text(n => n.title);
    card.append('text').attr('x', 17).attr('y', 65).attr('class', 'node-subtitle').text(n => typeById.get(n.type)?.role === 'step' ? 'Planned' : typeById.get(n.type)?.role === 'methodology' ? 'Open workflow ↗' : 'Object definition');
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(280).strength(0.45))
      .force('charge', d3.forceManyBody().strength(-650))
      .force('collide', d3.forceCollide(145))
      .force('x', d3.forceX(width / 2).strength(0.08))
      .force('y', d3.forceY(height / 2).strength(0.08));
    simulation.on('tick', () => {
      edge.attr('d', e => `M${e.source.x + 118} ${e.source.y + 38} C${e.source.x + 250} ${e.source.y + 38},${e.target.x - 250} ${e.target.y + 38},${e.target.x - 118} ${e.target.y + 38}`);
      label.attr('x', e => (e.source.x + e.target.x) / 2).attr('y', e => (e.source.y + e.target.y) / 2 - 8);
      card.attr('transform', n => `translate(${n.x - 118},${n.y - 38})`);
    });
    card.call(d3.drag().on('start', (event, n) => { if (!event.active) simulation.alphaTarget(0.25).restart(); n.fx = n.x; n.fy = n.y; }).on('drag', (event, n) => { n.fx = event.x; n.fy = event.y; }).on('end', (event, n) => { if (!event.active) simulation.alphaTarget(0); n.fx = null; n.fy = null; }));
    svg.call(d3.zoom().scaleExtent([0.5, 2.5]).on('zoom', event => scene.attr('transform', event.transform)));
    return () => simulation.stop();
  }, [model, parent, selected, onSelect]);
  return <svg ref={svgRef} className="graph" viewBox="0 0 1200 600" role="img" aria-label="D3 force-directed ontology graph" />;
}
