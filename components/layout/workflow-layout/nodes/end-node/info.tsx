// components/layout/workflow-layout/nodes/end-node/info.tsx
"use client";

import { memo, useCallback } from "react";
import { getNestedProperty } from "@/lib/utils";
import { useTheme } from "@/components/context/theme-context";
import { Square, ArrowLeft, CheckCircle, Workflow } from "lucide-react";

export const EndNodeInfo = memo(() => {
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
			{/* Hero */}
			<div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
				<div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
					<Square className="w-6 h-6 text-destructive" />
				</div>
				<div>
					<h3 className="font-semibold text-base">
						{t(
							"flow.nodeTypes.nodes.endNode.info.title",
							"End Node",
						)}
					</h3>
					<p className="text-xs text-muted-foreground">
						{t(
							"flow.nodeTypes.nodes.endNode.info.subtitle",
							"Workflow termination point",
						)}
					</p>
				</div>
			</div>

			{/* Description */}
			<p className="text-sm leading-relaxed">
				{t(
					"flow.nodeTypes.nodes.endNode.info.description",
					"The End node marks where workflow execution stops. It receives the final output from the previous node and terminates the workflow.",
				)}
			</p>

			{/* Key Points */}
			<div className="space-y-2">
				<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					{t(
						"flow.nodeTypes.nodes.endNode.info.featuresTitle",
						"Key Features",
					)}
				</h4>

				<div className="space-y-2">
					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<ArrowLeft className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
						<div>
							<p className="text-sm font-medium">
								{t(
									"flow.nodeTypes.nodes.endNode.info.inputTitle",
									"Single Input",
								)}
							</p>
							<p className="text-xs text-muted-foreground">
								{t(
									"flow.nodeTypes.nodes.endNode.info.inputDesc",
									"Receives the final output from the last node in the workflow",
								)}
							</p>
						</div>
					</div>

					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<CheckCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
						<div>
							<p className="text-sm font-medium">
								{t(
									"flow.nodeTypes.nodes.endNode.info.terminationTitle",
									"Termination Point",
								)}
							</p>
							<p className="text-xs text-muted-foreground">
								{t(
									"flow.nodeTypes.nodes.endNode.info.terminationDesc",
									"Stops workflow execution when reached. No further nodes execute",
								)}
							</p>
						</div>
					</div>

					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<Workflow className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
						<div>
							<p className="text-sm font-medium">
								{t(
									"flow.nodeTypes.nodes.endNode.info.multipleTitle",
									"Multiple End Nodes",
								)}
							</p>
							<p className="text-xs text-muted-foreground">
								{t(
									"flow.nodeTypes.nodes.endNode.info.multipleDesc",
									"You can have multiple End nodes for different workflow branches",
								)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

EndNodeInfo.displayName = "EndNodeInfo";
