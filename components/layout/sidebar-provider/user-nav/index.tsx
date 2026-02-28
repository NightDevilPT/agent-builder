"use client";

import {
	LogOut,
	User,
	MoreVertical,
	Sparkles,
	Shield,
	Receipt,
	BarChart,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/components/context/user-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/components/context/theme-context";

// Navigation items configuration
const NAVIGATION_ITEMS = [
	{
		path: "/settings",
		icon: User,
		labelKey: "navigation.settings",
		group: "account",
	},
	{
		path: "/subscription",
		icon: Sparkles,
		labelKey: "navigation.billing.subscription",
		group: "billing",
	},
	{
		path: "/plans",
		icon: Shield,
		labelKey: "navigation.billing.plans",
		group: "billing",
	},
	{
		path: "/invoices",
		icon: Receipt,
		labelKey: "navigation.billing.invoices",
		group: "billing",
	},
	{
		path: "/usage",
		icon: BarChart,
		labelKey: "navigation.billing.usage",
		group: "billing",
	},
] as const;

export function UserNav() {
	const { user, logout } = useUser();
	const { isMobile, state } = useSidebar();
	const { dictionary } = useTheme();
	const router = useRouter();

	const isCollapsed = state === "collapsed";

	const getUserInitial = () => user?.name?.charAt(0).toUpperCase() || "?";

	const handleNavigation = (path: string) => {
		router.push(path);
	};

	const handleLogout = () => {
		logout();
	};

	// Loading state
	if (!user || !dictionary) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton size="lg">
						<Skeleton className="h-8 w-8 rounded-full" />
						{!isCollapsed && (
							<div className="grid flex-1 gap-1">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-3 w-32" />
							</div>
						)}
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		);
	}

	// Helper to get translation with fallback
	const getTranslation = (key: string, fallback: string): string => {
		const keys = key.split(".");
		let value: any = dictionary;

		for (const k of keys) {
			if (!value?.[k]) return fallback;
			value = value[k];
		}

		return typeof value === "string" ? value : fallback;
	};

	// Collapsed state - show only avatar
	if (isCollapsed) {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all justify-center px-0"
								aria-label="User menu"
							>
								<Avatar className="h-8 w-8">
									<AvatarFallback className="bg-primary text-primary-foreground">
										{getUserInitial()}
									</AvatarFallback>
								</Avatar>
							</SidebarMenuButton>
						</DropdownMenuTrigger>

						<DropdownMenuContent
							className="w-56 rounded-lg"
							side="right"
							align="center"
							sideOffset={8}
						>
							{/* User info header */}
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-3 px-2 py-3">
									<Avatar className="h-9 w-9">
										<AvatarFallback className="bg-primary text-primary-foreground">
											{getUserInitial()}
										</AvatarFallback>
									</Avatar>

									<div className="grid flex-1 gap-0.5">
										<span className="text-sm font-semibold leading-none">
											{user.name}
										</span>
										<span className="text-xs text-muted-foreground truncate">
											{user.email}
										</span>
									</div>
								</div>
							</DropdownMenuLabel>

							<DropdownMenuSeparator />

							{/* Navigation items */}
							<DropdownMenuGroup>
								{NAVIGATION_ITEMS.map((item) => (
									<DropdownMenuItem
										key={item.path}
										onClick={() =>
											handleNavigation(item.path)
										}
										className="cursor-pointer"
									>
										<item.icon className="mr-2 h-4 w-4" />
										{getTranslation(
											item.labelKey,
											item.labelKey.split(".").pop() || ""
										)}
									</DropdownMenuItem>
								))}
							</DropdownMenuGroup>

							<DropdownMenuSeparator />

							{/* Logout */}
							<DropdownMenuItem
								onClick={handleLogout}
								className="cursor-pointer"
							>
								<LogOut className="mr-2 h-4 w-4" />
								{getTranslation("navigation.logout", "Log out")}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		);
	}

	// Expanded state - show full user info
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all"
							aria-label="User menu"
						>
							<Avatar className="h-8 w-8">
								<AvatarFallback className="bg-primary text-primary-foreground">
									{getUserInitial()}
								</AvatarFallback>
							</Avatar>

							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{user.name}
								</span>
								<span className="text-muted-foreground truncate text-xs">
									{user.email}
								</span>
							</div>

							<MoreVertical className="ml-auto h-4 w-4 text-muted-foreground" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						{/* User info header */}
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-3 px-2 py-3">
								<Avatar className="h-9 w-9">
									<AvatarFallback className="bg-primary text-primary-foreground">
										{getUserInitial()}
									</AvatarFallback>
								</Avatar>

								<div className="grid flex-1 gap-0.5">
									<span className="text-sm font-semibold leading-none">
										{user.name}
									</span>
									<span className="text-xs text-muted-foreground truncate">
										{user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>

						<DropdownMenuSeparator />

						{/* Navigation items */}
						<DropdownMenuGroup>
							{NAVIGATION_ITEMS.map((item) => (
								<DropdownMenuItem
									key={item.path}
									onClick={() => handleNavigation(item.path)}
									className="cursor-pointer"
								>
									<item.icon className="mr-2 h-4 w-4" />
									{getTranslation(
										item.labelKey,
										item.labelKey.split(".").pop() || ""
									)}
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						{/* Logout */}
						<DropdownMenuItem
							onClick={handleLogout}
							className="cursor-pointer"
						>
							<LogOut className="mr-2 h-4 w-4" />
							{getTranslation("navigation.logout", "Log out")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
