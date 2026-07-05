// components/layout/workflow-layout/FlowEditor.tsx
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  type DragEvent as ReactDragEvent,
} from "react";
import { ReactFlow, Background, MiniMap, useReactFlow, type ColorMode, type EdgeTypes } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useWorkflow } from "@/components/context/workflow-context";
import { ToolsPanel } from "./ToolsPanel";
import { NodeSidebar } from "./NodeSidebar";
import { useTheme, IThemeMode } from "@/components/context/theme-context";
import { NodeType } from "../types";
import { nodeComponents } from "../nodes";
import { CustomEdge } from "./CustomEdge";

interface FlowEditorProps {
  workflowId: string;
  initialNodes?: any[];
  initialEdges?: any[];
}

const edgeTypes: EdgeTypes = {
  default: CustomEdge,
};

export const FlowEditor = ({
  workflowId,
  initialNodes = [],
  initialEdges = [],
}: FlowEditorProps) => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setInitialNodes,
    setInitialEdges,
  } = useWorkflow();

  const { resolvedTheme } = useTheme();
  const { screenToFlowPosition } = useReactFlow();

  const colorMode: ColorMode = useMemo(() => {
    if (resolvedTheme === IThemeMode.DARK) return "dark";
    if (resolvedTheme === IThemeMode.LIGHT) return "light";
    return "system";
  }, [resolvedTheme]);

  useEffect(() => {
    if (initialNodes.length > 0) setInitialNodes(initialNodes);
  }, []);

  useEffect(() => {
    if (initialEdges.length > 0) setInitialEdges(initialEdges);
  }, []);

  const onDragOver = useCallback((event: ReactDragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: ReactDragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData(
        "application/reactflow",
      ) as NodeType;
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      addNode(type, position);
    },
    [addNode, screenToFlowPosition],
  );

  const onDragStart = useCallback(
    (event: ReactDragEvent<HTMLDivElement>, nodeType: NodeType) => {
      event.dataTransfer.setData("application/reactflow", nodeType);
      event.dataTransfer.effectAllowed = "move";
    },
    [],
  );

  return (
    <div className="flex h-full">
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeComponents}
          edgeTypes={edgeTypes}
          colorMode={colorMode}
          selectionOnDrag
          panOnScroll
          zoomOnScroll
          zoomOnDoubleClick
          nodesDraggable
          nodesConnectable
          elementsSelectable
          deleteKeyCode={["Delete", "Backspace"]}
          defaultEdgeOptions={{
            type: "default",
            animated: false,
          }}
        >
          <NodeSidebar onDragStart={onDragStart} />
          <Background />
          <MiniMap position="bottom-right" />
          <ToolsPanel position="top-right" />
        </ReactFlow>
      </div>
    </div>
  );
};