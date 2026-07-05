// components/layout/workflow-layout/_components/ConnectionLine.tsx
"use client";

import { memo } from "react";
import { useConnection } from "@xyflow/react";

interface ConnectionLineProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export const ConnectionLine = memo(({ fromX, fromY, toX, toY }: ConnectionLineProps) => {
  const { fromHandle } = useConnection();

  if (!fromHandle) return null;

  const color = fromHandle.id?.includes("error") 
    ? "#ef4444" 
    : fromHandle.id?.includes("response") 
      ? "#22c55e" 
      : "#3b82f6";

  return (
    <g>
      <path
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray="5,5"
        className="animate-dash"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={4}
        stroke={color}
        strokeWidth={2}
      />
    </g>
  );
});

ConnectionLine.displayName = "ConnectionLine";