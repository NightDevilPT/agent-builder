import React from "react";
import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StartNodePreviewProps {
	className?: string;
	color?: string;
}

const StartNodePreview = ({ 
	className,
	color = "bg-green-500"
}: StartNodePreviewProps) => {
	return (
		<div
			className={cn(
				"inline-flex items-center gap-1.5 px-2 py-1.5 rounded text-white text-xs font-medium",
				"shadow-md border border-black/10",
				color,
				className
			)}
		>
			<PlayCircle className="h-3 w-3" />
			<span>Start Node</span>
		</div>
	);
};

export default StartNodePreview;
