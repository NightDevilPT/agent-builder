// components/layout/workflow-layout/nodes/uppercase-node/config.ts
import {
	NodeType,
	NodeExecutionStatus,
	HandleRowType,
	HandleDataFormat,
	HandleValueSource,
	AppNodeData,
} from "../../types";
import { ArrowUp } from "lucide-react";
import { Position } from "@xyflow/react";
import { UppercaseNodeInfo } from "./info";

export const uppercaseNodeConfig: AppNodeData = {
	type: NodeType.UPPERCASE,
	header: {
		label: "flow.nodeTypes.nodes.uppercaseNode.label",
		description: "flow.nodeTypes.nodes.uppercaseNode.description",
		icon: ArrowUp,
		type: NodeType.UPPERCASE,
		status: NodeExecutionStatus.IDLE,
		actions: {
			copy: { isEnabled: true },
			delete: { isEnabled: true },
			execute: { isEnabled: true },
			info: {
				isEnabled: true,
				component: UppercaseNodeInfo,
			},
		},
	},
	config: {},
	inputHandles: [],
	outputHandles: [],
	handleRows: [
		{
			id: "input-text",
			label: "flow.nodeTypes.nodes.uppercaseNode.fields.input-text.label",
			type: HandleRowType.INPUT_OUTPUT,
			description: "flow.nodeTypes.nodes.uppercaseNode.fields.input-text.description",
			config: {
				value: "",
				inputType: "text",
				placeholder: "flow.nodeTypes.nodes.uppercaseNode.fields.input-text.placeholder",
			},
			targetHandle: {
				id: "input-text-target",
				position: Position.Left,
				label: "flow.nodeTypes.nodes.uppercaseNode.fields.input-text.targetHandle.label",
				description: "flow.nodeTypes.nodes.uppercaseNode.fields.input-text.targetHandle.description",
				value: null,
				defaultValue: null,
				source: HandleValueSource.DEFAULT,
				dataFormat: HandleDataFormat.STRING,
				validation: { config: { required: false } },
				type: "target",
				connection: {
					maxConnections: 1,
					connectableNodes: [
						NodeType.START,
						NodeType.TEXT,
					],
					required: false,
				},
				visible: true,
				disabled: false,
			},
			sourceHandle: {
				id: "input-text-source",
				position: Position.Right,
				label: "flow.nodeTypes.nodes.uppercaseNode.fields.input-text.sourceHandle.label",
				description: "flow.nodeTypes.nodes.uppercaseNode.fields.input-text.sourceHandle.description",
				value: null,
				defaultValue: null,
				source: HandleValueSource.DEFAULT,
				dataFormat: HandleDataFormat.STRING,
				validation: { config: { required: false } },
				type: "source",
				connection: {
					maxConnections: Infinity,
					connectableNodes: [
						NodeType.END,
						NodeType.TEXT,
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
