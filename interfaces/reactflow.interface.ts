import React from "react";
import { Node } from "@xyflow/react";

export enum NodeTypesEnum {
	TEXT_NODE = "TEXT_NODE",
	NUMBER_NODE = "NUMBER_NODE",
	FILE_NODE = "FILE_NODE",
}

export interface NodeRegistryType {
	[key: string]: {
		component: React.ElementType;
		config: any;
	};
}

type ValueTypes =
	| string
	| number
	| object
	| string[]
	| number[]
	| { key: string; value: string }[] // For headers or query parameters
	| null;

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
