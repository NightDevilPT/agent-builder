"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlayCircle, Info, CheckCircle } from "lucide-react";
import { useTheme } from "@/components/context/theme-context";

const StartNodeInfo = () => {
	const { dictionary } = useTheme();

	// Guard for loading dictionary state
	if (!dictionary) {
		return (
			<div className="space-y-4 p-1 animate-pulse">
				<div className="h-6 w-3/4 bg-muted rounded"></div>
				<div className="h-4 w-1/2 bg-muted rounded"></div>
				<Separator />
				<div className="space-y-2">
					<div className="h-4 bg-muted rounded"></div>
					<div className="h-4 bg-muted rounded"></div>
				</div>
			</div>
		);
	}

	const info = dictionary.flow?.nodeTypes?.nodes?.startNode?.info;

	// In case the localized keys are missing or not defined yet, fallback gracefully
	if (!info) {
		return null;
	}

	return (
		<div className="space-y-4 p-1">
			{/* Overview */}
			<div className="space-y-3">
				<div className="flex items-center gap-2 text-lg font-medium">
					<PlayCircle className="h-5 w-5 text-green-600" />
					{info.overview.title}
				</div>
				<p className="text-sm text-muted-foreground">
					{info.overview.subtitle}
				</p>
				<p className="text-sm text-muted-foreground">
					{info.overview.description}
				</p>
				<div className="flex items-center gap-2">
					<Badge
						variant="outline"
						className="text-green-600 border-green-200"
					>
						<CheckCircle className="h-3 w-3 mr-1" />
						{info.overview.required}
					</Badge>
					<Badge variant="secondary">{info.overview.entryPoint}</Badge>
				</div>
			</div>

			<Separator />

			{/* Features */}
			<div className="space-y-3">
				<div className="flex items-center gap-2 text-base font-medium">
					<Info className="h-4 w-4" />
					{info.features.title}
				</div>
				<ul className="space-y-2 text-sm">
					{info.features.list?.map((feature: string, idx: number) => (
						<li key={idx} className="flex items-start gap-2">
							<div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
							<span>{feature}</span>
						</li>
					))}
				</ul>
			</div>

			<Separator />

			{/* Usage */}
			<div className="space-y-3">
				<div className="text-base font-medium">{info.guidelines.title}</div>
				<div className="space-y-3">
					<div>
						<h4 className="font-medium text-sm mb-2">
							{info.guidelines.bestPractices.title}
						</h4>
						<ul className="space-y-1 text-sm text-muted-foreground">
							{info.guidelines.bestPractices.list?.map((bp: string, idx: number) => (
								<li key={idx}>• {bp}</li>
							))}
						</ul>
					</div>
					<Separator />
					<div>
						<h4 className="font-medium text-sm mb-2">
							{info.guidelines.limitations.title}
						</h4>
						<ul className="space-y-1 text-sm text-muted-foreground">
							{info.guidelines.limitations.list?.map((limit: string, idx: number) => (
								<li key={idx}>• {limit}</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			<Separator />

			{/* Technical Details */}
			<div className="space-y-3">
				<div className="text-base font-medium">{info.technicalDetails.title}</div>
				<div className="space-y-2 text-sm">
					<div className="flex justify-between">
						<span className="text-muted-foreground">
							{info.technicalDetails.nodeType}
						</span>
						<span className="font-mono text-xs bg-muted px-2 py-1 rounded">
							START_NODE
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">
							{info.technicalDetails.execution}
						</span>
						<span>{info.technicalDetails.executionValue}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">
							{info.technicalDetails.statusTracking}
						</span>
						<span>{info.technicalDetails.statusTrackingValue}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">
							{info.technicalDetails.configurable}
						</span>
						<span>{info.technicalDetails.configurableValue}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StartNodeInfo;
