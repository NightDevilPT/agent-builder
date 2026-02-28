import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Agent Builder: Tools",
	description: "Agent Builder tools portal",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
