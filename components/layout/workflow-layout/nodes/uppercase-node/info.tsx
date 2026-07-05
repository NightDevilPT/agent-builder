// components/layout/workflow-layout/nodes/uppercase-node/info.tsx
"use client";

import { memo, useCallback } from "react";
import { ArrowUp, BookOpen } from "lucide-react";
import { getNestedProperty } from "@/lib/utils";
import { useTheme } from "@/components/context/theme-context";

export const UppercaseNodeInfo = memo(() => {
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
					<ArrowUp className="w-6 h-6 text-primary" />
				</div>
				<div>
					<h3 className="font-semibold text-base">
						{t(
							"flow.nodeTypes.nodes.uppercaseNode.info.title",
							"Uppercase Node",
						)}
					</h3>
					<p className="text-xs text-muted-foreground">
						{t(
							"flow.nodeTypes.nodes.uppercaseNode.info.subtitle",
							"Text case modifier",
						)}
					</p>
				</div>
			</div>

			{/* Description */}
			<p className="text-sm leading-relaxed">
				{t(
					"flow.nodeTypes.nodes.uppercaseNode.info.description",
					"The Uppercase node processes string text values and converts all alphabetic characters to uppercase format. It can process text entered manually or received from preceding nodes.",
				)}
			</p>

			{/* Usage Guidelines */}
			<div className="space-y-2">
				<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					{t(
						"flow.nodeTypes.nodes.uppercaseNode.info.usageTitle",
						"Usage Rules",
					)}
				</h4>
				<ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1.5">
					<li>
						{t(
							"flow.nodeTypes.nodes.uppercaseNode.info.rule1",
							"Accepts any text inputs via target handle or direct manual input.",
						)}
					</li>
					<li>
						{t(
							"flow.nodeTypes.nodes.uppercaseNode.info.rule2",
							"Outputs the converted uppercase string to downstream target nodes.",
						)}
					</li>
					<li>
						{t(
							"flow.nodeTypes.nodes.uppercaseNode.info.rule3",
							"Non-alphabetic characters (numbers, punctuation, emojis) are left unchanged.",
						)}
					</li>
				</ul>
			</div>

			{/* Feature Icons */}
			<div className="grid grid-cols-2 gap-2 pt-1">
				<div className="flex items-center gap-2 p-2 rounded bg-muted/50">
					<ArrowUp className="w-4 h-4 text-primary flex-shrink-0" />
					<span className="text-xs">Case Conversion</span>
				</div>
				<div className="flex items-center gap-2 p-2 rounded bg-muted/50">
					<BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
					<span className="text-xs">String Utilities</span>
				</div>
			</div>
		</div>
	);
});

UppercaseNodeInfo.displayName = "UppercaseNodeInfo";
