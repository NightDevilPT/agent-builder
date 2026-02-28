import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Agent Builder: My Agents",
	description: "Agent Builder my agents portal",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
