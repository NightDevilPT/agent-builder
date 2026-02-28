"use client";

import { ReactNode } from "react";
import { SidebarRoutes } from "@/routes/route";
import { UserNav } from "../sidebar-provider/user-nav";
import HeaderLogo from "../sidebar-provider/header-logo";
import { LayoutProvider } from "../sidebar-provider/layout";
import { UserProvider } from "@/components/context/user-context";
import { ThemeContextProvider } from "@/components/context/theme-context";

export function RootProvider({ children }: { children: ReactNode }) {
	return (
		<ThemeContextProvider>
			<UserProvider>
				<LayoutProvider
					header={<HeaderLogo />}
					footer={<UserNav />}
					sidebarRoute={SidebarRoutes}
				>
					{children}
				</LayoutProvider>
			</UserProvider>
		</ThemeContextProvider>
	);
}
