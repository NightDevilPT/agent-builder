// components/layout/workflow-layout/nodes/text-node/info.tsx
"use client";

import { memo, useCallback } from "react";
import { getNestedProperty } from "@/lib/utils";
import { useTheme } from "@/components/context/theme-context";
import { Type, ArrowRight, ArrowLeft, Pencil } from "lucide-react";

export const TextNodeInfo = memo(() => {
	const { dictionary } = useTheme();

	const t = useCallback(
		(path: string, defaultValue: string): string => {
			if (!dictionary) return defaultValue;
			return getNestedProperty(dictionary, path) || defaultValue;
		},
		[dictionary],
	);

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
				<div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
					<Type className="w-6 h-6 text-primary" />
				</div>
				<div>
					<h3 className="font-semibold text-base">
						{t("flow.nodeTypes.nodes.textNode.info.title", "Text Node")}
					</h3>
					<p className="text-xs text-muted-foreground">
						{t("flow.nodeTypes.nodes.textNode.info.subtitle", "String value storage")}
					</p>
				</div>
			</div>

			<p className="text-sm leading-relaxed">
				{t(
					"flow.nodeTypes.nodes.textNode.info.description",
					"The Text node holds a string value that can be manually entered or received from another node, and passed forward in the workflow.",
				)}
			</p>

			<div className="space-y-2">
				<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					{t("flow.nodeTypes.nodes.textNode.info.howItWorks", "How it works")}
				</h4>
				<div className="space-y-2">
					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<Pencil className="w-4 h-4 text-primary mt-0.5 shrink-0" />
						<p className="text-xs text-muted-foreground">
							{t(
								"flow.nodeTypes.nodes.textNode.info.manualInput",
								"Enter text manually or receive value from a connected node",
							)}
						</p>
					</div>
					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<ArrowLeft className="w-4 h-4 text-primary mt-0.5 shrink-0" />
						<p className="text-xs text-muted-foreground">
							{t(
								"flow.nodeTypes.nodes.textNode.info.inputHandle",
								"Input handle receives string data from API, LLM, or other nodes",
							)}
						</p>
					</div>
					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
						<p className="text-xs text-muted-foreground">
							{t(
								"flow.nodeTypes.nodes.textNode.info.outputHandle",
								"Output handle sends the text value to downstream nodes",
							)}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
});

TextNodeInfo.displayName = "TextNodeInfo";
