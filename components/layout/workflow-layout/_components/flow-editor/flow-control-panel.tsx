// components/layout/workflow-layout/flow-control-panel.tsx
"use client";

import React, { useMemo, useCallback } from "react";
import { useReactFlow, Panel, useNodes, useEdges } from "@xyflow/react";
import {
	ZoomIn,
	ZoomOut,
	Maximize2,
	Minimize2,
	Grid,
	MousePointer,
	Hand,
	Eye,
	EyeOff,
	ArrowDown,
	ArrowRight,
	Undo2,
	Redo2,
	Save,
	Download,
	Upload,
	Trash2,
	SquareSplitVertical,
	SquareSplitHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Dagre from "@dagrejs/dagre";
import {
	useFlow,
	useFlowHistory,
	useFlowStatus,
} from "@/components/context/reactflow-context";
import { useTheme } from "@/components/context/theme-context";

interface ControlItem {
	id: string;
	icon: React.ElementType;
	label: string;
	action: () => void;
	variant?: "default" | "ghost";
	isActive?: boolean;
	show?: boolean;
	disabled?: boolean;
}

interface FlowControlPanelProps {
	interactionMode: "select" | "pan";
	onInteractionModeChange: (mode: "select" | "pan") => void;
	showGrid: boolean;
	onShowGridChange: (show: boolean) => void;
	showMinimap: boolean;
	onShowMinimapChange: (show: boolean) => void;
	snapToGrid: boolean;
	onSnapToGridChange: (snap: boolean) => void;
	isFullscreen: boolean;
	onFullscreenToggle: () => void;
	position?:
		| "top-left"
		| "top-right"
		| "top-center"
		| "bottom-left"
		| "bottom-right"
		| "bottom-center";
}

const getLayoutedElements = (nodes: any[], edges: any[], direction: string) => {
	const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
	g.setGraph({ rankdir: direction });

	edges.forEach((edge) => g.setEdge(edge.source, edge.target));
	nodes.forEach((node) =>
		g.setNode(node.id, {
			...node,
			width: node.measured?.width ?? 200,
			height: node.measured?.height ?? 100,
		})
	);

	Dagre.layout(g);

	return {
		nodes: nodes.map((node) => {
			const position = g.node(node.id);
			const x = position.x - (node.measured?.width ?? 200) / 2;
			const y = position.y - (node.measured?.height ?? 100) / 2;
			return { ...node, position: { x, y } };
		}),
		edges,
	};
};

export const FlowControlPanel = ({
	interactionMode,
	onInteractionModeChange,
	showGrid,
	onShowGridChange,
	showMinimap,
	onShowMinimapChange,
	snapToGrid,
	onSnapToGridChange,
	isFullscreen,
	onFullscreenToggle,
	position = "top-right",
}: FlowControlPanelProps) => {
	const { dictionary } = useTheme();
	const { zoomIn, zoomOut, fitView } = useReactFlow();
	const nodes = useNodes();
	const edges = useEdges();

	// Use FlowContext
	const { dispatch, saveFlow, exportFlow, importFlow } = useFlow();
	const { undo, redo, canUndo, canRedo } = useFlowHistory();
	const { isDirty } = useFlowStatus();

	// Handle layout
	const onLayout = useCallback(
		(direction: "TB" | "LR") => {
			const layouted = getLayoutedElements(nodes, edges, direction);

			// Use context to update nodes and edges
			dispatch({ type: "SET_NODES", payload: layouted.nodes });
			dispatch({ type: "SET_EDGES", payload: layouted.edges });

			// Mark as dirty since layout changed
			dispatch({ type: "SET_DIRTY", payload: true });

			// Small timeout to ensure nodes are updated before fitting view
			setTimeout(() => {
				fitView({ padding: 0.2 });
			}, 50);
		},
		[nodes, edges, dispatch, fitView]
	);

	// Handle export
	const handleExport = useCallback(() => {
		const flow = exportFlow();
		const dataStr = JSON.stringify(flow, null, 2);
		const dataUri =
			"data:application/json;charset=utf-8," +
			encodeURIComponent(dataStr);
		const fileName = `${
			flow.flowName || "flow"
		}-${new Date().toISOString()}.json`;

		const link = document.createElement("a");
		link.href = dataUri;
		link.download = fileName;
		link.click();
	}, [exportFlow]);

	// Handle import
	const handleImport = useCallback(() => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".json,application/json";
		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					try {
						const flow = JSON.parse(e.target?.result as string);
						importFlow(flow);
					} catch (error) {
						console.error("Failed to import flow:", error);
					}
				};
				reader.readAsText(file);
			}
		};
		input.click();
	}, [importFlow]);

	// Handle clear all
	const handleClear = useCallback(() => {
		if (nodes.length === 0 && edges.length === 0) return;

		dispatch({ type: "SET_NODES", payload: [] });
		dispatch({ type: "SET_EDGES", payload: [] });
		dispatch({ type: "SET_DIRTY", payload: true });
	}, [nodes.length, edges.length, dispatch]);

	const controls: ControlItem[] = useMemo(
		() => [
			// History group
			{
				id: "undo",
				icon: Undo2,
				label: dictionary?.flow?.controls?.undo || "Undo",
				action: undo,
				variant: "ghost",
				disabled: !canUndo,
			},
			{
				id: "redo",
				icon: Redo2,
				label: dictionary?.flow?.controls?.redo || "Redo",
				action: redo,
				variant: "ghost",
				disabled: !canRedo,
			},
			// Separator
			{
				id: "separator-0",
				icon: () => null,
				label: "",
				action: () => {},
				show: false,
			},

			// Mode selection group
			{
				id: "select-mode",
				icon: MousePointer,
				label: dictionary?.flow?.controls?.selectMode || "Select Mode",
				action: () => onInteractionModeChange("select"),
				variant: interactionMode === "select" ? "default" : "ghost",
				isActive: interactionMode === "select",
			},
			{
				id: "pan-mode",
				icon: Hand,
				label: dictionary?.flow?.controls?.panMode || "Pan Mode",
				action: () => onInteractionModeChange("pan"),
				variant: interactionMode === "pan" ? "default" : "ghost",
				isActive: interactionMode === "pan",
			},
			// Separator
			{
				id: "separator-1",
				icon: () => null,
				label: "",
				action: () => {},
				show: false,
			},

			// View controls group
			{
				id: "zoom-in",
				icon: ZoomIn,
				label: dictionary?.flow?.controls?.zoomIn || "Zoom In",
				action: zoomIn,
				variant: "ghost",
			},
			{
				id: "zoom-out",
				icon: ZoomOut,
				label: dictionary?.flow?.controls?.zoomOut || "Zoom Out",
				action: zoomOut,
				variant: "ghost",
			},
			// Separator
			{
				id: "separator-2",
				icon: () => null,
				label: "",
				action: () => {},
				show: false,
			},

			// Layout controls group
			{
				id: "vertical-layout",
				icon: SquareSplitVertical,
				label:
					dictionary?.flow?.controls?.verticalLayout ||
					"Vertical Layout",
				action: () => onLayout("TB"),
				variant: "ghost",
				disabled: nodes.length === 0,
			},
			{
				id: "horizontal-layout",
				icon: SquareSplitHorizontal,
				label:
					dictionary?.flow?.controls?.horizontalLayout ||
					"Horizontal Layout",
				action: () => onLayout("LR"),
				variant: "ghost",
				disabled: nodes.length === 0,
			},
			// Separator
			{
				id: "separator-3",
				icon: () => null,
				label: "",
				action: () => {},
				show: false,
			},

			// Display controls group
			{
				id: "toggle-grid",
				icon: Grid,
				label: dictionary?.flow?.controls?.toggleGrid || "Toggle Grid",
				action: () => onShowGridChange(!showGrid),
				variant: "ghost",
				isActive: showGrid,
			},
			{
				id: "toggle-minimap",
				icon: showMinimap ? Eye : EyeOff,
				label:
					dictionary?.flow?.controls?.toggleMinimap ||
					"Toggle Minimap",
				action: () => onShowMinimapChange(!showMinimap),
				variant: "ghost",
				isActive: showMinimap,
			},
			// Separator
			{
				id: "separator-4",
				icon: () => null,
				label: "",
				action: () => {},
				show: false,
			},

			// File operations group
			{
				id: "save",
				icon: Save,
				label: dictionary?.flow?.controls?.save || "Save",
				action: saveFlow,
				variant: "ghost",
				disabled: !isDirty,
			},
			{
				id: "export",
				icon: Download,
				label: dictionary?.flow?.controls?.export || "Export",
				action: handleExport,
				variant: "ghost",
				disabled: nodes.length === 0 && edges.length === 0,
			},
			{
				id: "import",
				icon: Upload,
				label: dictionary?.flow?.controls?.import || "N/A",
				action: handleImport,
				variant: "ghost",
			},
			{
				id: "clear",
				icon: Trash2,
				label: dictionary?.flow?.controls?.clearAll || "Clear All",
				action: handleClear,
				variant: "ghost",
				disabled: nodes.length === 0 && edges.length === 0,
			},
		],
		[
			interactionMode,
			isFullscreen,
			showGrid,
			showMinimap,
			onInteractionModeChange,
			onFullscreenToggle,
			onShowGridChange,
			onShowMinimapChange,
			zoomIn,
			zoomOut,
			fitView,
			onLayout,
			undo,
			redo,
			canUndo,
			canRedo,
			saveFlow,
			handleExport,
			handleImport,
			handleClear,
			isDirty,
			nodes.length,
			edges.length,
			dictionary,
		]
	);

	const renderControl = (control: ControlItem, index: number) => {
		if (control.id.startsWith("separator")) {
			return index > 0 && index < controls.length - 1 ? (
				<Separator key={control.id} className="h-6 mx-1" />
			) : null;
		}

		const Icon = control.icon;

		return (
			<Tooltip key={control.id}>
				<TooltipTrigger asChild>
					<Button
						variant={control.variant}
						size="icon"
						className={cn(
							"h-8 w-8",
							control.isActive &&
								!control.variant &&
								"text-primary",
							control.disabled && "opacity-50 cursor-not-allowed"
						)}
						title={
							control.disabled
								? dictionary?.flow?.tooltips?.disabled ||
								  "Disabled"
								: undefined
						}
						onClick={control.action}
						disabled={control.disabled}
					>
						<Icon className="h-4 w-4" />
					</Button>
				</TooltipTrigger>
				<TooltipContent side="left" align="center">
					{control.label}
					{control.disabled &&
						control.id === "save" &&
						isDirty &&
						` (${
							dictionary?.flow?.tooltips?.noChanges ||
							"No changes"
						})`}
				</TooltipContent>
			</Tooltip>
		);
	};

	return (
		<Panel position={position} className="mt-4">
			<Card className="px-2 py-1 flex items-center gap-1 shadow-lg">
				<TooltipProvider>
					{controls.map((control, index) =>
						renderControl(control, index)
					)}
				</TooltipProvider>
			</Card>
		</Panel>
	);
};
