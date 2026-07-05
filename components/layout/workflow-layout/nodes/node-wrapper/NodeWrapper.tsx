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
import { getNodeColor, nodeSidebarItems } from "../index";
import { Badge } from "@/components/ui/badge";
import { type NodeProps } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { cn, getNestedProperty } from "@/lib/utils";
import { memo, useCallback, useMemo, useState } from "react";
import { useTheme } from "@/components/context/theme-context";
import { useWorkflow } from "@/components/context/workflow-context";
import { AppNode, NodeExecutionStatus } from "../../types";

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
		const sidebarItem = useMemo(() => {
			return nodeSidebarItems.find((item) => item.type === data?.type);
		}, [data?.type]);

		const NodeIcon = sidebarItem?.icon;
		const nodeColor = sidebarItem?.color || getNodeColor(data?.type);

		const status = header?.status ?? NodeExecutionStatus.IDLE;
		const statusInfo = statusConfig[status];
		const StatusIcon = statusInfo?.icon;

		const infoAction = header?.actions?.info;
		const InfoComponent = infoAction?.component;

		const dynamicNodeKey = useMemo(() => {
			if (!data?.type) return "";
			const lowercase = data.type.toLowerCase();
			return (
				lowercase.replace(/[-_]([a-z])/g, (g) => g[1].toUpperCase()) +
				"Node"
			);
		}, [data?.type]);

		const dynamicLabelKey = dynamicNodeKey
			? `flow.nodeTypes.nodes.${dynamicNodeKey}.label`
			: "";
		const dynamicDescKey = dynamicNodeKey
			? `flow.nodeTypes.nodes.${dynamicNodeKey}.description`
			: "";

		const nodeLabel = header?.label
			? t(header.label, header.label)
			: dynamicLabelKey
				? t(
						dynamicLabelKey,
						(data?.label as string) ||
							t("flow.nodeWrapper.defaultNodeLabel", "Node"),
					)
				: t("flow.nodeWrapper.defaultNodeLabel", "Node");

		const nodeDescription = header?.description
			? t(header.description, header.description)
			: dynamicDescKey
				? t(dynamicDescKey, "")
				: "";

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

		const isRunning = status === NodeExecutionStatus.RUNNING;
		const resolvedColor = "hsl(120, 100%, 50%)";

		return (
			<>
				{/* Local Dynamic Keyframe Animation Stylesheet */}
{isRunning && (
	<style>{`
		@keyframes borderGradientRotation {
			from {
				transform: translate(-50%, -50%) rotate(0deg);
			}
			to {
				transform: translate(-50%, -50%) rotate(360deg);
			}
		}
		.rotating-border-panel {
			position: absolute;
			top: 50%;
			left: 50%;
			width: 350%; 
			height: 350%;
			transform: translate(-50%, -50%);
			/* Uses the explicit hex value of green-500 (#22c55e) to ensure flawless cross-browser rendering */
			background: conic-gradient(
				from 0deg,
				transparent 0%,
				transparent 20%,
				#22c55e 25%,
				transparent 30%,
				transparent 70%,
				#22c55e 75%,
				transparent 80%,
				transparent 100%
			);
			animation: borderGradientRotation 3s linear infinite;
			transform-origin: center center;
			will-change: transform;
		}
	`}</style>
)}

				<BaseNode
					className={cn(
						"relative transition-all duration-200",
						selected &&
							"ring-2 ring-primary ring-offset-2 ring-offset-background",
						isRunning && "border-transparent shadow-md",
					)}
				>
					{/* Running State: 360-Degree Rotating Conic Border Animation */}
					{isRunning && (
						<div className="absolute -inset-[1.5px] pointer-events-none rounded-[inherit] overflow-hidden z-0">
							<div className="rotating-border-panel" />
							{/* Inner protective theme frame mask */}
							<div className="absolute inset-[1.5px] bg-card rounded-[inherit] z-10" />
						</div>
					)}

					{/* Header */}
					<BaseNodeHeader className="relative z-20">
						<div className="flex items-center gap-2 flex-1 min-w-0">
							{NodeIcon ? (
								<NodeIcon
									className="w-4 h-4 shrink-0"
									style={{ color: nodeColor }}
								/>
							) : (
								<div
									className="w-2.5 h-2.5 rounded-full shrink-0"
									style={{ backgroundColor: nodeColor }}
								/>
							)}
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
												isRunning && "animate-spin",
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
					<BaseNodeContent className="relative z-20">
						{children}
					</BaseNodeContent>
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
							{nodeDescription && (
								<DialogDescription>
									{nodeDescription}
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
