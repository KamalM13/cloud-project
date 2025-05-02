import { useEffect } from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorBoundary() {
  const error = useRouteError();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Route error:", error);
  }, [error]);

  // Check if it's a 404 error
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center ">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Page not found
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Sorry, we couldn't find the page you're looking for. The page might
          have been moved or deleted.
        </p>
        <Button asChild>
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    );
  }

  // For other errors
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center w-full">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-6">
        <AlertCircle className="w-10 h-10 text-amber-600" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2">
        Something went wrong
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        An unexpected error occurred. Please try again later.
      </p>
      <Button asChild>
        <Link to="/">Go back home</Link>
      </Button>
    </div>
  );
}
