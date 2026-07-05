// components/layout/workflow-layout/nodes/node-wrapper/NodeWrapper.tsx
"use client";

import {
	Copy,
	Trash2,
	Play,
	Loader2,
	CheckCircle2,
	XCircle,
	Clock,
	Info,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	BaseNode,
	BaseNodeHeader,
	BaseNodeHeaderTitle,
	BaseNodeContent,
} from "@/components/ui/base-node";
import { getNodeColor } from "../index";
import { Badge } from "@/components/ui/badge";
import { type NodeProps } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { cn, getNestedProperty } from "@/lib/utils";
import { memo, useCallback, useState } from "react";
import { useTheme } from "@/components/context/theme-context";
import { useWorkflow } from "@/components/context/workflow-context";
import { AppNode, NodeExecutionStatus, NodeType } from "../../types";

interface NodeWrapperProps extends NodeProps<AppNode> {
	children?: React.ReactNode;
}

const statusConfig: Record<
	NodeExecutionStatus,
	{
		icon: React.ElementType;
		variant:
			| "secondary"
			| "default"
			| "destructive"
			| "outline"
			| "success"
			| "waiting";
	}
> = {
	[NodeExecutionStatus.IDLE]: {
		icon: Clock,
		variant: "secondary",
	},
	[NodeExecutionStatus.RUNNING]: {
		icon: Loader2,
		variant: "default",
	},
	[NodeExecutionStatus.SUCCESS]: {
		icon: CheckCircle2,
		variant: "success",
	},
	[NodeExecutionStatus.FAILURE]: {
		icon: XCircle,
		variant: "destructive",
	},
	[NodeExecutionStatus.WAITING]: {
		icon: Clock,
		variant: "waiting",
	},
};

export const NodeWrapper = memo(
	({ id, data, selected, children }: NodeWrapperProps) => {
		const { duplicateNode, removeNode, executeNode } = useWorkflow();
		const { dictionary } = useTheme();
		const [showInfo, setShowInfo] = useState(false);

		const t = useCallback(
			(path: string, defaultValue: string): string => {
				if (!dictionary) return defaultValue;
				return getNestedProperty(dictionary, path) || defaultValue;
			},
			[dictionary],
		);

		const header = data?.header;
		const isStartNode = data?.isStartNode ?? false;
		const isEndNode = data?.isEndNode ?? false;
		const nodeColor = getNodeColor(data?.type);

		const status = header?.status ?? NodeExecutionStatus.IDLE;
		const statusInfo = statusConfig[status];
		const StatusIcon = statusInfo?.icon;

		const infoAction = header?.actions?.info;
		const InfoComponent = infoAction?.component;

		const nodeLabel = header?.label
			? t(header.label, header.label)
			: (data?.label ? t(data.label as string, data.label as string) : t("flow.nodeWrapper.defaultNodeLabel", "Node"));

		const handleCopy = useCallback(
			(e: React.MouseEvent) => {
				e.stopPropagation();
				duplicateNode(id);
			},
			[duplicateNode, id],
		);

		const handleDelete = useCallback(
			(e: React.MouseEvent) => {
				e.stopPropagation();
				removeNode(id);
			},
			[removeNode, id],
		);

		const handleExecute = useCallback(
			(e: React.MouseEvent) => {
				e.stopPropagation();
				executeNode(id);
			},
			[executeNode, id],
		);

		const handleInfoClick = useCallback((e: React.MouseEvent) => {
			e.stopPropagation();
			setShowInfo(true);
		}, []);

		const actions = header?.actions;
		const showCopy = actions?.copy?.isEnabled && !isStartNode;
		const showDelete = actions?.delete?.isEnabled && !isStartNode;
		const showExecute =
			actions?.execute?.isEnabled &&
			status !== NodeExecutionStatus.RUNNING;
		const showInfoButton = infoAction?.isEnabled && !!InfoComponent;

		return (
			<>
				<BaseNode className={cn(selected && "ring-2 ring-primary")}>
					{/* Header */}
					<BaseNodeHeader>
						<div className="flex items-center gap-2 flex-1 min-w-0">
							<div
								className="w-2.5 h-2.5 rounded-full shrink-0"
								style={{ backgroundColor: nodeColor }}
							/>
							<BaseNodeHeaderTitle className="truncate">
								{nodeLabel}
							</BaseNodeHeaderTitle>
						</div>

						<div className="flex items-center gap-0.5">
							{/* Status Icon */}
							<Tooltip>
								<TooltipTrigger asChild>
									<Badge
										variant={statusInfo.variant}
										className="h-5 w-5 p-0 flex items-center justify-center"
									>
										<StatusIcon
											className={cn(
												"w-3 h-3",
												status ===
													NodeExecutionStatus.RUNNING &&
													"animate-spin",
											)}
										/>
									</Badge>
								</TooltipTrigger>
								<TooltipContent side="top">
									<p>
										{t("flow.nodeWrapper.status", "Status")}
										: {status}
									</p>
								</TooltipContent>
							</Tooltip>

							{/* Info Button */}
							{showInfoButton && (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6"
											onClick={handleInfoClick}
										>
											<Info className="w-3.5 h-3.5" />
										</Button>
									</TooltipTrigger>
									<TooltipContent side="top">
										{infoAction?.tooltip
											? t(
													infoAction.tooltip,
													infoAction.tooltip,
												)
											: t(
													"flow.nodeWrapper.infoTooltip",
													"Node Info",
												)}
									</TooltipContent>
								</Tooltip>
							)}

							{/* Execute Button */}
							{showExecute && (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6"
											onClick={handleExecute}
										>
											<Play className="w-3.5 h-3.5" />
										</Button>
									</TooltipTrigger>
									<TooltipContent side="top">
										{t(
											"flow.nodeWrapper.executeTooltip",
											"Execute Node",
										)}
									</TooltipContent>
								</Tooltip>
							)}

							{/* Copy Button */}
							{showCopy && (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6"
											onClick={handleCopy}
										>
											<Copy className="w-3.5 h-3.5" />
										</Button>
									</TooltipTrigger>
									<TooltipContent side="top">
										{t(
											"flow.nodeWrapper.duplicateTooltip",
											"Duplicate Node",
										)}
									</TooltipContent>
								</Tooltip>
							)}

							{/* Delete Button */}
							{showDelete && (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6"
											onClick={handleDelete}
										>
											<Trash2 className="w-3.5 h-3.5 text-destructive" />
										</Button>
									</TooltipTrigger>
									<TooltipContent side="top">
										{t(
											"flow.nodeWrapper.deleteTooltip",
											"Delete Node",
										)}
									</TooltipContent>
								</Tooltip>
							)}
						</div>
					</BaseNodeHeader>

					{/* Content */}
					<BaseNodeContent>{children}</BaseNodeContent>
				</BaseNode>

				{/* Info Dialog */}
				<Dialog open={showInfo} onOpenChange={setShowInfo}>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2">
								<div
									className="w-3 h-3 rounded-full shrink-0"
									style={{ backgroundColor: nodeColor }}
								/>
								{nodeLabel}
							</DialogTitle>
							{header?.description && (
								<DialogDescription>
									{t(header.description, header.description)}
								</DialogDescription>
							)}
						</DialogHeader>
						{InfoComponent && <InfoComponent />}
					</DialogContent>
				</Dialog>
			</>
		);
	},
);

NodeWrapper.displayName = "NodeWrapper";
