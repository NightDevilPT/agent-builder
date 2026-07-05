// components/layout/workflow-layout/nodes/uppercase-node/index.tsx
"use client";

import { AppNode } from "../../types";
import { memo, useCallback } from "react";
import { type NodeProps } from "@xyflow/react";
import { NodeHandles } from "../node-wrapper/NodeHandles";
import { NodeWrapper } from "../node-wrapper/NodeWrapper";
import { useWorkflow } from "@/components/context/workflow-context";

type UppercaseNodeProps = NodeProps<AppNode>;

const UppercaseNode = memo((props: UppercaseNodeProps) => {
	const { id, data } = props;
	const { updateNodeData } = useWorkflow();
	const handleRows = data?.handleRows ?? [];

	const handleInputChange = useCallback(
		(rowId: string, value: string | number | boolean) => {
			const updatedRows = handleRows.map((row) =>
				row.id === rowId
					? { ...row, config: { ...row.config, value } }
					: row,
			);
			updateNodeData(id, { handleRows: updatedRows });
		},
		[id, handleRows, updateNodeData],
	);

	return (
		<NodeWrapper {...props}>
			<div className="w-[240px] px-1 py-0.5">
				<NodeHandles
					handleRows={handleRows}
					onChange={handleInputChange}
				/>
			</div>
		</NodeWrapper>
	);
});

UppercaseNode.displayName = "UppercaseNode";

export default UppercaseNode;
export { uppercaseNodeConfig } from "./config";
