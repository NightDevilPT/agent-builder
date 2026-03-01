// components/layout/workflow-layout/_components/nodes/general-nodes/text-node/index.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppNode, NodeStatus } from "../../../types";
import BaseNodeWrapper from "../base/base";

interface TextNodeProps {
	data: AppNode["data"];
	id: string;
	selected?: boolean;
}

const TextNode = ({ data, id }: TextNodeProps) => {
	const [content, setContent] = useState(data.content || "");
	const [charCount, setCharCount] = useState(0);
	const maxLength = data.maxLength || 1000;

	useEffect(() => {
		setCharCount(content.length);
	}, [content]);

	const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newContent = e.target.value;
		if (newContent.length <= maxLength) {
			setContent(newContent);
			// You would call updateNode from context here
		}
	};

	return (
		<BaseNodeWrapper nodeType={data.type} nodeId={id}>
			Text Node
		</BaseNodeWrapper>
	);
};

export default TextNode;
