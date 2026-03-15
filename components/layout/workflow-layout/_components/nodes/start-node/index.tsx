import React from "react";
import { Handle, Position } from "@xyflow/react";
import BaseNodeWrapper from "../base/base";
import { NodeTypesEnum } from "../../../types";

interface StartNodeProps {
	id: string;
	data: any;
}

const StartNode = ({ id, data }: StartNodeProps) => {
	return (
		<BaseNodeWrapper
			nodeType={NodeTypesEnum.START_NODE}
			nodeId={id}
			className="border-green-500 ring-1 ring-green-200"
		>
			<label>StartNode</label>
			<Handle
				type="source"
				position={Position.Right}
				className="w-3 h-3 bg-green-500 border-2 border-white"
				id="output"
			/>
		</BaseNodeWrapper>
	);
};

export default StartNode;