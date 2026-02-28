"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { RouteBreadcrumb } from "@/components/shared/route-breadcrumb";

const HeaderSection = () => {
	return (
		<header
			className={`w-full h-full flex justify-between items-center gap-5 px-5 py-4`}
		>
			<div className={`flex justify-center items-center gap-4 h-full`}>
				<SidebarTrigger />
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
