// components/layout/workflow-layout/nodes/text-node/config.ts
import {
	NodeType,
	NodeExecutionStatus,
	HandleRowType,
	HandleDataFormat,
	HandleValueSource,
	AppNodeData,
} from "../../types";
import { Position } from "@xyflow/react";
import { Type } from "lucide-react";
import { TextNodeInfo } from "./info";

export const textNodeConfig: AppNodeData = {
	type: NodeType.TEXT,
	header: {
		label: "flow.nodeTypes.nodes.textNode.label",
		description: "flow.nodeTypes.nodes.textNode.description",
		icon: Type,
		type: NodeType.TEXT,
		status: NodeExecutionStatus.IDLE,
		actions: {
			copy: { isEnabled: true },
			delete: { isEnabled: true },
			execute: { isEnabled: false },
			info: {
				isEnabled: true,
				component: TextNodeInfo,
			},
		},
	},
	config: {},
	inputHandles: [],
	outputHandles: [],
	handleRows: [
		{
			id: "text-value",
			label: "flow.nodeTypes.nodes.textNode.fields.text-value.label",
			type: HandleRowType.INPUT_OUTPUT,
			description: "flow.nodeTypes.nodes.textNode.fields.text-value.description",
			config: {
				value: "",
				inputType: "text",
				placeholder: "flow.nodeTypes.nodes.textNode.fields.text-value.placeholder",
			},
			targetHandle: {
				id: "text-input",
				position: Position.Left,
				label: "flow.nodeTypes.nodes.textNode.fields.text-value.targetHandle.label",
				description: "flow.nodeTypes.nodes.textNode.fields.text-value.targetHandle.description",
				value: null,
				defaultValue: null,
				source: HandleValueSource.DEFAULT,
				dataFormat: HandleDataFormat.STRING,
				validation: { config: { required: false } },
				type: "target",
				connection: {
					maxConnections: 1,
					connectableNodes: [
						NodeType.API,
						NodeType.LLM,
						NodeType.INPUT,
						NodeType.TEXT,
						NodeType.NUMBER,
					],
					required: false,
				},
				visible: true,
				disabled: false,
			},
			sourceHandle: {
				id: "text-output",
				position: Position.Right,
				label: "flow.nodeTypes.nodes.textNode.fields.text-value.sourceHandle.label",
				description: "flow.nodeTypes.nodes.textNode.fields.text-value.sourceHandle.description",
				value: null,
				defaultValue: null,
				source: HandleValueSource.DEFAULT,
				dataFormat: HandleDataFormat.STRING,
				validation: { config: { required: false } },
				type: "source",
				connection: {
					maxConnections: Infinity,
					connectableNodes: [
						NodeType.API,
						NodeType.LLM,
						NodeType.CONDITIONAL,
						NodeType.LOOP,
						NodeType.OUTPUT,
					],
					required: false,
					connectedNodeIds: [],
					connectedHandleIds: [],
				},
				visible: true,
				disabled: false,
			},
		},
	],
	isStartNode: false,
	isEndNode: false,
};
