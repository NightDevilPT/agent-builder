// components/layout/workflow-layout/nodes/node-wrapper/NodeHandles.tsx
"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { InputHandle, OutputHandle } from "../../types";
import { getHandleColor } from "../index";

interface NodeHandlesProps {
	inputHandles?: InputHandle[];
	outputHandles?: OutputHandle[];
}

export const NodeHandles = memo(
	({ inputHandles = [], outputHandles = [] }: NodeHandlesProps) => {
		return (
			<>
				{inputHandles
					.filter((h) => h.visible !== false)
					.map((handle) => (
						<Handle
							key={handle.id}
							type="target"
							position={handle.position ?? Position.Left}
							id={handle.id}
							title={handle.label}
							className="!w-2.5 !h-2.5 !border-2 !border-background"
							style={{
								backgroundColor: getHandleColor("target"),
							}}
						/>
					))}
				{outputHandles
					.filter((h) => h.visible !== false)
					.map((handle) => (
						<Handle
							key={handle.id}
							type="source"
							position={handle.position ?? Position.Right}
							id={handle.id}
							title={handle.label}
							className="!w-2.5 !h-2.5 !border-2 !border-background"
							style={{
								backgroundColor: getHandleColor("source"),
							}}
						/>
					))}
			</>
		);
	},
);

NodeHandles.displayName = "NodeHandles";
