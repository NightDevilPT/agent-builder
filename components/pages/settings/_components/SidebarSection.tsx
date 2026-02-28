"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	PanelLeft,
	PanelRight,
	Sidebar,
	SidebarClose,
	SidebarOpen,
} from "lucide-react";
import { useTheme } from "@/components/context/theme-context";
import {
	ISidebarView,
	ISidebarVariant,
	ISidebarCollapsible,
} from "@/components/context/theme-context";

export function SidebarSection() {
	const {
		sidebarView,
		setSidebarView,
		sidebarVariant,
		setSidebarVariant,
		dictionary,
	} = useTheme();

	if (!dictionary) {
		return (
			<div className="space-y-4">
				<Card className="p-3 px-5 rounded-md grid grid-cols-[1fr_auto]">
					<div className="w-full h-auto grid grid-cols-1 gap-1 place-content-start place-items-start">
						<h3 className="font-medium">Loading...</h3>
					</div>
				</Card>
				<Card className="p-3 px-5 rounded-md grid grid-cols-[1fr_auto]">
					<div className="w-full h-auto grid grid-cols-1 gap-1 place-content-start place-items-start">
						<h3 className="font-medium">Loading...</h3>
					</div>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Position */}
			<Card className="p-3 px-5 rounded-md grid grid-cols-[1fr_auto]">
				<div className="w-full h-auto grid grid-cols-1 gap-1 place-content-start place-items-start">
					<h3 className="font-medium">{dictionary.settings.sections.sidebar.position.title}</h3>
					<span className="text-xs text-muted-foreground">
						{dictionary.settings.sections.sidebar.position.description}
					</span>
				</div>
				<div className="flex w-full justify-center items-center">
					<div className="flex items-center gap-1 rounded-lg border bg-muted/10 p-1">
						<Button
							variant={
								sidebarView === ISidebarView.LEFT
									? "default"
									: "ghost"
							}
							size="sm"
							className="h-8 w-8 p-0"
							onClick={() =>
								setSidebarView(ISidebarView.LEFT)
							}
						>
							<PanelLeft className="h-4 w-4" />
						</Button>
						<Button
							variant={
								sidebarView === ISidebarView.RIGHT
									? "secondary"
									: "ghost"
							}
							size="sm"
							className="h-8 w-8 p-0"
							onClick={() =>
								setSidebarView(ISidebarView.RIGHT)
							}
						>
							<PanelRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</Card>

			{/* Style */}
			<Card className="p-3 px-5 rounded-md grid grid-cols-[1fr_auto]">
				<div className="w-full h-auto grid grid-cols-1 gap-1 place-content-start place-items-start">
					<h3 className="font-medium">{dictionary.settings.sections.sidebar.style.title}</h3>
					<span className="text-xs text-muted-foreground">
						{dictionary.settings.sections.sidebar.style.description}
					</span>
				</div>
				<div className="flex w-full justify-center items-center">
					<div className="flex items-center gap-1 rounded-lg border bg-muted/10 p-1">
						<Button
							variant={
								sidebarVariant === ISidebarVariant.SIDEBAR
									? "default"
									: "ghost"
							}
							size="sm"
							className="h-8 px-3 text-xs gap-2"
							onClick={() =>
								setSidebarVariant(ISidebarVariant.SIDEBAR)
							}
						>
							<Sidebar className="h-4 w-4" />
							<span>{dictionary.common.buttons.sidebar}</span>
						</Button>
						<Button
							variant={
								sidebarVariant === ISidebarVariant.INSET
									? "default"
									: "ghost"
							}
							size="sm"
							className="h-8 px-3 text-xs gap-2"
							onClick={() =>
								setSidebarVariant(ISidebarVariant.INSET)
							}
						>
							<SidebarOpen className="h-4 w-4" />
							<span>{dictionary.common.buttons.inset}</span>
						</Button>
						<Button
							variant={
								sidebarVariant === ISidebarVariant.FLOATING
									? "default"
									: "ghost"
							}
							size="sm"
							className="h-8 px-3 text-xs gap-2"
							onClick={() =>
								setSidebarVariant(ISidebarVariant.FLOATING)
							}
						>
							<SidebarClose className="h-4 w-4" />
							<span>{dictionary.common.buttons.floating}</span>
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}