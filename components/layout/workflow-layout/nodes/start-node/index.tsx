// components/layout/workflow-layout/nodes/start-node/index.tsx
"use client";

import { memo } from "react";
import { type NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { AppNode } from "../../types";
import { NodeWrapper } from "../node-wrapper/NodeWrapper";
import { startNodeConfig } from "./config";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Play } from "lucide-react";
import { getHandleColor } from "../index";

type StartNodeProps = NodeProps<AppNode>;

const StartNode = memo((props: StartNodeProps) => {
  const { data } = props;
  const outputHandles = data?.outputHandles ?? [];

  return (
    <NodeWrapper {...props}>
      <div className="flex flex-col items-center gap-3 py-3 px-4 w-[220px]">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          <Play className="w-5 h-5 text-primary" />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Badge variant="secondary" className="text-[10px]">
            Entry Point
          </Badge>
          <Label className="text-xs text-muted-foreground font-normal text-center">
            Connect a node to start building
          </Label>
        </div>
      </div>

      {outputHandles
        .filter((h) => h.visible !== false)
        .map((handle) => (
          <Handle
            key={handle.id}
            type="source"
            position={Position.Right}
            id={handle.id}
            title={handle.label}
            className="!w-2.5 !h-2.5 !border-2 !border-background"
            style={{ backgroundColor: getHandleColor('source') }}
          />
        ))}
    </NodeWrapper>
  );
});

StartNode.displayName = "StartNode";
export { startNodeConfig };
export default StartNode;