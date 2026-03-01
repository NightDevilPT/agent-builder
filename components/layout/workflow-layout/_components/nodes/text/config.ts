// components/layout/workflow-layout/_components/nodes/general-nodes/text-node/config.ts
import { Copy, FileText, Play, Trash } from "lucide-react";
import { AppNodeData, NodeStatus, NodeTypesEnum } from "../../../types";
import TextNodeInfo from "./info";

export const TextNodeConfig: AppNodeData = {
	icon: FileText,
	label: "flow.nodeTypes.nodes.textNode.label",
	description: "flow.nodeTypes.nodes.textNode.description",
	type: NodeTypesEnum.TEXT_NODE,
	header: {
		label: "flow.nodeTypes.nodes.textNode.label",
		type: NodeTypesEnum.TEXT_NODE,
		copy: {
			isCopy: true,
			copyIcon: Copy,
		},
		delete: {
			isDelete: true,
			deleteIcon: Trash,
		},
		execute: {
			isExecute: true,
			ExecuteIcon: Play,
		},
		info: TextNodeInfo,
		status: NodeStatus.SUCCESS,
	},
	isStartNode: false,
	isEndNode: false,

	// Text node specific data
	content: "",
	placeholder: "Enter your text here...",
	maxLength: 1000,
	minLength: 0,
};
