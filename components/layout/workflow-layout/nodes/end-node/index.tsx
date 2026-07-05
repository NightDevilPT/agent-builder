// components/layout/workflow-layout/nodes/end-node/index.tsx
"use client";

import { memo } from "react";
import { type NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { AppNode } from "../../types";
import { NodeWrapper } from "../node-wrapper/NodeWrapper";
import { endNodeConfig } from "./config";
import { Badge } from "@/components/ui/badge";
import { Square } from "lucide-react";
import { getHandleColor } from "../index";

type EndNodeProps = NodeProps<AppNode>;

const EndNode = memo((props: EndNodeProps) => {
	const { data } = props;
	const handleRows = data?.handleRows ?? [];

	return (
		<NodeWrapper {...props}>
			<div className="flex flex-col items-center gap-3 py-3 px-4 w-[200px]">
				<div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
					<Square className="w-5 h-5 text-destructive" />
				</div>
				<div className="flex flex-col items-center gap-1.5">
					<Badge variant="destructive" className="text-[10px]">
						Exit Point
					</Badge>
					<p className="text-xs text-muted-foreground text-center">
						Workflow ends here
					</p>
				</div>
			</div>

			{/* Render handle rows */}
			{handleRows.map((row) => (
				<div key={row.id}>
					{row.targetHandle && row.targetHandle.visible && (
						<Handle
							key={row.targetHandle.id}
							type="target"
							position={
								row.targetHandle.position ?? Position.Left
							}
							id={row.targetHandle.id}
							title={row.targetHandle.label}
							className="!w-4 !h-4 !border-2 !border-background"
							style={{
								backgroundColor: getHandleColor("target"),
							}}
						/>
					)}
				</div>
			))}
		</NodeWrapper>
	);
});

EndNode.displayName = "EndNode";
export { endNodeConfig };
export default EndNode;
