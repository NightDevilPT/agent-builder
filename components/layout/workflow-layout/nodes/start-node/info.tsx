// components/layout/workflow-layout/nodes/start-node/info.tsx
"use client";

import { memo } from "react";
import { Play, ArrowRight, Shield, Workflow, Zap } from "lucide-react";

export const StartNodeInfo = memo(() => {
	return (
		<div className="space-y-4">
			{/* Hero */}
			<div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
				<div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
					<Play className="w-6 h-6 text-primary" />
				</div>
				<div>
					<h3 className="font-semibold text-base">Start Node</h3>
					<p className="text-xs text-muted-foreground">
						Workflow entry point
					</p>
				</div>
			</div>

			{/* Description */}
			<p className="text-sm leading-relaxed">
				The Start node marks the beginning of every workflow execution.
				It passes control to the next connected node when the workflow
				is triggered.
			</p>

			{/* Key Points */}
			<div className="space-y-2">
				<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					Key Features
				</h4>

				<div className="space-y-2">
					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
						<div>
							<p className="text-sm font-medium">
								Execution Trigger
							</p>
							<p className="text-xs text-muted-foreground">
								Starts the workflow when triggered manually, via
								webhook, or on schedule
							</p>
						</div>
					</div>

					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
						<div>
							<p className="text-sm font-medium">Single Output</p>
							<p className="text-xs text-muted-foreground">
								Connects to one node to begin the workflow
								execution chain
							</p>
						</div>
					</div>

					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<Workflow className="w-4 h-4 text-primary mt-0.5 shrink-0" />
						<div>
							<p className="text-sm font-medium">Required Node</p>
							<p className="text-xs text-muted-foreground">
								Every workflow must have exactly one Start node
							</p>
						</div>
					</div>

					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
						<div>
							<p className="text-sm font-medium">Immutable</p>
							<p className="text-xs text-muted-foreground">
								Cannot be deleted or duplicated. Protected
								workflow entry
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

StartNodeInfo.displayName = "StartNodeInfo";
