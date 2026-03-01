import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Agent Builder: Agent Details",
	description: "Agent Builder agent details portal",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
