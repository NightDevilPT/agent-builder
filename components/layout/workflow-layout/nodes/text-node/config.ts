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
		label: "Text",
		description: "Text value node",
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
			label: "Text",
			type: HandleRowType.INPUT_OUTPUT,
			description: "Text value",
			config: {
				value: "",
				inputType: "text",
				placeholder: "Enter text...",
			},
			targetHandle: {
				id: "text-input",
				position: Position.Left,
				label: "Input",
				description: "Receive text from another node",
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
				label: "Output",
				description: "Send text to another node",
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
