// components/layout/workflow-layout/nodes/output-node/config.ts
import {
	NodeType,
	NodeExecutionStatus,
	HandleRowType,
	HandleDataFormat,
	HandleValueSource,
	AppNodeData,
} from "../../types";
import { Position } from "@xyflow/react";
import { Eye } from "lucide-react";
import { OutputNodeInfo } from "./info";

export const outputNodeConfig: AppNodeData = {
	type: NodeType.OUTPUT,
	header: {
		label: "flow.nodeTypes.nodes.outputNode.label",
		description: "flow.nodeTypes.nodes.outputNode.description",
		icon: Eye,
		type: NodeType.OUTPUT,
		status: NodeExecutionStatus.IDLE,
		actions: {
			copy: { isEnabled: true },
			delete: { isEnabled: true },
			execute: { isEnabled: true },
			info: {
				isEnabled: true,
				component: OutputNodeInfo,
			},
		},
	},
	config: {},
	inputHandles: [],
	outputHandles: [],
	handleRows: [
		{
			id: "format",
			label: "flow.nodeTypes.nodes.outputNode.fields.format.label",
			type: HandleRowType.INPUT,
			description: "flow.nodeTypes.nodes.outputNode.fields.format.description",
			config: {
				value: "text",
				inputType: "select",
				placeholder: "flow.nodeTypes.nodes.outputNode.fields.format.placeholder",
				options: [
					{
						label: "flow.nodeTypes.nodes.outputNode.fields.format.options.text",
						value: "text",
					},
					{
						label: "flow.nodeTypes.nodes.outputNode.fields.format.options.pdf",
						value: "pdf",
					},
					{
						label: "flow.nodeTypes.nodes.outputNode.fields.format.options.image",
						value: "image",
					},
					{
						label: "flow.nodeTypes.nodes.outputNode.fields.format.options.code",
						value: "code",
					},
					{
						label: "flow.nodeTypes.nodes.outputNode.fields.format.options.json",
						value: "json",
					},
				],
			},
		},
		{
			id: "output-data",
			label: "flow.nodeTypes.nodes.outputNode.fields.output-data.label",
			type: HandleRowType.INPUT,
			description: "flow.nodeTypes.nodes.outputNode.fields.output-data.description",
			config: {
				value: "",
				inputType: "none",
				placeholder: "flow.nodeTypes.nodes.outputNode.fields.output-data.placeholder",
			},
			targetHandle: {
				id: "output-data-target",
				position: Position.Left,
				label: "flow.nodeTypes.nodes.outputNode.fields.output-data.targetHandle.label",
				description: "flow.nodeTypes.nodes.outputNode.fields.output-data.targetHandle.description",
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
						NodeType.UPPERCASE,
					],
					required: false,
				},
				visible: true,
				disabled: false,
			},
		},
	],
	isStartNode: false,
	isEndNode: true,
};
