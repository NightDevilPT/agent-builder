'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import 'swagger-ui-react/swagger-ui.css';

// A professional, visually polished skeleton screen simulating Swagger documentation panels
const SwaggerLoader = () => {
  return (
    <div className="w-full container mx-auto p-6 space-y-8">
      {/* Header Info Block */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Security Actions Bar */}
      <div className="flex justify-between items-center py-4 border-y border-border">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Section Title */}
      <div className="space-y-2 pt-4">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Endpoint Skeletons */}
      <div className="space-y-3">
        {/* Endpoint Row 1 (GET) */}
        <div className="flex items-center justify-between p-4 border border-border/80 rounded-xl bg-card/30">
          <div className="flex items-center gap-4">
            <Skeleton className="h-7 w-16 rounded-lg animate-none" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Endpoint Row 2 (POST) */}
        <div className="flex items-center justify-between p-4 border border-border/80 rounded-xl bg-card/30">
          <div className="flex items-center gap-4">
            <Skeleton className="h-7 w-16 animate-none" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Endpoint Row 3 (DELETE) */}
        <div className="flex items-center justify-between p-4 border border-border/80 rounded-xl bg-card/30">
          <div className="flex items-center gap-4">
            <Skeleton className="h-7 w-16 rounded-lg animate-none" />
            <Skeleton className="h-5 w-52" />
          </div>
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  );
};

// Load the browser-only SwaggerUI component dynamically with a simulated 2-second delay to test the loading skeleton
const SwaggerUI = dynamic(
  () => new Promise<any>((resolve) => setTimeout(resolve, 5000)).then(() => import('swagger-ui-react')),
  {
    ssr: false,
    loading: () => <SwaggerLoader />,
  }
);

type Props = {
  spec: Record<string, any>;
};

function ReactSwagger({ spec }: Props) {
  return <SwaggerUI spec={spec} />;
}

export default ReactSwagger;