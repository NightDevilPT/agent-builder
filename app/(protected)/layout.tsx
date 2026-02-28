import { RootProvider } from "@/components/layout/root-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Agent Builder",
	description: "Agent Builder portal",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <RootProvider>{children}</RootProvider>;
}
