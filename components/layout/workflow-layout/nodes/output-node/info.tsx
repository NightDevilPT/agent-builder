// components/layout/workflow-layout/nodes/output-node/info.tsx
"use client";

import { memo, useCallback } from "react";
import { Eye, Shield, FileText, Code2, Image } from "lucide-react";
import { getNestedProperty } from "@/lib/utils";
import { useTheme } from "@/components/context/theme-context";

export const OutputNodeInfo = memo(() => {
	const { dictionary } = useTheme();

	const t = useCallback(
		(path: string, defaultValue: string): string => {
			if (!dictionary) return defaultValue;
			return getNestedProperty(dictionary, path) || defaultValue;
		},
		[dictionary],
	);

	return (
		<div className="space-y-5">
			{/* Hero */}
			<div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
				<div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
					<Eye className="w-6 h-6 text-primary" />
				</div>
				<div>
					<h3 className="font-semibold text-base">
						{t(
							"flow.nodeTypes.nodes.outputNode.info.title",
							"Output Node",
						)}
					</h3>
					<p className="text-xs text-muted-foreground">
						{t(
							"flow.nodeTypes.nodes.outputNode.info.subtitle",
							"Data Visualization & Preview",
						)}
					</p>
				</div>
			</div>

			{/* Description */}
			<p className="text-sm leading-relaxed">
				{t(
					"flow.nodeTypes.nodes.outputNode.info.description",
					"The Output node acts as a viewer endpoint in your workflow. It receives processed data from preceding nodes and displays it in a format of your choice, such as plain text, PDF, images, raw source code, or JSON structures.",
				)}
			</p>

			{/* Usage Guidelines */}
			<div className="space-y-2">
				<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					{t(
						"flow.nodeTypes.nodes.outputNode.info.usageTitle",
						"Usage Rules",
					)}
				</h4>
				<ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1.5">
					<li>
						{t(
							"flow.nodeTypes.nodes.outputNode.info.rule1",
							"Accepts exactly one input connection via its left target handle.",
						)}
					</li>
					<li>
						{t(
							"flow.nodeTypes.nodes.outputNode.info.rule2",
							"Select a display format from the dropdown to format the raw input data accordingly.",
						)}
					</li>
					<li>
						{t(
							"flow.nodeTypes.nodes.outputNode.info.rule3",
							"Supports previewing live outputs like images, formatted code snippets, or raw JSON structures.",
						)}
					</li>
				</ul>
			</div>

			{/* Feature Icons */}
			<div className="grid grid-cols-2 gap-2 pt-1">
				<div className="flex items-center gap-2 p-2 rounded bg-muted/50">
					<Code2 className="w-4 h-4 text-primary flex-shrink-0" />
					<span className="text-xs">Multiple View Modes</span>
				</div>
				<div className="flex items-center gap-2 p-2 rounded bg-muted/50">
					<FileText className="w-4 h-4 text-primary flex-shrink-0" />
					<span className="text-xs">PDF & Text Renderers</span>
				</div>
			</div>
		</div>
	);
});

OutputNodeInfo.displayName = "OutputNodeInfo";
