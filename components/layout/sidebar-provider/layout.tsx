"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarInset,
	SidebarProvider,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
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
	return (
		<SidebarProvider>
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
			<SidebarInset className={`grid grid-rows-[60px_1px_1fr]`}>
				<HeaderSection />
				<Separator />
				<ScrollArea
					className={`h-[calc(100vh-61px)] p-5 overflow-hidden overflow-y-auto`}
				>
					{children}
				</ScrollArea>
			</SidebarInset>
		</SidebarProvider>
	);
}
