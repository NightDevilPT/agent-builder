// components/layout/workflow-layout/nodes/output-node/index.tsx
"use client";

import { memo, useCallback } from "react";
import { type NodeProps } from "@xyflow/react";
import { AppNode } from "../../types";
import { NodeWrapper } from "../node-wrapper/NodeWrapper";
import { NodeHandles } from "../node-wrapper/NodeHandles";
import { useWorkflow } from "@/components/context/workflow-context";
import { FileText, Image as ImageIcon, Code2, Play } from "lucide-react";

type OutputNodeProps = NodeProps<AppNode>;

const OutputNode = memo((props: OutputNodeProps) => {
	const { id, data } = props;
	const { updateNodeData } = useWorkflow();
	const handleRows = data?.handleRows ?? [];

	const format = String(handleRows.find((row) => row.id === "format")?.config.value || "text");
	const dataValue = String(handleRows.find((row) => row.id === "output-data")?.config.value || "");

	const handleInputChange = useCallback(
		(rowId: string, value: string | number | boolean) => {
			const updatedRows = handleRows.map((row) =>
				row.id === rowId
					? { ...row, config: { ...row.config, value } }
					: row,
			);
			updateNodeData(id, { handleRows: updatedRows });
		},
		[id, handleRows, updateNodeData],
	);

	// Safe JSON Formatter
	const formatJSON = (val: string) => {
		try {
			const parsed = JSON.parse(val);
			return JSON.stringify(parsed, null, 2);
		} catch {
			return val;
		}
	};

	// Check if string is url
	const isUrl = (string: string) => {
		try {
			new URL(string);
			return true;
		} catch (_) {
			return false;
		}
	};

	return (
		<NodeWrapper {...props}>
			<div className="w-[260px] px-1 py-0.5 space-y-3">
				<NodeHandles
					handleRows={handleRows}
					onChange={handleInputChange}
				/>

				{/* Preview Area */}
				<div className="border border-border/60 bg-muted/30 rounded-md p-2 text-xs selection:bg-transparent">
					<div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
						<span>Live Preview ({format})</span>
					</div>

					{dataValue ? (
						<div className="max-h-[160px] overflow-auto select-text font-mono text-[11px] leading-normal scrollbar-thin">
							{format === "text" && (
								<div className="whitespace-pre-wrap select-text font-sans text-xs">
									{dataValue}
								</div>
							)}
							{format === "code" && (
								<pre className="p-1.5 bg-muted/80 rounded border border-border/50 text-[10px] text-primary select-text whitespace-pre-wrap break-all">
									<code>{dataValue}</code>
								</pre>
							)}
							{format === "json" && (
								<pre className="p-1.5 bg-muted/80 rounded border border-border/50 text-[10px] text-green-600 dark:text-green-400 select-text whitespace-pre">
									<code>{formatJSON(dataValue)}</code>
								</pre>
							)}
							{format === "image" && (
								<div className="flex flex-col items-center gap-1.5 p-1">
									{isUrl(dataValue) || dataValue.startsWith("data:image/") ? (
										<img
											src={dataValue}
											alt="Output Preview"
											className="max-h-[120px] object-contain rounded border border-border shadow-sm"
										/>
									) : (
										<div className="flex flex-col items-center justify-center p-3 text-center rounded border border-dashed border-border/60 text-muted-foreground w-full">
											<ImageIcon className="w-5 h-5 mb-1 opacity-70" />
											<span className="text-[10px] font-sans">Raw Image Data/URL:</span>
											<span className="text-[9px] break-all select-text font-mono mt-1 opacity-80">{dataValue}</span>
										</div>
									)}
								</div>
							)}
							{format === "pdf" && (
								<div className="flex flex-col items-center justify-center p-3 text-center rounded border border-dashed border-border/60 text-muted-foreground w-full">
									<FileText className="w-6 h-6 mb-1 text-red-500/80" />
									<span className="text-[10px] font-sans font-medium">PDF Document Preview</span>
									{isUrl(dataValue) ? (
										<a
											href={dataValue}
											target="_blank"
											rel="noreferrer"
											className="text-[9px] text-primary hover:underline break-all mt-1"
										>
											Open/Download Link
										</a>
									) : (
										<span className="text-[9px] break-all select-text font-mono mt-1 opacity-80">{dataValue}</span>
									)}
								</div>
							)}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center p-4 text-center rounded border border-dashed border-border/40 text-muted-foreground/60">
							<Play className="w-4 h-4 mb-1 animate-pulse opacity-60" />
							<span className="text-[10px] font-sans">Waiting for input data...</span>
						</div>
					)}
				</div>
			</div>
		</NodeWrapper>
	);
});

OutputNode.displayName = "OutputNode";

export default OutputNode;
export { outputNodeConfig } from "./config";
