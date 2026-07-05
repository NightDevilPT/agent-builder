// components/layout/workflow-layout/nodes/text-node/index.tsx
"use client";

import { memo, useCallback } from "react";
import { type NodeProps } from "@xyflow/react";
import { AppNode } from "../../types";
import { NodeWrapper } from "../node-wrapper/NodeWrapper";
import { NodeHandles } from "../node-wrapper/NodeHandles";
import { useWorkflow } from "@/components/context/workflow-context";
import { textNodeConfig } from "./config";

type TextNodeProps = NodeProps<AppNode>;

const TextNode = memo((props: TextNodeProps) => {
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
			<NodeHandles
				handleRows={handleRows}
				onChange={handleInputChange}
			/>
		</NodeWrapper>
	);
});

TextNode.displayName = "TextNode";
export { textNodeConfig };
export default TextNode;
