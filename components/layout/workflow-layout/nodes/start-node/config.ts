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
		label: "Start",
		description: "Workflow begins here",
		icon: Play,
		type: NodeType.START,
		status: NodeExecutionStatus.WAITING,
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
			label: "Start",
			type: HandleRowType.OUTPUT,
			description: "Triggers workflow execution",
			config: {
				value: null,
				inputType: "text",
			},
			sourceHandle: {
				id: "start-output",
				position: Position.Right,
				label: "Start",
				description: "Connect to begin workflow",
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
						NodeType.API,
						NodeType.LLM,
						NodeType.CONDITIONAL,
						NodeType.LOOP,
						NodeType.INPUT,
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
