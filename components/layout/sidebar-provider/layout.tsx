"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarInset,
	SidebarProvider,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NavMain } from "./nav-main";
import { usePathname } from "next/navigation";
import HeaderSection from "./header-section";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/components/context/theme-context";

export interface ISidebarRoutes {
	id: string;
	label: string;
	icon: React.ElementType;
	href?: string;
	child?: ISidebarRoutes[];
}

interface ILayoutProviderProps {
	children: React.ReactNode;
	header: React.ReactNode;
	footer: React.ReactNode;
	sidebarRoute: ISidebarRoutes[];
	groupLabel?: string;
}

export function LayoutProvider({
	footer,
	header,
	children,
	sidebarRoute,
	groupLabel,
}: ILayoutProviderProps) {
	const { sidebarVariant, sidebarCollapsible, sidebarState } = useTheme();
	const pathName = usePathname();
	const isShowSidebarLayout = !pathName.includes("workflow");
	const isWorkflowPage = pathName.includes("workflow");

	return (
		<SidebarProvider>
			{isShowSidebarLayout && (
				<Sidebar
					variant={sidebarVariant}
					defaultState={sidebarState}
					collapsible={sidebarCollapsible}
				>
					<SidebarHeader className="h-[60px]">{header}</SidebarHeader>
					<Separator />
					<SidebarContent>
						<NavMain items={sidebarRoute} />
					</SidebarContent>
					<SidebarFooter>{footer}</SidebarFooter>
				</Sidebar>
			)}

			<SidebarInset
				className={cn(
					"grid",
					isWorkflowPage
						? "grid-rows-[60px_1px_1fr] overflow-hidden"
						: "grid-rows-[60px_1px_1fr]"
				)}
			>
				<HeaderSection />
				<Separator />

				{/* Conditional rendering based on page type */}
				{isWorkflowPage ? (
					// For workflow page - no ScrollArea, just direct children
					<div className="h-full overflow-hidden">{children}</div>
				) : (
					// For other pages - with ScrollArea
					<ScrollArea className="h-full overflow-y-auto">
						<div className="p-5">{children}</div>
					</ScrollArea>
				)}
			</SidebarInset>
		</SidebarProvider>
	);
}
