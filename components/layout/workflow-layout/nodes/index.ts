// components/layout/workflow-layout/nodes/index.ts
import { NodeType } from "../types";
import {
	Play,
	Square,
	Type,
	ArrowUp,
	Eye,
} from "lucide-react";

import EndNode, { endNodeConfig } from "./end-node";
import TextNode, { textNodeConfig } from "./text-node";
import StartNode, { startNodeConfig } from "./start-node";
import UppercaseNode, { uppercaseNodeConfig } from "./uppercase-node";
import { uppercaseNodeExecutor } from "./uppercase-node/executor";
import OutputNode, { outputNodeConfig } from "./output-node";
import { outputNodeExecutor } from "./output-node/executor";

// ==================== Node Colors ====================

export const nodeColors: Record<NodeType, string> = {
	[NodeType.START]: "#22c55e",
	[NodeType.END]: "#ef4444",
	[NodeType.OUTPUT]: "#ec4899",
	[NodeType.TEXT]: "#6b7280",
	[NodeType.UPPERCASE]: "#a855f7",
};

export const handleColors = {
	target: "#3b82f6", // blue for target/input handles
	source: "#22c55e", // green for source/output handles
};

// ==================== Node Configs Registry ====================

export const nodeConfigs: Record<NodeType, any> = {
	[NodeType.START]: startNodeConfig,
	[NodeType.END]: endNodeConfig,
	[NodeType.OUTPUT]: outputNodeConfig,
	[NodeType.TEXT]: textNodeConfig,
	[NodeType.UPPERCASE]: uppercaseNodeConfig,
};

// ==================== Node Components Registry ====================

export const nodeComponents: Record<NodeType, any> = {
	[NodeType.START]: StartNode,
	[NodeType.END]: EndNode,
	[NodeType.OUTPUT]: OutputNode,
	[NodeType.TEXT]: TextNode,
	[NodeType.UPPERCASE]: UppercaseNode,
};

// ==================== Node Executors Registry ====================

export const nodeExecutors: Record<NodeType, any> = {
	[NodeType.START]: null,
	[NodeType.END]: null,
	[NodeType.OUTPUT]: outputNodeExecutor,
	[NodeType.TEXT]: null,
	[NodeType.UPPERCASE]: uppercaseNodeExecutor,
};

// ==================== Sidebar Config (Grouped) ====================

// ==================== Types ====================

export interface SidebarItem {
	type: NodeType;
	label: string;
	description: string;
	icon: React.ElementType;
	color: string;
	unique?: boolean;
}

export interface SidebarGroup {
	id: string;
	label: string;
	items: SidebarItem[];
}

// ==================== Sidebar Config ====================

export const nodeSidebarGroups: SidebarGroup[] = [
	{
		id: "flow",
		label: "Flow Control",
		items: [
			{
				type: NodeType.START,
				label: "Start",
				description: "Workflow entry point",
				icon: Play,
				color: nodeColors[NodeType.START],
				unique: true,
			},
			{
				type: NodeType.END,
				label: "End",
				description: "Workflow end point",
				icon: Square,
				color: nodeColors[NodeType.END],
			},
		],
	},
	{
		id: "logic",
		label: "Logic",
		items: [
			{
				type: NodeType.UPPERCASE,
				label: "Uppercase",
				description: "Convert text to uppercase",
				icon: ArrowUp,
				color: nodeColors[NodeType.UPPERCASE],
			},
		],
	},
	{
		id: "data",
		label: "Data",
		items: [
			{
				type: NodeType.OUTPUT,
				label: "Output",
				description: "Visualize output data",
				icon: Eye,
				color: nodeColors[NodeType.OUTPUT],
			},
			{
				type: NodeType.TEXT,
				label: "Text",
				description: "Text value",
				icon: Type,
				color: nodeColors[NodeType.TEXT],
			},
		],
	},
];

export const nodeSidebarItems: SidebarItem[] = nodeSidebarGroups.flatMap(
	(g) => g.items,
);

// ==================== Helper Functions ====================

export function getNodeConfig(type: NodeType) {
	return nodeConfigs[type];
}

export function getNodeComponent(type: NodeType) {
	return nodeComponents[type];
}

export function getNodeExecutor(type: NodeType) {
	return nodeExecutors[type];
}

export function getNodeColor(type: NodeType): string {
	return nodeColors[type] || "#6b7280";
}

export function getSidebarItems() {
	return nodeSidebarItems;
}

export function getSidebarGroups() {
	return nodeSidebarGroups;
}

export function getHandleColor(type: "target" | "source"): string {
	return handleColors[type];
}
