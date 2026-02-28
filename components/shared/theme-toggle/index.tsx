"use client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IThemeMode, useTheme } from "@/components/context/theme-context";
import { Moon, Sun, Monitor } from "lucide-react";

function ThemeToggle() {
	const { themeMode, setThemeMode, dictionary } = useTheme();
	
	if (!dictionary) {
		return (
			<Button variant="outline" size="icon" className="relative" disabled>
				<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
				<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
				<span className="sr-only">Loading...</span>
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className="relative">
					<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
					<span className="sr-only">{dictionary.theme.toggle.srLabel}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					onClick={() => setThemeMode(IThemeMode.LIGHT)}
					className={
						themeMode === IThemeMode.LIGHT ? "bg-accent" : ""
					}
				>
					<Sun className="mr-2 h-4 w-4" />
					{dictionary.theme.toggle.light}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setThemeMode(IThemeMode.DARK)}
					className={themeMode === IThemeMode.DARK ? "bg-accent" : ""}
				>
					<Moon className="mr-2 h-4 w-4" />
					{dictionary.theme.toggle.dark}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setThemeMode(IThemeMode.SYSTEM)}
					className={
						themeMode === IThemeMode.SYSTEM ? "bg-accent" : ""
					}
				>
					<Monitor className="mr-2 h-4 w-4" />
					{dictionary.theme.toggle.system}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export { ThemeToggle };
