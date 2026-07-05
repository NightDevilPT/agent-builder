// components/layout/workflow-layout/nodes/output-node/executor.ts
export const outputNodeExecutor = async (
	inputs: Record<string, any>,
): Promise<Record<string, any>> => {
	return {
		"output-data": inputs["output-data"] || "",
	};
};
