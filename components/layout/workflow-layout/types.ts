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

// ==================== Handle Definition ====================

export type HandleDefinition = InputHandle | OutputHandle;

// ==================== Node Enums ====================

export enum NodeType {
	START = "START",
	END = "END",
	API = "API",
	LLM = "LLM",
	CONDITIONAL = "CONDITIONAL",
	LOOP = "LOOP",
	INPUT = "INPUT",
	OUTPUT = "OUTPUT",
	TEXT = "TEXT",
	NUMBER = "NUMBER",
	MODEL = "MODEL",
	TOOL = "TOOL",
	CODE = "CODE",
	DATABASE = "DATABASE",
	EMAIL = "EMAIL",
	WEBHOOK = "WEBHOOK",
	MESSAGE = "MESSAGE",
	FILTER = "FILTER",
	TIMER = "TIMER",
	MAP = "MAP",
	FILE = "FILE",
	IMAGE = "IMAGE",
	TABLE = "TABLE",
	CALENDAR = "CALENDAR",
	UPLOAD = "UPLOAD",
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
	isStartNode: boolean;
	isEndNode: boolean;
	[key: string]: unknown;
}

// ==================== Workflow Node ====================

export type AppNode = Node<AppNodeData>;
