"use client";

import React, {
	createContext,
	useContext,
	useReducer,
	useCallback,
	ReactNode,
	useEffect,
} from "react";
import {
	Edge,
	Connection,
	NodeChange,
	EdgeChange,
	applyNodeChanges,
	applyEdgeChanges,
	addEdge,
	Viewport,
	XYPosition,
} from "@xyflow/react";
import {
	AppNode,
	AppNodeData,
	NodeTypesEnum,
} from "@/interfaces/reactflow.interface";
import { v4 as uuidv4 } from "uuid";

// Flow Editor State
export interface FlowEditorState {
	nodes: AppNode[];
	edges: Edge[];
	selectedNodeId: string | null;
	selectedEdgeId: string | null;
	viewport: Viewport;
	history: {
		past: Array<{ nodes: AppNode[]; edges: Edge[] }>;
		future: Array<{ nodes: AppNode[]; edges: Edge[] }>;
	};
	isLoading: boolean;
	error: string | null;
	isDirty: boolean;
	flowId: string | null;
	flowName: string;
}

// Initial State
const initialState: FlowEditorState = {
	nodes: [],
	edges: [],
	selectedNodeId: null,
	selectedEdgeId: null,
	viewport: { x: 0, y: 0, zoom: 1 },
	history: {
		past: [],
		future: [],
	},
	isLoading: false,
	error: null,
	isDirty: false,
	flowId: null,
	flowName: "Untitled Flow",
};

// Action Types
type FlowAction =
	| { type: "SET_FLOW_ID"; payload: string }
	| { type: "SET_FLOW_NAME"; payload: string }
	| { type: "SET_NODES"; payload: AppNode[] }
	| { type: "SET_EDGES"; payload: Edge[] }
	| { type: "ON_NODES_CHANGE"; payload: NodeChange[] }
	| { type: "ON_EDGES_CHANGE"; payload: EdgeChange[] }
	| { type: "ON_CONNECT"; payload: Connection }
	| { type: "SELECT_NODE"; payload: string | null }
	| { type: "SELECT_EDGE"; payload: string | null }
	| { type: "SET_VIEWPORT"; payload: Viewport }
	| { type: "UNDO" }
	| { type: "REDO" }
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_ERROR"; payload: string | null }
	| { type: "SET_DIRTY"; payload: boolean }
	| { type: "RESET_FLOW" }
	| {
			type: "LOAD_FLOW";
			payload: { nodes: AppNode[]; edges: Edge[]; flowName?: string };
	  };

// Helper function to ensure nodes are properly typed
const ensureAppNodes = (nodes: any[]): AppNode[] => {
	return nodes.map((node) => ({
		...node,
		data: {
			icon: node.data?.icon || (() => null),
			label: node.data?.label || "Node",
			description: node.data?.description,
			type: node.data?.type || node.type || NodeTypesEnum.TEXT_NODE,
			header: node.data?.header || {
				nodeId: node.id,
				label: node.data?.label || "Node",
				copy: { isCopy: true },
				delete: { isDelete: true },
				type: node.data?.type || node.type || NodeTypesEnum.TEXT_NODE,
			},
			isStartNode: node.data?.isStartNode || false,
			isEndNode: node.data?.isEndNode || false,
			...node.data,
		},
	}));
};

// Reducer
const flowReducer = (
	state: FlowEditorState,
	action: FlowAction
): FlowEditorState => {
	switch (action.type) {
		case "SET_FLOW_ID":
			return { ...state, flowId: action.payload };

		case "SET_FLOW_NAME":
			return { ...state, flowName: action.payload };

		case "SET_NODES":
			return { ...state, nodes: ensureAppNodes(action.payload) };

		case "SET_EDGES":
			return { ...state, edges: action.payload };

		case "ON_NODES_CHANGE": {
			const newNodes = applyNodeChanges(action.payload, state.nodes);
			return {
				...state,
				nodes: newNodes as AppNode[],
				isDirty: true,
				history: {
					past: [
						...state.history.past,
						{ nodes: state.nodes, edges: state.edges },
					],
					future: [],
				},
			};
		}

		case "ON_EDGES_CHANGE": {
			const newEdges = applyEdgeChanges(action.payload, state.edges);
			return {
				...state,
				edges: newEdges,
				isDirty: true,
				history: {
					past: [
						...state.history.past,
						{ nodes: state.nodes, edges: state.edges },
					],
					future: [],
				},
			};
		}

		case "ON_CONNECT": {
			const newEdges = addEdge(action.payload, state.edges);
			return {
				...state,
				edges: newEdges,
				isDirty: true,
				history: {
					past: [
						...state.history.past,
						{ nodes: state.nodes, edges: state.edges },
					],
					future: [],
				},
			};
		}

		case "SELECT_NODE":
			return {
				...state,
				selectedNodeId: action.payload,
				selectedEdgeId: action.payload ? null : state.selectedEdgeId,
			};

		case "SELECT_EDGE":
			return {
				...state,
				selectedEdgeId: action.payload,
				selectedNodeId: action.payload ? null : state.selectedNodeId,
			};

		case "SET_VIEWPORT":
			return { ...state, viewport: action.payload };

		case "UNDO": {
			if (state.history.past.length === 0) return state;

			const previous = state.history.past[state.history.past.length - 1];
			const newPast = state.history.past.slice(0, -1);

			return {
				...state,
				nodes: previous.nodes,
				edges: previous.edges,
				isDirty: true,
				history: {
					past: newPast,
					future: [
						{ nodes: state.nodes, edges: state.edges },
						...state.history.future,
					],
				},
			};
		}

		case "REDO": {
			if (state.history.future.length === 0) return state;

			const next = state.history.future[0];
			const newFuture = state.history.future.slice(1);

			return {
				...state,
				nodes: next.nodes,
				edges: next.edges,
				isDirty: true,
				history: {
					past: [
						...state.history.past,
						{ nodes: state.nodes, edges: state.edges },
					],
					future: newFuture,
				},
			};
		}

		case "SET_LOADING":
			return { ...state, isLoading: action.payload };

		case "SET_ERROR":
			return { ...state, error: action.payload };

		case "SET_DIRTY":
			return { ...state, isDirty: action.payload };

		case "LOAD_FLOW":
			return {
				...state,
				nodes: ensureAppNodes(action.payload.nodes),
				edges: action.payload.edges,
				flowName: action.payload.flowName || state.flowName,
				isDirty: false,
				history: { past: [], future: [] },
				selectedNodeId: null,
				selectedEdgeId: null,
			};

		case "RESET_FLOW":
			return {
				...initialState,
				flowId: state.flowId, // Preserve the flow ID
			};

		default:
			return state;
	}
};

// Context Interface
interface FlowContextType {
	state: FlowEditorState;
	dispatch: React.Dispatch<FlowAction>;
	// Node Operations
	addNode: (
		type: NodeTypesEnum,
		position: XYPosition,
		data?: Partial<AppNodeData>
	) => void;
	updateNode: (nodeId: string, data: Partial<AppNodeData>) => void;
	duplicateNode: (nodeId: string) => void;
	removeNode: (nodeId: string) => void;
	getNodeById: (nodeId: string) => AppNode | undefined;

	// Edge Operations
	removeEdge: (edgeId: string) => void;
	getEdgeById: (edgeId: string) => Edge | undefined;

	// Selection
	clearSelection: () => void;

	// Flow Operations
	saveFlow: () => Promise<void>;
	loadFlow: (flowId: string) => Promise<void>;
	exportFlow: () => { nodes: AppNode[]; edges: Edge[]; flowName: string };
	importFlow: (flow: {
		nodes: AppNode[];
		edges: Edge[];
		flowName?: string;
	}) => void;

	// History
	undo: () => void;
	redo: () => void;
	canUndo: boolean;
	canRedo: boolean;
}

// Create Context
const FlowContext = createContext<FlowContextType | undefined>(undefined);

// Provider Props
interface FlowProviderProps {
	children: ReactNode;
	flowId?: string;
	initialNodes?: AppNode[];
	initialEdges?: Edge[];
	autoSave?: boolean;
	autoSaveDelay?: number;
}

// Provider Component
export function FlowProvider({
	children,
	flowId: initialFlowId,
	initialNodes = [],
	initialEdges = [],
	autoSave = false,
	autoSaveDelay = 3000,
}: FlowProviderProps) {
	const [state, dispatch] = useReducer(flowReducer, {
		...initialState,
		nodes: ensureAppNodes(initialNodes),
		edges: initialEdges,
		flowId: initialFlowId || null,
	});

	// Auto-save effect
	useEffect(() => {
		if (!autoSave || !state.isDirty || !state.flowId) return;

		const timer = setTimeout(() => {
			saveFlow();
		}, autoSaveDelay);

		return () => clearTimeout(timer);
	}, [state.nodes, state.edges, state.isDirty, autoSave, state.flowId]);

	// Node Operations
	const addNode = useCallback(
		(
			type: NodeTypesEnum,
			position: XYPosition,
			data?: Partial<AppNodeData>
		) => {
			const nodeId = `node-${uuidv4()}`;
			const newNode: AppNode = {
				id: nodeId,
				type: type as string, // Cast to string for ReactFlow compatibility
				position,
				data: {
					icon: data?.icon || (() => null),
					label: data?.label || "New Node",
					description: data?.description,
					type: type,
					header: {
						nodeId: nodeId,
						label: data?.label || "New Node",
						copy: { isCopy: true },
						delete: { isDelete: true },
						type: type,
					},
					isStartNode: data?.isStartNode || false,
					isEndNode: data?.isEndNode || false,
					...data,
				},
			};

			dispatch({ type: "SET_NODES", payload: [...state.nodes, newNode] });
		},
		[state.nodes]
	);

	const updateNode = useCallback(
		(nodeId: string, data: Partial<AppNodeData>) => {
			const updatedNodes = state.nodes.map((node) =>
				node.id === nodeId
					? { ...node, data: { ...node.data, ...data } }
					: node
			);
			dispatch({ type: "SET_NODES", payload: updatedNodes });
		},
		[state.nodes]
	);

	const duplicateNode = useCallback(
		(nodeId: string) => {
			const nodeToDuplicate = state.nodes.find(
				(node) => node.id === nodeId
			);
			if (!nodeToDuplicate) return;

			const newNodeId = `node-${uuidv4()}`;
			const newNode: AppNode = {
				...nodeToDuplicate,
				id: newNodeId,
				position: {
					x: nodeToDuplicate.position.x + 50,
					y: nodeToDuplicate.position.y + 50,
				},
				data: {
					...nodeToDuplicate.data,
					label: `${nodeToDuplicate.data.label} (Copy)`,
					header: {
						...nodeToDuplicate.data.header,
						nodeId: newNodeId,
						label: `${nodeToDuplicate.data.label} (Copy)`,
					},
				},
			};

			dispatch({ type: "SET_NODES", payload: [...state.nodes, newNode] });
		},
		[state.nodes]
	);

	const removeNode = useCallback(
		(nodeId: string) => {
			// Remove node and its connected edges
			const filteredNodes = state.nodes.filter(
				(node) => node.id !== nodeId
			);
			const filteredEdges = state.edges.filter(
				(edge) => edge.source !== nodeId && edge.target !== nodeId
			);

			dispatch({ type: "SET_NODES", payload: filteredNodes });
			dispatch({ type: "SET_EDGES", payload: filteredEdges });

			if (state.selectedNodeId === nodeId) {
				dispatch({ type: "SELECT_NODE", payload: null });
			}
		},
		[state.nodes, state.edges, state.selectedNodeId]
	);

	const getNodeById = useCallback(
		(nodeId: string) => {
			return state.nodes.find((node) => node.id === nodeId);
		},
		[state.nodes]
	);

	// Edge Operations
	const removeEdge = useCallback(
		(edgeId: string) => {
			const filteredEdges = state.edges.filter(
				(edge) => edge.id !== edgeId
			);
			dispatch({ type: "SET_EDGES", payload: filteredEdges });

			if (state.selectedEdgeId === edgeId) {
				dispatch({ type: "SELECT_EDGE", payload: null });
			}
		},
		[state.edges, state.selectedEdgeId]
	);

	const getEdgeById = useCallback(
		(edgeId: string) => {
			return state.edges.find((edge) => edge.id === edgeId);
		},
		[state.edges]
	);

	// Selection
	const clearSelection = useCallback(() => {
		dispatch({ type: "SELECT_NODE", payload: null });
		dispatch({ type: "SELECT_EDGE", payload: null });
	}, []);

	// Flow Operations
	const saveFlow = useCallback(async () => {
		if (!state.flowId) return;

		dispatch({ type: "SET_LOADING", payload: true });
		try {
			// API call to save flow
			const flowData = {
				id: state.flowId,
				name: state.flowName,
				nodes: state.nodes,
				edges: state.edges,
				updatedAt: new Date(),
			};

			// await api.saveFlow(flowData);
			console.log("Saving flow:", flowData);

			dispatch({ type: "SET_DIRTY", payload: false });
			dispatch({ type: "SET_ERROR", payload: null });
		} catch (error) {
			dispatch({ type: "SET_ERROR", payload: "Failed to save flow" });
		} finally {
			dispatch({ type: "SET_LOADING", payload: false });
		}
	}, [state.flowId, state.flowName, state.nodes, state.edges]);

	const loadFlow = useCallback(async (flowId: string) => {
		dispatch({ type: "SET_LOADING", payload: true });
		try {
			// API call to load flow
			// const flowData = await api.loadFlow(flowId);
			const flowData = {
				nodes: [],
				edges: [],
				name: "Loaded Flow",
			};

			dispatch({
				type: "LOAD_FLOW",
				payload: {
					nodes: flowData.nodes as AppNode[],
					edges: flowData.edges,
					flowName: flowData.name,
				},
			});
			dispatch({ type: "SET_FLOW_ID", payload: flowId });
			dispatch({ type: "SET_ERROR", payload: null });
		} catch (error) {
			dispatch({ type: "SET_ERROR", payload: "Failed to load flow" });
		} finally {
			dispatch({ type: "SET_LOADING", payload: false });
		}
	}, []);

	const exportFlow = useCallback(() => {
		return {
			nodes: state.nodes,
			edges: state.edges,
			flowName: state.flowName,
		};
	}, [state.nodes, state.edges, state.flowName]);

	const importFlow = useCallback(
		(flow: { nodes: AppNode[]; edges: Edge[]; flowName?: string }) => {
			dispatch({
				type: "LOAD_FLOW",
				payload: {
					nodes: ensureAppNodes(flow.nodes),
					edges: flow.edges,
					flowName: flow.flowName,
				},
			});
		},
		[]
	);

	// History
	const undo = useCallback(() => dispatch({ type: "UNDO" }), []);
	const redo = useCallback(() => dispatch({ type: "REDO" }), []);

	const canUndo = state.history.past.length > 0;
	const canRedo = state.history.future.length > 0;

	const value: FlowContextType = {
		state,
		dispatch,
		addNode,
		updateNode,
		duplicateNode,
		removeNode,
		getNodeById,
		removeEdge,
		getEdgeById,
		clearSelection,
		saveFlow,
		loadFlow,
		exportFlow,
		importFlow,
		undo,
		redo,
		canUndo,
		canRedo,
	};

	return (
		<FlowContext.Provider value={value}>{children}</FlowContext.Provider>
	);
}

// Custom Hook
export function useFlow(): FlowContextType {
	const context = useContext(FlowContext);

	if (context === undefined) {
		throw new Error("useFlow must be used within a FlowProvider");
	}

	return context;
}

// Selector Hooks
export function useNodes(): AppNode[] {
	const { state } = useFlow();
	return state.nodes;
}

export function useEdges(): Edge[] {
	const { state } = useFlow();
	return state.edges;
}

export function useSelectedNode(): AppNode | null {
	const { state, getNodeById } = useFlow();
	return state.selectedNodeId
		? getNodeById(state.selectedNodeId) || null
		: null;
}

export function useSelectedEdge(): Edge | null {
	const { state, getEdgeById } = useFlow();
	return state.selectedEdgeId
		? getEdgeById(state.selectedEdgeId) || null
		: null;
}

export function useFlowStatus() {
	const { state } = useFlow();
	return {
		isLoading: state.isLoading,
		error: state.error,
		isDirty: state.isDirty,
		flowName: state.flowName,
		flowId: state.flowId,
	};
}

export function useFlowHistory() {
	const { undo, redo, canUndo, canRedo } = useFlow();
	return { undo, redo, canUndo, canRedo };
}
