"use client";

import { IColorScheme, useTheme } from "@/components/context/theme-context";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ColorSchemas } from "@/interfaces/color-schema";

export function ColorSchemeSection() {
	const { colorScheme, setColorScheme, resolvedTheme, dictionary } =
		useTheme();

	if (!dictionary) {
		return (
			<Card className="p-5">
				<div className="space-y-5">
					<div className="space-y-1">
						<h4 className="text-sm font-medium leading-none">
							Loading...
						</h4>
					</div>
				</div>
			</Card>
		);
	}

	const handleColorSchemeChange = (schemeKey: string) => {
		setColorScheme(schemeKey as IColorScheme);
	};

	// Get color palette for donut chart
	const getDonutColors = (schemeKey: string) => {
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
			colorPalette.muted,
			colorPalette.border,
			colorPalette.card,
		].filter(Boolean);
	};

	// Donut chart component
	const DonutChart = ({
		colors,
		isSelected,
	}: {
		colors: string[];
		isSelected: boolean;
	}) => {
		const size = 80;
		const center = size / 2;
		const radius = 32;
		const innerRadius = 20;

		// Calculate segments
		const segments = colors.map((color, index) => {
			const startAngle = (index * 360) / colors.length;
			const endAngle = ((index + 1) * 360) / colors.length;

			const startRad = (startAngle * Math.PI) / 180;
			const endRad = (endAngle * Math.PI) / 180;

			const x1 = center + radius * Math.cos(startRad);
			const y1 = center + radius * Math.sin(startRad);
			const x2 = center + radius * Math.cos(endRad);
			const y2 = center + radius * Math.sin(endRad);

			const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

			// Create path for donut segment
			const path = [
				`M ${center + innerRadius * Math.cos(startRad)} ${
					center + innerRadius * Math.sin(startRad)
				}`,
				`L ${x1} ${y1}`,
				`A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
				`L ${center + innerRadius * Math.cos(endRad)} ${
					center + innerRadius * Math.sin(endRad)
				}`,
				`A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${
					center + innerRadius * Math.cos(startRad)
				} ${center + innerRadius * Math.sin(startRad)}`,
				"Z",
			].join(" ");

			return { path, color };
		});

		return (
			<div className="relative w-20 h-20">
				<svg
					width={size}
					height={size}
					viewBox={`0 0 ${size} ${size}`}
					className="absolute inset-0"
				>
					{/* Donut segments */}
					{segments.map((segment, index) => (
						<path
							key={index}
							d={segment.path}
							fill={segment.color}
							stroke="transparent"
							className="transition-colors duration-200"
						/>
					))}
				</svg>

				{/* Center indicator */}
				<div className="absolute inset-0 flex items-center justify-center">
					<div
						className={cn(
							"w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200",
							isSelected
								? "bg-primary shadow-md scale-100"
								: "bg-background border border-muted scale-90 group-hover:scale-95"
						)}
					>
						{isSelected && (
							<CheckCheck className="h-4 w-4 text-primary-foreground" />
						)}
					</div>
				</div>
			</div>
		);
	};

	return (
		<Card className="p-5">
			<div className="space-y-5">
				{/* Header */}
				<div className="space-y-1">
					<h4 className="text-sm font-medium leading-none">
						{dictionary.settings.sections.colors.palette.title}
					</h4>
					<p className="text-xs text-muted-foreground">
						{
							dictionary.settings.sections.colors.palette
								.description
						}
					</p>
				</div>

				{/* Color Schemes Grid */}
				<div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
					{Object.entries(ColorSchemas).map(([schemeKey]) => {
						const isSelected = colorScheme === schemeKey;
						const colors = getDonutColors(schemeKey);

						return (
							<button
								key={schemeKey}
								onClick={() =>
									handleColorSchemeChange(schemeKey)
								}
								className={cn(
									"group relative flex flex-col items-center gap-2.5 p-3 rounded-lg border transition-all duration-200",
									"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
									isSelected
										? "border-primary bg-primary/5"
										: "border-border hover:border-primary/30 hover:bg-accent/30"
								)}
							>
								<DonutChart
									colors={colors}
									isSelected={isSelected}
								/>

								<span
									className={cn(
										"text-xs font-medium capitalize transition-colors",
										isSelected
											? "text-primary"
											: "text-muted-foreground group-hover:text-foreground"
									)}
								>
									{schemeKey === "default"
										? dictionary.common.buttons.default
										: dictionary.common.colors[schemeKey as keyof typeof dictionary.common.colors] || schemeKey}
								</span>
							</button>
						);
					})}
				</div>
			</div>
		</Card>
	);
}
