"use client";

import { ThemeContextProvider } from "@/components/context/theme-context";
import { ReactNode } from "react";
import { LayoutProvider } from "../sidebar-provider/layout";
import HeaderLogo from "../sidebar-provider/header-logo";
import { SidebarRoutes } from "@/routes/route";
import { useTheme } from "@/components/context/theme-context";

export function RootProvider({ children }: { children: ReactNode }) {

	return (
		<ThemeContextProvider>
			<LayoutProvider
				header={
					<HeaderLogo
					/>
				}
				footer={<div>jhhjjh</div>}
				sidebarRoute={SidebarRoutes}
			>
				{children}
			</LayoutProvider>
		</ThemeContextProvider>
	);
}
