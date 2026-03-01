"use client";

import {
	BaseNode,
	BaseNodeContent,
	BaseNodeFooter,
	BaseNodeHeader,
} from "@/components/ui/base-node";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn, getNestedProperty } from "@/lib/utils";
import { NodeTypesEnum, NodeStatus } from "../../../types";
import { useTheme } from "@/components/context/theme-context";
import { useFlow } from "@/components/context/reactflow-context";
import { Copy, Trash2, Play, Info, GripVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BaseNodeWrapperProps {
	children: React.ReactNode;
	nodeType: NodeTypesEnum;
	nodeId: string;
	className?: string;
}

const BaseNodeWrapper = ({
	children,
	nodeType,
	nodeId,
	className,
}: BaseNodeWrapperProps) => {
	const { duplicateNode, removeNode, getNodeById } = useFlow();
	const { dictionary } = useTheme();
	const [infoDialogOpen, setInfoDialogOpen] = useState(false);

	// Get node data from context
	const nodeData = getNodeById(nodeId);
	const data = nodeData?.data;

	if (!data) return null;

	// Get translated label
	const translatedLabel = data?.header?.label
		? getNestedProperty(dictionary, data.header.label)
		: data?.label || "Node";

	// Status color mapping
	const statusColors = {
		[NodeStatus.IDLE]: "bg-gray-500",
		[NodeStatus.RUNNING]: "bg-blue-500 animate-pulse",
		[NodeStatus.SUCCESS]: "bg-green-500",
		[NodeStatus.FAILURE]: "bg-red-500",
	};

	// Status translations
	const statusTranslations = {
		[NodeStatus.IDLE]: dictionary?.flow?.nodeStatus?.idle || "Idle",
		[NodeStatus.RUNNING]:
			dictionary?.flow?.nodeStatus?.running || "Running",
		[NodeStatus.SUCCESS]:
			dictionary?.flow?.nodeStatus?.success || "Success",
		[NodeStatus.FAILURE]:
			dictionary?.flow?.nodeStatus?.failure || "Failure",
	};

	// Action button translations
	const actionLabels = {
		copy: dictionary?.flow?.nodeActions?.copy || "Copy",
		delete: dictionary?.flow?.nodeActions?.delete || "Delete",
		execute: dictionary?.flow?.nodeActions?.execute || "Execute",
		info: dictionary?.flow?.nodeActions?.info || "Information",
		drag: dictionary?.flow?.nodeActions?.drag || "Drag to move",
	};

	// Event handlers
	const handleCopy = (e: React.MouseEvent) => {
		e.stopPropagation();
		duplicateNode(nodeId);
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		removeNode(nodeId);
	};

	const handleExecute = (e: React.MouseEvent) => {
		e.stopPropagation();
		data?.execution?.();
	};

	const handleDragStart = (e: React.DragEvent) => {
		e.dataTransfer.setData("application/reactflow", nodeType);
		e.dataTransfer.effectAllowed = "move";
	};

	const handleInfoClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setInfoDialogOpen(true);
	};

	// Get Info component
	const InfoComponent = data?.header?.info;

	return (
		<>
			<BaseNode
				className={cn(
					"min-w-[250px] max-w-[350px] border-2 shadow-md group",
					nodeType === NodeTypesEnum.START_NODE &&
						"border-green-500 ring-1 ring-green-200",
					nodeType === NodeTypesEnum.END_NODE &&
						"border-red-500 ring-1 ring-red-200",
					className
				)}
			>
				{/* Header Section */}
				<BaseNodeHeader className="flex items-center justify-between p-2 border-b bg-muted/30">
					{/* Left Section - Node Info */}
					<div className="flex items-center gap-2 flex-1 min-w-0">
						{/* Drag Handle */}
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<div
										className="cursor-move p-1 hover:bg-accent rounded"
										draggable
										onDragStart={handleDragStart}
									>
										<GripVertical className="h-4 w-4 text-muted-foreground" />
									</div>
								</TooltipTrigger>
								<TooltipContent side="top">
									{actionLabels.drag}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						{/* Status Indicator */}
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<div
										className={cn(
											"w-2 h-2 rounded-full",
											statusColors[data?.header?.status]
										)}
									/>
								</TooltipTrigger>
								<TooltipContent side="top">
									{
										statusTranslations[
											data?.header?.status ||
												NodeStatus.IDLE
										]
									}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						{/* Node Icon */}
						{data?.icon && (
							<div className="shrink-0">
								<data.icon className="h-4 w-4 text-muted-foreground" />
							</div>
						)}

						{/* Node Label */}
						<span className="font-medium text-sm truncate">
							{translatedLabel}
						</span>
					</div>

					{/* Right Section - Action Buttons */}
					<div className="flex items-center gap-1 shrink-0">
						{/* Info Button with Dialog */}
						{InfoComponent && (
							<Dialog>
								<DialogTrigger>
									<Button
										variant="ghost"
										size="icon"
										className="h-7 w-7 opacity-70 hover:opacity-100"
									>
										<Info className="h-3.5 w-3.5" />
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[425px]">
									<DialogHeader>
										<DialogTitle className="flex items-center gap-2">
											{data?.icon && (
												<data.icon className="h-5 w-5" />
											)}
											<span>
												{translatedLabel} - Information
											</span>
										</DialogTitle>
										<Separator />
										<DialogDescription>
											<InfoComponent />
										</DialogDescription>
									</DialogHeader>
								</DialogContent>
							</Dialog>
						)}

						{/* Copy Button */}
						{data?.header?.copy?.isCopy && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-7 w-7 opacity-70 hover:opacity-100"
											onClick={handleCopy}
										>
											{data.header.copy.copyIcon ? (
												<data.header.copy.copyIcon className="h-3.5 w-3.5" />
											) : (
												<Copy className="h-3.5 w-3.5" />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent side="top">
										{actionLabels.copy}
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}

						{/* Execute Button */}
						{data?.header?.execute?.isExecute && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-7 w-7 opacity-70 hover:opacity-100"
											onClick={handleExecute}
										>
											{data.header.execute.ExecuteIcon ? (
												<data.header.execute.ExecuteIcon className="h-3.5 w-3.5" />
											) : (
												<Play className="h-3.5 w-3.5" />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent side="top">
										{actionLabels.execute}
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}

						{/* Delete Button */}
						{data?.header?.delete?.isDelete && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-7 w-7 opacity-70 hover:opacity-100 hover:text-destructive"
											onClick={handleDelete}
										>
											{data.header.delete.deleteIcon ? (
												<data.header.delete.deleteIcon className="h-3.5 w-3.5" />
											) : (
												<Trash2 className="h-3.5 w-3.5" />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent side="top">
										{actionLabels.delete}
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>
				</BaseNodeHeader>

				{/* Content Section */}
				<BaseNodeContent className="p-3 space-y-3">
					{children}
				</BaseNodeContent>

				{/* Footer Section - Only for Start/End Nodes */}
				{(nodeType === NodeTypesEnum.START_NODE ||
					nodeType === NodeTypesEnum.END_NODE) && (
					<BaseNodeFooter className="p-2 border-t bg-muted/20 text-[10px] text-muted-foreground">
						{nodeType === NodeTypesEnum.START_NODE
							? dictionary?.flow?.nodeTypes?.startNode ||
							  "Start Point"
							: dictionary?.flow?.nodeTypes?.endNode ||
							  "End Point"}
					</BaseNodeFooter>
				)}
			</BaseNode>
		</>
	);
};

export default BaseNodeWrapper;
