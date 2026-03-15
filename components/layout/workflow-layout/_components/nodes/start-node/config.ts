"use client";

import React from "react";
import { PlayCircle } from "lucide-react";
import { NodeTypesEnum, NodeStatus, AppNodeData } from "../../../types";
import StartNodeInfo from "./info";
import StartNodePreview from "./node-preview";

// Start node configuration
export const startNodeConfig: AppNodeData = {
	icon: PlayCircle,
	label: "flow.nodeTypes.nodes.startNode.label",
	description: "flow.nodeTypes.nodes.startNode.description",
	type: NodeTypesEnum.START_NODE,
	header: {
		label: "flow.nodeTypes.nodes.startNode.label",
		copy: {
			isCopy: false, // Start nodes typically cannot be copied
		},
		delete: {
			isDelete: false, // Start nodes typically cannot be deleted
		},
		execute: {
			isExecute: true,
			ExecuteIcon: PlayCircle,
		},
		info: StartNodeInfo,
		status: NodeStatus.IDLE,
	},
	nodePreview: StartNodePreview,
	isStartNode: true,
	isEndNode: false,
	execution: () => {
		console.log("Start node executed");
		// Start node execution logic here
	},
};
