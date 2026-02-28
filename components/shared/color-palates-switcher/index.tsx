// components/ColorPaletteSwitcher.tsx
"use client";

import { useState } from "react";
import { Check, ChevronDown, Palette } from "lucide-react";
import { IColorScheme, useTheme } from "@/components/context/theme-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { ColorSchemas } from "@/interfaces/color-schema";

interface ColorPaletteSwitcherProps {
	variant?: "default" | "outline" | "ghost" | "link";
	size?: "default" | "sm" | "lg" | "icon";
	showPreview?: boolean;
	showText?: boolean;
	className?: string;
	align?: "center" | "start" | "end";
}

// Mini donut preview component
const ColorPreview = ({
	schemeKey,
	isSelected,
}: {
	schemeKey: string;
	isSelected?: boolean;
}) => {
	const { resolvedTheme } = useTheme();

	const getPreviewColors = (schemeKey: string) => {
		const colorPalette =
			ColorSchemas[schemeKey as keyof typeof ColorSchemas]?.[
				resolvedTheme || "dark"
			];
		if (!colorPalette) return [];

		return [
			colorPalette.primary,
			colorPalette.secondary,
			colorPalette.accent,
			colorPalette.background,
			colorPalette.foreground,
		].filter(Boolean);
	};

	const colors = getPreviewColors(schemeKey);

	// Create mini donut using conic gradient
	const gradientStops = colors
		.map((color, index) => {
			const start = (index / colors.length) * 100;
			const end = ((index + 1) / colors.length) * 100;
			return `${color} ${start}% ${end}%`;
		})
		.join(", ");

	return (
		<div className="relative w-6 h-6">
			<div
				className="absolute inset-0 rounded-full"
				style={{
					background: `conic-gradient(${gradientStops})`,
				}}
			>
				<div className="absolute inset-[20%] rounded-full bg-background" />
			</div>
			{isSelected && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="w-3 h-3 rounded-full bg-primary flex items-center justify-center">
						<Check className="h-2 w-2 text-primary-foreground" />
					</div>
				</div>
			)}
		</div>
	);
};

export function ColorPaletteSwitcher({
	variant = "ghost",
	size = "default",
	showPreview = true,
	showText = true,
	className,
	align = "end",
}: ColorPaletteSwitcherProps) {
	const { colorScheme, setColorScheme, dictionary, isLoading } = useTheme();
	const [open, setOpen] = useState(false);

	const handleColorSchemeChange = (schemeKey: string) => {
		setColorScheme(schemeKey as IColorScheme);
		setOpen(false);
	};

	// Get color scheme display name
	const getSchemeDisplayName = (schemeKey: string) => {
		if (schemeKey === "default") {
			return dictionary?.common?.buttons?.default || "Default";
		}
		return (
			dictionary?.common?.colors?.[
				schemeKey as keyof typeof dictionary.common.colors
			] || schemeKey
		);
	};

	if (isLoading || !dictionary) {
		return (
			<Button
				variant={variant}
				size={size}
				className={cn(
					"justify-between gap-2",
					size === "icon" ? "w-10 px-0 justify-center" : "px-3",
					className
				)}
				disabled
			>
				<div className="flex items-center gap-2">
					{size !== "icon" && (
						<Palette className="h-4 w-4 shrink-0" />
					)}
					{showPreview && (
						<div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
					)}
					{showText && size !== "icon" && (
						<span className="truncate">Loading...</span>
					)}
				</div>
			</Button>
		);
	}

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
							<Palette className="h-4 w-4 shrink-0" />
						)}
						{showPreview && (
							<ColorPreview schemeKey={colorScheme} />
						)}
						{showText && size !== "icon" && (
							<span className="truncate">
								{getSchemeDisplayName(colorScheme)}
							</span>
						)}
					</div>
					{size !== "icon" && (
						<ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-[240px] p-0"
				align={align}
				sideOffset={5}
			>
				<Command>
					<CommandInput
						placeholder={
							dictionary.common?.search?.placeholder ||
							"Search colors..."
						}
					/>
					<CommandList className="max-h-[300px] overflow-y-auto">
						<CommandEmpty>
							{dictionary.common?.search?.noResults ||
								"No color scheme found"}
						</CommandEmpty>
						<CommandGroup>
							{Object.keys(ColorSchemas).map((schemeKey) => {
								const isSelected = colorScheme === schemeKey;

								return (
									<CommandItem
										key={schemeKey}
										value={`${schemeKey}-${getSchemeDisplayName(
											schemeKey
										)}`}
										onSelect={() =>
											handleColorSchemeChange(schemeKey)
										}
										className="cursor-pointer gap-3"
									>
										<ColorPreview
											schemeKey={schemeKey}
											isSelected={isSelected}
										/>
										<span className="capitalize flex-1">
											{getSchemeDisplayName(schemeKey)}
										</span>
										<Check
											className={cn(
												"ml-auto h-4 w-4",
												isSelected
													? "opacity-100"
													: "opacity-0"
											)}
										/>
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
