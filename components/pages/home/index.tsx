"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	ArrowRight,
	Github,
	Twitter,
	Linkedin,
	Zap,
	Workflow,
	Bot,
	Share2,
	Code2,
	Container,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ColorPaletteSwitcher } from "@/components/shared/color-palates-switcher";
import { useTheme } from "@/components/context/theme-context";
import SpotlightCard from "@/components/ui/spotlight-card";

const HomePage = () => {
	const { dictionary } = useTheme();

	if (!dictionary) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-muted-foreground">Loading...</div>
			</div>
		);
	}

	const nodeTypes = dictionary.home.nodeLibrary.types || [];
	const exportLanguages = dictionary.home.export.languages || [];
	return (
		<ScrollArea className="h-screen w-full">
			<div className="min-h-screen bg-background">
				{/* Navigation */}
				<nav className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
					<div className="container mx-auto px-4 py-3 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Bot className="h-6 w-6 text-primary" />
							<span className="font-bold text-xl">
								AgentBuilder
							</span>
						</div>

						<div className="hidden md:flex items-center gap-6">
							<Link
								href="#features"
								className="text-sm hover:text-primary transition"
							>
								{dictionary.home.navigation.features}
							</Link>
							<Link
								href="#how-it-works"
								className="text-sm hover:text-primary transition"
							>
								{dictionary.home.navigation.howItWorks}
							</Link>
							<Link
								href="#pricing"
								className="text-sm hover:text-primary transition"
							>
								{dictionary.home.navigation.pricing}
							</Link>
							<Link
								href="#docs"
								className="text-sm hover:text-primary transition"
							>
								{dictionary.home.navigation.docs}
							</Link>
						</div>

						<div className="flex items-center gap-2">
							<ThemeToggle />
							<LanguageSwitcher size="icon" />
							<ColorPaletteSwitcher size="icon" />
							<Button
								variant="ghost"
								size="sm"
								className="hidden sm:inline-flex"
							>
								{dictionary.home.navigation.signIn}
							</Button>
							<Button size="sm">
								{dictionary.home.navigation.getStarted}
							</Button>
						</div>
					</div>
				</nav>

				{/* Hero Section */}
				<section className="container mx-auto px-4 py-16 md:py-20 text-center">
					<Badge variant="outline" className="mb-4">
						{dictionary.home.hero.badge}
					</Badge>
					<h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent whitespace-pre-line">
						{dictionary.home.hero.title}
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
						{dictionary.home.hero.description}
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
						<Button size="lg" className="gap-2">
							{dictionary.home.hero.startBuilding}{" "}
							<ArrowRight className="h-4 w-4" />
						</Button>
						<Button size="lg" variant="outline" className="gap-2">
							<Github className="h-4 w-4" />{" "}
							{dictionary.home.hero.starOnGithub}
						</Button>
					</div>
				</section>

				{/* Features Grid */}
				<section
					id="features"
					className="container mx-auto px-4 py-16 md:py-20"
				>
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold mb-4">
							{dictionary.home.features.title}
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							{dictionary.home.features.description}
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						<SpotlightCard className="p-6">
							<Workflow className="h-10 w-10 text-primary mb-4" />
							<h3 className="text-xl font-semibold mb-2">
								{dictionary.home.features.visualBuilder.title}
							</h3>
							<p className="text-muted-foreground mb-4">
								{
									dictionary.home.features.visualBuilder
										.description
								}
							</p>
							<div className="flex flex-wrap gap-2">
								{dictionary.home.features.visualBuilder.tags?.map(
									(tag: string) => (
										<Badge key={tag} variant="secondary">
											{tag}
										</Badge>
									)
								)}
							</div>
						</SpotlightCard>

						<SpotlightCard className="p-6">
							<Bot className="h-10 w-10 text-primary mb-4" />
							<h3 className="text-xl font-semibold mb-2">
								{dictionary.home.features.multiModel.title}
							</h3>
							<p className="text-muted-foreground mb-4">
								{
									dictionary.home.features.multiModel
										.description
								}
							</p>
							<div className="flex flex-wrap gap-2">
								{dictionary.home.features.multiModel.tags?.map(
									(tag: string) => (
										<Badge key={tag} variant="secondary">
											{tag}
										</Badge>
									)
								)}
							</div>
						</SpotlightCard>

						<SpotlightCard className="p-6">
							<Code2 className="h-10 w-10 text-primary mb-4" />
							<h3 className="text-xl font-semibold mb-2">
								{dictionary.home.features.multiLanguage.title}
							</h3>
							<p className="text-muted-foreground mb-4">
								{
									dictionary.home.features.multiLanguage
										.description
								}
							</p>
							<div className="flex flex-wrap gap-2">
								{dictionary.home.features.multiLanguage.tags?.map(
									(tag: string) => (
										<Badge key={tag} variant="secondary">
											{tag}
										</Badge>
									)
								)}
							</div>
						</SpotlightCard>

						<SpotlightCard className="p-6">
							<Zap className="h-10 w-10 text-primary mb-4" />
							<h3 className="text-xl font-semibold mb-2">
								{dictionary.home.features.apiIntegration.title}
							</h3>
							<p className="text-muted-foreground mb-4">
								{
									dictionary.home.features.apiIntegration
										.description
								}
							</p>
						</SpotlightCard>

						<SpotlightCard className="p-6">
							<Share2 className="h-10 w-10 text-primary mb-4" />
							<h3 className="text-xl font-semibold mb-2">
								{
									dictionary.home.features.shareCollaborate
										.title
								}
							</h3>
							<p className="text-muted-foreground mb-4">
								{
									dictionary.home.features.shareCollaborate
										.description
								}
							</p>
						</SpotlightCard>

						<SpotlightCard className="p-6">
							<Container className="h-10 w-10 text-primary mb-4" />
							<h3 className="text-xl font-semibold mb-2">
								{
									dictionary.home.features.containerSupport
										.title
								}
							</h3>
							<p className="text-muted-foreground mb-4">
								{
									dictionary.home.features.containerSupport
										.description
								}
							</p>
						</SpotlightCard>
					</div>
				</section>

				{/* Node Types Showcase */}
				<section className="bg-muted/30 py-16 md:py-20">
					<div className="container mx-auto px-4">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-bold mb-4">
								{dictionary.home.nodeLibrary.title}
							</h2>
							<p className="text-muted-foreground max-w-2xl mx-auto">
								{dictionary.home.nodeLibrary.description}
							</p>
						</div>

						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{nodeTypes.map((node: string) => (
								<SpotlightCard
									key={node}
									className="p-4 text-center cursor-default"
								>
									<span className="font-medium">{node}</span>
								</SpotlightCard>
							))}
						</div>
					</div>
				</section>

				{/* Export Section */}
				<section className="container mx-auto px-4 py-16 md:py-20">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div>
							<Badge className="mb-4">
								Multi-Language Export
							</Badge>
							<h2 className="text-3xl font-bold mb-4">
								{dictionary.home.export.title}
							</h2>
							<p className="text-muted-foreground mb-6">
								{dictionary.home.export.description}
							</p>
							<div className="flex gap-2 flex-wrap mb-8">
								{exportLanguages.map((lang: string) => (
									<Badge
										key={lang}
										variant="outline"
										className="py-2 px-3"
									>
										{lang}
									</Badge>
								))}
							</div>
							<Button className="gap-2">
								{dictionary.home.export.viewDocs}{" "}
								<ArrowRight className="h-4 w-4" />
							</Button>
						</div>
						<SpotlightCard className="p-6 bg-muted/30">
							<pre className="text-sm overflow-x-auto">
								<code className="language-python">
									{`# Generated Python Agent
from agent_builder import Agent

agent = Agent.from_workflow("customer-support")
result = agent.run({
  "query": "How to reset password?",
  "user_id": "12345"
})`}
								</code>
							</pre>
						</SpotlightCard>
					</div>
				</section>

				{/* Stats Section */}
				<section className="bg-primary text-primary-foreground py-16">
					<div className="container mx-auto px-4">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
							<div>
								<div className="text-3xl md:text-4xl font-bold mb-2">
									10K+
								</div>
								<div className="text-primary-foreground/80 text-sm">
									{dictionary.home.stats.agentsBuilt}
								</div>
							</div>
							<div>
								<div className="text-3xl md:text-4xl font-bold mb-2">
									50+
								</div>
								<div className="text-primary-foreground/80 text-sm">
									{dictionary.home.stats.nodeTypes}
								</div>
							</div>
							<div>
								<div className="text-3xl md:text-4xl font-bold mb-2">
									100+
								</div>
								<div className="text-primary-foreground/80 text-sm">
									{dictionary.home.stats.integrations}
								</div>
							</div>
							<div>
								<div className="text-3xl md:text-4xl font-bold mb-2">
									5K+
								</div>
								<div className="text-primary-foreground/80 text-sm">
									{dictionary.home.stats.happyDevelopers}
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="container mx-auto px-4 py-16 md:py-20 text-center">
					<SpotlightCard className="p-8 md:p-12 bg-gradient-to-br from-primary/10 via-background to-background border-2">
						<h2 className="text-2xl md:text-3xl font-bold mb-4">
							{dictionary.home.cta.title}
						</h2>
						<p className="text-muted-foreground mb-8 max-w-xl mx-auto">
							{dictionary.home.cta.description}
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button size="lg" className="gap-2">
								{dictionary.home.cta.getStarted}{" "}
								<ArrowRight className="h-4 w-4" />
							</Button>
							<Button size="lg" variant="outline">
								{dictionary.home.cta.scheduleDemo}
							</Button>
						</div>
					</SpotlightCard>
				</section>

				{/* Footer */}
				<footer className="border-t py-12">
					<div className="container mx-auto px-4">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
							<div className="col-span-2 md:col-span-1">
								<div className="flex items-center gap-2 mb-4">
									<Bot className="h-5 w-5 text-primary" />
									<span className="font-bold">
										AgentBuilder
									</span>
								</div>
								<p className="text-sm text-muted-foreground">
									{dictionary.home.footer.description}
								</p>
							</div>

							<div>
								<h4 className="font-semibold mb-4">
									{dictionary.home.footer.product.title}
								</h4>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li>
										<Link
											href="#"
											className="hover:text-primary"
										>
											{
												dictionary.home.footer.product
													.features
											}
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="hover:text-primary"
										>
											{
												dictionary.home.footer.product
													.pricing
											}
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="hover:text-primary"
										>
											{
												dictionary.home.footer.product
													.documentation
											}
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="hover:text-primary"
										>
											{dictionary.home.footer.product.api}
										</Link>
									</li>
								</ul>
							</div>

							<div>
								<h4 className="font-semibold mb-4">
									{dictionary.home.footer.company.title}
								</h4>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li>
										<Link
											href="#"
											className="hover:text-primary"
										>
											{
												dictionary.home.footer.company
													.about
											}
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="hover:text-primary"
										>
											{
												dictionary.home.footer.company
													.blog
											}
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="hover:text-primary"
										>
											{
												dictionary.home.footer.company
													.careers
											}
										</Link>
									</li>
									<li>
										<Link
											href="#"
											className="hover:text-primary"
										>
											{
												dictionary.home.footer.company
													.contact
											}
										</Link>
									</li>
								</ul>
							</div>

							<div>
								<h4 className="font-semibold mb-4">
									{dictionary.home.footer.connect.title}
								</h4>
								<div className="flex gap-4">
									<Link
										href="#"
										className="text-muted-foreground hover:text-primary"
									>
										<Github className="h-5 w-5" />
									</Link>
									<Link
										href="#"
										className="text-muted-foreground hover:text-primary"
									>
										<Twitter className="h-5 w-5" />
									</Link>
									<Link
										href="#"
										className="text-muted-foreground hover:text-primary"
									>
										<Linkedin className="h-5 w-5" />
									</Link>
								</div>
							</div>
						</div>

						<div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
							{dictionary.home.footer.copyright}
						</div>
					</div>
				</footer>
			</div>
		</ScrollArea>
	);
};

export default HomePage;
