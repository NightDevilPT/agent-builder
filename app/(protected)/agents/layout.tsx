import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Agent Builder: Agents",
	description: "Agent Builder agents portal",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
