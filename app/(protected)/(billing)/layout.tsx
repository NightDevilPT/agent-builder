import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Agent Builder: Billing",
	description: "Manage your billing and subscription",
};

export default function BillingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
