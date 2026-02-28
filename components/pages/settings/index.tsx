"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import {
	Settings,
	Palette,
	Monitor,
	Sidebar,
	View,
	Languages,
	Sparkles,
	Sun,
	Moon,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ColorSchemeSection } from "./_components/ColorSchemeSection";
import { SidebarSection } from "./_components/SidebarSection";
import { ViewModeSection } from "./_components/ViewModeSection";
import { useTheme } from "@/components/context/theme-context";
import { Switch } from "@/components/ui/switch";
import { IThemeMode } from "@/components/context/theme-context";

export default function SettingsPage() {
	const { themeMode, setThemeMode, dictionary } = useTheme();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return (
			<div className="container mx-auto py-6">
				<div className="space-y-6">
					<div className="space-y-2">
						<div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
						<div className="h-4 w-80 bg-muted rounded animate-pulse"></div>
					</div>
					<Separator />
					<div className="space-y-6">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="space-y-4">
								<div className="h-6 w-40 bg-muted rounded animate-pulse"></div>
								<div className="h-32 w-full bg-muted rounded animate-pulse"></div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (!dictionary) {
		return (
			<div className="container mx-auto py-6">
				<div className="flex items-center justify-center h-64">
					<div className="text-muted-foreground">Loading...</div>
				</div>
			</div>
		);
	}

	const sections = [
		{
			id: "theme",
			title: dictionary.settings.sections.theme.title,
			description: dictionary.settings.sections.theme.description,
			icon: Palette,
			component: (
				<div className="space-y-4">
					<Card className="p-3 px-5 rounded-md grid grid-cols-[1fr_70px]">
						<div className="w-full h-auto grid grid-cols-1 gap-1 place-content-start place-items-start">
							<h3 className="font-medium">{dictionary.settings.sections.theme.mode.title}</h3>
							<span className="text-xs text-muted-foreground">
								{dictionary.settings.sections.theme.mode.description}
							</span>
						</div>
						<div className="flex w-full justify-center items-center">
							<ThemeToggle />
						</div>
					</Card>
				</div>
			),
		},
		{
			id: "language",
			title: dictionary.settings.sections.language.title,
			description: dictionary.settings.sections.language.description,
			icon: Languages,
			component: (
				<Card className="p-3 px-5 rounded-md grid grid-cols-[1fr_auto]">
					<div className="w-full h-auto grid grid-cols-1 gap-1 place-content-start place-items-start">
						<h3>{dictionary.settings.sections.language.appLanguage.title}</h3>
						<span className="text-xs text-muted-foreground">
							{dictionary.settings.sections.language.appLanguage.description}
						</span>
					</div>
					<div className="flex w-full justify-center items-center">
						<LanguageSwitcher
							variant="default"
							size="default"
							showFlag={true}
							showText={true}
							align="end"
						/>
					</div>
				</Card>
			),
		},
		{
			id: "sidebar",
			title: dictionary.settings.sections.sidebar.title,
			description: dictionary.settings.sections.sidebar.description,
			icon: Sidebar,
			component: <SidebarSection />,
		},
		{
			id: "view",
			title: dictionary.settings.sections.view.title,
			description: dictionary.settings.sections.view.description,
			icon: View,
			component: <ViewModeSection />,
		},
		{
			id: "colors",
			title: dictionary.settings.sections.colors.title,
			description: dictionary.settings.sections.colors.description,
			icon: Sparkles,
			component: <ColorSchemeSection />,
		}
	];

	return (
		<ScrollArea className="h-full">
			<div className="container mx-auto py-6">
				<div className="space-y-6">
					{/* <div className="space-y-2">
						<h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
							<Settings className="h-6 w-6" />
							{dictionary.settings.title}
						</h1>
						<p className="text-muted-foreground">
							{dictionary.settings.description}
						</p>
					</div>

					<Separator /> */}

					<div className="space-y-8">
						{sections.map((section) => {
							const Icon = section.icon;

							return (
								<div key={section.id} className="space-y-4">
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<div className="p-2 rounded-lg">
												<Icon className="h-5 w-5" />
											</div>
											<h2 className="text-lg font-semibold">
												{section.title}
											</h2>
										</div>
										<p className="text-sm text-muted-foreground ml-11">
											{section.description}
										</p>
									</div>

									<div className="ml-11">
										{section.component}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</ScrollArea>
	);
}
