// components/layout/workflow-layout/nodes/start-node/index.tsx
"use client";

import { Play } from "lucide-react";
import { AppNode } from "../../types";
import { memo, useCallback } from "react";
import { startNodeConfig } from "./config";
import { Badge } from "@/components/ui/badge";
import { getNestedProperty } from "@/lib/utils";
import { type NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { NodeWrapper } from "../node-wrapper/NodeWrapper";
import { useTheme } from "@/components/context/theme-context";
import { getHandleColor } from "../index";

type StartNodeProps = NodeProps<AppNode>;

const StartNode = memo((props: StartNodeProps) => {
	const { data } = props;
	const handleRows = data?.handleRows ?? [];
	const { dictionary } = useTheme();

	const t = useCallback(
		(path: string, defaultValue: string): string => {
			if (!dictionary) return defaultValue;
			return getNestedProperty(dictionary, path) || defaultValue;
		},
		[dictionary],
	);

	return (
		<NodeWrapper {...props}>
			<div className="flex flex-col items-center gap-3 px-4 w-[200px]">
				<div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
					<Play className="w-5 h-5 text-primary" />
				</div>
				<div className="flex flex-col items-center gap-1.5">
					<Badge variant="secondary" className="text-[10px]">
						{t("flow.nodeTypes.nodes.startNode.badge", "Entry Point")}
					</Badge>
					<p className="text-xs text-muted-foreground text-center">
						{t("flow.nodeTypes.nodes.startNode.connectMessage", "Connect to start building")}
					</p>
				</div>
			</div>

			{/* Render handle rows */}
			{handleRows.map((row) => (
				<div key={row.id}>
					{row.sourceHandle && row.sourceHandle.visible && (
						<Handle
							key={row.sourceHandle.id}
							type="source"
							position={
								row.sourceHandle.position ?? Position.Right
							}
							id={row.sourceHandle.id}
							title={row.sourceHandle.label}
							className="!w-4 !h-4 !border-2 !border-background"
							style={{
								backgroundColor: getHandleColor("source"),
							}}
						/>
					)}
				</div>
			))}
		</NodeWrapper>
	);
});

StartNode.displayName = "StartNode";
export { startNodeConfig };
export default StartNode;
