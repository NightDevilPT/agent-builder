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
	HandleRowType,
} from "@/components/layout/workflow-layout/types";
import { getNodeConfig, getNodeExecutor } from "@/components/layout/workflow-layout/nodes";

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
			if (!node) {
				console.warn(`[Workflow Engine] Execution failed: Node with ID "${nodeId}" not found.`);
				return;
			}

			console.group(`[Workflow Engine] Executing Node: ${node.data.header.label} (${node.data.type}) [ID: ${nodeId}]`);
			console.log(`[Workflow Engine] Current execution status -> RUNNING`);

			updateNodeData(nodeId, {
				header: {
					...node.data.header,
					status: NodeExecutionStatus.RUNNING,
				},
			});

			// Introduce a 1000ms delay to make the running state animation visible in the UI
			await new Promise((resolve) => setTimeout(resolve, 2000));

			try {
				// Resolve inputs from incoming connections
				const inputValues: Record<string, any> = {};
				
				// 1. Set default manual input values
				node.data.handleRows.forEach((row) => {
					if (row.type === HandleRowType.INPUT || row.type === HandleRowType.INPUT_OUTPUT) {
						inputValues[row.id] = row.config.value;
					}
				});
				console.log(`[Workflow Engine] Manual configured inputs:`, { ...inputValues });

				// 2. Resolve target values from incoming edges
				const incomingEdges = edges.filter((edge) => edge.target === nodeId);
				console.log(`[Workflow Engine] Found ${incomingEdges.length} incoming edge(s)`);
				incomingEdges.forEach((edge) => {
					const sourceNode = getNodeById(edge.source);
					if (!sourceNode) {
						console.warn(`[Workflow Engine] Edge resolution warning: Source node "${edge.source}" not found.`);
						return;
					}

					const targetRow = node.data.handleRows.find(
						(row) => row.targetHandle?.id === edge.targetHandle
					);
					if (!targetRow) return;

					const sourceRow = sourceNode.data.handleRows.find(
						(row) => row.sourceHandle?.id === edge.sourceHandle
					);
					if (!sourceRow) return;

					inputValues[targetRow.id] = sourceRow.config.value;
					console.log(`[Workflow Engine] Input resolved from connection: targetRow "${targetRow.id}" <- sourceNode "${sourceNode.data.header.label}" sourceRow "${sourceRow.id}" (Value:`, sourceRow.config.value, `)`);
				});

				console.log(`[Workflow Engine] Final resolved inputs for executor:`, inputValues);

				// 3. Call registered executor if exists
				const executor = getNodeExecutor(node.data.type);
				let outputs: Record<string, any> = {};
				if (executor) {
					console.log(`[Workflow Engine] Invoking registered executor...`);
					outputs = await executor(inputValues);
					console.log(`[Workflow Engine] Executor outputs returned:`, outputs);
				} else {
					console.log(`[Workflow Engine] No custom executor registered. Skipping executor execution.`);
				}

				// 4. Update the output rows config value in state
				const updatedRows = node.data.handleRows.map((row) => {
					if (row.id in outputs) {
						return {
							...row,
							config: {
								...row.config,
								value: outputs[row.id],
							},
						};
					}
					return row;
				});

				console.log(`[Workflow Engine] Node execution completed -> SUCCESS`);
				updateNodeData(nodeId, {
					handleRows: updatedRows,
					header: {
						...node.data.header,
						status: NodeExecutionStatus.SUCCESS,
					},
				});
				console.groupEnd();

				// 5. Propagate downstream
				const outgoingEdges = edges.filter((edge) => edge.source === nodeId);
				console.log(`[Workflow Engine] Propagating downstream to ${outgoingEdges.length} connected node(s):`, outgoingEdges.map(e => e.target));
				for (const edge of outgoingEdges) {
					await executeNode(edge.target);
				}
			} catch (error) {
				console.error(`[Workflow Engine] Error executing node "${nodeId}":`, error);
				updateNodeData(nodeId, {
					header: {
						...node.data.header,
						status: NodeExecutionStatus.FAILURE,
					},
				});
				console.groupEnd();
			}
		},
		[getNodeById, updateNodeData, edges],
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
