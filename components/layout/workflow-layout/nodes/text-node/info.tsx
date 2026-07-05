// components/layout/workflow-layout/nodes/text-node/info.tsx
"use client";

import { memo } from "react";
import { Type, ArrowRight, ArrowLeft, Pencil } from "lucide-react";

export const TextNodeInfo = memo(() => {
	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
				<div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
					<Type className="w-6 h-6 text-primary" />
				</div>
				<div>
					<h3 className="font-semibold text-base">Text Node</h3>
					<p className="text-xs text-muted-foreground">
						String value storage
					</p>
				</div>
			</div>

			<p className="text-sm leading-relaxed">
				The Text node holds a string value that can be manually entered
				or received from another node, and passed forward in the
				workflow.
			</p>

			<div className="space-y-2">
				<h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					How it works
				</h4>
				<div className="space-y-2">
					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<Pencil className="w-4 h-4 text-primary mt-0.5 shrink-0" />
						<p className="text-xs text-muted-foreground">
							Enter text manually or receive value from a
							connected node
						</p>
					</div>
					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<ArrowLeft className="w-4 h-4 text-primary mt-0.5 shrink-0" />
						<p className="text-xs text-muted-foreground">
							Input handle receives string data from API, LLM, or
							other nodes
						</p>
					</div>
					<div className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50">
						<ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
						<p className="text-xs text-muted-foreground">
							Output handle sends the text value to downstream
							nodes
						</p>
					</div>
				</div>
			</div>
		</div>
	);
});

TextNodeInfo.displayName = "TextNodeInfo";
