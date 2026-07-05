// components/layout/workflow-layout/nodes/end-node/config.ts
import {
	NodeType,
	NodeExecutionStatus,
	HandleRowType,
	HandleDataFormat,
	HandleValueSource,
	type AppNode,
	AppNodeData,
} from "../../types";
import { Position } from "@xyflow/react";
import { Square } from "lucide-react";
import { EndNodeInfo } from "./info";

export const endNodeConfig: AppNodeData = {
	type: NodeType.END,
	header: {
		label: "flow.nodeTypes.nodes.endNode.label",
		description: "flow.nodeTypes.nodes.endNode.description",
		icon: Square,
		type: NodeType.END,
		status: NodeExecutionStatus.IDLE,
		actions: {
			copy: { isEnabled: false },
			delete: { isEnabled: true },
			execute: { isEnabled: false },
			info: { isEnabled: true, component: EndNodeInfo },
		},
	},
	config: {},
	inputHandles: [],
	outputHandles: [],
	handleRows: [
		{
			id: "end",
			label: "flow.nodeTypes.nodes.endNode.fields.end.label",
			type: HandleRowType.INPUT,
			description: "flow.nodeTypes.nodes.endNode.fields.end.description",
			config: {
				value: null,
				inputType: "text",
			},
			targetHandle: {
				id: "end-input",
				position: Position.Left,
				label: "flow.nodeTypes.nodes.endNode.fields.end.targetHandle.label",
				description: "flow.nodeTypes.nodes.endNode.fields.end.targetHandle.description",
				value: null,
				defaultValue: null,
				source: HandleValueSource.DEFAULT,
				dataFormat: HandleDataFormat.ANY,
				validation: {
					config: { required: false },
				},
				type: "target",
				connection: {
					maxConnections: 1,
					connectableNodes: [
						NodeType.START,
						NodeType.TEXT,
						NodeType.UPPERCASE,
						NodeType.OUTPUT,
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
