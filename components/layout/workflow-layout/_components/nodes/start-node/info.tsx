import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlayCircle, Info, CheckCircle } from "lucide-react";

const StartNodeInfo = () => {
	return (
		<div className="space-y-4 p-1">
			{/* Overview */}
			<div className="space-y-3">
				<div className="flex items-center gap-2 text-lg font-medium">
					<PlayCircle className="h-5 w-5 text-green-600" />
					Start Node Overview
				</div>
				<p className="text-sm text-muted-foreground">
					The entry point of your workflow execution
				</p>
				<p className="text-sm text-muted-foreground">
					The Start Node marks the beginning of your workflow. When a
					workflow is executed, it always begins from this node. You
					can have only one start node per workflow.
				</p>
				<div className="flex items-center gap-2">
					<Badge
						variant="outline"
						className="text-green-600 border-green-200"
					>
						<CheckCircle className="h-3 w-3 mr-1" />
						Required
					</Badge>
					<Badge variant="secondary">Entry Point</Badge>
				</div>
			</div>

			<Separator />

			{/* Features */}
			<div className="space-y-3">
				<div className="flex items-center gap-2 text-base font-medium">
					<Info className="h-4 w-4" />
					Features
				</div>
				<ul className="space-y-2 text-sm">
					<li className="flex items-start gap-2">
						<div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
						<span>
							Automatically initializes workflow execution
						</span>
					</li>
					<li className="flex items-start gap-2">
						<div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
						<span>
							Cannot be deleted or copied (workflow integrity)
						</span>
					</li>
					<li className="flex items-start gap-2">
						<div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
						<span>Supports manual execution for testing</span>
					</li>
					<li className="flex items-start gap-2">
						<div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
						<span>Visual indicator for workflow start point</span>
					</li>
				</ul>
			</div>

			<Separator />

			{/* Usage */}
			<div className="space-y-3">
				<div className="text-base font-medium">Usage Guidelines</div>
				<div className="space-y-3">
					<div>
						<h4 className="font-medium text-sm mb-2">
							Best Practices:
						</h4>
						<ul className="space-y-1 text-sm text-muted-foreground">
							<li>
								• Place the start node at the top or left of
								your workflow
							</li>
							<li>• Connect it to your first processing node</li>
							<li>
								• Use descriptive names for better workflow
								readability
							</li>
						</ul>
					</div>
					<Separator />
					<div>
						<h4 className="font-medium text-sm mb-2">
							Limitations:
						</h4>
						<ul className="space-y-1 text-sm text-muted-foreground">
							<li>• Only one start node per workflow</li>
							<li>• Cannot have incoming connections</li>
							<li>• Fixed position in some workflow layouts</li>
						</ul>
					</div>
				</div>
			</div>

			<Separator />

			{/* Technical Details */}
			<div className="space-y-3">
				<div className="text-base font-medium">Technical Details</div>
				<div className="space-y-2 text-sm">
					<div className="flex justify-between">
						<span className="text-muted-foreground">
							Node Type:
						</span>
						<span className="font-mono text-xs bg-muted px-2 py-1 rounded">
							START_NODE
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">
							Execution:
						</span>
						<span>Manual & Automatic</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">
							Status Tracking:
						</span>
						<span>Yes</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">
							Configurable:
						</span>
						<span>Limited</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StartNodeInfo;
