// ==================== START NODE ====================

// components/layout/workflow-layout/nodes/start-node/config.ts
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
import { Play } from "lucide-react";
import { StartNodeInfo } from "./info";

export const startNodeConfig: AppNodeData = {
	type: NodeType.START,
	header: {
		label: "flow.nodeTypes.nodes.startNode.label",
		description: "flow.nodeTypes.nodes.startNode.description",
		icon: Play,
		type: NodeType.START,
		status: NodeExecutionStatus.IDLE,
		actions: {
			copy: { isEnabled: false },
			delete: { isEnabled: false },
			execute: { isEnabled: false },
			info: {
				isEnabled: true,
				component: StartNodeInfo,
			},
		},
	},
	config: {},
	inputHandles: [],
	outputHandles: [],
	handleRows: [
		{
			id: "start",
			label: "flow.nodeTypes.nodes.startNode.fields.start.label",
			type: HandleRowType.OUTPUT,
			description:
				"flow.nodeTypes.nodes.startNode.fields.start.description",
			config: {
				value: null,
				inputType: "text",
			},
			sourceHandle: {
				id: "start-output",
				position: Position.Right,
				label: "flow.nodeTypes.nodes.startNode.fields.start.sourceHandle.label",
				description:
					"flow.nodeTypes.nodes.startNode.fields.start.sourceHandle.description",
				value: null,
				defaultValue: null,
				source: HandleValueSource.DEFAULT,
				dataFormat: HandleDataFormat.ANY,
				validation: {
					config: { required: false },
				},
				type: "source",
				connection: {
					maxConnections: 1,
					connectableNodes: [
						NodeType.TEXT,
						NodeType.UPPERCASE,
						NodeType.OUTPUT,
						NodeType.END,
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
	isStartNode: true,
	isEndNode: false,
};
