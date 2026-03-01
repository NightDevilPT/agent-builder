const ToolDetailsPage = async ({
	params,
}: {
	params: Promise<{ toolId: string }>;
}) => {
	const { toolId } = await params;
	return <div>ToolDetailsPage {toolId}</div>;
};

export default ToolDetailsPage;
