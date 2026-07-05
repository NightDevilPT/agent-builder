// components/layout/workflow-layout/nodes/uppercase-node/executor.ts
export const uppercaseNodeExecutor = async (
	inputs: Record<string, any>,
): Promise<Record<string, any>> => {
	const text = inputs["input-text"] || "";
	return {
		"input-text": String(text).toUpperCase(),
	};
};
