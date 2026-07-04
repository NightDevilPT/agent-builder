// context/WorkflowContext.tsx
"use client";

import React, {
	createContext,
	useContext,
	useCallback,
	useMemo,
	useState,
} from "react";
import {
	useNodesState,
	useEdgesState,
	addEdge,
	type OnNodesChange,
	type OnEdgesChange,
	type OnConnect,
	type Connection,
	type Edge,
} from "@xyflow/react";
import { IdGenerator } from "@/utils/idGenerator";
import {
	AppNode,
	AppNodeData,
	NodeExecutionStatus,
	NodeType,
} from "@/components/layout/workflow-layout/types";
import { getNodeConfig } from "@/components/layout/workflow-layout/nodes";

// ==================== Context Type ====================

interface WorkflowContextType {
	nodes: AppNode[];
	edges: Edge[];
	selectedNode: AppNode | null;
	isExecuting: boolean;

	addNode: (type: NodeType, position: { x: number; y: number }) => string;
	updateNodeData: (nodeId: string, updates: Partial<AppNodeData>) => void;
	removeNode: (nodeId: string) => void;
	duplicateNode: (nodeId: string) => void;

	setInitialNodes: (nodes: AppNode[]) => void;
	setInitialEdges: (edges: Edge[]) => void;

	onNodesChange: OnNodesChange<AppNode>;
	onEdgesChange: OnEdgesChange;
	onConnect: OnConnect;

	executeNode: (nodeId: string) => Promise<void>;
	executeWorkflow: () => Promise<void>;
	resetWorkflow: () => void;

	getNodeById: (nodeId: string) => AppNode | undefined;
}

// ==================== Context ====================

const WorkflowContext = createContext<WorkflowContextType | null>(null);

export const useWorkflow = () => {
	const context = useContext(WorkflowContext);
	if (!context) {
		throw new Error("useWorkflow must be used within a WorkflowProvider");
	}
	return context;
};

// ==================== Provider ====================

export const WorkflowProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
	const [isExecuting, setIsExecuting] = useState(false);

	const selectedNode = useMemo(
		() => nodes.find((n) => n.id === selectedNodeId) || null,
		[nodes, selectedNodeId],
	);

	const getNodeById = useCallback(
		(nodeId: string) => nodes.find((n) => n.id === nodeId),
		[nodes],
	);

	// ==================== Set Initial Data ====================

	const setInitialNodes = useCallback(
		(initialNodes: AppNode[]) => {
			setNodes(initialNodes);
		},
		[setNodes],
	);

	const setInitialEdges = useCallback(
		(initialEdges: Edge[]) => {
			setEdges(initialEdges);
		},
		[setEdges],
	);

	// ==================== Node Operations ====================

	const addNode = useCallback(
		(type: NodeType, position: { x: number; y: number }) => {
			const nodeId = IdGenerator.generateNodeId(type);
			const nodeConfig = getNodeConfig(type);

			const isStartOrEnd =
				type === NodeType.START || type === NodeType.END;
			const newNode: AppNode = {
				id: nodeId,
				type,
				position,
				data: {
					...nodeConfig,
				} as AppNodeData,
			};

			setNodes((nds) => [...nds, newNode]);
			return nodeId;
		},
		[setNodes],
	);

	const updateNodeData = useCallback(
		(nodeId: string, updates: Partial<AppNodeData>) => {
			setNodes((nds) =>
				nds.map((node) =>
					node.id === nodeId
						? { ...node, data: { ...node.data, ...updates } }
						: node,
				),
			);
		},
		[setNodes],
	);

	const removeNode = useCallback(
		(nodeId: string) => {
			setNodes((nds) => nds.filter((node) => node.id !== nodeId));
			setEdges((eds) =>
				eds.filter(
					(edge) => edge.source !== nodeId && edge.target !== nodeId,
				),
			);
			if (selectedNodeId === nodeId) setSelectedNodeId(null);
		},
		[setNodes, setEdges, selectedNodeId],
	);

	const duplicateNode = useCallback(
		(nodeId: string) => {
			const node = getNodeById(nodeId);
			if (!node) return;

			const newNode: AppNode = {
				...node,
				id: IdGenerator.generateNodeId(node.data.type),
				position: { x: node.position.x + 50, y: node.position.y + 50 },
				selected: false,
			};
			setNodes((nds) => [...nds, newNode]);
		},
		[getNodeById, setNodes],
	);

	// ==================== Edge Operations ====================

	const onConnect: OnConnect = useCallback(
		(connection: Connection) => {
			setEdges((eds) => addEdge(connection, eds));
		},
		[setEdges],
	);

	// ==================== Execution ====================

	const executeNode = useCallback(
		async (nodeId: string) => {
			const node = getNodeById(nodeId);
			if (!node) return;

			updateNodeData(nodeId, {
				header: {
					...node.data.header,
					status: NodeExecutionStatus.RUNNING,
				},
			});

			try {
				updateNodeData(nodeId, {
					header: {
						...node.data.header,
						status: NodeExecutionStatus.SUCCESS,
					},
				});
			} catch {
				updateNodeData(nodeId, {
					header: {
						...node.data.header,
						status: NodeExecutionStatus.FAILURE,
					},
				});
			}
		},
		[getNodeById, updateNodeData],
	);

	const executeWorkflow = useCallback(async () => {
		setIsExecuting(true);
		const startNode = nodes.find((n) => n.data.type === NodeType.START);
		if (startNode) await executeNode(startNode.id);
		setIsExecuting(false);
	}, [nodes, executeNode]);

	const resetWorkflow = useCallback(() => {
		setNodes((nds) =>
			nds.map((node) => ({
				...node,
				data: {
					...node.data,
					header: {
						...node.data.header,
						status: NodeExecutionStatus.IDLE,
					},
				},
			})),
		);
	}, [setNodes]);

	// ==================== Context Value ====================

	const value = useMemo(
		() => ({
			nodes,
			edges,
			selectedNode,
			isExecuting,
			addNode,
			updateNodeData,
			removeNode,
			duplicateNode,
			setInitialNodes,
			setInitialEdges,
			onNodesChange,
			onEdgesChange,
			onConnect,
			executeNode,
			executeWorkflow,
			resetWorkflow,
			getNodeById,
		}),
		[nodes, edges, selectedNode, isExecuting],
	);

	return (
		<WorkflowContext.Provider value={value}>
			{children}
		</WorkflowContext.Provider>
	);
};
