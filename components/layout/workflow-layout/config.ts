// config/node-types-config.ts
import {
	FileText,
	Hash,
	PlayCircle,
	StopCircle,
	GitBranch,
	Repeat,
	Globe,
	Brain,
	Wrench,
} from "lucide-react";
import { NodeSidebar, NodeTypesEnum } from "./types";
import TextNode from "./_components/nodes/text";
import { TextNodeConfig } from "./_components/nodes/text/config";

// Category translation keys
export const NODE_CATEGORIES = {
	INIT_NODE: "flow.nodeTypes.categories.initNode",
	BASIC_NODE: "flow.nodeTypes.categories.basicNode",
	CONTROL_FLOW: "flow.nodeTypes.categories.controlFlow",
	INTEGRATION: "flow.nodeTypes.categories.integration",
	AI_ML: "flow.nodeTypes.categories.aiMl",
	TOOLS: "flow.nodeTypes.categories.tools",
} as const;

// Base node configuration with translation keys directly in label/description
export const BaseNodeTypes: Record<string, NodeSidebar[]> = {
	[NODE_CATEGORIES.INIT_NODE]: [
		{
			id: "start-node",
			label: "flow.nodeTypes.nodes.startNode.label",
			description: "flow.nodeTypes.nodes.startNode.description",
			icon: PlayCircle,
			type: NodeTypesEnum.START_NODE,
			color: "bg-green-500",
		},
		{
			id: "end-node",
			label: "flow.nodeTypes.nodes.endNode.label",
			description: "flow.nodeTypes.nodes.endNode.description",
			icon: StopCircle,
			type: NodeTypesEnum.END_NODE,
			color: "bg-red-500",
		},
	],
	[NODE_CATEGORIES.BASIC_NODE]: [
		{
			id: "text-node",
			label: "flow.nodeTypes.nodes.textNode.label",
			description: "flow.nodeTypes.nodes.textNode.description",
			icon: FileText,
			type: NodeTypesEnum.TEXT_NODE,
			color: "bg-yellow-500",
		},
		{
			id: "number-node",
			label: "flow.nodeTypes.nodes.numberNode.label",
			description: "flow.nodeTypes.nodes.numberNode.description",
			icon: Hash,
			type: NodeTypesEnum.NUMBER_NODE,
			color: "bg-blue-500",
		},
	],
	[NODE_CATEGORIES.CONTROL_FLOW]: [
		{
			id: "conditional-node",
			label: "flow.nodeTypes.nodes.conditionalNode.label",
			description: "flow.nodeTypes.nodes.conditionalNode.description",
			icon: GitBranch,
			type: NodeTypesEnum.CONDITIONAL_NODE,
			color: "bg-orange-500",
		},
		{
			id: "loop-node",
			label: "flow.nodeTypes.nodes.loopNode.label",
			description: "flow.nodeTypes.nodes.loopNode.description",
			icon: Repeat,
			type: NodeTypesEnum.LOOP_NODE,
			color: "bg-purple-500",
		},
	],
	[NODE_CATEGORIES.INTEGRATION]: [
		{
			id: "api-node",
			label: "flow.nodeTypes.nodes.apiNode.label",
			description: "flow.nodeTypes.nodes.apiNode.description",
			icon: Globe,
			type: NodeTypesEnum.API_NODE,
			color: "bg-indigo-500",
		},
	],
	[NODE_CATEGORIES.AI_ML]: [
		{
			id: "model-node",
			label: "flow.nodeTypes.nodes.modelNode.label",
			description: "flow.nodeTypes.nodes.modelNode.description",
			icon: Brain,
			type: NodeTypesEnum.MODEL_NODE,
			color: "bg-pink-500",
		},
	],
	[NODE_CATEGORIES.TOOLS]: [
		{
			id: "tool-node",
			label: "flow.nodeTypes.nodes.toolNode.label",
			description: "flow.nodeTypes.nodes.toolNode.description",
			icon: Wrench,
			type: NodeTypesEnum.TOOL_NODE,
			color: "bg-gray-500",
		},
	],
};

// Node types with component references
export const NodeTypes = {
	[NodeTypesEnum.TEXT_NODE]: TextNode,
};

// Node type configurations with type annotations
export const NodeTypeConfigs: Record<string, any> = {
	[NodeTypesEnum.TEXT_NODE]: TextNodeConfig,
};
