import React from "react";

const AgentDetailsPage = async ({
	params,
}: {
	params: Promise<{ agentId: string }>;
}) => {
	const { agentId } = await params;
	return <div>AgentDetailsPage {agentId}</div>;
};

export default AgentDetailsPage;
