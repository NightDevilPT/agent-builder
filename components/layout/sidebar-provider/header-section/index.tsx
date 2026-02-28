"use client";

import { useTheme } from "@/components/context/theme-context";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { RouteBreadcrumb } from "@/components/shared/route-breadcrumb";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";


const HeaderSection = () => {
	const { state } = useSidebar();
	const { setSidebarState } = useTheme();
	return (
		<header
			className={`w-full h-full flex justify-between items-center gap-5 px-5 py-4`}
		>
			<div className={`flex justify-center items-center gap-4 h-full`}>
				<SidebarTrigger
					onClick={() => {
						setSidebarState(
							state === "collapsed" ? "expanded" : "collapsed"
						);
					}}
				/>
				<Separator orientation={"vertical"} />
				<RouteBreadcrumb />
			</div>
			<div className="w-auto h-auto flex justify-center items-center gap-4">
				<LanguageSwitcher showText={false} variant={"outline"} />
				<ThemeToggle />
			</div>
		</header>
	);
};

export default HeaderSection;