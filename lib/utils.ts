// utils/node-translation-utils.ts
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"
import { NodeSidebar } from "@/components/layout/workflow-layout/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



// Helper function to get nested property from object
export const getNestedProperty = (obj: any, path: string): string => {
	return path.split('.').reduce((current, key) => current?.[key], obj) || path;
};

// Get translated node types
export const getTranslatedNodeTypes = (
	dictionary: any,
	baseNodeTypes: Record<string, NodeSidebar[]>
): Record<string, NodeSidebar[]> => {
	if (!dictionary) return {};

	const translated: Record<string, NodeSidebar[]> = {};

	Object.entries(baseNodeTypes).forEach(([categoryKey, nodes]) => {
		// Translate category name
		const categoryName = getNestedProperty(dictionary, categoryKey) || categoryKey;
		
		// Translate nodes
		translated[categoryName] = nodes.map((node) => ({
			...node,
			label: getNestedProperty(dictionary, node.label),
			description: node.description ? getNestedProperty(dictionary, node.description) : undefined,
		}));
	});

	return translated;
};