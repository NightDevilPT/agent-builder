import {
	LayoutDashboard,
	Brain,
	Wrench,
	Settings,
	User,
	Globe,
	CreditCard,
	Receipt,
	Sparkles,
	Shield,
	History,
	BarChart,
	HelpCircle,
} from "lucide-react";
import { ISidebarRoutes } from "@/components/layout/sidebar-provider/layout";

// Route paths
export const ROUTES = {
	// Main
	DASHBOARD: '/dashboard',
	
	// Agents
	AGENTS: '/agents',
	AGENTS_MY: '/agents/my-agents',
	AGENTS_PUBLIC: '/agents',
	
	// Tools
	TOOLS: '/tools',
	TOOLS_MY: '/tools/my-tools',
	TOOLS_PUBLIC: '/tools',
	
	// Billing & Subscription
	BILLING: '/billing',
	BILLING_SUBSCRIPTION: '/subscription',
	BILLING_PLANS: '/plans',
	BILLING_PAYMENT_METHODS: '/payment-methods',
	BILLING_INVOICES: '/invoices',
	BILLING_USAGE: '/usage',
	
	// Settings
	SETTINGS: '/settings',
} as const;

// Route IDs
export const ROUTE_IDS = {
	DASHBOARD: 'dashboard',
	AGENTS: 'agents',
	AGENTS_MY: 'my-agents',
	AGENTS_PUBLIC: 'public-agents',
	TOOLS: 'tools',
	TOOLS_MY: 'my-tools',
	TOOLS_PUBLIC: 'public-tools',
	BILLING: 'billing',
	BILLING_SUBSCRIPTION: 'billing-subscription',
	BILLING_PLANS: 'billing-plans',
	BILLING_PAYMENT_METHODS: 'billing-payment-methods',
	BILLING_INVOICES: 'billing-invoices',
	BILLING_USAGE: 'billing-usage',
	SETTINGS: 'settings',
} as const;

// Sidebar routes configuration
export const SidebarRoutes: ISidebarRoutes[] = [
	{
		id: ROUTE_IDS.DASHBOARD,
		label: "navigation.dashboard",
		icon: LayoutDashboard,
		href: ROUTES.DASHBOARD,
	},
	{
		id: ROUTE_IDS.AGENTS,
		label: "navigation.agents.title",
		icon: Brain,
		href: ROUTES.AGENTS,
	},
	{
		id: ROUTE_IDS.TOOLS,
		label: "navigation.tools.title",
		icon: Wrench,
		href: ROUTES.TOOLS,
	},
	{
		id: ROUTE_IDS.BILLING,
		label: "navigation.billing.title",
		icon: CreditCard,
		href: ROUTES.BILLING,
		child: [
			{
				id: ROUTE_IDS.BILLING_SUBSCRIPTION,
				label: "navigation.billing.subscription",
				icon: Sparkles,
				href: ROUTES.BILLING_SUBSCRIPTION,
			},
			{
				id: ROUTE_IDS.BILLING_PLANS,
				label: "navigation.billing.plans",
				icon: Shield,
				href: ROUTES.BILLING_PLANS,
			},
			{
				id: ROUTE_IDS.BILLING_INVOICES,
				label: "navigation.billing.invoices",
				icon: Receipt,
				href: ROUTES.BILLING_INVOICES,
			},
			{
				id: ROUTE_IDS.BILLING_USAGE,
				label: "navigation.billing.usage",
				icon: BarChart,
				href: ROUTES.BILLING_USAGE,
			},
		],
	},
	{
		id: ROUTE_IDS.SETTINGS,
		label: "navigation.settings",
		icon: Settings,
		href: ROUTES.SETTINGS,
	},
];