import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Agent Builder: My Tools",
	description: "Agent Builder my tools portal",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
