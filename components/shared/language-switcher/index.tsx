// components/LanguageSwitcher.tsx
"use client";


import { useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { ILanguage, useTheme } from "@/components/context/theme-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

// Define supported languages with their metadata
const SUPPORTED_LANGUAGES = {
	[ILanguage.EN]: {
		name: "English",
		flag: "🇺🇸",
		nativeName: "English",
	},
	[ILanguage.FR]: {
		name: "French",
		flag: "🇫🇷",
		nativeName: "Français",
	},
	[ILanguage.ES]: {
		name: "Spanish",
		flag: "🇪🇸",
		nativeName: "Español",
	},
	// Japanese
	[ILanguage.JA]: {
		name: "Japanese",
		flag: "🇯🇵", // JP flag; may display as "JP" on some platforms
		nativeName: "日本語", // Nihongo
	},
	[ILanguage.DE]: {
		name: "German",
		flag: "🇩🇪",
		nativeName: "Deutsch",
	},
} as const;

interface LanguageSwitcherProps {
	variant?: "default" | "outline" | "ghost" | "link";
	size?: "default" | "sm" | "lg" | "icon";
	showFlag?: boolean;
	showText?: boolean;
	className?: string;
	align?: "center" | "start" | "end";
}

export function LanguageSwitcher({
	variant = "ghost",
	size = "default",
	showFlag = true,
	showText = true,
	className,
	align = "end",
}: LanguageSwitcherProps) {
	const { language, setLanguage, isLoading, dictionary } = useTheme();
	const [open, setOpen] = useState(false);

	const currentLanguage = SUPPORTED_LANGUAGES[language];

	const handleLanguageChange = (languageCode: ILanguage) => {
		setLanguage(languageCode);
		setOpen(false);
	};

	if (isLoading || !dictionary) {
		return (
			<Button
				variant={variant}
				size={size}
				className={cn(
					"justify-between gap-2",
					size === "icon" ? "w-10 px-0" : "px-3",
					className
				)}
				disabled
			>
				<div className="flex items-center gap-2">
					{size !== "icon" && <Globe className="h-4 w-4 shrink-0" />}
					{showFlag && <span>🌐</span>}
					{showText && size !== "icon" && (
						<span className="truncate">Loading...</span>
					)}
				</div>
			</Button>
		);
	}

	// Map language codes to translation keys
	const getLanguageTranslationKey = (code: string): string => {
		const keyMap: Record<string, string> = {
			[ILanguage.EN]: dictionary.language.switcher.english,
			[ILanguage.FR]: dictionary.language.switcher.french,
			[ILanguage.ES]: dictionary.language.switcher.spanish,
			[ILanguage.JA]: dictionary.language.switcher.japanese,
			[ILanguage.DE]: dictionary.language.switcher.german,
		};
		return keyMap[code] || code;
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={variant}
					size={size}
					role="combobox"
					aria-expanded={open}
					className={cn(
						"justify-between gap-2",
						size === "icon" ? "w-10 px-0 justify-center" : "px-3",
						className
					)}
				>
					<div className="flex items-center gap-2">
						{size !== "icon" && (
							<Globe className="h-4 w-4 shrink-0" />
						)}
						{showFlag && <span>{currentLanguage.flag}</span>}
						{showText && size !== "icon" && (
							<span className="truncate">
								{getLanguageTranslationKey(language)}
							</span>
						)}
					</div>
					{size !== "icon" && (
						<ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-[200px] p-0"
				align={align}
				sideOffset={5}
			>
				<Command>
					<CommandInput placeholder={dictionary.language.switcher.searchPlaceholder} />
					<CommandList className="max-h-[300px] overflow-y-auto">
						<CommandEmpty>{dictionary.language.switcher.noLanguageFound}</CommandEmpty>
						<CommandGroup>
							{Object.entries(SUPPORTED_LANGUAGES).map(
								([code, { name, flag }]) => (
									<CommandItem
										key={code}
										value={`${code}-${name}`}
										onSelect={() =>
											handleLanguageChange(
												code as ILanguage
											)
										}
										className="cursor-pointer gap-2"
									>
										<span className="text-lg">{flag}</span>
										<span>{getLanguageTranslationKey(code)}</span>
										<Check
											className={cn(
												"ml-auto h-4 w-4",
												language === code
													? "opacity-100"
													: "opacity-0"
											)}
										/>
									</CommandItem>
								)
							)}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}