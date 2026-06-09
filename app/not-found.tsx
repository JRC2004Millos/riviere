import { ErrorDisplay } from "@/components/error/error-display";

export default function NotFound() {
  return <ErrorDisplay code={404} message="Página no encontrada" />;
}
