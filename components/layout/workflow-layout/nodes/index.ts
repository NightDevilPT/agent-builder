// components/layout/workflow-layout/nodes/index.ts
import { NodeType } from "../types";
import {
	Globe,
	Brain,
	Repeat,
	GitBranch,
	ArrowDownToLine,
	ArrowUpFromLine,
	Type,
	Hash,
	Play,
	Square,
	Upload,
	FileText,
	Image,
	Table,
	Calendar,
	Mail,
	MessageSquare,
	Database,
	Code,
	Webhook,
	Timer,
	Filter,
	Map,
} from "lucide-react";
import StartNode, { startNodeConfig } from "./start-node";
import { unique } from "next/dist/build/utils";
import EndNode, { endNodeConfig } from "./end-node";
import TextNode, { textNodeConfig } from "./text-node";

// ==================== Node Colors ====================

export const nodeColors: Record<NodeType, string> = {
	[NodeType.START]: "#22c55e",
	[NodeType.END]: "#ef4444",
	[NodeType.API]: "#3b82f6",
	[NodeType.LLM]: "#8b5cf6",
	[NodeType.CONDITIONAL]: "#f59e0b",
	[NodeType.LOOP]: "#06b6d4",
	[NodeType.INPUT]: "#22c55e",
	[NodeType.OUTPUT]: "#ec4899",
	[NodeType.TEXT]: "#6b7280",
	[NodeType.NUMBER]: "#6b7280",
	[NodeType.MODEL]: "#eab308",
	[NodeType.TOOL]: "#f97316",
	[NodeType.CODE]: "#3b82f6",
	[NodeType.DATABASE]: "#06b6d4",
	[NodeType.EMAIL]: "#f59e0b",
	[NodeType.WEBHOOK]: "#ec4899",
	[NodeType.MESSAGE]: "#22c55e",
	[NodeType.FILTER]: "#8b5cf6",
	[NodeType.TIMER]: "#6b7280",
	[NodeType.MAP]: "#3b82f6",
	[NodeType.FILE]: "#eab308",
	[NodeType.IMAGE]: "#8b5cf6",
	[NodeType.TABLE]: "#3b82f6",
	[NodeType.CALENDAR]: "#06b6d4",
	[NodeType.UPLOAD]: "#22c55e",
};

export const handleColors = {
	target: "#3b82f6", // blue for target/input handles
	source: "#22c55e", // green for source/output handles
};

// ==================== Node Configs Registry ====================

export const nodeConfigs: Record<NodeType, any> = {
	[NodeType.START]: startNodeConfig,
	[NodeType.END]: endNodeConfig,
	[NodeType.API]: {},
	[NodeType.LLM]: {},
	[NodeType.CONDITIONAL]: {},
	[NodeType.LOOP]: {},
	[NodeType.INPUT]: {},
	[NodeType.OUTPUT]: {},
	[NodeType.TEXT]: textNodeConfig,
	[NodeType.NUMBER]: {},
	[NodeType.MODEL]: {},
	[NodeType.TOOL]: {},
	[NodeType.CODE]: {},
	[NodeType.DATABASE]: {},
	[NodeType.EMAIL]: {},
	[NodeType.WEBHOOK]: {},
	[NodeType.MESSAGE]: {},
	[NodeType.FILTER]: {},
	[NodeType.TIMER]: {},
	[NodeType.MAP]: {},
	[NodeType.FILE]: {},
	[NodeType.IMAGE]: {},
	[NodeType.TABLE]: {},
	[NodeType.CALENDAR]: {},
	[NodeType.UPLOAD]: {},
};

// ==================== Node Components Registry ====================

export const nodeComponents: Record<NodeType, any> = {
	[NodeType.START]: StartNode,
	[NodeType.END]: EndNode,
	[NodeType.API]: null,
	[NodeType.LLM]: null,
	[NodeType.CONDITIONAL]: null,
	[NodeType.LOOP]: null,
	[NodeType.INPUT]: null,
	[NodeType.OUTPUT]: null,
	[NodeType.TEXT]: TextNode,
	[NodeType.NUMBER]: null,
	[NodeType.MODEL]: null,
	[NodeType.TOOL]: null,
	[NodeType.CODE]: null,
	[NodeType.DATABASE]: null,
	[NodeType.EMAIL]: null,
	[NodeType.WEBHOOK]: null,
	[NodeType.MESSAGE]: null,
	[NodeType.FILTER]: null,
	[NodeType.TIMER]: null,
	[NodeType.MAP]: null,
	[NodeType.FILE]: null,
	[NodeType.IMAGE]: null,
	[NodeType.TABLE]: null,
	[NodeType.CALENDAR]: null,
	[NodeType.UPLOAD]: null,
};

// ==================== Node Executors Registry ====================

export const nodeExecutors: Record<NodeType, any> = {
	[NodeType.START]: null,
	[NodeType.END]: null,
	[NodeType.API]: null,
	[NodeType.LLM]: null,
	[NodeType.CONDITIONAL]: null,
	[NodeType.LOOP]: null,
	[NodeType.INPUT]: null,
	[NodeType.OUTPUT]: null,
	[NodeType.TEXT]: null,
	[NodeType.NUMBER]: null,
	[NodeType.MODEL]: null,
	[NodeType.TOOL]: null,
	[NodeType.CODE]: null,
	[NodeType.DATABASE]: null,
	[NodeType.EMAIL]: null,
	[NodeType.WEBHOOK]: null,
	[NodeType.MESSAGE]: null,
	[NodeType.FILTER]: null,
	[NodeType.TIMER]: null,
	[NodeType.MAP]: null,
	[NodeType.FILE]: null,
	[NodeType.IMAGE]: null,
	[NodeType.TABLE]: null,
	[NodeType.CALENDAR]: null,
	[NodeType.UPLOAD]: null,
};

// ==================== Sidebar Config (Grouped) ====================
// components/layout/workflow-layout/nodes/index.ts

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
		id: "actions",
		label: "Actions",
		items: [
			{
				type: NodeType.API,
				label: "API",
				description: "Make HTTP request",
				icon: Globe,
				color: nodeColors[NodeType.API],
			},
			{
				type: NodeType.LLM,
				label: "LLM",
				description: "Language Model",
				icon: Brain,
				color: nodeColors[NodeType.LLM],
			},
			{
				type: NodeType.CODE,
				label: "Code",
				description: "Run custom code",
				icon: Code,
				color: nodeColors[NodeType.CODE],
			},
			{
				type: NodeType.DATABASE,
				label: "Database",
				description: "Database query",
				icon: Database,
				color: nodeColors[NodeType.DATABASE],
			},
			{
				type: NodeType.EMAIL,
				label: "Email",
				description: "Send email",
				icon: Mail,
				color: nodeColors[NodeType.EMAIL],
			},
			{
				type: NodeType.WEBHOOK,
				label: "Webhook",
				description: "Incoming webhook",
				icon: Webhook,
				color: nodeColors[NodeType.WEBHOOK],
			},
			{
				type: NodeType.MESSAGE,
				label: "Message",
				description: "Send message",
				icon: MessageSquare,
				color: nodeColors[NodeType.MESSAGE],
			},
		],
	},
	{
		id: "logic",
		label: "Logic",
		items: [
			{
				type: NodeType.CONDITIONAL,
				label: "Condition",
				description: "If/Else condition",
				icon: GitBranch,
				color: nodeColors[NodeType.CONDITIONAL],
			},
			{
				type: NodeType.LOOP,
				label: "Loop",
				description: "Loop through items",
				icon: Repeat,
				color: nodeColors[NodeType.LOOP],
			},
			{
				type: NodeType.FILTER,
				label: "Filter",
				description: "Filter data",
				icon: Filter,
				color: nodeColors[NodeType.FILTER],
			},
			{
				type: NodeType.TIMER,
				label: "Timer",
				description: "Delay or schedule",
				icon: Timer,
				color: nodeColors[NodeType.TIMER],
			},
			{
				type: NodeType.MAP,
				label: "Map",
				description: "Transform data",
				icon: Map,
				color: nodeColors[NodeType.MAP],
			},
		],
	},
	{
		id: "data",
		label: "Data",
		items: [
			{
				type: NodeType.INPUT,
				label: "Input",
				description: "User input",
				icon: ArrowDownToLine,
				color: nodeColors[NodeType.INPUT],
			},
			{
				type: NodeType.OUTPUT,
				label: "Output",
				description: "Display output",
				icon: ArrowUpFromLine,
				color: nodeColors[NodeType.OUTPUT],
			},
			{
				type: NodeType.TEXT,
				label: "Text",
				description: "Text value",
				icon: Type,
				color: nodeColors[NodeType.TEXT],
			},
			{
				type: NodeType.NUMBER,
				label: "Number",
				description: "Number value",
				icon: Hash,
				color: nodeColors[NodeType.NUMBER],
			},
			{
				type: NodeType.FILE,
				label: "File",
				description: "File content",
				icon: FileText,
				color: nodeColors[NodeType.FILE],
			},
			{
				type: NodeType.IMAGE,
				label: "Image",
				description: "Image processing",
				icon: Image,
				color: nodeColors[NodeType.IMAGE],
			},
			{
				type: NodeType.TABLE,
				label: "Table",
				description: "Tabular data",
				icon: Table,
				color: nodeColors[NodeType.TABLE],
			},
			{
				type: NodeType.CALENDAR,
				label: "Calendar",
				description: "Date & time",
				icon: Calendar,
				color: nodeColors[NodeType.CALENDAR],
			},
			{
				type: NodeType.UPLOAD,
				label: "Upload",
				description: "Upload file",
				icon: Upload,
				color: nodeColors[NodeType.UPLOAD],
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
