// components/layout/workflow-layout/_components/CustomEdge.tsx
"use client";

import { memo, useState } from "react";
import {
	BaseEdge,
	EdgeLabelRenderer,
	getBezierPath,
	useReactFlow,
	type EdgeProps,
} from "@xyflow/react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CustomEdge = memo(
	({
		id,
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
		style = {},
		markerEnd,
		selected,
	}: EdgeProps) => {
		const [edgePath, labelX, labelY] = getBezierPath({
			sourceX,
			sourceY,
			sourcePosition,
			targetX,
			targetY,
			targetPosition,
		});

		const { setEdges } = useReactFlow();
		const [isHovered, setIsHovered] = useState(false);

		const onEdgeClick = (e: React.MouseEvent) => {
			e.stopPropagation();
			setEdges((edges) => edges.filter((edge) => edge.id !== id));
		};

		return (
			<>
				<path
					d={edgePath}
					fill="none"
					stroke="transparent"
					strokeWidth={20}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					style={{ cursor: "pointer" }}
				/>

				<BaseEdge
					path={edgePath}
					markerEnd={markerEnd}
					style={{
						...style,
						strokeWidth: 2.5,
						strokeDasharray: "5,5",
						animation: "dashdraw 0.5s linear infinite",
						transition: "stroke-width 0.2s",
					}}
				/>

				<EdgeLabelRenderer>
					<div
						className="nodrag nopan absolute"
						style={{
							transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
							pointerEvents: "all",
							zIndex: 10,
						}}
					>
						<Button
							variant="default"
							size="icon"
							onClick={onEdgeClick}
							className="cursor-pointer h-6 w-6"
						>
							<Trash2 className="w-3 h-3" />
						</Button>
					</div>
				</EdgeLabelRenderer>
			</>
		);
	},
);

CustomEdge.displayName = "CustomEdge";
