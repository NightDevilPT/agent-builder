// components/layout/workflow-layout/nodes/start-node/config.ts
import {
	NodeType,
	NodeExecutionStatus,
	type OutputHandle,
	InputHandle,
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
	inputHandles: [] as InputHandle[],
	outputHandles: [
		{
			id: "start-output",
			type: "source",
			position: Position.Right,
			label: "Start",
			description: "Triggers workflow execution",
			value: null,
			defaultValue: null,
			source: "default",
			dataFormat: "any",
			validation: {
				config: {
					required: false,
				},
			},
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
		} as OutputHandle,
	],
	isStartNode: true,
	isEndNode: false,
};
