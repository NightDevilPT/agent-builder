// components/layout/workflow-layout/ToolsPanel.tsx
"use client";

import { memo } from "react";
import { Panel } from "@xyflow/react";
import {
	Play,
	RotateCcw,
	Copy,
	Trash2,
	ZoomIn,
	ZoomOut,
	Maximize2,
	Download,
	Upload,
	Focus,
} from "lucide-react";
import { useWorkflow } from "@/components/context/workflow-context";
import { useReactFlow } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

interface ToolsPanelProps {
	position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export const ToolsPanel = memo(
	({ position = "bottom-left" }: ToolsPanelProps) => {
		const {
			selectedNode,
			isExecuting,
			executeWorkflow,
			executeNode,
			resetWorkflow,
			duplicateNode,
			removeNode,
		} = useWorkflow();

		const { zoomIn, zoomOut, fitView, getNodes, getEdges } = useReactFlow();

		const handleExportJson = () => {
			const nodes = getNodes();
			const edges = getEdges();
			const workflowData = {
				nodes: nodes.map((node) => ({
					id: node.id,
					type: node.type,
					position: node.position,
					data: node.data,
				})),
				edges: edges.map((edge) => ({
					id: edge.id,
					source: edge.source,
					target: edge.target,
					sourceHandle: edge.sourceHandle,
					targetHandle: edge.targetHandle,
				})),
			};

			const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
				type: "application/json",
			});
			const link = document.createElement("a");
			link.download = "workflow.json";
			link.href = URL.createObjectURL(blob);
			link.click();
		};

		const handleImportJson = () => {
			const input = document.createElement("input");
			input.type = "file";
			input.accept = ".json";
			input.onchange = (e) => {
				const file = (e.target as HTMLInputElement).files?.[0];
				if (!file) return;

				const reader = new FileReader();
				reader.onload = (event) => {
					try {
						const workflow = JSON.parse(
							event.target?.result as string,
						);
						console.log("Imported workflow:", workflow);
					} catch (error) {
						console.error("Failed to parse workflow:", error);
					}
				};
				reader.readAsText(file);
			};
			input.click();
		};

		const executionTools = [
			{
				icon: Play,
				label: "Run Workflow",
				onClick: executeWorkflow,
				disabled: isExecuting,
				variant: "default" as const,
			},
			{
				icon: RotateCcw,
				label: "Reset Workflow",
				onClick: resetWorkflow,
				variant: "outline" as const,
			},
		];

		const viewTools = [
			{
				icon: ZoomIn,
				label: "Zoom In",
				onClick: () => zoomIn({ duration: 200 }),
			},
			{
				icon: ZoomOut,
				label: "Zoom Out",
				onClick: () => zoomOut({ duration: 200 }),
			},
			{
				icon: Maximize2,
				label: "Fit View",
				onClick: () => fitView({ duration: 200 }),
			},
			{
				icon: Focus,
				label: "Focus Selected",
				onClick: () => {
					if (selectedNode) {
						fitView({
							nodes: [selectedNode],
							duration: 200,
							maxZoom: 2,
						});
					}
				},
				disabled: !selectedNode,
			},
		];

		const fileTools = [
			{
				icon: Download,
				label: "Export JSON",
				onClick: handleExportJson,
			},
			{
				icon: Upload,
				label: "Import JSON",
				onClick: handleImportJson,
			},
		];

		const nodeTools = selectedNode
			? [
					{
						icon: Play,
						label: "Run Node",
						onClick: () => executeNode(selectedNode.id),
						disabled: isExecuting,
					},
					{
						icon: Copy,
						label: "Duplicate Node",
						onClick: () => duplicateNode(selectedNode.id),
					},
					{
						icon: Trash2,
						label: "Delete Node",
						onClick: () => removeNode(selectedNode.id),
						variant: "destructive" as const,
					},
				]
			: [];

		return (
			<Panel position={position}>
				<div className="flex flex-col gap-2 bg-background border rounded-lg p-2 shadow-lg">
					{/* Execution Controls */}
					{executionTools.map((tool) => (
						<Tooltip key={tool.label}>
							<TooltipTrigger asChild>
								<Button
									variant={tool.variant || "ghost"}
									size="icon"
									onClick={tool.onClick}
									disabled={tool.disabled}
								>
									<tool.icon className="w-4 h-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right">
								<p>{tool.label}</p>
							</TooltipContent>
						</Tooltip>
					))}

					<Separator />

					{/* View Controls */}
					{viewTools.map((tool) => (
						<Tooltip key={tool.label}>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									onClick={tool.onClick}
									disabled={tool.disabled}
								>
									<tool.icon className="w-4 h-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right">
								<p>{tool.label}</p>
							</TooltipContent>
						</Tooltip>
					))}

					<Separator />

					{/* File Controls */}
					{fileTools.map((tool) => (
						<Tooltip key={tool.label}>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									onClick={tool.onClick}
								>
									<tool.icon className="w-4 h-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right">
								<p>{tool.label}</p>
							</TooltipContent>
						</Tooltip>
					))}

					{/* Node Actions */}
					{nodeTools.length > 0 && (
						<>
							<Separator />
							{nodeTools.map((tool) => (
								<Tooltip key={tool.label}>
									<TooltipTrigger asChild>
										<Button
											variant={tool.variant || "ghost"}
											size="icon"
											onClick={tool.onClick}
											disabled={tool.disabled}
										>
											<tool.icon className="w-4 h-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent side="right">
										<p>{tool.label}</p>
									</TooltipContent>
								</Tooltip>
							))}
						</>
					)}
				</div>
			</Panel>
		);
	},
);

ToolsPanel.displayName = "ToolsPanel";
