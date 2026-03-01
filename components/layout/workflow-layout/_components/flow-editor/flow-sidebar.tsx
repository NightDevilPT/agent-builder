// components/layout/workflow-layout/node-library-panel.tsx
"use client";

import { Search, ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn, getTranslatedNodeTypes } from "@/lib/utils";
import { Panel } from "@xyflow/react";
import React, { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { NodeTypesEnum, NodeSidebar } from "../../types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/components/context/theme-context";
import { BaseNodeTypes } from "../../config";

interface NodeLibraryPanelProps {
	position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	onDragStart: (event: React.DragEvent, nodeType: NodeTypesEnum) => void;
}

export const NodeLibraryPanel = ({
	position = "top-left",
	onDragStart,
}: NodeLibraryPanelProps) => {
	const { dictionary } = useTheme();
	const [searchQuery, setSearchQuery] = useState("");
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
		new Set()
	);

	// Get translated node types
	const nodeTypes = useMemo(() => {
		return getTranslatedNodeTypes(dictionary, BaseNodeTypes);
	}, [dictionary]);

	// Initialize expanded categories after translation
	useEffect(() => {
		if (Object.keys(nodeTypes).length > 0) {
			setExpandedCategories(new Set(Object.keys(nodeTypes)));
		}
	}, [nodeTypes]);

	// Filter nodes based on search
	const filteredNodeTypes = useMemo(() => {
		if (!searchQuery.trim()) {
			return nodeTypes;
		}

		const query = searchQuery.toLowerCase();
		const filtered: Record<string, NodeSidebar[]> = {};

		Object.entries(nodeTypes).forEach(([category, nodes]) => {
			const filteredNodes = nodes.filter(
				(node: NodeSidebar) =>
					node.label.toLowerCase().includes(query) ||
					node.description?.toLowerCase().includes(query)
			);
			if (filteredNodes.length > 0) {
				filtered[category] = filteredNodes;
			}
		});

		return filtered;
	}, [searchQuery, nodeTypes]);

	const toggleCategory = (category: string) => {
		setExpandedCategories((prev) => {
			const next = new Set(prev);
			if (next.has(category)) {
				next.delete(category);
			} else {
				next.add(category);
			}
			return next;
		});
	};

	const expandAll = () => {
		setExpandedCategories(new Set(Object.keys(nodeTypes)));
	};

	const collapseAll = () => {
		setExpandedCategories(new Set());
	};

	// Don't render if no dictionary
	if (!dictionary) return null;

	return (
		<Panel position={position}>
			<Card className="w-80 shadow-lg bg-background/95 backdrop-blur py-0">
				{/* Header */}
				<div className="p-4 border-b">
					<div className="flex items-center justify-between mb-3">
						<h3 className="font-semibold text-sm">
							{dictionary?.flow?.sidebar?.title || "Node Library"}
						</h3>
						<div className="flex items-center gap-1">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6"
											onClick={expandAll}
										>
											<ChevronDown className="h-3 w-3" />
										</Button>
									</TooltipTrigger>
									<TooltipContent side="top">
										{dictionary?.flow?.sidebar?.expandAll ||
											"Expand All"}
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6"
											onClick={collapseAll}
										>
											<ChevronRight className="h-3 w-3" />
										</Button>
									</TooltipTrigger>
									<TooltipContent side="top">
										{dictionary?.flow?.sidebar
											?.collapseAll || "Collapse All"}
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>
					<div className="relative">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder={
								dictionary?.flow?.sidebar?.searchPlaceholder ||
								"Search nodes..."
							}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-8 h-9 text-sm"
						/>
					</div>
				</div>

				{/* Node Categories */}
				<ScrollArea className="h-[500px] p-2">
					{Object.entries(filteredNodeTypes).map(
						([category, nodes]) => (
							<Collapsible
								key={category}
								open={expandedCategories.has(category)}
								onOpenChange={() => toggleCategory(category)}
								className="mb-2"
							>
								<CollapsibleTrigger asChild>
									<Button
										variant="ghost"
										className="w-full justify-between px-2 h-8 text-sm font-medium"
									>
										<span>{category}</span>
										<div className="flex items-center gap-2">
											<Badge
												variant="outline"
												className="text-xs"
											>
												{nodes.length}
											</Badge>
											{expandedCategories.has(
												category
											) ? (
												<ChevronDown className="h-3 w-3" />
											) : (
												<ChevronRight className="h-3 w-3" />
											)}
										</div>
									</Button>
								</CollapsibleTrigger>
								<CollapsibleContent className="mt-1 space-y-1">
									{nodes.map((node: NodeSidebar) => (
										<NodeCard
											key={node.id}
											node={node}
											onDragStart={onDragStart}
										/>
									))}
								</CollapsibleContent>
							</Collapsible>
						)
					)}

					{Object.keys(filteredNodeTypes).length === 0 && (
						<div className="text-center py-8 text-muted-foreground text-sm">
							{dictionary?.flow?.sidebar?.noNodesFound ||
								"No nodes found"}
						</div>
					)}
				</ScrollArea>

				{/* Footer */}
				<div className="p-3 border-t text-xs text-muted-foreground flex items-center gap-2">
					<GripVertical className="h-3 w-3" />
					<span>
						{dictionary?.flow?.sidebar?.dragToCanvas ||
							"Drag nodes to canvas"}
					</span>
				</div>
			</Card>
		</Panel>
	);
};

// Node Card Component
interface NodeCardProps {
	node: NodeSidebar;
	onDragStart: (event: React.DragEvent, nodeType: NodeTypesEnum) => void;
}

const NodeCard = ({ node, onDragStart }: NodeCardProps) => {
	const Icon = node.icon;

	const handleDragStart = (e: React.DragEvent) => {
		onDragStart(e, node.type);

		// Set drag image
		const dragPreview = document.createElement("div");
		dragPreview.className = `px-3 py-2 rounded-md text-white text-sm ${node.color}`;
		dragPreview.textContent = node.label;
		document.body.appendChild(dragPreview);
		e.dataTransfer.setDragImage(dragPreview, 10, 10);
		setTimeout(() => document.body.removeChild(dragPreview), 0);
	};

	return (
		<div
			className={cn(
				"group flex items-start gap-2 p-2 rounded-md cursor-move",
				"hover:bg-accent transition-colors duration-200",
				"border border-transparent hover:border-border"
			)}
			draggable
			onDragStart={handleDragStart}
		>
			<div
				className={cn(
					"p-1.5 rounded-md shrink-0",
					node.color,
					"text-white"
				)}
			>
				<Icon className="h-3.5 w-3.5" />
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-1">
					<span className="text-xs font-medium">{node.label}</span>
					<Badge
						variant="secondary"
						className="text-[10px] px-1 py-0 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
					>
						drag
					</Badge>
				</div>
				{node.description && (
					<p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
						{node.description}
					</p>
				)}
			</div>
		</div>
	);
};
