"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import dagre from "@dagrejs/dagre";
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  buildRelationshipChains,
  type BrandTokenMap,
  type FlatToken,
  type RelationshipChain,
} from "@/lib/token-relationship-model";
import styles from "./token-relationship-graph.module.css";

type Layer = "core" | "semantic" | "component" | "brand";

type GraphTokenData = {
  layer: Layer;
  token: FlatToken;
  accent?: string;
};

type TokenNode = Node<GraphTokenData, "token">;

export type TokenGraphBrand = {
  slug: string;
  label: string;
  source: string;
  tokens: BrandTokenMap;
};

export type TokenRelationshipGraphProps = {
  brands: TokenGraphBrand[];
  coreTokens: FlatToken[];
  semanticTokens: FlatToken[];
  componentTokens: FlatToken[];
  initialBrand?: string;
};

const LAYERS: Layer[] = ["core", "semantic", "component", "brand"];
const FEATURED = [
  "component-button-background-primary-solid-default",
  "component-button-border-primary-outlined-default",
  "component-button-content-primary-solid-default",
  "component-card-core-content-title-content-default",
  "component-card-core-content-meta-content-default",
  "component-accordion-background-default",
  "component-badge-background-highlight",
  "component-link-content-primary-default",
];

function displayValue(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

function colorValue(value: unknown) {
  return typeof value === "string" && /^(#|rgb|hsl)/i.test(value) ? value : undefined;
}

function TokenNodeView({ data, selected }: NodeProps<TokenNode>) {
  const value = displayValue(data.token.value);
  return (
    <div
      className={`${styles.node} ${selected ? styles.nodeSelected : ""}`}
      style={{ "--node-accent": data.accent } as React.CSSProperties}
    >
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <div className={styles.nodeLayer}>{data.layer}</div>
      <div className={styles.nodeName}>{data.token.canonicalName}</div>
      <div className={styles.nodeValue}>
        {colorValue(data.token.value) ? (
          <span className={styles.swatch} style={{ "--swatch": colorValue(data.token.value) } as React.CSSProperties} />
        ) : null}
        <span>{value}</span>
      </div>
      <Handle type="source" position={Position.Right} isConnectable={false} />
    </div>
  );
}

const nodeTypes = { token: TokenNodeView };

function layoutGraph(nodes: TokenNode[], edges: Edge[]) {
  const layerX: Record<Layer, number> = { core: 68, semantic: 292, component: 516, brand: 740 };
  const graph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: "LR", ranksep: 90, nodesep: 24, marginx: 36, marginy: 58 });
  nodes.forEach((node) => graph.setNode(node.id, { width: 210, height: 92 }));
  edges.forEach((edge) => graph.setEdge(edge.source, edge.target));
  dagre.layout(graph);

  return nodes.map((node) => {
    const position = graph.node(node.id);
    return { ...node, position: { x: layerX[node.data.layer], y: position.y - 46 } };
  });
}

function nodeId(layer: Layer, token: FlatToken) {
  return `${layer}:${token.canonicalName}`;
}

function graphElements(chains: RelationshipChain[], accent: string | undefined, visibleLayers: Set<Layer>) {
  const nodes = new Map<string, TokenNode>();
  const edges = new Map<string, Edge>();

  const addNode = (layer: Layer, token?: FlatToken) => {
    if (!token || !visibleLayers.has(layer)) return;
    const id = nodeId(layer, token);
    nodes.set(id, { id, type: "token", position: { x: 0, y: 0 }, data: { layer, token, accent: layer === "brand" ? accent : undefined } });
  };

  const addEdge = (sourceLayer: Layer, source: FlatToken | undefined, targetLayer: Layer, target: FlatToken | undefined) => {
    if (!source || !target || !visibleLayers.has(sourceLayer) || !visibleLayers.has(targetLayer)) return;
    const id = `${nodeId(sourceLayer, source)}>${nodeId(targetLayer, target)}`;
    edges.set(id, {
      id,
      source: nodeId(sourceLayer, source),
      target: nodeId(targetLayer, target),
      markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 },
      style: { stroke: "#82909d", strokeWidth: 1.25 },
    });
  };

  chains.forEach((chain) => {
    addNode("core", chain.core);
    addNode("semantic", chain.semantic);
    addNode("component", chain.component);
    addNode("brand", chain.brand);
    addEdge("core", chain.core, "semantic", chain.semantic);
    addEdge("semantic", chain.semantic, "component", chain.component);
    addEdge("component", chain.component, "brand", chain.brand);
  });

  const edgeList = [...edges.values()];
  return { nodes: layoutGraph([...nodes.values()], edgeList), edges: edgeList };
}

function GraphExperience(props: TokenRelationshipGraphProps) {
  const { fitView } = useReactFlow<TokenNode>();
  const [brandSlug, setBrandSlug] = useState(props.initialBrand ?? props.brands[0]?.slug ?? "");
  const [query, setQuery] = useState("");
  const [visibleLayers, setVisibleLayers] = useState<Set<Layer>>(() => new Set(LAYERS));
  const [selectedNode, setSelectedNode] = useState<TokenNode>();
  const brand = props.brands.find((candidate) => candidate.slug === brandSlug) ?? props.brands[0];

  const chains = useMemo(
    () =>
      brand
        ? buildRelationshipChains({
            coreTokens: props.coreTokens,
            semanticTokens: props.semanticTokens,
            componentTokens: props.componentTokens,
            brandTokens: brand.tokens,
            brandSource: brand.source,
          })
        : [],
    [brand, props.componentTokens, props.coreTokens, props.semanticTokens]
  );

  const shownChains = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery) {
      return chains.filter((chain) => chain.id.toLowerCase().includes(normalizedQuery)).slice(0, 14);
    }
    const featured = FEATURED.flatMap((id) => chains.find((chain) => chain.id === id) ?? []);
    return featured.length >= 4 ? featured : chains.slice(0, 8);
  }, [chains, query]);

  const accent = colorValue(brand?.tokens["brand-1"]?.value);
  const elements = useMemo(
    () => graphElements(shownChains, accent, visibleLayers),
    [accent, shownChains, visibleLayers]
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => fitView({ padding: 0.16, duration: 250 }));
    return () => cancelAnimationFrame(frame);
  }, [brandSlug, fitView, query, visibleLayers]);

  const toggleLayer = useCallback((layer: Layer) => {
    setSelectedNode(undefined);
    setVisibleLayers((current) => {
      const next = new Set(current);
      if (next.has(layer) && next.size > 1) next.delete(layer);
      else next.add(layer);
      return next;
    });
  }, []);

  return (
    <section className={styles.shell} aria-label="Token relationship explorer">
      <div className={styles.toolbar}>
        <label className={styles.field}>
          <span className={styles.label}>Brand snapshot</span>
          <select className={styles.select} value={brandSlug} onChange={(event) => { setSelectedNode(undefined); setBrandSlug(event.target.value); }}>
            {props.brands.map((option) => <option key={option.slug} value={option.slug}>{option.label}</option>)}
          </select>
        </label>
        <label className={`${styles.field} ${styles.fieldSearch}`}>
          <span className={styles.label}>Find component token</span>
          <input className={styles.input} type="search" value={query} onChange={(event) => { setSelectedNode(undefined); setQuery(event.target.value); }} placeholder="Try button, card, badge…" />
        </label>
        <fieldset className={styles.layers}>
          <legend className={styles.label}>Layers</legend>
          {LAYERS.map((layer) => (
            <label className={styles.layerToggle} key={layer}>
              <input type="checkbox" checked={visibleLayers.has(layer)} onChange={() => toggleLayer(layer)} />
              {layer}
            </label>
          ))}
        </fieldset>
        <button className={styles.button} type="button" onClick={() => fitView({ padding: 0.16, duration: 250 })}>Fit view</button>
      </div>

      <div className={styles.layout}>
        <div className={styles.canvas}>
          <div className={styles.laneLabels} aria-hidden="true">
            {LAYERS.map((layer) => <span key={layer}>{layer}</span>)}
          </div>
          {elements.nodes.length === 0 ? <p className={styles.empty}>No referenced component tokens match “{query}”. Try a broader token name.</p> : null}
          <ReactFlow<TokenNode, Edge>
            nodes={elements.nodes}
            edges={elements.edges}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            onNodeClick={(_, node) => setSelectedNode(node)}
            onPaneClick={() => setSelectedNode(undefined)}
            fitView
            minZoom={0.25}
            maxZoom={1.6}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#d6dce1" gap={22} size={1} />
            <Controls showInteractive={false} />
            <MiniMap pannable zoomable nodeColor={(node) => node.data?.layer === "brand" ? accent ?? "#1b5f8a" : "#9aa6b2"} />
          </ReactFlow>
        </div>
        <aside className={styles.inspector} aria-live="polite">
          <h2>Token inspector</h2>
          {selectedNode ? (
            <>
              <p className={styles.inspectorName}>{selectedNode.data.token.canonicalName}</p>
              <p className={styles.inspectorHint}>{selectedNode.data.layer === "brand" ? "Resolved value in the selected brand snapshot." : "Canonical source definition in the token pipeline."}</p>
              <dl className={styles.details}>
                <div><dt>Layer</dt><dd>{selectedNode.data.layer}</dd></div>
                <div><dt>Type</dt><dd>{selectedNode.data.token.type ?? "inferred"}</dd></div>
                <div><dt>Value</dt><dd className={styles.valueRow}>{colorValue(selectedNode.data.token.value) ? <span className={styles.swatch} style={{ "--swatch": colorValue(selectedNode.data.token.value) } as React.CSSProperties} /> : null}{displayValue(selectedNode.data.token.value)}</dd></div>
                <div><dt>Source</dt><dd>{selectedNode.data.token.source}</dd></div>
                <div><dt>Canonical path</dt><dd>{selectedNode.data.token.path}</dd></div>
              </dl>
            </>
          ) : (
            <p className={styles.inspectorHint}>Select any node to inspect its canonical name, source file, alias, or resolved brand value.</p>
          )}
        </aside>
      </div>
    </section>
  );
}

export function TokenRelationshipGraph(props: TokenRelationshipGraphProps) {
  return <ReactFlowProvider><GraphExperience {...props} /></ReactFlowProvider>;
}
