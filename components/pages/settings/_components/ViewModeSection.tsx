"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LayoutGrid,
  List
} from "lucide-react";
import { useTheme } from "@/components/context/theme-context";
import { IViewMode } from "@/components/context/theme-context";

export function ViewModeSection() {
  const { viewMode, setViewMode, dictionary } = useTheme();

  if (!dictionary) {
    return (
      <Card className="p-3 px-5 rounded-md grid grid-cols-[1fr_auto]">
        <div className="w-full h-auto grid grid-cols-1 gap-1 place-content-start place-items-start">
          <h3 className="font-medium">Loading...</h3>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-3 px-5 rounded-md grid grid-cols-[1fr_auto]">
      <div className="w-full h-auto grid grid-cols-1 gap-1 place-content-start place-items-start">
        <h3 className="font-medium">{dictionary.settings.sections.view.layout.title}</h3>
        <span className="text-xs text-muted-foreground">
          {dictionary.settings.sections.view.layout.description}
        </span>
      </div>
      <div className="flex w-full justify-center items-center">
        <div className="flex items-center gap-1 rounded-lg border bg-muted/10 p-1">
          <Button
            variant={viewMode === IViewMode.GRID ? "default" : "ghost"}
            size="sm"
            className="h-8 px-3 text-xs gap-2"
            onClick={() => setViewMode(IViewMode.GRID)}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>{dictionary.common.buttons.grid}</span>
          </Button>
          <Button
            variant={viewMode === IViewMode.TABLE ? "default" : "ghost"}
            size="sm"
            className="h-8 px-3 text-xs gap-2"
            onClick={() => setViewMode(IViewMode.TABLE)}
          >
            <List className="h-4 w-4" />
            <span>{dictionary.common.buttons.table}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}