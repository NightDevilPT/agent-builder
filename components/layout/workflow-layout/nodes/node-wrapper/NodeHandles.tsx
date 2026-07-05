"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { HandleRow } from "../../types";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getHandleColor } from "../index";

interface NodeHandlesProps {
	handleRows: HandleRow[];
	onChange?: (rowId: string, value: string | number | boolean) => void;
}

export const NodeHandles = memo(
	({ handleRows, onChange }: NodeHandlesProps) => {
		return (
			<div className="flex flex-col w-full divide-y divide-border/40">
				{handleRows.map((row) => {
					const hasTarget =
						row.targetHandle && row.targetHandle.visible;
					const hasSource =
						row.sourceHandle && row.sourceHandle.visible;

					return (
						<div
							key={row.id}
							className="relative flex flex-col gap-1.5 py-2.5 transition-colors"
						>
							{/* Target Handle (Input side) */}
							{hasTarget && (
								<Handle
									type="target"
									position={Position.Left}
									id={row.targetHandle!.id}
									title={row.targetHandle!.label}
									className="!w-3 !h-3 border-2 border-background shadow-sm transition-transform"
									style={{
										backgroundColor:
											getHandleColor("target"),
										left: "-10px",
									}}
								/>
							)}

							{/* Dynamic Padding Content Layout */}
							<div
								className={cn(
									"flex flex-col gap-1 w-full text-left",
									hasTarget ? "pl-2" : "pl-0",
									hasSource ? "pr-2" : "pr-0",
								)}
							>
								<Label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80 selection:bg-transparent">
									{row.label}
								</Label>
								<NodeInputRenderer
									row={row}
									onChange={onChange}
								/>
							</div>

							{/* Source Handle (Output side) */}
							{hasSource && (
								<Handle
									type="source"
									position={Position.Right}
									id={row.sourceHandle!.id}
									title={row.sourceHandle!.label}
									className="!w-3 !h-3 border-2 border-background shadow-sm transition-transform"
									style={{
										backgroundColor:
											getHandleColor("source"),
										right: "-10px"
									}}
								/>
							)}
						</div>
					);
				})}
			</div>
		);
	},
);

NodeHandles.displayName = "NodeHandles";

/**
 * Isolated Input Sub-Renderer to avoid heavy switch blocks inside main map iteration
 */
interface NodeInputRendererProps {
	row: HandleRow;
	onChange?: (rowId: string, value: string | number | boolean) => void;
}

const NodeInputRenderer = ({ row, onChange }: NodeInputRendererProps) => {
	const { config, targetHandle } = row;
	const isConnected = targetHandle?.source === "connected";
	const value = config.value;
	const placeholder = config.placeholder;

	if (isConnected) {
		return (
			<Badge
				variant="secondary"
				className="text-[10px] px-1.5 py-0 h-5 w-fit font-normal bg-primary/10 text-primary border-none select-none"
			>
				Connected
			</Badge>
		);
	}

	switch (config.inputType) {
		case "text":
			return (
				<Input
					value={(value as string) ?? ""}
					placeholder={placeholder}
					onChange={(e) => onChange?.(row.id, e.target.value)}
					className="h-7 text-xs bg-background/50 focus-visible:ring-1"
				/>
			);

		case "number":
			return (
				<Input
					type="number"
					value={(value as number) ?? ""}
					placeholder={placeholder}
					onChange={(e) =>
						onChange?.(
							row.id,
							e.target.value === "" ? "" : Number(e.target.value),
						)
					}
					className="h-7 text-xs bg-background/50 focus-visible:ring-1"
				/>
			);

		case "select":
			return (
				<Select
					value={(value as string) ?? ""}
					onValueChange={(val: string) => onChange?.(row.id, val)}
				>
					<SelectTrigger className="h-7 text-xs bg-background/50 focus:ring-1">
						<SelectValue placeholder={placeholder} />
					</SelectTrigger>
					<SelectContent>
						{config.options?.map((opt) => (
							<SelectItem
								key={opt.value}
								value={opt.value}
								className="text-xs"
							>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			);

		case "boolean":
			return (
				<Select
					value={
						value === undefined || value === null
							? ""
							: value
								? "true"
								: "false"
					}
					onValueChange={(val: string) =>
						onChange?.(row.id, val === "true")
					}
				>
					<SelectTrigger className="h-7 text-xs bg-background/50 focus:ring-1">
						<SelectValue placeholder="Select bool..." />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="true" className="text-xs">
							True
						</SelectItem>
						<SelectItem value="false" className="text-xs">
							False
						</SelectItem>
					</SelectContent>
				</Select>
			);

		default:
			return (
				<span className="text-xs text-muted-foreground/50 italic">
					-
				</span>
			);
	}
};

NodeInputRenderer.displayName = "NodeInputRenderer";