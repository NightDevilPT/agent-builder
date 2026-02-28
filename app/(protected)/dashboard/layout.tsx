import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Agent Builder: Dashboard",
	description: "Agent Builder dashboard portal",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
