import { ISidebarRoutes } from "@/components/layout/sidebar-provider/layout";
import {
	LayoutDashboard,
	FileText,
	Building2,
	Users,
	Settings,
	Brain,
	Globe,
	EarthLock,
	Earth,
	Wrench,
} from "lucide-react";

export const SidebarRoutes: ISidebarRoutes[] = [
	{
		id: "dashboard",
		label: "navigation.dashboard",
		icon: LayoutDashboard,
		href: "/",
	},
	{
		id: "agents",
		label: "navigation.agents.title",
		icon: Brain,
		child: [
			{
				id: "my-agents",
				label: "navigation.agents.myAgents",
				icon: Earth,
				href: "/agents/my-agents",
			},
			{
				id: "public-agents",
				label: "navigation.agents.publicAgents",
				icon: EarthLock,
				href: "/agents/public-agents",
			},
		],
	},
	{
		id: "tools",
		label: "navigation.tools.title",
		icon: Wrench,
		child: [
			{
				id: "my-tools",
				label: "navigation.tools.myTools",
				icon: Earth,
				href: "/tools/my-tools",
			},
			{
				id: "public-tools",
				label: "navigation.tools.manageTools",
				icon: EarthLock,
				href: "/tools/public-tools",
			},
		],
	},
	{
		id: "settings",
		label: "navigation.settings",
		icon: Settings,
		href: "/settings",
	},
];
