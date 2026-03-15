// components/layout/workflow-layout/flow-editor.tsx
"use client";

import { useTheme } from "@/components/context/theme-context";
import {
	Background,
	BackgroundVariant,
	Controls,
	MiniMap,
	ReactFlow,
	useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { NodeTypesEnum } from "../../types";
import { useState, useCallback, useEffect } from "react";
import { NodeLibraryPanel } from "./flow-sidebar";
import { FlowControlPanel } from "./flow-control-panel";
import { NodeTypeConfigs, NodeTypes } from "../../config";
import { useFlow } from "@/components/context/reactflow-context";
import { PlayCircle } from "lucide-react";
import { NodeStatus } from "../../types";
import { startNodeConfig } from "../nodes/start-node/config";

const FlowEditor = () => {
	const { resolvedTheme } = useTheme();
	const { screenToFlowPosition } = useReactFlow();

	// Get flow state and handlers from context
	const {
		addNode,
		onNodesChange,
		onEdgesChange,
		onConnect,
		state: { nodes, edges },
	} = useFlow();

	// Ensure default start node exists on mount
	useEffect(() => {
		const hasStartNode = nodes.some(
			(node) => node.type === NodeTypesEnum.START_NODE,
		);
		if (!hasStartNode) {
			// Add default start node
			addNode(
				NodeTypesEnum.START_NODE,
				{ x: 100, y: 100 },
				startNodeConfig,
			);
		}
	}, []); // Run only on mount

	const [showGrid, setShowGrid] = useState(true);
	const [snapToGrid, setSnapToGrid] = useState(true);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showMinimap, setShowMinimap] = useState(true);
	const [interactionMode, setInteractionMode] = useState<"select" | "pan">(
		"select",
	);

	const toggleFullscreen = useCallback(() => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
			setIsFullscreen(true);
		} else {
			document.exitFullscreen();
			setIsFullscreen(false);
		}
	}, []);

	const onDragStart = useCallback(
		(event: React.DragEvent, nodeType: NodeTypesEnum) => {
			event.dataTransfer.setData("application/reactflow", nodeType);
			event.dataTransfer.effectAllowed = "move";
		},
		[],
	);

	const onDragOver = useCallback((event: React.DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}, []);

	const onDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault();
			const type = event.dataTransfer.getData(
				"application/reactflow",
			) as NodeTypesEnum;
			if (!type) return;

			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			});

			// Snap to grid if enabled
			const finalPosition = snapToGrid
				? {
						x: Math.round(position.x / 20) * 20,
						y: Math.round(position.y / 20) * 20,
					}
				: position;

			// Add node using context
			addNode(
				type,
				finalPosition,
				NodeTypeConfigs[type as NodeTypesEnum] || {},
			);
		},
		[screenToFlowPosition, addNode, snapToGrid],
	);

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onConnect={onConnect}
			onDrop={onDrop}
			onDragOver={onDragOver}
			nodeTypes={NodeTypes}
			className="w-full h-full"
			colorMode={resolvedTheme}
			fitView
			attributionPosition="bottom-right"
			snapGrid={[20, 20]}
		>
			{showGrid && <Background variant={BackgroundVariant.Dots} />}
			{showMinimap && <MiniMap className="m-4" />}

			<NodeLibraryPanel position="top-left" onDragStart={onDragStart} />

			<FlowControlPanel
				interactionMode={interactionMode}
				onInteractionModeChange={setInteractionMode}
				showGrid={showGrid}
				onShowGridChange={setShowGrid}
				showMinimap={showMinimap}
				onShowMinimapChange={setShowMinimap}
				snapToGrid={snapToGrid}
				onSnapToGridChange={setSnapToGrid}
				isFullscreen={isFullscreen}
				onFullscreenToggle={toggleFullscreen}
			/>
		</ReactFlow>
	);
};

export default FlowEditor;
