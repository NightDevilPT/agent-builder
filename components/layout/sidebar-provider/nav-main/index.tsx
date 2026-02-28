"use client";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ISidebarRoutes } from "../layout";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/context/theme-context";

interface NavMainProps {
	items: ISidebarRoutes[];
	groupLabel?: string;
}

// Helper function to get nested property from object
const getNestedProperty = (obj: any, path: string): string => {
	return path.split('.').reduce((current, key) => current?.[key], obj) || path;
};

export function NavMain({ items, groupLabel }: NavMainProps) {
	const { state } = useSidebar();
	const { dictionary } = useTheme();
	const pathname = usePathname();
	const isCollapsed = state === "collapsed";
	
	if (!dictionary) {
		return (
			<SidebarGroup>
				<SidebarGroupLabel>Loading...</SidebarGroupLabel>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton>Loading...</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroup>
		);
	}

	// Function to resolve label from translation key
	const resolveLabel = (label: string): string => {
		if (label.startsWith('navigation.')) {
			return getNestedProperty(dictionary, label) || label;
		}
		return label;
	};

	// Check if a route is active - exact match only
	const isActiveRoute = (href?: string): boolean => {
		if (!href) return false;
		return pathname === href;
	};

	return (
		<SidebarGroup>
			{groupLabel && <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>}
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						key={item.id}
						asChild
						defaultOpen={false}
						className="group/collapsible"
					>
						<SidebarMenuItem>
							{/* Show dropdown when collapsed and item has children */}
							{isCollapsed &&
							item.child &&
							item.child.length > 0 ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<SidebarMenuButton
											tooltip={resolveLabel(item.label)}
											className={cn(
												"flex items-center justify-between w-full",
												isActiveRoute(item.href) && "bg-accent text-accent-foreground"
											)}
										>
											<div className="flex items-center">
												{item.icon && (
													<item.icon className="h-5 w-5 mr-2" />
												)}
												{!isCollapsed && (
													<span>{resolveLabel(item.label)}</span>
												)}
											</div>
											{!isCollapsed && item.child && (
												<ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
											)}
										</SidebarMenuButton>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className="w-48"
										align="start"
										side="right"
										sideOffset={5}
									>
										{/* Main item as link if it has href */}
										{item.href ? (
											<DropdownMenuItem asChild>
												<Link
													href={item.href}
													className="cursor-pointer"
												>
													<div className="flex items-center">
														{item.icon && (
															<item.icon className="h-4 w-4 mr-2" />
														)}
														<span>
															{resolveLabel(item.label)}
														</span>
													</div>
												</Link>
											</DropdownMenuItem>
										) : (
											<div className="px-2 py-1.5 text-sm font-semibold flex items-center">
												{item.icon && (
													<item.icon className="h-4 w-4 mr-2" />
												)}
												<span>{resolveLabel(item.label)}</span>
											</div>
										)}

										{/* Show children items */}
										{item.child &&
											item.child.length > 0 && (
												<>
													{item.href && (
														<div className="h-px bg-border my-1" />
													)}
													{item.child.map(
														(subItem) => (
															<DropdownMenuItem
																key={subItem.id}
																asChild
																className={cn(
																	isActiveRoute(subItem.href) && "bg-accent text-accent-foreground"
																)}
															>
																<Link
																	href={
																		subItem.href!
																	}
																	className="cursor-pointer pl-6"
																>
																	<div className="flex items-center">
																		{subItem.icon && (
																			<subItem.icon className="h-4 w-4 mr-2" />
																		)}
																		<span>
																			{
																				resolveLabel(subItem.label)
																			}
																		</span>
																	</div>
																</Link>
															</DropdownMenuItem>
														)
													)}
												</>
											)}
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								/* Normal behavior when expanded or no children */
								<>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton
											tooltip={resolveLabel(item.label)}
											className={cn(
												"flex items-center justify-between",
												isActiveRoute(item.href) && "bg-accent text-accent-foreground"
											)}
											asChild={!!item.href && !item.child}
										>
											{item.href && !item.child ? (
												<Link href={item.href}>
													<div className="flex items-center">
														{item.icon && (
															<item.icon className="h-5 w-5 mr-2" />
														)}
														<span>
															{resolveLabel(item.label)}
														</span>
													</div>
												</Link>
											) : (
												<div className="flex items-center justify-between w-full">
													<div className="flex items-center">
														{item.icon && (
															<item.icon className="h-5 w-5 mr-2" />
														)}
														<span>
															{resolveLabel(item.label)}
														</span>
													</div>
													{item.child && (
														<ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
													)}
												</div>
											)}
										</SidebarMenuButton>
									</CollapsibleTrigger>
									{item.child && (
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.child.map((subItem) => (
													<SidebarMenuSubItem
														key={subItem.id}
													>
														<SidebarMenuSubButton
															asChild
															className={cn(
																isActiveRoute(subItem.href) && "bg-accent text-accent-foreground"
															)}
														>
															<Link
																href={
																	subItem.href!
																}
															>
																{subItem.icon && (
																	<subItem.icon className="h-4 w-4 mr-2" />
																)}
																<span>
																	{
																		resolveLabel(subItem.label)
																	}
																</span>
															</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									)}
								</>
							)}
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
