// workflow-layout/types/node.ts
import React, { ElementType } from "react";
import { Node, Position } from "@xyflow/react";

// ==================== Handle Enums ====================

export enum HandleDataFormat {
	STRING = "string",
	NUMBER = "number",
	BOOLEAN = "boolean",
	OBJECT = "object",
	ARRAY = "array",
	ANY = "any",
}

export enum HandleValueSource {
	MANUAL = "manual",
	CONNECTED = "connected",
	EXECUTION = "execution",
	DEFAULT = "default",
}

export enum HandleRowType {
	INPUT = "input",
	OUTPUT = "output",
	INPUT_OUTPUT = "input-output",
}

// ==================== Handle Validation ====================

export interface HandleValidationConfig {
	required: boolean;
	min?: number;
	max?: number;
	minLength?: number;
	maxLength?: number;
	pattern?: string;
	enum?: string[];
	message?: string;
}

export interface HandleValidation {
	config: HandleValidationConfig;
	validator?: (
		value: unknown,
		config: HandleValidationConfig,
	) => boolean | string;
}

// ==================== Connection Validation ====================

export interface ConnectionValidation {
	maxConnections: number;
	connectableNodes: string[];
	required: boolean;
}

// ==================== Handle Schema ====================

export interface SchemaProperty {
	type: HandleDataFormat;
	items?: SchemaProperty;
	properties?: Record<string, SchemaProperty>;
}

export interface HandleSchema {
	generated: {
		type: HandleDataFormat;
		properties?: Record<string, SchemaProperty>;
	};
	selectedPath?: string;
	filteredValue?: unknown;
	operations: string[];
}

// ==================== Base Handle ====================

export interface BaseHandle {
	id: string;
	position: Position;
	label: string;
	description?: string;
	placeholder?: string;
	value: unknown;
	defaultValue?: unknown;
	source: HandleValueSource;
	dataFormat: HandleDataFormat;
	validation: HandleValidation;
	schema?: HandleSchema;
	tooltip?: ElementType;
	visible: boolean;
	disabled: boolean;
}

// ==================== Input Handle ====================

export interface InputHandle extends BaseHandle {
	type: "target";
	connection: ConnectionValidation & {
		connectedNodeId?: string;
		connectedHandleId?: string;
	};
}

// ==================== Output Handle ====================

export interface OutputHandle extends BaseHandle {
	type: "source";
	connection: ConnectionValidation & {
		connectedNodeIds: string[];
		connectedHandleIds: string[];
	};
}

// ==================== Handle Row ====================

export interface KeyValuePair {
	id: string;
	key: string;
	value: string;
	source: "manual" | "connection";
	connectedNodeId?: string;
	connectedHandleId?: string;
}

export interface HandleRowConfig {
	value: unknown;
	defaultValue?: unknown;
	inputType:
		| "text"
		| "number"
		| "select"
		| "textarea"
		| "json"
		| "key-value"
		| "boolean"
		| "none";
	placeholder?: string;
	options?: { label: string; value: string }[];
	keyValuePairs?: KeyValuePair[];
}

export interface HandleRow {
	id: string;
	label: string;
	type: HandleRowType;
	description?: string;
	config: HandleRowConfig;
	targetHandle?: InputHandle;
	sourceHandle?: OutputHandle;
}

// ==================== Handle Definition ====================

export type HandleDefinition = InputHandle | OutputHandle;

// ==================== Node Enums ====================

export enum NodeType {
	START = "START",
	END = "END",
	OUTPUT = "OUTPUT",
	TEXT = "TEXT",
	UPPERCASE = "UPPERCASE",
}

export enum NodeExecutionStatus {
	IDLE = "IDLE",
	RUNNING = "RUNNING",
	SUCCESS = "SUCCESS",
	FAILURE = "FAILURE",
	WAITING = "WAITING",
}

// ==================== Node Header ====================

export interface NodeHeaderAction {
	isEnabled: boolean;
	icon?: React.ElementType;
	tooltip?: string;
}

export interface NodeHeaderInfoAction extends NodeHeaderAction {
	component?: React.ElementType;
}

export interface NodeHeader {
	label: string;
	description?: string;
	icon?: React.ElementType;
	type: NodeType;
	status: NodeExecutionStatus;
	actions: {
		copy: NodeHeaderAction;
		delete: NodeHeaderAction;
		execute?: NodeHeaderAction;
		info?: NodeHeaderInfoAction;
	};
}

// ==================== Node Configuration ====================

export interface NodeConfig {
	[key: string]: unknown;
}

// ==================== Node Data ====================

export interface AppNodeData extends Record<string, unknown> {
	type: NodeType;
	header: NodeHeader;
	config: NodeConfig;
	inputHandles: InputHandle[];
	outputHandles: OutputHandle[];
	handleRows: HandleRow[];
	isStartNode: boolean;
	isEndNode: boolean;
	[key: string]: unknown;
}

// ==================== Workflow Node ====================

export type AppNode = Node<AppNodeData>;
