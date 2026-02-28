"use client";

import { useTheme } from "@/components/context/theme-context";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";



export default function Page() {
  const { dictionary } = useTheme();
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">{dictionary?.welcome}</h1>
        <Button size="sm">Button</Button>
      </div>
      <ThemeToggle />
    </div>
  );
}