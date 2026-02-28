import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Agent Builder: Settings",
	description: "Agent Builder settings portal",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
