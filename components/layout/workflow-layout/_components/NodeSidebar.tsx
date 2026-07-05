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
import { cn, getNestedProperty } from "@/lib/utils";
import { useTheme } from "@/components/context/theme-context";
import { useCallback } from "react";

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
	const { dictionary } = useTheme();

	const t = useCallback(
		(path: string, defaultValue: string): string => {
			if (!dictionary) return defaultValue;
			return getNestedProperty(dictionary, path) || defaultValue;
		},
		[dictionary],
	);

	// Helper to get camelCase translation key from NodeType enum
	const getNodeTranslationKeys = useCallback((type: NodeType) => {
		const lowercase = type.toLowerCase();
		const camelCase = lowercase.replace(/[-_]([a-z])/g, (g) => g[1].toUpperCase());
		return {
			label: `flow.nodeTypes.nodes.${camelCase}Node.label`,
			desc: `flow.nodeTypes.nodes.${camelCase}Node.description`
		};
	}, []);

	// Helper to get category key
	const getCategoryTranslationKey = useCallback((categoryId: string) => {
		const mapping: Record<string, string> = {
			flow: "controlFlow",
			actions: "basicNode",
			logic: "tools",
			data: "integration"
		};
		return `flow.nodeTypes.categories.${mapping[categoryId] || categoryId}`;
	}, []);

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

	// Translate group categories and items dynamically
	const translatedGroups = useMemo(() => {
		return nodeSidebarGroups.map((group) => {
			const groupLabel = t(getCategoryTranslationKey(group.id), group.label);
			const items = group.items.map((item) => {
				const keys = getNodeTranslationKeys(item.type);
				const label = t(keys.label, item.label);
				const description = t(keys.desc, item.description);
				return {
					...item,
					label,
					description,
					disabled: item.unique && existingUniqueNodes.has(item.type),
				};
			});
			return {
				...group,
				label: groupLabel,
				items,
			};
		});
	}, [t, getCategoryTranslationKey, getNodeTranslationKeys, existingUniqueNodes]);

	// Filter based on translated items and categories
	const filteredGroups = useMemo(() => {
		return translatedGroups
			.map((group) => ({
				...group,
				items: group.items.filter(
					(item) =>
						item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
						item.description.toLowerCase().includes(searchQuery.toLowerCase()),
				),
			}))
			.filter((group) => group.items.length > 0);
	}, [translatedGroups, searchQuery]);

	return (
		<Panel position="top-left" className="m-2">
			<div className="w-64 bg-background border rounded-lg shadow-lg flex flex-col max-h-[calc(100vh-100px)]">
				{/* Header */}
				<div className="shrink-0 p-3 border-b border-border flex items-center justify-between">
					<h3 className="font-semibold text-sm">
						{t("flow.sidebar.title", "Nodes")}
					</h3>
					<button
						onClick={() => setIsCollapsed(!isCollapsed)}
						className="text-muted-foreground hover:text-foreground text-xs"
					>
						{isCollapsed ? t("flow.sidebar.show", "Show") : t("flow.sidebar.hide", "Hide")}
					</button>
				</div>

				{!isCollapsed && (
					<>
						{/* Search */}
						<div className="shrink-0 p-3 border-b border-border">
							<div className="relative">
								<Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
								<Input
									placeholder={t("flow.sidebar.searchPlaceholder", "Search nodes...")}
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
										{t("flow.sidebar.noNodesFound", "No nodes found")}
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
																					? t("flow.sidebar.alreadyAdded", "Already added")
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
								{t("flow.sidebar.dragToCanvas", "Drag & drop to canvas")}
							</div>
						</div>
					</>
				)}
			</div>
		</Panel>
	);
});

NodeSidebar.displayName = "NodeSidebar";
