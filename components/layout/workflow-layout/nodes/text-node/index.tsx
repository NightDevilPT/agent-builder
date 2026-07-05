// components/layout/workflow-layout/nodes/text-node/index.tsx
"use client";

import { memo } from "react";
import { type NodeProps } from "@xyflow/react";
import { AppNode } from "../../types";
import { NodeWrapper } from "../node-wrapper/NodeWrapper";
import { NodeHandles } from "../node-wrapper/NodeHandles";
import { textNodeConfig } from "./config";

type TextNodeProps = NodeProps<AppNode>;

const TextNode = memo((props: TextNodeProps) => {
	const { data } = props;
	const handleRows = data?.handleRows ?? [];

	return (
		<NodeWrapper {...props}>
			<NodeHandles handleRows={handleRows} />
		</NodeWrapper>
	);
});

TextNode.displayName = "TextNode";
export { textNodeConfig };
export default TextNode;
