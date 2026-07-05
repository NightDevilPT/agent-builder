// components/layout/workflow-layout/NodeSidebar.tsx
"use client";

import {
	memo,
	useState,
	useMemo,
	type DragEvent as ReactDragEvent,
} from "react";
import { Panel } from "@xyflow/react";
import { NodeType } from "../types";
import { nodeSidebarGroups } from "../nodes";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";
import { Search } from "lucide-react";
import { useWorkflow } from "@/components/context/workflow-context";
import { cn } from "@/lib/utils";

interface NodeSidebarProps {
	onDragStart: (
		event: ReactDragEvent<HTMLDivElement>,
		nodeType: NodeType,
	) => void;
}

export const NodeSidebar = memo(({ onDragStart }: NodeSidebarProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [isCollapsed, setIsCollapsed] = useState(false);
	const { nodes } = useWorkflow();

	// Check which unique nodes already exist on the canvas
	const existingUniqueNodes = useMemo(() => {
		const uniqueTypes = new Set<NodeType>();
		nodeSidebarGroups.forEach((group) => {
			group.items.forEach((item) => {
				if (
					item.unique &&
					nodes.some((n) => n.data?.type === item.type)
				) {
					uniqueTypes.add(item.type);
				}
			});
		});
		return uniqueTypes;
	}, [nodes]);

	const filteredGroups = nodeSidebarGroups
		.map((group) => ({
			...group,
			items: group.items
				.filter(
					(item) =>
						item.label
							.toLowerCase()
							.includes(searchQuery.toLowerCase()) ||
						item.description
							.toLowerCase()
							.includes(searchQuery.toLowerCase()),
				)
				.map((item) => ({
					...item,
					disabled: item.unique && existingUniqueNodes.has(item.type),
				})),
		}))
		.filter((group) => group.items.length > 0);

	return (
		<Panel position="top-left" className="m-2">
			<div className="w-64 bg-background border rounded-lg shadow-lg flex flex-col max-h-[calc(100vh-100px)]">
				{/* Header */}
				<div className="shrink-0 p-3 border-b border-border flex items-center justify-between">
					<h3 className="font-semibold text-sm">Nodes</h3>
					<button
						onClick={() => setIsCollapsed(!isCollapsed)}
						className="text-muted-foreground hover:text-foreground text-xs"
					>
						{isCollapsed ? "Show" : "Hide"}
					</button>
				</div>

				{!isCollapsed && (
					<>
						{/* Search */}
						<div className="shrink-0 p-3 border-b border-border">
							<div className="relative">
								<Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
								<Input
									placeholder="Search nodes..."
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
									className="pl-8 h-9 text-sm"
								/>
							</div>
						</div>

						{/* Node Groups with Accordion */}
						<ScrollArea className="flex-1 max-h-[500px] overflow-auto">
							<div className="p-2">
								{filteredGroups.length === 0 ? (
									<div className="text-center text-sm text-muted-foreground py-4">
										No nodes found
									</div>
								) : (
									<Accordion
										type="multiple"
										defaultValue={filteredGroups.map(
											(g) => g.id,
										)}
									>
										{filteredGroups.map((group) => (
											<AccordionItem
												key={group.id}
												value={group.id}
												className="border-none"
											>
												<AccordionTrigger className="py-1 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground hover:no-underline">
													{group.label}
												</AccordionTrigger>
												<AccordionContent className="pb-1">
													<div className="space-y-1">
														{group.items.map(
															(item) => {
																const isDisabled =
																	item.disabled ??
																	false;

																return (
																	<div
																		key={
																			item.type
																		}
																		className={cn(
																			"flex items-center gap-2 p-2 rounded-md transition-colors border",
																			isDisabled
																				? "opacity-50 cursor-not-allowed border-transparent"
																				: "cursor-grab hover:bg-accent border-transparent hover:border-border",
																		)}
																		draggable={
																			!isDisabled
																		}
																		onDragStart={(
																			e,
																		) => {
																			if (
																				!isDisabled
																			)
																				onDragStart(
																					e,
																					item.type,
																				);
																		}}
																	>
																		<div
																			className="flex items-center justify-center w-7 h-7 rounded-md shrink-0"
																			style={{
																				backgroundColor: `${item.color}15`,
																			}}
																		>
																			<item.icon
																				className="w-3.5 h-3.5"
																				style={{
																					color: item.color,
																				}}
																			/>
																		</div>
																		<div className="flex-1 min-w-0">
																			<div className="text-xs font-medium truncate">
																				{
																					item.label
																				}
																			</div>
																			<div className="text-[10px] text-muted-foreground truncate">
																				{isDisabled
																					? "Already added"
																					: item.description}
																			</div>
																		</div>
																	</div>
																);
															},
														)}
													</div>
												</AccordionContent>
											</AccordionItem>
										))}
									</Accordion>
								)}
							</div>
						</ScrollArea>

						{/* Footer */}
						<div className="shrink-0 p-2 border-t border-border">
							<div className="text-[10px] text-muted-foreground text-center">
								Drag & drop to canvas
							</div>
						</div>
					</>
				)}
			</div>
		</Panel>
	);
});

NodeSidebar.displayName = "NodeSidebar";
