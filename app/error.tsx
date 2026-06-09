"use client";

import { ErrorDisplay } from "@/components/error/error-display";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorDisplay code={500} message="Algo salió mal" onRetry={reset} />;
}
