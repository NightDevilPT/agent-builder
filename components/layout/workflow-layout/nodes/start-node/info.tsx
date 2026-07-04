// components/layout/workflow-layout/nodes/start-node/info.tsx
"use client";

import { memo } from "react";
import { Play, ArrowRight, Zap, Shield, Info, Workflow } from "lucide-react";

export const StartNodeInfo = memo(() => {
	return (
		<div className="space-y-4">
			{/* Hero */}
			<div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
				<div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
					<Play
						className="w-6 h-6 text-primary"
						fill="currentColor"
					/>
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
				It defines how your workflow gets triggered and passes control
				to the next connected node.
			</p>

			{/* Key Points */}
			<div className="space-y-3">
				<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					Key Features
				</h4>

				<div className="space-y-2">
					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 shrink-0 mt-0.5">
							<Zap className="w-3.5 h-3.5 text-primary" />
						</div>
						<div>
							<p className="text-sm font-medium">
								Execution Trigger
							</p>
							<p className="text-xs text-muted-foreground">
								Can be manual, webhook-based, or scheduled using
								cron expressions
							</p>
						</div>
					</div>

					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 shrink-0 mt-0.5">
							<ArrowRight className="w-3.5 h-3.5 text-primary" />
						</div>
						<div>
							<p className="text-sm font-medium">Single Output</p>
							<p className="text-xs text-muted-foreground">
								Connects to one node to start the workflow
								execution chain
							</p>
						</div>
					</div>

					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 shrink-0 mt-0.5">
							<Workflow className="w-3.5 h-3.5 text-primary" />
						</div>
						<div>
							<p className="text-sm font-medium">Required Node</p>
							<p className="text-xs text-muted-foreground">
								Every workflow must have exactly one Start node
								to function
							</p>
						</div>
					</div>

					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 shrink-0 mt-0.5">
							<Shield className="w-3.5 h-3.5 text-primary" />
						</div>
						<div>
							<p className="text-sm font-medium">Immutable</p>
							<p className="text-xs text-muted-foreground">
								Cannot be deleted or duplicated. One Start node
								per workflow
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Tip */}
			<div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border">
				<Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
				<p className="text-xs text-muted-foreground">
					Connect the output handle to any action or logic node to
					begin building your workflow. The workflow execution will
					follow the connections you create.
				</p>
			</div>
		</div>
	);
});

StartNodeInfo.displayName = "StartNodeInfo";
