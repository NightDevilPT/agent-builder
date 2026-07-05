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
		label: "End",
		description: "Workflow ends here",
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
			label: "End",
			type: HandleRowType.INPUT,
			description: "Workflow ends here",
			config: {
				value: null,
				inputType: "text",
			},
			targetHandle: {
				id: "end-input",
				position: Position.Left,
				label: "End",
				description: "Receives final output",
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
						NodeType.API,
						NodeType.LLM,
						NodeType.CONDITIONAL,
						NodeType.LOOP,
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
