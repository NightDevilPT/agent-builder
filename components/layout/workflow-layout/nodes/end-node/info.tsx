// components/layout/workflow-layout/nodes/end-node/info.tsx
"use client";

import { memo } from "react";
import { Square, ArrowLeft, CheckCircle, Workflow } from "lucide-react";

export const EndNodeInfo = memo(() => {
	return (
		<div className="space-y-4">
			{/* Hero */}
			<div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
				<div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
					<Square className="w-6 h-6 text-destructive" />
				</div>
				<div>
					<h3 className="font-semibold text-base">End Node</h3>
					<p className="text-xs text-muted-foreground">
						Workflow termination point
					</p>
				</div>
			</div>

			{/* Description */}
			<p className="text-sm leading-relaxed">
				The End node marks where workflow execution stops. It receives
				the final output from the previous node and terminates the
				workflow.
			</p>

			{/* Key Points */}
			<div className="space-y-2">
				<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					Key Features
				</h4>

				<div className="space-y-2">
					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<ArrowLeft className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
						<div>
							<p className="text-sm font-medium">Single Input</p>
							<p className="text-xs text-muted-foreground">
								Receives the final output from the last node in
								the workflow
							</p>
						</div>
					</div>

					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<CheckCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
						<div>
							<p className="text-sm font-medium">
								Termination Point
							</p>
							<p className="text-xs text-muted-foreground">
								Stops workflow execution when reached. No
								further nodes execute
							</p>
						</div>
					</div>

					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<Workflow className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
						<div>
							<p className="text-sm font-medium">
								Multiple End Nodes
							</p>
							<p className="text-xs text-muted-foreground">
								You can have multiple End nodes for different
								workflow branches
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

EndNodeInfo.displayName = "EndNodeInfo";
