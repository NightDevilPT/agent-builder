import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Agent Builder: Tool Details",
	description: "Agent Builder tool details portal",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
