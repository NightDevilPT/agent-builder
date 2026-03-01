// app/(protected)/agents/[agentId]/workflow/page.tsx
import { WorkflowLayout } from "@/components/layout/workflow-layout";

export default async function Page({ params }: { params: Promise<{ agentId: string }> }) {
	const { agentId } = await params;
	return <WorkflowLayout workflowId={agentId} />;
}
