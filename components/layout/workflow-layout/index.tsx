// components/layout/workflow-layout/index.tsx
"use client";

import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { ReactFlowProvider } from "@xyflow/react";
import { WorkflowProvider } from "@/components/context/workflow-context";
import { FlowEditor } from "./_components/FlowEditor";

interface WorkflowLayoutProps {
	workflowId: string;
}

export const WorkflowLayout = ({ workflowId }: WorkflowLayoutProps) => {
	const router = useRouter();
	const [workflow, setWorkflow] = useState<any | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchWorkflow = async () => {
			try {
				const mockWorkflow = {
					id: workflowId,
					name: "Untitled Workflow",
					nodes: [],
					edges: [],
					createdAt: new Date(),
					updatedAt: new Date(),
				};

				setWorkflow(mockWorkflow);
			} catch (error) {
				router.push("/workflow");
			} finally {
				setIsLoading(false);
			}
		};

		if (workflowId) {
			fetchWorkflow();
		}
	}, [workflowId, router]);

	if (isLoading || !workflow) {
		return (
			<div className="w-full h-screen bg-background flex justify-center items-center flex-col gap-2">
				<LoaderIcon className="w-16 h-16 animate-spin text-primary" />
				<Label className="text-xl">Loading workflow...</Label>
			</div>
		);
	}

	return (
		<div className="w-full h-full grid grid-rows-[60px_1fr]">
			{/* Header */}
			<header className="w-full px-6 h-full flex justify-between items-center border-b border-border">
				<h1 className="text-xl font-semibold">{workflow.name}</h1>
			</header>

			{/* Flow Editor with Providers */}
			<ReactFlowProvider>
				<WorkflowProvider>
					<FlowEditor
						workflowId={workflowId}
						initialNodes={workflow.nodes}
						initialEdges={workflow.edges}
					/>
				</WorkflowProvider>
			</ReactFlowProvider>
		</div>
	);
};

export default WorkflowLayout;
