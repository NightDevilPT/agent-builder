"use client";

import { Handle, Position } from "@xyflow/react";
import BaseNodeWrapper from "../base/base";
import { NodeTypesEnum } from "../../../types";
import { getNestedProperty } from "@/lib/utils";
import { useTheme } from "@/components/context/theme-context";

interface StartNodeProps {
	id: string;
	data: any;
}

const StartNode = ({ id, data }: StartNodeProps) => {
	const { dictionary } = useTheme();
	return (
		<BaseNodeWrapper
			nodeType={NodeTypesEnum.START_NODE}
			nodeId={id}
			className="border-green-500 ring-1 ring-green-200"
		>
			<label>{getNestedProperty(dictionary, data.header.label)}</label>
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
