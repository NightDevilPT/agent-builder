import React from "react";
import { Node } from "@xyflow/react";

// interfaces/reactflow.interface.ts
export enum NodeTypesEnum {
	// Basic Node
	TEXT_NODE = "TEXT_NODE", // Basic Node
	NUMBER_NODE = "NUMBER_NODE",
	// Start and End nodes
	START_NODE = "START_NODE",
	END_NODE = "END_NODE",
	// Conditional Node
	CONDITIONAL_NODE = "CONDITIONAL_NODE",
	// Loop Node
	LOOP_NODE = "LOOP_NODE",
	// API Node
	API_NODE = "API_NODE",
	// Model Node
	MODEL_NODE = "MODEL_NODE",
	// Tool Node
	TOOL_NODE = "TOOL_NODE",
}

export enum NodeStatus {
	IDLE = "IDLE",
	RUNNING = "RUNNING",
	SUCCESS = "SUCCESS",
	FAILURE = "FAILURE",
}

export interface NodeHeaderProps {
	nodeId?: string; // ID of the node (useful for copying or deleting the node)
	label: string; // Title of the node
	copy: {
		isCopy: boolean; // Whether the node can be copied
		copyIcon?: React.ElementType; // Icon for the copy action
	};
	delete: {
		isDelete: boolean; // Whether the node can be deleted
		deleteIcon?: React.ElementType; // Icon for the delete action
	};
	execute?: {
		isExecute: boolean; // Whether the node can be deleted
		ExecuteIcon?: React.ElementType; // Icon for the delete action
	};
	info?: React.ElementType;
	type?: NodeTypesEnum;
	status: NodeStatus;
}

export interface AppNodeData {
	icon: React.ElementType;
	label: string;
	description?: string;
	type: NodeTypesEnum;
	header: NodeHeaderProps;
	execution?: () => void;
	isStartNode: boolean;
	isEndNode: boolean;
	[key: string]: any;
}

export interface AppNode extends Node {
	data: AppNodeData;
}

export interface NodeSidebar {
	id: string;
	label: string;
	description?: string;
	icon: React.ElementType;
	type: NodeTypesEnum;
	color: string;
}
